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
// state). This scan honors that gotcha.

import { isEffectDeltaNonEmpty } from '../../category-map';
import type { Corpus, Finding, Scan } from '../../types';
import { familyOf, fileOf } from '../shared';

export const SCAN_ID = 'substance.surface-only';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const ev of corpus.eventById.values()) {
    if (corpus.familyByCardId.get(ev.id) === 'notification') continue;
    if (ev.choices.length === 1) continue;

    const choices = corpus.effects.events[ev.id] ?? corpus.assessments.effects[ev.id];
    if (!choices) continue;

    for (const c of ev.choices) {
      const delta = choices[c.choiceId];
      if (!isEffectDeltaNonEmpty(delta)) continue; // covered by empty-effects

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

      const isStructural =
        hasTempMod ||
        hasFeatureEntry ||
        hasStyleTag ||
        hasFollowUp ||
        tagReadElsewhere ||
        regionConditionStructural;

      if (!isStructural) {
        out.push({
          severity: 'MAJOR',
          family: familyOf(corpus, ev.id),
          scanId: SCAN_ID,
          code: 'SURFACE_ONLY',
          cardId: ev.id,
          choiceId: c.choiceId,
          filePath: fileOf(corpus, ev.id),
          message: `Choice ${ev.id}:${c.choiceId} only nudges sliders — no temp modifier, kingdom feature, style tag, follow-up, or downstream tag reader.`,
          details: {
            checked: {
              hasTempMod,
              hasFeatureEntry,
              hasStyleTag,
              hasFollowUp,
              tagReadElsewhere,
              regionConditionStructural,
            },
          },
        });
      }
    }
  }

  return out;
};
