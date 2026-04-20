// Wiring scan — every choiceId on every event has a matching button label in
// the family's text table. Split out from missing-text so authors can see the
// per-choice gap distinct from "no entry exists at all".
//
// Dispatch through `getTextEntryForFamily` so assessments/negotiations/
// overtures read their own tables (ASSESSMENT_TEXT uses `choices`;
// NEGOTIATION_TEXT has term titles + rejectLabel; OVERTURE_TEXT has
// grantTitle/denyTitle).

import { getTextEntryForFamily } from '../../text-sources';
import type { Corpus, Finding, Scan } from '../../types';
import { familyOf, fileOf } from '../shared';

export const SCAN_ID = 'wiring.choice-label-coverage';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  // Events (crisis/petition/notification/unknown and assessments).
  for (const ev of corpus.eventById.values()) {
    const family = familyOf(corpus, ev.id);
    const entry = getTextEntryForFamily(corpus, family, ev.id);
    if (!entry) continue; // covered by wiring.missing-text
    for (const c of ev.choices) {
      if (!entry.choiceLabels[c.choiceId]) {
        out.push({
          severity: 'CRITICAL',
          family,
          scanId: SCAN_ID,
          code: 'CHOICE_LABEL_MISSING',
          cardId: ev.id,
          choiceId: c.choiceId,
          filePath: fileOf(corpus, ev.id),
          message: `Choice ${c.choiceId} on ${ev.id} has no button label.`,
        });
      }
    }
  }

  // Negotiations — every term needs a label + description; rejectChoiceId
  // needs a rejectLabel at the top level.
  for (const n of corpus.negotiations.pool) {
    const entry = getTextEntryForFamily(corpus, 'negotiation', n.id);
    if (!entry) continue;
    for (const term of n.terms) {
      if (!entry.choiceLabels[term.termId]) {
        out.push({
          severity: 'CRITICAL',
          family: 'negotiation',
          scanId: SCAN_ID,
          code: 'CHOICE_LABEL_MISSING',
          cardId: n.id,
          choiceId: term.termId,
          filePath: fileOf(corpus, n.id),
          message: `Term ${term.termId} on ${n.id} has no title in NEGOTIATION_TEXT.terms.`,
        });
      }
      if (!entry.termDescriptions?.[term.termId]) {
        out.push({
          severity: 'CRITICAL',
          family: 'negotiation',
          scanId: SCAN_ID,
          code: 'NEGOTIATION_TERM_DESCRIPTION_MISSING',
          cardId: n.id,
          choiceId: term.termId,
          filePath: fileOf(corpus, n.id),
          message: `Term ${term.termId} on ${n.id} has no description.`,
        });
      }
    }
    const rejectEntry = corpus.negotiations.text[n.id];
    if (rejectEntry && !rejectEntry.rejectLabel) {
      out.push({
        severity: 'CRITICAL',
        family: 'negotiation',
        scanId: SCAN_ID,
        code: 'NEGOTIATION_REJECT_LABEL_MISSING',
        cardId: n.id,
        choiceId: n.rejectChoiceId,
        filePath: fileOf(corpus, n.id),
        message: `Negotiation ${n.id} has no rejectLabel.`,
      });
    }
  }

  // Overtures — grantTitle + denyTitle both required.
  for (const agenda of corpus.overtures.authoredAgendas) {
    const entry = getTextEntryForFamily(corpus, 'overture', agenda);
    if (!entry) continue;
    for (const choiceId of ['grant', 'deny'] as const) {
      if (!entry.choiceLabels[choiceId]) {
        out.push({
          severity: 'CRITICAL',
          family: 'overture',
          scanId: SCAN_ID,
          code: 'CHOICE_LABEL_MISSING',
          cardId: `overture:${agenda}`,
          choiceId,
          filePath: fileOf(corpus, `overture:${agenda}`),
          message: `OVERTURE_TEXT[${agenda}] is missing ${choiceId === 'grant' ? 'grantTitle' : 'denyTitle'}.`,
        });
      }
    }
  }

  // World events.
  for (const we of corpus.worldEvents.defs) {
    const entry = getTextEntryForFamily(corpus, 'world', we.id);
    if (!entry) continue;
    for (const c of we.choices) {
      if (!entry.choiceLabels[c.id]) {
        out.push({
          severity: 'CRITICAL',
          family: 'world',
          scanId: SCAN_ID,
          code: 'CHOICE_LABEL_MISSING',
          cardId: we.id,
          choiceId: c.id,
          filePath: fileOf(corpus, we.id),
          message: `World event choice ${c.id} on ${we.id} has no button label.`,
        });
      }
    }
  }

  return out;
};
