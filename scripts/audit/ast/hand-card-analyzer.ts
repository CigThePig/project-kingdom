// Hand-card AST analyzer — parses each HandCardDefinition.apply arrow and
// fills a StructuralMarkerSummary describing what the apply body actually
// does. The hand-card adapter (scripts/audit/adapters/hand-cards.ts) can
// then flip astSemanticCoverage true and record the summary on every
// decision path.
//
// We only consume ts-morph + tsquery — no regex against source text — so
// the analyzer is insensitive to formatting changes.

import { SyntaxKind, type ArrowFunction, type ObjectLiteralExpression } from 'ts-morph';
import { tsquery } from '@phenomnomnominal/tsquery';

import type { StructuralMarkerSummary } from '../ir';
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
  const bodyText = bodyNode.getText();

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

  // `readsChoice` — parameter name is `choice` on all hand cards;
  // we match any Identifier[name="choice"] inside the body. A function
  // with only the `state` parameter never references `choice`.
  const choiceParam = apply.getParameters().find((p) => p.getName() === 'choice');
  if (choiceParam && /\bchoice\b/.test(bodyText)) {
    markers.readsChoice = true;
  }

  return markers;
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
