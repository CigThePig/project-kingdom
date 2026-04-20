// Hand-card AST analyzer — parses each HandCardDefinition.apply arrow and
// fills a StructuralMarkerSummary describing what the apply body actually
// does. The hand-card adapter (scripts/audit/adapters/hand-cards.ts) can
// then flip astSemanticCoverage true and record the summary on every
// decision path.
//
// We only consume ts-morph + tsquery — no regex against source text — so
// the analyzer is insensitive to formatting changes.

import {
  Node,
  SyntaxKind,
  type ArrowFunction,
  type ObjectLiteralExpression,
} from 'ts-morph';
import { tsquery } from '@phenomnomnominal/tsquery';

import type { QueuedModifierSummary, StructuralMarkerSummary } from '../ir';
import { emptyStructuralMarkerSummary } from '../ir';
import { getAuditProject } from './project';

const HAND_CARD_SOURCE_FILES = [
  'src/data/cards/hand-cards.ts',
  'src/data/cards/hand-cards-expanded.ts',
];

let cached: Map<string, StructuralMarkerSummary> | null = null;

export function analyzeHandCards(): Map<string, StructuralMarkerSummary> {
  if (cached) return cached;
  const project = getAuditProject();
  const out = new Map<string, StructuralMarkerSummary>();

  for (const relPath of HAND_CARD_SOURCE_FILES) {
    const sf = project
      .getSourceFiles()
      .find((f) => f.getFilePath().endsWith(relPath));
    if (!sf) continue;

    // Every hand-card entry lives as a PropertyAssignment inside a Record
    // object literal. The property name is the id; the initializer is an
    // ObjectLiteral with { id, title, body, apply, ... }. We walk every
    // ObjectLiteral that has an `id:` string literal matching HandCardId
    // naming — cheap and robust.
    const objectLiterals = sf.getDescendantsOfKind(SyntaxKind.ObjectLiteralExpression);
    for (const obj of objectLiterals) {
      const handCardId = extractHandCardId(obj);
      if (!handCardId) continue;
      const applyArrow = extractApplyArrow(obj);
      if (!applyArrow) continue;
      out.set(handCardId, classifyApply(applyArrow));
    }
  }

  cached = out;
  return cached;
}

export function __resetHandCardAnalyzerForTests(): void {
  cached = null;
}

// ============================================================
// Internals
// ============================================================

function extractHandCardId(obj: ObjectLiteralExpression): string | null {
  const idProp = obj.getProperty('id');
  if (!idProp || !idProp.isKind(SyntaxKind.PropertyAssignment)) return null;
  const initializer = idProp.getInitializer();
  if (!initializer || !initializer.isKind(SyntaxKind.StringLiteral)) return null;
  const value = initializer.getLiteralValue();
  return value.startsWith('hand_') ? value : null;
}

function extractApplyArrow(obj: ObjectLiteralExpression): ArrowFunction | null {
  const applyProp = obj.getProperty('apply');
  if (!applyProp || !applyProp.isKind(SyntaxKind.PropertyAssignment)) return null;
  const initializer = applyProp.getInitializer();
  if (!initializer || !initializer.isKind(SyntaxKind.ArrowFunction)) return null;
  return initializer;
}

function classifyApply(apply: ArrowFunction): StructuralMarkerSummary {
  const markers = emptyStructuralMarkerSummary();
  const bodyNode = apply.getBody();

  // Structural: does the body mention these identifiers at all? tsquery
  // handles scope-correct identifier matching for free.
  const root = bodyNode.compilerNode;

  if (hasIdentifier(root, 'persistentConsequences')) {
    markers.touchesPersistentConsequences = true;
  }
  if (
    hasIdentifier(root, 'activeTemporaryModifiers') ||
    hasCallTo(root, 'queueTemporaryModifier')
  ) {
    markers.queuesTemporaryModifier = true;
  }
  if (hasCallTo(root, 'applyMechanicalEffectDelta')) {
    markers.appliesMechanicalDelta = true;
  }
  if (hasCallTo(root, 'applyPressure')) {
    markers.writesPressure = true;
  }
  if (hasIdentifier(root, 'diplomaticBonds') || hasCallTo(root, 'createBond')) {
    markers.touchesBond = true;
  }

  // `readsChoice` — parameter name is `choice` on all hand cards. Existing
  // consumers rely on the boolean-any-reference form; depth is captured
  // separately below in `choiceUsageKind`.
  const choiceParam = apply.getParameters().find((p) => p.getName() === 'choice');
  if (choiceParam && hasIdentifier(root, 'choice')) {
    markers.readsChoice = true;
  }

  // Fine-grained choice-flow classification drives `requires-choice-used`
  // and `choice-fallback-risk`. See `analyzeChoiceUsage` for the rules.
  markers.choiceUsageKind = choiceParam
    ? analyzeChoiceUsage(apply, bodyNode)
    : 'none';

  // Silent fallback / early-return detection powers `choice-fallback-risk`.
  const fallbacks = analyzeEarlyReturns(apply, bodyNode);
  markers.earlyReturnOnMissingId = fallbacks.earlyReturnOnMissingId;
  markers.silentFallbackOnChoiceKind = fallbacks.silentFallbackOnChoiceKind;

  // Temp-modifier shape inventory powers `temp-modifier-shape`.
  markers.queuedModifiers = collectQueuedModifiers(apply, bodyNode);

  return markers;
}

// ============================================================
// Choice-usage classification
// ============================================================

/**
 * Classify how deeply the `choice` parameter flows through the apply body.
 *
 * `none`    — the body never references `choice`.
 * `shallow` — every `choice` reference is inside a guard-style early-return
 *             condition such as `if (choice.kind !== 'class') return state`.
 *             These cards nominally accept a choice but the output shape
 *             doesn't depend on its contents.
 * `deep`    — at least one `choice` reference propagates into a call
 *             argument, spread expression, or the returned value.
 */
function analyzeChoiceUsage(
  apply: ArrowFunction,
  bodyNode: Node,
): 'none' | 'shallow' | 'deep' {
  void apply;
  const references = bodyNode
    .getDescendantsOfKind(SyntaxKind.Identifier)
    .filter((id) => id.getText() === 'choice');
  if (references.length === 0) return 'none';

  for (const ref of references) {
    if (!isInsideEarlyReturnGuard(ref)) return 'deep';
  }
  return 'shallow';
}

/**
 * Identify `if (...) return state;` statements where the condition reads
 * `choice.kind !== 'literal'` or `!<identifier>`. The first shape corresponds
 * to `silentFallbackOnChoiceKind`; the second to `earlyReturnOnMissingId`.
 */
function analyzeEarlyReturns(
  apply: ArrowFunction,
  bodyNode: Node,
): { earlyReturnOnMissingId: boolean; silentFallbackOnChoiceKind: boolean } {
  void apply;
  const out = { earlyReturnOnMissingId: false, silentFallbackOnChoiceKind: false };
  const ifStatements = bodyNode.getDescendantsOfKind(SyntaxKind.IfStatement);
  for (const stmt of ifStatements) {
    if (!returnsStateUnchanged(stmt)) continue;
    const cond = stmt.getExpression();
    if (isChoiceKindMismatch(cond)) {
      out.silentFallbackOnChoiceKind = true;
    }
    if (isMissingIdGuard(cond)) {
      out.earlyReturnOnMissingId = true;
    }
  }
  return out;
}

function returnsStateUnchanged(stmt: Node): boolean {
  const thenClause = stmt.asKindOrThrow(SyntaxKind.IfStatement).getThenStatement();
  // `if (...) return state;`
  if (Node.isReturnStatement(thenClause)) {
    const expr = thenClause.getExpression();
    return !!expr && expr.getKind() === SyntaxKind.Identifier && expr.getText() === 'state';
  }
  // `if (...) { return state; }`
  if (Node.isBlock(thenClause)) {
    const stmts = thenClause.getStatements();
    if (stmts.length !== 1) return false;
    const inner = stmts[0];
    if (!Node.isReturnStatement(inner)) return false;
    const expr = inner.getExpression();
    return !!expr && expr.getKind() === SyntaxKind.Identifier && expr.getText() === 'state';
  }
  return false;
}

function isChoiceKindMismatch(cond: Node | undefined): boolean {
  if (!cond || !Node.isBinaryExpression(cond)) return false;
  const op = cond.getOperatorToken().getText();
  if (op !== '!==' && op !== '!=') return false;
  const left = cond.getLeft().getText();
  const right = cond.getRight();
  return left === 'choice.kind' && Node.isStringLiteral(right);
}

function isMissingIdGuard(cond: Node | undefined): boolean {
  if (!cond) return false;
  if (!Node.isPrefixUnaryExpression(cond)) return false;
  if (cond.getOperatorToken() !== SyntaxKind.ExclamationToken) return false;
  const operand = cond.getOperand();
  return Node.isIdentifier(operand);
}

function isInsideEarlyReturnGuard(node: Node): boolean {
  // Walk up from the Identifier and check whether the nearest enclosing
  // IfStatement's condition syntactically contains this node AND the then-
  // branch is exactly `return state;`. Anything outside that shape is "deep".
  let cursor: Node | undefined = node.getParent();
  while (cursor) {
    if (Node.isIfStatement(cursor)) {
      const condition = cursor.getExpression();
      if (condition && containsNode(condition, node) && returnsStateUnchanged(cursor)) {
        return true;
      }
      return false;
    }
    cursor = cursor.getParent();
  }
  return false;
}

function containsNode(root: Node, target: Node): boolean {
  const targetPos = target.getStart();
  return targetPos >= root.getStart() && targetPos <= root.getEnd();
}

// ============================================================
// Temp-modifier shape extraction
// ============================================================

function collectQueuedModifiers(
  apply: ArrowFunction,
  bodyNode: Node,
): QueuedModifierSummary[] {
  void apply;
  const out: QueuedModifierSummary[] = [];
  const allCalls = collectAll(bodyNode, SyntaxKind.CallExpression);
  for (const call of allCalls) {
    if (!Node.isCallExpression(call)) continue;
    if (call.getExpression().getText() !== 'queueTemporaryModifier') continue;
    const arg = call.getArguments()[1];
    if (!arg || !Node.isObjectLiteralExpression(arg)) continue;
    out.push(summarizeModifierLiteral(arg));
  }

  // Also pick up inline spreads into `activeTemporaryModifiers: [..., {...}]`.
  // hand-cards today uses the helper exclusively, but this keeps us honest
  // if a future card inlines the spread.
  const allAssignments = collectAll(bodyNode, SyntaxKind.PropertyAssignment);
  for (const assign of allAssignments) {
    if (!Node.isPropertyAssignment(assign)) continue;
    if (assign.getName() !== 'activeTemporaryModifiers') continue;
    const initializer = assign.getInitializer();
    if (!initializer || !Node.isArrayLiteralExpression(initializer)) continue;
    for (const el of initializer.getElements()) {
      if (Node.isObjectLiteralExpression(el)) {
        out.push(summarizeModifierLiteral(el));
      }
    }
  }
  return out;
}

/**
 * Return every descendant of the given node matching `kind`, INCLUDING the
 * node itself when it matches. Arrow functions with expression bodies expose
 * the expression directly — `getDescendantsOfKind` skips the root — so
 * callers that care about top-level matches must include it explicitly.
 */
function collectAll(root: Node, kind: SyntaxKind): Node[] {
  const out: Node[] = [];
  if (root.getKind() === kind) out.push(root);
  for (const d of root.getDescendantsOfKind(kind)) out.push(d);
  return out;
}

function summarizeModifierLiteral(obj: ObjectLiteralExpression): QueuedModifierSummary {
  const summary: QueuedModifierSummary = {
    turnsRemaining: 'dynamic',
    effectKeys: [],
    hasSourceTag: false,
    hasTurnApplied: false,
    hasId: false,
  };
  for (const prop of obj.getProperties()) {
    if (!Node.isPropertyAssignment(prop)) continue;
    const name = prop.getName();
    const initializer = prop.getInitializer();
    if (name === 'id') summary.hasId = true;
    if (name === 'sourceTag') summary.hasSourceTag = true;
    if (name === 'turnApplied') summary.hasTurnApplied = true;
    if (name === 'turnsRemaining') {
      summary.turnsRemaining =
        initializer && initializer.getKind() === SyntaxKind.NumericLiteral
          ? 'literal'
          : 'dynamic';
    }
    if (name === 'effectPerTurn' && initializer && Node.isObjectLiteralExpression(initializer)) {
      for (const fx of initializer.getProperties()) {
        if (Node.isPropertyAssignment(fx)) {
          summary.effectKeys.push(fx.getName());
        }
      }
    }
  }
  return summary;
}

function hasIdentifier(root: unknown, name: string): boolean {
  const selector = `Identifier[name="${name}"]`;
  const matches = tsquery(root as never, selector);
  return matches.length > 0;
}

function hasCallTo(root: unknown, name: string): boolean {
  const selector = `CallExpression:has(Identifier[name="${name}"])`;
  const matches = tsquery(root as never, selector);
  return matches.length > 0;
}
