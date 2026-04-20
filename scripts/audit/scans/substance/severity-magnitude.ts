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
//
// Phase 6 upgrade: when any choice has a runtimeFingerprint, demand that a
// Critical card produce at least one structural/temporal/policy/construction
// runtime touch across its choices. A Critical whose strongest numeric
// outcome clears the magnitude bar but whose runtime diff is surface-only
// is still shallow — the card is "big on paper, thin in practice" — and we
// flag it with RUNTIME_GROUNDED confidence.

import { ALL_EFFECT_FIELDS } from '../../category-map';
import type { MechanicalEffectDelta } from '../../../../src/engine/types';
import { EventSeverity } from '../../../../src/engine/types';
import type { AuditCard } from '../../ir';
import type { Corpus, Finding, Scan } from '../../types';
import { STRUCTURAL_TOUCH_CLASSES, familyOf, fileOf } from '../shared';

export const SCAN_ID = 'substance.severity-magnitude';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  const auditCardIndex = new Map<string, AuditCard>();
  for (const card of corpus.auditCards) auditCardIndex.set(card.id, card);

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

    const auditCard = auditCardIndex.get(ev.id);
    const runtime = summarizeRuntimeDepth(auditCard);

    if (ev.severity === EventSeverity.Critical && maxAbs < 40) {
      out.push({
        severity: 'MAJOR',
        family: familyOf(corpus, ev.id),
        scanId: SCAN_ID,
        code: 'CRITICAL_TOO_SMALL',
        cardId: ev.id,
        filePath: fileOf(corpus, ev.id),
        message: `Critical event ${ev.id} has max-magnitude outcome ${maxAbs}; expected ≥ 40.`,
        confidence: 'HEURISTIC',
        details: { maxAbs },
      });
    } else if (ev.severity === EventSeverity.Critical && runtime.anyFingerprint && !runtime.anyStructural) {
      // Numeric magnitude passes, but real runtime diffs show no structural
      // depth on any choice. This is the "loud on paper, shallow in practice"
      // case — Critical cards should move something beyond surface sliders.
      out.push({
        severity: 'MAJOR',
        family: familyOf(corpus, ev.id),
        scanId: SCAN_ID,
        code: 'CRITICAL_SHALLOW_RUNTIME',
        cardId: ev.id,
        filePath: fileOf(corpus, ev.id),
        message: `Critical event ${ev.id}: max numeric magnitude ${maxAbs} is fine, but runtime diffs on every choice touch only surface state.`,
        confidence: 'RUNTIME_GROUNDED',
        details: { maxAbs, touchesByChoice: runtime.touchesByChoice },
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
        confidence: 'HEURISTIC',
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
        confidence: 'HEURISTIC',
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

interface RuntimeDepthSummary {
  anyFingerprint: boolean;
  anyStructural: boolean;
  touchesByChoice: Record<string, string[]>;
}

function summarizeRuntimeDepth(card: AuditCard | undefined): RuntimeDepthSummary {
  const summary: RuntimeDepthSummary = {
    anyFingerprint: false,
    anyStructural: false,
    touchesByChoice: {},
  };
  if (!card) return summary;
  for (const path of card.choices) {
    const fp = path.runtimeFingerprint;
    if (!fp) continue;
    summary.anyFingerprint = true;
    summary.touchesByChoice[path.choiceId] = fp.touches;
    if (fp.classes.some((c) => STRUCTURAL_TOUCH_CLASSES.has(c))) {
      summary.anyStructural = true;
    }
  }
  return summary;
}
