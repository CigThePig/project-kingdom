// Hand-card scan §9.8 — every queued temporary modifier should follow the
// authoring convention used elsewhere in the corpus: `id`, `sourceTag`,
// `turnApplied`, a numeric-literal `turnsRemaining`, and a non-empty
// `effectPerTurn` record. Missing any of those undermines the modifier's
// UX (malformed rows surface in the codex as "unknown source") or the
// simulation (empty `effectPerTurn` is a no-op modifier).
//
// Reads `declaredStructuralMarkers.queuedModifiers` populated by the
// hand-card AST analyzer.

import type { Corpus, Finding, Scan } from '../../types';

export const SCAN_ID = 'hand.temp-modifier-shape';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const card of corpus.auditCards) {
    if (card.family !== 'hand') continue;
    if (!card.coverage.astSemanticCoverage) continue;
    for (const path of card.choices) {
      const mods = path.declaredStructuralMarkers.queuedModifiers;
      for (let i = 0; i < mods.length; i++) {
        const mod = mods[i];
        const missing: string[] = [];
        if (!mod.hasId) missing.push('id');
        if (!mod.hasSourceTag) missing.push('sourceTag');
        if (!mod.hasTurnApplied) missing.push('turnApplied');
        const emptyEffects = mod.effectKeys.length === 0;
        const dynamicTurns = mod.turnsRemaining === 'dynamic';

        if (emptyEffects) {
          out.push({
            severity: 'MAJOR',
            family: 'hand',
            scanId: SCAN_ID,
            code: 'TEMP_MODIFIER_MALFORMED',
            cardId: card.id,
            choiceId: path.choiceId,
            filePath: card.filePath,
            message: `Queued modifier #${i} on ${card.id} has an empty effectPerTurn — the modifier does nothing each turn.`,
            confidence: 'DETERMINISTIC',
            details: { modifierIndex: i, missing: ['effectPerTurn'] },
          });
          continue;
        }

        if (missing.length > 0 || dynamicTurns) {
          const details = {
            modifierIndex: i,
            missing,
            dynamicTurnsRemaining: dynamicTurns,
            effectKeys: mod.effectKeys,
          };
          out.push({
            severity: 'MINOR',
            family: 'hand',
            scanId: SCAN_ID,
            code: 'TEMP_MODIFIER_MALFORMED',
            cardId: card.id,
            choiceId: path.choiceId,
            filePath: card.filePath,
            message:
              `Queued modifier #${i} on ${card.id} is missing ` +
              (missing.length > 0 ? `[${missing.join(', ')}]` : 'nothing') +
              (dynamicTurns ? ' and has non-literal turnsRemaining' : '') +
              '.',
            confidence: 'DETERMINISTIC',
            details,
          });
        }
      }
    }
  }

  return out;
};
