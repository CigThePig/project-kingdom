// Wiring scan §13.3 — registered effects that are entirely empty (no nonzero
// numeric field, no diplomacy entries, no temp modifier).
//
// "Acknowledge"-style notification choices and free overture choices may
// legitimately be empty if (and only if) they're the sole choice on a single-
// choice card. The single-choice-monthly substance scan flags those separately.

import { isEffectDeltaNonEmpty } from '../../category-map';
import type { Corpus, Finding, Scan } from '../../types';
import { familyOf, fileOf } from '../shared';

export const SCAN_ID = 'wiring.empty-effects';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const ev of corpus.eventById.values()) {
    const isNotification =
      corpus.familyByCardId.get(ev.id) === 'notification' ||
      ev.classification === 'notification';
    const isSingleChoice = ev.choices.length === 1;
    if (isNotification || isSingleChoice) continue;

    const choices = corpus.effects.events[ev.id] ?? corpus.assessments.effects[ev.id];
    const tempBlock = corpus.tempModifiers[ev.id] ?? {};
    if (!choices) continue;

    for (const c of ev.choices) {
      const delta = choices[c.choiceId];
      const tempDelta = tempBlock[c.choiceId]?.effectPerTurn;
      if (!isEffectDeltaNonEmpty(delta) && !isEffectDeltaNonEmpty(tempDelta)) {
        out.push({
          severity: 'MAJOR',
          family: familyOf(corpus, ev.id),
          scanId: SCAN_ID,
          code: 'EFFECTS_EMPTY',
          cardId: ev.id,
          choiceId: c.choiceId,
          filePath: fileOf(corpus, ev.id),
          message: `Choice ${ev.id}:${c.choiceId} resolves with no nonzero deltas.`,
        });
      }
    }
  }

  // Decrees with empty effects.
  for (const d of corpus.decrees.pool) {
    const delta = corpus.decrees.effects[d.id];
    if (!delta) continue; // covered by missing-effects
    if (!isEffectDeltaNonEmpty(delta)) {
      out.push({
        severity: 'MAJOR',
        family: 'decree',
        scanId: SCAN_ID,
        code: 'EFFECTS_EMPTY',
        cardId: d.id,
        filePath: fileOf(corpus, d.id),
        message: `Decree ${d.id} resolves with no nonzero deltas.`,
      });
    }
  }

  // Negotiation terms — every term that exists should move at least one number.
  for (const n of corpus.negotiations.pool) {
    const slot = corpus.negotiations.effects[n.id];
    if (!slot) continue;
    for (const t of n.terms) {
      const delta = slot[t.termId];
      if (delta && !isEffectDeltaNonEmpty(delta)) {
        out.push({
          severity: 'MAJOR',
          family: 'negotiation',
          scanId: SCAN_ID,
          code: 'EFFECTS_EMPTY',
          cardId: n.id,
          choiceId: t.termId,
          filePath: fileOf(corpus, n.id),
          message: `Negotiation term ${n.id}:${t.termId} resolves with no nonzero deltas.`,
        });
      }
    }
  }

  // World event choices.
  for (const we of corpus.worldEvents.defs) {
    if (we.choices.length === 1) continue;
    for (const c of we.choices) {
      const delta = corpus.worldEvents.effects[c.effectsKey];
      if (delta && !isEffectDeltaNonEmpty(delta)) {
        out.push({
          severity: 'MAJOR',
          family: 'world',
          scanId: SCAN_ID,
          code: 'EFFECTS_EMPTY',
          cardId: we.id,
          choiceId: c.id,
          filePath: fileOf(corpus, we.id),
          message: `World event choice ${we.id}:${c.id} (${c.effectsKey}) resolves with no nonzero deltas.`,
        });
      }
    }
  }

  return out;
};
