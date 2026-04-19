// Wiring scan §13.2 — every authored choice has an effects entry registered
// in the corresponding effects table (events / decrees / world / negotiations
// / assessments).

import type { Corpus, Finding, Scan } from '../../types';
import { familyOf, fileOf } from '../shared';

export const SCAN_ID = 'wiring.missing-effects';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  // EVENT_POOL + FOLLOW_UP_POOL — all live in EVENT_CHOICE_EFFECTS.
  for (const ev of corpus.events.pool) emitMissingEventChoice(corpus, ev, out, false);
  for (const ev of corpus.events.followUpPool) emitMissingEventChoice(corpus, ev, out, false);

  // ASSESSMENT_POOL — uses ASSESSMENT_EFFECTS.
  for (const ev of corpus.assessments.pool) {
    const choices = corpus.assessments.effects[ev.id];
    for (const c of ev.choices) {
      if (!choices || !choices[c.choiceId]) {
        out.push({
          severity: 'CRITICAL',
          family: 'assessment',
          scanId: SCAN_ID,
          code: 'EFFECTS_MISSING',
          cardId: ev.id,
          choiceId: c.choiceId,
          filePath: fileOf(corpus, ev.id),
          message: `Assessment ${ev.id}:${c.choiceId} has no entry in ASSESSMENT_EFFECTS.`,
        });
      }
    }
  }

  // NEGOTIATION_POOL — uses NEGOTIATION_EFFECTS.
  for (const n of corpus.negotiations.pool) {
    const slot = corpus.negotiations.effects[n.id];
    for (const t of n.terms) {
      if (!slot || !slot[t.termId]) {
        out.push({
          severity: 'CRITICAL',
          family: 'negotiation',
          scanId: SCAN_ID,
          code: 'EFFECTS_MISSING',
          cardId: n.id,
          choiceId: t.termId,
          filePath: fileOf(corpus, n.id),
          message: `Negotiation term ${n.id}:${t.termId} has no entry in NEGOTIATION_EFFECTS.`,
        });
      }
    }
    if (!slot || !slot[n.rejectChoiceId]) {
      out.push({
        severity: 'CRITICAL',
        family: 'negotiation',
        scanId: SCAN_ID,
        code: 'EFFECTS_MISSING',
        cardId: n.id,
        choiceId: n.rejectChoiceId,
        filePath: fileOf(corpus, n.id),
        message: `Negotiation reject ${n.id}:${n.rejectChoiceId} has no entry in NEGOTIATION_EFFECTS.`,
      });
    }
  }

  // DECREES — every decree must have an entry in DECREE_EFFECTS.
  for (const d of corpus.decrees.pool) {
    if (!corpus.decrees.effects[d.id]) {
      out.push({
        severity: 'CRITICAL',
        family: 'decree',
        scanId: SCAN_ID,
        code: 'EFFECTS_MISSING',
        cardId: d.id,
        filePath: fileOf(corpus, d.id),
        message: `Decree ${d.id} has no entry in DECREE_EFFECTS.`,
      });
    }
  }

  // WORLD EVENTS — choice.effectsKey must resolve.
  for (const we of corpus.worldEvents.defs) {
    for (const c of we.choices) {
      if (!corpus.worldEvents.effects[c.effectsKey]) {
        out.push({
          severity: 'CRITICAL',
          family: 'world',
          scanId: SCAN_ID,
          code: 'EFFECTS_MISSING',
          cardId: we.id,
          choiceId: c.id,
          filePath: fileOf(corpus, we.id),
          message: `World event choice ${we.id}:${c.id} has no entry in WORLD_EVENT_CHOICE_EFFECTS for key ${c.effectsKey}.`,
        });
      }
    }
  }

  return out;
};

function emitMissingEventChoice(
  corpus: Corpus,
  ev: import('../../../../src/engine/events/event-engine').EventDefinition,
  out: Finding[],
  _: boolean,
): void {
  const choices = corpus.effects.events[ev.id];
  for (const c of ev.choices) {
    if (!choices || !choices[c.choiceId]) {
      out.push({
        severity: 'CRITICAL',
        family: familyOf(corpus, ev.id),
        scanId: SCAN_ID,
        code: 'EFFECTS_MISSING',
        cardId: ev.id,
        choiceId: c.choiceId,
        filePath: fileOf(corpus, ev.id),
        message: `Event ${ev.id}:${c.choiceId} has no entry in EVENT_CHOICE_EFFECTS.`,
      });
    }
  }
}
