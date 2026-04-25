// Substance scan §13.4 — choices that move only "surface" sliders (treasury,
// satisfaction, faith, etc.) without touching any of the five structural
// markers that signal real downstream consequence:
//
//   1. EVENT_CHOICE_TEMPORARY_MODIFIERS[event][choice] — recurring effects.
//   2. KINGDOM_FEATURE_REGISTRY['event:<event>:<choice>'] — installs a kingdom
//      feature on resolution.
//   3. EVENT_CHOICE_STYLE_TAGS[event][choice] — non-empty axis deltas.
//   4. followUpEvents[*].triggerChoiceId === choice — schedules a follow-up.
//   5. Some other trigger somewhere reads the consequence tag this choice
//      produces (`<event>:<choice>`).
//
// `regionConditionDelta` is normally surface-level, but for cards with
// affectsRegion === true it is structurally meaningful (it persists in region
// state). This scan honors that gotcha in the fallback path.
//
// Phase 6 upgrade: when a decision path carries a runtimeFingerprint (hand,
// decree, assessment, negotiation, overture), trust the real runtime diff
// over the table heuristics. A fingerprint with any non-surface touch class
// passes; a fingerprint with only surface classes fails as RUNTIME_GROUNDED.
//
// Recovery upgrade (§2 severity-scaling corollary): the fallback heuristic is
// now tier-aware. Style tags and the regionConditionDelta gotcha count as
// "weak" markers — they're pervasive and cheap, so they don't buy a
// high-severity card structural credit on their own. Critical-severity cards
// need 2+ strong markers (temp modifier, feature entry, follow-up, tag read
// elsewhere); Serious need 1+ strong; Notable/Informational keep the legacy
// "1 of any marker" bar.

import { EventSeverity } from '../../../../src/engine/types';
import { isEffectDeltaNonEmpty } from '../../category-map';
import type { AuditCard, AuditDecisionPath } from '../../ir';
import type { Corpus, Finding, Scan } from '../../types';
import { STRUCTURAL_TOUCH_CLASSES, familyOf, fileOf } from '../shared';

export const SCAN_ID = 'substance.surface-only';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  // Prefer the normalized IR for families where the harness has runtime
  // fingerprints; fall back to raw corpus.eventById for every card the IR
  // doesn't own or where the fingerprint is absent.
  const auditCardIndex = new Map<string, AuditCard>();
  for (const card of corpus.auditCards) auditCardIndex.set(card.id, card);

  for (const ev of corpus.eventById.values()) {
    if (corpus.familyByCardId.get(ev.id) === 'notification') continue;
    if (ev.choices.length === 1) continue;

    const choices = corpus.effects.events[ev.id] ?? corpus.assessments.effects[ev.id];
    if (!choices) continue;

    const auditCard = auditCardIndex.get(ev.id);

    for (const c of ev.choices) {
      const delta = choices[c.choiceId];
      if (!isEffectDeltaNonEmpty(delta)) continue; // covered by empty-effects

      // Runtime-grounded path: if the IR has a fingerprint for this choice,
      // check whether it touches any structural class. If so we're done.
      // If not, we still fall through to the table markers — the harness's
      // event-resolution path applies only the raw mechanical delta via
      // `applyEventChoiceEffects` and skips the `applyCrisisResponseEffect`
      // tail (temp-modifier scheduling, kingdom-feature registration,
      // follow-up queueing). Those three channels are the §2 "strong
      // markers" and must be consulted from the tables when the runtime
      // diff stops short.
      const fp = findChoiceFingerprint(auditCard, c.choiceId);
      if (fp) {
        if (fp.noOp) continue; // owned by no-op-apply / empty-effects scans
        if (fp.classes.some((cls) => STRUCTURAL_TOUCH_CLASSES.has(cls))) continue;
      }

      // Table heuristics — always consulted when the runtime diff did not
      // settle the question (either no fingerprint, or fingerprint only
      // touched surface classes).

      // Marker 1: temp modifier.
      const hasTempMod = !!corpus.tempModifiers[ev.id]?.[c.choiceId];

      // Marker 2: kingdom feature registry entry.
      const featureKey = `event:${ev.id}:${c.choiceId}`;
      const hasFeatureEntry = !!corpus.featureRegistry[featureKey];

      // Marker 3: non-empty style tag block.
      const styleAxes = corpus.styleTags[ev.id]?.[c.choiceId];
      const hasStyleTag = !!styleAxes && Object.keys(styleAxes).length > 0;

      // Marker 4: choice triggers a follow-up.
      const hasFollowUp = (ev.followUpEvents ?? []).some((fu) => fu.triggerChoiceId === c.choiceId);

      // Marker 5: produced consequence tag is read elsewhere.
      const tag = `${ev.id}:${c.choiceId}`;
      const tagReadElsewhere = corpus.tagReaders.has(tag);

      // §14 gotcha: regionConditionDelta on a card with affectsRegion === true
      // is structurally meaningful (persists in region state).
      const regionConditionStructural =
        ev.affectsRegion === true &&
        typeof delta.regionConditionDelta === 'number' &&
        delta.regionConditionDelta !== 0;

      const markers = {
        hasTempMod,
        hasFeatureEntry,
        hasStyleTag,
        hasFollowUp,
        tagReadElsewhere,
        regionConditionStructural,
      };
      const verdict = structuralVerdict(ev.severity, markers);

      if (!verdict.ok) {
        // When a fingerprint exists and is surface-only, the finding is
        // RUNTIME_GROUNDED — the runtime confirmed no structural touch AND
        // the table heuristic confirmed no structural marker. Fall back to
        // HEURISTIC only when no fingerprint was available at all.
        out.push({
          severity: 'MAJOR',
          family: familyOf(corpus, ev.id),
          scanId: SCAN_ID,
          code: 'SURFACE_ONLY',
          cardId: ev.id,
          choiceId: c.choiceId,
          filePath: fileOf(corpus, ev.id),
          message: fp
            ? `Choice ${ev.id}:${c.choiceId} runtime diff shows only surface touches (${fp.touches.join(', ') || '(none)'}) and no structural table marker — ${verdict.reason}.`
            : `Choice ${ev.id}:${c.choiceId} only nudges sliders — ${verdict.reason}.`,
          confidence: fp ? 'RUNTIME_GROUNDED' : 'HEURISTIC',
          details: fp
            ? {
                fixtureId: fp.fixtureId,
                touches: fp.touches,
                classes: fp.classes,
                severity: ev.severity,
                verdictReason: verdict.reason,
                checked: markers,
              }
            : {
                severity: ev.severity,
                verdictReason: verdict.reason,
                checked: markers,
              },
        });
      }
    }
  }

  return out;
};

const STRONG_MARKERS = [
  'hasTempMod',
  'hasFeatureEntry',
  'hasFollowUp',
  'tagReadElsewhere',
] as const;
const WEAK_MARKERS = ['hasStyleTag', 'regionConditionStructural'] as const;

type MarkerMap = Record<
  (typeof STRONG_MARKERS)[number] | (typeof WEAK_MARKERS)[number],
  boolean
>;

function structuralVerdict(
  severity: EventSeverity,
  markers: MarkerMap,
): { ok: boolean; reason: string } {
  const strong = STRONG_MARKERS.filter((m) => markers[m]).length;
  const weak = WEAK_MARKERS.filter((m) => markers[m]).length;

  if (severity === EventSeverity.Critical) {
    return strong >= 2
      ? { ok: true, reason: `Critical card carries ${strong} strong markers` }
      : {
          ok: false,
          reason: `Critical card requires 2+ strong markers (temp mod, feature entry, follow-up, tag read elsewhere); got ${strong} strong and ${weak} weak (style tag / regionConditionStructural do not count at this tier)`,
        };
  }
  if (severity === EventSeverity.Serious) {
    return strong >= 1
      ? { ok: true, reason: `Serious card carries ${strong} strong marker(s)` }
      : {
          ok: false,
          reason: `Serious card requires 1+ strong marker (temp mod, feature entry, follow-up, tag read elsewhere); got ${strong} strong and ${weak} weak (style tag / regionConditionStructural do not count at this tier)`,
        };
  }
  // Notable / Informational — legacy rule: 1 of any marker.
  return strong + weak >= 1
    ? { ok: true, reason: `has at least one marker (${strong} strong, ${weak} weak)` }
    : { ok: false, reason: 'no temp modifier, kingdom feature, style tag, follow-up, or downstream tag reader' };
}

function findChoiceFingerprint(
  card: AuditCard | undefined,
  choiceId: string,
): AuditDecisionPath['runtimeFingerprint'] {
  if (!card) return null;
  const path = card.choices.find((p) => p.choiceId === choiceId);
  return path?.runtimeFingerprint ?? null;
}
