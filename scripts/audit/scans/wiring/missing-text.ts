// Wiring scan §13.1 — every authored card has display text in its own text
// table, and every choice has a label.
//
// The pre-overhaul implementation read almost everything through EVENT_TEXT;
// assessments/negotiations/overtures were either mis-sourced or invisible.
// This scan now dispatches per family through `getTextEntryForFamily`, so
// each family is judged against the table its runtime path actually reads.

import { getTextEntryForFamily } from '../../text-sources';
import type { Corpus, Finding, Scan } from '../../types';
import { familyOf, fileOf } from '../shared';

export const SCAN_ID = 'wiring.missing-text';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  // Events in EVENT_POOL ∪ FOLLOW_UP_POOL: classified family (crisis, petition,
  // notification, overture-class event, unknown). They all read EVENT_TEXT.
  for (const ev of corpus.eventById.values()) {
    const family = familyOf(corpus, ev.id);
    // Assessments are already in `eventById` but must read ASSESSMENT_TEXT —
    // dispatch below via assessments.pool handles them, so skip here.
    if (family === 'assessment') continue;

    const entry = getTextEntryForFamily(corpus, family, ev.id);
    if (!entry) {
      out.push({
        severity: 'CRITICAL',
        family,
        scanId: SCAN_ID,
        code: 'TEXT_MISSING',
        cardId: ev.id,
        filePath: fileOf(corpus, ev.id),
        message: `No EVENT_TEXT entry for ${ev.id}.`,
      });
      continue;
    }
    if (!entry.title || !entry.body) {
      out.push({
        severity: 'CRITICAL',
        family,
        scanId: SCAN_ID,
        code: 'TEXT_INCOMPLETE',
        cardId: ev.id,
        filePath: fileOf(corpus, ev.id),
        message: `EVENT_TEXT entry for ${ev.id} is missing title or body.`,
      });
    }
  }

  // Assessments — ASSESSMENT_TEXT.
  for (const a of corpus.assessments.pool) {
    const entry = getTextEntryForFamily(corpus, 'assessment', a.id);
    if (!entry) {
      out.push({
        severity: 'CRITICAL',
        family: 'assessment',
        scanId: SCAN_ID,
        code: 'TEXT_MISSING',
        cardId: a.id,
        filePath: fileOf(corpus, a.id),
        message: `No ASSESSMENT_TEXT entry for ${a.id}.`,
      });
      continue;
    }
    if (!entry.title || !entry.body) {
      out.push({
        severity: 'CRITICAL',
        family: 'assessment',
        scanId: SCAN_ID,
        code: 'TEXT_INCOMPLETE',
        cardId: a.id,
        filePath: fileOf(corpus, a.id),
        message: `ASSESSMENT_TEXT entry for ${a.id} is missing title or body.`,
      });
    }
  }

  // Negotiations — NEGOTIATION_TEXT. Every pooled negotiation needs a text
  // entry, and every term from the definition needs a termTitle/description.
  for (const n of corpus.negotiations.pool) {
    const entry = getTextEntryForFamily(corpus, 'negotiation', n.id);
    if (!entry) {
      out.push({
        severity: 'CRITICAL',
        family: 'negotiation',
        scanId: SCAN_ID,
        code: 'TEXT_MISSING',
        cardId: n.id,
        filePath: fileOf(corpus, n.id),
        message: `No NEGOTIATION_TEXT entry for ${n.id}.`,
      });
      continue;
    }
    if (!entry.title || !entry.body) {
      out.push({
        severity: 'CRITICAL',
        family: 'negotiation',
        scanId: SCAN_ID,
        code: 'TEXT_INCOMPLETE',
        cardId: n.id,
        filePath: fileOf(corpus, n.id),
        message: `NEGOTIATION_TEXT entry for ${n.id} is missing title or body.`,
      });
    }
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

  // Overtures — OVERTURE_TEXT, keyed by RivalAgenda.
  for (const agenda of corpus.overtures.authoredAgendas) {
    const entry = getTextEntryForFamily(corpus, 'overture', agenda);
    if (!entry) continue; // impossible given the iteration, but satisfy the nullable return.
    if (!entry.title || !entry.body) {
      out.push({
        severity: 'CRITICAL',
        family: 'overture',
        scanId: SCAN_ID,
        code: 'TEXT_INCOMPLETE',
        cardId: `overture:${agenda}`,
        filePath: fileOf(corpus, `overture:${agenda}`),
        message: `OVERTURE_TEXT entry for ${agenda} is missing title or body.`,
      });
    }
  }

  // World events.
  for (const we of corpus.worldEvents.defs) {
    const entry = getTextEntryForFamily(corpus, 'world', we.id);
    if (!entry) {
      out.push({
        severity: 'CRITICAL',
        family: 'world',
        scanId: SCAN_ID,
        code: 'TEXT_MISSING',
        cardId: we.id,
        filePath: fileOf(corpus, we.id),
        message: `No WORLD_EVENT_TEXT entry for ${we.id}.`,
      });
      continue;
    }
    if (!entry.title || !entry.body) {
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

  // Hand cards — inline title/body.
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

  // Decrees — inline title/effectPreview.
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

  return out;
};
