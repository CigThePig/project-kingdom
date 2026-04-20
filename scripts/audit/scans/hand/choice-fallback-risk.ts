// Hand-card scan §9.8 — cards declaring `requiresChoice` but whose `apply`
// contains a silent fallback that swallows the choice. Two shapes:
//
//   1. `if (choice.kind !== 'class') return state;` — the card accepts a
//      choice UI but the apply discards it when the kind doesn't match.
//      This is always a design smell: the card's requiresChoice contract
//      is that only matching-kind choices reach the apply.
//
//   2. `if (!id) return state;` where `id` was derived from `choice` (via
//      pickRivalId or similar) and the apply has no other effect. The card
//      silently falls back to `neighbors[0]` when the player didn't pick a
//      target and then bails out if even that's missing — the player's
//      input never distinguishes the card's outcome when neighbors[0]
//      exists.

import type { Corpus, Finding, Scan } from '../../types';

export const SCAN_ID = 'hand.choice-fallback-risk';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const card of corpus.auditCards) {
    if (card.family !== 'hand') continue;
    if (!card.coverage.astSemanticCoverage) continue;
    const requiresChoice =
      (card.metadata?.requiresChoice as 'class' | 'rival' | null | undefined) ?? null;
    if (!requiresChoice) continue;

    for (const path of card.choices) {
      const markers = path.declaredStructuralMarkers;

      if (markers.silentFallbackOnChoiceKind) {
        out.push({
          severity: 'MAJOR',
          family: 'hand',
          scanId: SCAN_ID,
          code: 'CHOICE_FALLBACK_RISK',
          cardId: card.id,
          choiceId: path.choiceId,
          filePath: card.filePath,
          message: `${card.id}: apply contains \`if (choice.kind !== '…') return state;\` — the declared requiresChoice is effectively unenforced inside the body.`,
          confidence: 'HEURISTIC',
          details: { kind: 'silent-fallback-on-choice-kind' },
        });
        continue;
      }

      if (
        requiresChoice === 'rival'
        && markers.earlyReturnOnMissingId
        && !markers.appliesMechanicalDelta
      ) {
        out.push({
          severity: 'MINOR',
          family: 'hand',
          scanId: SCAN_ID,
          code: 'CHOICE_FALLBACK_RISK',
          cardId: card.id,
          choiceId: path.choiceId,
          filePath: card.filePath,
          message: `${card.id}: apply falls through to neighbors[0] when the player hasn't picked a rival — the target choice is effectively cosmetic when any rival exists.`,
          confidence: 'HEURISTIC',
          details: { kind: 'neighbors-fallback' },
        });
      }
    }
  }

  return out;
};
