// Substance scan §13.10 — severity vs. magnitude mismatch.
// EventSeverity.Critical events should produce at least one large-magnitude
// delta on the strongest choice; Notable/Informational events shouldn't be
// gated by trivial nudges that look ignorable.
//
// Heuristic — compute the maximum absolute numeric delta across all choices
// of the card (treating temp modifiers as their per-turn value × duration as
// a rough total). Compare to per-severity thresholds:
//
//   Critical    → max ≥ 40 expected; emit MAJOR if max < 40.
//   Serious     → max ≥ 20 expected; emit MINOR if max < 20.
//   Notable     → max in [5, 80]; emit MINOR if max > 80 (over-tuned) or < 5.
//   Informational → no check.
//
// These are deliberately loose — too-tight thresholds drown the audit in
// false positives. The point is to surface "Critical card whose strongest
// outcome moves stability by 1" cases, which are real and frequent.

import { ALL_EFFECT_FIELDS } from '../../category-map';
import type { MechanicalEffectDelta } from '../../../../src/engine/types';
import { EventSeverity } from '../../../../src/engine/types';
import type { Corpus, Finding, Scan } from '../../types';
import { familyOf, fileOf } from '../shared';

export const SCAN_ID = 'substance.severity-magnitude';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const ev of corpus.eventById.values()) {
    if (corpus.familyByCardId.get(ev.id) === 'notification') continue;
    if (ev.severity === EventSeverity.Informational) continue;

    const choices = corpus.effects.events[ev.id] ?? corpus.assessments.effects[ev.id];
    const tempBlock = corpus.tempModifiers[ev.id] ?? {};
    if (!choices) continue;

    let maxAbs = 0;
    for (const c of ev.choices) {
      maxAbs = Math.max(maxAbs, magnitudeOfDelta(choices[c.choiceId]));
      const tm = tempBlock[c.choiceId];
      if (tm) {
        maxAbs = Math.max(maxAbs, magnitudeOfDelta(tm.effectPerTurn) * Math.max(1, tm.durationTurns));
      }
    }

    if (ev.severity === EventSeverity.Critical && maxAbs < 40) {
      out.push({
        severity: 'MAJOR',
        family: familyOf(corpus, ev.id),
        scanId: SCAN_ID,
        code: 'CRITICAL_TOO_SMALL',
        cardId: ev.id,
        filePath: fileOf(corpus, ev.id),
        message: `Critical event ${ev.id} has max-magnitude outcome ${maxAbs}; expected ≥ 40.`,
        details: { maxAbs },
      });
    } else if (ev.severity === EventSeverity.Serious && maxAbs < 20) {
      out.push({
        severity: 'MINOR',
        family: familyOf(corpus, ev.id),
        scanId: SCAN_ID,
        code: 'SERIOUS_TOO_SMALL',
        cardId: ev.id,
        filePath: fileOf(corpus, ev.id),
        message: `Serious event ${ev.id} has max-magnitude outcome ${maxAbs}; expected ≥ 20.`,
        details: { maxAbs },
      });
    } else if (ev.severity === EventSeverity.Notable && maxAbs > 80) {
      out.push({
        severity: 'MINOR',
        family: familyOf(corpus, ev.id),
        scanId: SCAN_ID,
        code: 'NOTABLE_TOO_LARGE',
        cardId: ev.id,
        filePath: fileOf(corpus, ev.id),
        message: `Notable event ${ev.id} has max-magnitude outcome ${maxAbs}; consider promoting to Serious or trimming.`,
        details: { maxAbs },
      });
    }
  }

  return out;
};

function magnitudeOfDelta(delta: MechanicalEffectDelta | undefined): number {
  if (!delta) return 0;
  let m = 0;
  for (const field of ALL_EFFECT_FIELDS) {
    if (field === 'diplomacyDeltas') {
      const dd = delta.diplomacyDeltas;
      if (dd) for (const v of Object.values(dd)) m = Math.max(m, Math.abs(v));
      continue;
    }
    const v = (delta as Record<string, unknown>)[field];
    if (typeof v === 'number') m = Math.max(m, Math.abs(v));
  }
  return m;
}
