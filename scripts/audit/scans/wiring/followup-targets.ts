// Wiring scan §13.7 — every followUpDefinitionId on every event resolves to an
// EventDefinition reachable via FOLLOW_UP_REGISTRY (= EVENT_POOL ∪
// FOLLOW_UP_POOL ∪ ASSESSMENT_POOL). A dangling follow-up surfaces as a black
// hole at runtime: the choice fires, the engine schedules nothing.

import type { Corpus, Finding, Scan } from '../../types';
import { familyOf, fileOf } from '../shared';

export const SCAN_ID = 'wiring.followup-targets';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const ev of corpus.eventById.values()) {
    const validChoiceIds = new Set(ev.choices.map((c) => c.choiceId));
    for (const fu of ev.followUpEvents ?? []) {
      if (!validChoiceIds.has(fu.triggerChoiceId)) {
        out.push({
          severity: 'CRITICAL',
          family: familyOf(corpus, ev.id),
          scanId: SCAN_ID,
          code: 'FOLLOWUP_TRIGGER_INVALID',
          cardId: ev.id,
          choiceId: fu.triggerChoiceId,
          filePath: fileOf(corpus, ev.id),
          message: `Follow-up on ${ev.id} references unknown choice ${fu.triggerChoiceId}.`,
          details: { followUpDefinitionId: fu.followUpDefinitionId },
        });
      }
      if (!corpus.eventById.has(fu.followUpDefinitionId)) {
        out.push({
          severity: 'CRITICAL',
          family: familyOf(corpus, ev.id),
          scanId: SCAN_ID,
          code: 'FOLLOWUP_TARGET_MISSING',
          cardId: ev.id,
          choiceId: fu.triggerChoiceId,
          filePath: fileOf(corpus, ev.id),
          message: `Follow-up on ${ev.id}:${fu.triggerChoiceId} targets unknown event ${fu.followUpDefinitionId}.`,
          details: { followUpDefinitionId: fu.followUpDefinitionId },
        });
      }
      if (typeof fu.probability === 'number' && (fu.probability <= 0 || fu.probability > 1)) {
        out.push({
          severity: 'MINOR',
          family: familyOf(corpus, ev.id),
          scanId: SCAN_ID,
          code: 'FOLLOWUP_PROBABILITY_INVALID',
          cardId: ev.id,
          choiceId: fu.triggerChoiceId,
          filePath: fileOf(corpus, ev.id),
          message: `Follow-up probability on ${ev.id}:${fu.triggerChoiceId} is ${fu.probability} (expected 0 < p ≤ 1).`,
        });
      }
      if (typeof fu.delayTurns === 'number' && fu.delayTurns < 0) {
        out.push({
          severity: 'MINOR',
          family: familyOf(corpus, ev.id),
          scanId: SCAN_ID,
          code: 'FOLLOWUP_DELAY_INVALID',
          cardId: ev.id,
          choiceId: fu.triggerChoiceId,
          filePath: fileOf(corpus, ev.id),
          message: `Follow-up delayTurns on ${ev.id}:${fu.triggerChoiceId} is negative (${fu.delayTurns}).`,
        });
      }
    }
  }

  return out;
};
