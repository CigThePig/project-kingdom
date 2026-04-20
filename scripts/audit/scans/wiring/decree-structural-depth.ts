// Wiring scan §13 — every decree must enact *some* state change.
//
// Resolution for an IssueDecree action runs two independent paths:
//   1. DECREE_EFFECT_REGISTRY[key] — immediate one-shot delta.
//   2. KINGDOM_FEATURE_REGISTRY['decree:<id>'] — ongoing per-turn effect.
//
// A decree with *neither* enacts silently: resource costs deduct, a
// persistent consequence is recorded, and nothing else touches GameState.
// That is a CRITICAL §8 bug (card fires and produces no effect). The
// existing `wiring.missing-effects` scan only checks the UI-preview
// DECREE_EFFECTS table, which is a different artefact — it can be fully
// populated while runtime delivery is still silent. This scan closes
// that gap.
//
// Registry lookup strips the `decree_` prefix (see apply-action-effects.ts
// `applyDecreeEffect`), so this scan applies the same transform.
// Kingdom features are keyed with the prefix intact (`decree:<decree_id>`).

import type { Corpus, Finding, Scan } from '../../types';
import { fileOf } from '../shared';

export const SCAN_ID = 'wiring.decree-structural-depth';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];
  for (const d of corpus.decrees.pool) {
    const handlerKey = d.id.replace(/^decree_/, '');
    const hasHandler = corpus.decrees.handlerKeys.has(handlerKey);
    const hasFeature = Object.prototype.hasOwnProperty.call(
      corpus.featureRegistry,
      `decree:${d.id}`,
    );
    if (!hasHandler && !hasFeature) {
      out.push({
        severity: 'CRITICAL',
        family: 'decree',
        scanId: SCAN_ID,
        code: 'DECREE_NO_STATE_CHANGE',
        cardId: d.id,
        filePath: fileOf(corpus, d.id),
        message:
          `Decree ${d.id} has no DECREE_EFFECT_REGISTRY entry (key "${handlerKey}") ` +
          `and no KINGDOM_FEATURE_REGISTRY["decree:${d.id}"] entry. ` +
          `The action will resolve silently with zero state change.`,
      });
    }
  }
  return out;
};
