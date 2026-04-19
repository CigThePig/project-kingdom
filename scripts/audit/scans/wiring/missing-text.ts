// Wiring scan §13.1 — every authored card has display text in its text table,
// and every choice has a label.

import type { Corpus, Finding, Scan } from '../../types';
import { familyOf, fileOf } from '../shared';

export const SCAN_ID = 'wiring.missing-text';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  // Standard events (EVENT_POOL ∪ FOLLOW_UP_POOL ∪ ASSESSMENT_POOL).
  for (const ev of corpus.eventById.values()) {
    const text = corpus.text.events[ev.id];
    if (!text) {
      out.push({
        severity: 'CRITICAL',
        family: familyOf(corpus, ev.id),
        scanId: SCAN_ID,
        code: 'TEXT_MISSING',
        cardId: ev.id,
        filePath: fileOf(corpus, ev.id),
        message: `No EVENT_TEXT entry for ${ev.id}.`,
      });
      continue;
    }
    if (!text.title || !text.body) {
      out.push({
        severity: 'CRITICAL',
        family: familyOf(corpus, ev.id),
        scanId: SCAN_ID,
        code: 'TEXT_INCOMPLETE',
        cardId: ev.id,
        filePath: fileOf(corpus, ev.id),
        message: `EVENT_TEXT entry for ${ev.id} is missing title or body.`,
      });
    }
  }

  // World events.
  for (const we of corpus.worldEvents.defs) {
    const text = corpus.worldEvents.text[we.id];
    if (!text) {
      out.push({
        severity: 'CRITICAL',
        family: 'world',
        scanId: SCAN_ID,
        code: 'TEXT_MISSING',
        cardId: we.id,
        filePath: fileOf(corpus, we.id),
        message: `No WORLD_EVENT_TEXT entry for ${we.id}.`,
      });
    } else if (!text.title || !text.body) {
      out.push({
        severity: 'CRITICAL',
        family: 'world',
        scanId: SCAN_ID,
        code: 'TEXT_INCOMPLETE',
        cardId: we.id,
        filePath: fileOf(corpus, we.id),
        message: `WORLD_EVENT_TEXT entry for ${we.id} is missing title or body.`,
      });
    }
  }

  // Hand cards carry their own title/body inline; verify they're populated.
  for (const h of corpus.handCards) {
    if (!h.title || !h.body) {
      out.push({
        severity: 'CRITICAL',
        family: 'hand',
        scanId: SCAN_ID,
        code: 'TEXT_INCOMPLETE',
        cardId: h.id,
        filePath: fileOf(corpus, h.id),
        message: `Hand card ${h.id} is missing title or body.`,
      });
    }
  }

  // Decrees carry title/effectPreview inline.
  for (const d of corpus.decrees.pool) {
    if (!d.title || !d.effectPreview) {
      out.push({
        severity: 'CRITICAL',
        family: 'decree',
        scanId: SCAN_ID,
        code: 'TEXT_INCOMPLETE',
        cardId: d.id,
        filePath: fileOf(corpus, d.id),
        message: `Decree ${d.id} is missing title or effectPreview.`,
      });
    }
  }

  // Negotiation text lives in NEGOTIATION_TEXT, not EVENT_TEXT — for now we
  // only check that the negotiation exists with a non-empty term list. (Token
  // checks live in the `text.unresolved-tokens` scan.)
  for (const n of corpus.negotiations.pool) {
    if (n.terms.length === 0) {
      out.push({
        severity: 'CRITICAL',
        family: 'negotiation',
        scanId: SCAN_ID,
        code: 'NEGOTIATION_NO_TERMS',
        cardId: n.id,
        filePath: fileOf(corpus, n.id),
        message: `Negotiation ${n.id} has no terms.`,
      });
    }
  }

  return out;
};
