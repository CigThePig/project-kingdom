// Hand-card scan §9.8 — cards declaring `requiresChoice: 'class' | 'rival'`
// must use the chosen target in a way that changes the outcome. Two signals
// combine:
//
//   - AST:     `choiceUsageKind === 'deep'` means `choice` feeds a call or
//     return expression, so different targets CAN influence the output.
//     Anything else (`'none'` or `'shallow'`) is suspicious.
//   - Runtime: `runtimeFingerprintVariants` re-runs the same apply with two
//     distinct targets. When both runs produce set-equal `touches` arrays
//     the card actually IGNORES the target in the harness fixture — this
//     is the RUNTIME_GROUNDED signal and upgrades the finding's confidence.
//
// The finding is MAJOR either way: an unused requiresChoice is a broken
// contract per the rules doc ("otherwise the choice is fake").

import type { AuditDecisionPath, RuntimeFingerprint } from '../../ir';
import type { Corpus, Finding, Scan } from '../../types';

export const SCAN_ID = 'hand.requires-choice-used';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const card of corpus.auditCards) {
    if (card.family !== 'hand') continue;
    const requiresChoice =
      (card.metadata?.requiresChoice as 'class' | 'rival' | null | undefined) ?? null;
    if (!requiresChoice) continue;

    for (const path of card.choices) {
      if (!card.coverage.astSemanticCoverage && !path.runtimeFingerprintVariants) continue;

      const markers = path.declaredStructuralMarkers;
      const shallowAst =
        card.coverage.astSemanticCoverage && markers.choiceUsageKind !== 'deep';
      const runtimeUnused =
        !!path.runtimeFingerprintVariants
        && touchesEqual(
          path.runtimeFingerprintVariants.a,
          path.runtimeFingerprintVariants.b,
        );

      if (!shallowAst && !runtimeUnused) continue;

      const confidence: Finding['confidence'] = runtimeUnused
        ? 'RUNTIME_GROUNDED'
        : 'HEURISTIC';
      const reasons: string[] = [];
      if (shallowAst) reasons.push(`choiceUsageKind=${markers.choiceUsageKind}`);
      if (runtimeUnused) reasons.push('runtime variants produced identical touches');

      out.push({
        severity: 'MAJOR',
        family: 'hand',
        scanId: SCAN_ID,
        code: 'REQUIRES_CHOICE_UNUSED',
        cardId: card.id,
        choiceId: path.choiceId,
        filePath: card.filePath,
        message: `${card.id}: declares requiresChoice='${requiresChoice}' but the apply doesn't use it meaningfully (${reasons.join('; ')}).`,
        confidence,
        details: buildDetails(path, requiresChoice),
      });
    }
  }

  return out;
};

function touchesEqual(a: RuntimeFingerprint, b: RuntimeFingerprint): boolean {
  if (a.touches.length !== b.touches.length) return false;
  const setA = new Set(a.touches);
  for (const t of b.touches) {
    if (!setA.has(t)) return false;
  }
  return true;
}

function buildDetails(
  path: AuditDecisionPath,
  requiresChoice: 'class' | 'rival',
): Record<string, unknown> {
  const details: Record<string, unknown> = {
    requiresChoice,
    choiceUsageKind: path.declaredStructuralMarkers.choiceUsageKind,
    hasRuntimeVariants: !!path.runtimeFingerprintVariants,
  };
  if (path.runtimeFingerprintVariants) {
    details.variantTouchesA = path.runtimeFingerprintVariants.a.touches;
    details.variantTouchesB = path.runtimeFingerprintVariants.b.touches;
  }
  return details;
}
