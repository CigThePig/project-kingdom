// Text scan §13.6 — text strings that contain `{tokens}` the smart-text
// substituter can't resolve. We run substituteSmartPlaceholders against
// several fixture states (early/mid/late game). A token is reported only
// when it fails in EVERY fixture — this avoids flagging tokens that
// legitimately resolve to empty in early states (memory clauses, etc.) but
// are well-formed.
//
// Family-aware: walks events (EVENT_TEXT), assessments (ASSESSMENT_TEXT),
// negotiations (NEGOTIATION_TEXT — title/body + per-term title/description +
// rejectLabel), overtures (OVERTURE_TEXT — title/body/grantTitle/denyTitle),
// world events, hand cards, decrees.

import { substituteSmartPlaceholders } from '../../../../src/bridge/smartText';
import { buildSampleStates, type SampleState } from '../../fixtures/sample-states';
import { getTextEntryForFamily } from '../../text-sources';
import type { Corpus, Finding, Scan } from '../../types';
import { familyOf, fileOf } from '../shared';

export const SCAN_ID = 'text.unresolved-tokens';

const TOKEN_REGEX = /\{([A-Za-z][A-Za-z0-9_/]*(?::[A-Za-z0-9_]+)?)\}/g;

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];
  const samples = buildSampleStates();

  // Events (crisis/petition/notification/unknown).
  for (const ev of corpus.eventById.values()) {
    const family = familyOf(corpus, ev.id);
    if (family === 'assessment') continue; // handled below
    const entry = getTextEntryForFamily(corpus, family, ev.id);
    if (!entry) continue;
    pushIfUnresolved(out, samples, entry.title, ev.id, undefined, 'title', family, fileOf(corpus, ev.id));
    pushIfUnresolved(out, samples, entry.body, ev.id, undefined, 'body', family, fileOf(corpus, ev.id));
    for (const [choiceId, label] of Object.entries(entry.choiceLabels)) {
      pushIfUnresolved(out, samples, label, ev.id, choiceId, 'choice', family, fileOf(corpus, ev.id));
    }
  }

  // Assessments — ASSESSMENT_TEXT.
  for (const a of corpus.assessments.pool) {
    const entry = getTextEntryForFamily(corpus, 'assessment', a.id);
    if (!entry) continue;
    pushIfUnresolved(out, samples, entry.title, a.id, undefined, 'title', 'assessment', fileOf(corpus, a.id));
    pushIfUnresolved(out, samples, entry.body, a.id, undefined, 'body', 'assessment', fileOf(corpus, a.id));
    for (const [choiceId, label] of Object.entries(entry.choiceLabels)) {
      pushIfUnresolved(out, samples, label, a.id, choiceId, 'choice', 'assessment', fileOf(corpus, a.id));
    }
  }

  // Negotiations — title, body, per-term title + description, rejectLabel.
  for (const n of corpus.negotiations.pool) {
    const entry = getTextEntryForFamily(corpus, 'negotiation', n.id);
    if (!entry) continue;
    pushIfUnresolved(out, samples, entry.title, n.id, undefined, 'title', 'negotiation', fileOf(corpus, n.id));
    pushIfUnresolved(out, samples, entry.body, n.id, undefined, 'body', 'negotiation', fileOf(corpus, n.id));
    for (const [termId, title] of Object.entries(entry.choiceLabels)) {
      pushIfUnresolved(out, samples, title, n.id, termId, 'term_title', 'negotiation', fileOf(corpus, n.id));
    }
    for (const [termId, description] of Object.entries(entry.termDescriptions ?? {})) {
      pushIfUnresolved(out, samples, description, n.id, termId, 'term_description', 'negotiation', fileOf(corpus, n.id));
    }
    const raw = corpus.negotiations.text[n.id];
    if (raw?.rejectLabel) {
      pushIfUnresolved(out, samples, raw.rejectLabel, n.id, n.rejectChoiceId, 'reject_label', 'negotiation', fileOf(corpus, n.id));
    }
  }

  // Overtures — title, body, grantTitle, denyTitle.
  for (const agenda of corpus.overtures.authoredAgendas) {
    const entry = getTextEntryForFamily(corpus, 'overture', agenda);
    if (!entry) continue;
    const cardId = `overture:${agenda}`;
    pushIfUnresolved(out, samples, entry.title, cardId, undefined, 'title', 'overture', fileOf(corpus, cardId));
    pushIfUnresolved(out, samples, entry.body, cardId, undefined, 'body', 'overture', fileOf(corpus, cardId));
    for (const [choiceId, label] of Object.entries(entry.choiceLabels)) {
      pushIfUnresolved(out, samples, label, cardId, choiceId, 'choice', 'overture', fileOf(corpus, cardId));
    }
  }

  // World event text.
  for (const we of corpus.worldEvents.defs) {
    const entry = getTextEntryForFamily(corpus, 'world', we.id);
    if (!entry) continue;
    pushIfUnresolved(out, samples, entry.title, we.id, undefined, 'title', 'world', fileOf(corpus, we.id));
    pushIfUnresolved(out, samples, entry.body, we.id, undefined, 'body', 'world', fileOf(corpus, we.id));
    for (const [choiceId, label] of Object.entries(entry.choiceLabels)) {
      pushIfUnresolved(out, samples, label, we.id, choiceId, 'choice', 'world', fileOf(corpus, we.id));
    }
  }

  // Decree title + effectPreview.
  for (const d of corpus.decrees.pool) {
    pushIfUnresolved(out, samples, d.title, d.id, undefined, 'title', 'decree', fileOf(corpus, d.id));
    pushIfUnresolved(out, samples, d.effectPreview, d.id, undefined, 'effectPreview', 'decree', fileOf(corpus, d.id));
  }

  // Hand cards.
  for (const h of corpus.handCards) {
    pushIfUnresolved(out, samples, h.title, h.id, undefined, 'title', 'hand', fileOf(corpus, h.id));
    pushIfUnresolved(out, samples, h.body, h.id, undefined, 'body', 'hand', fileOf(corpus, h.id));
  }

  return out;
};

function pushIfUnresolved(
  out: Finding[],
  samples: SampleState[],
  text: string | undefined,
  cardId: string,
  choiceId: string | undefined,
  field: string,
  family: import('../../types').Family,
  filePath: string | undefined,
): void {
  if (!text || text.indexOf('{') === -1) return;
  const tokens = extractTokens(text);
  if (tokens.size === 0) return;

  const stillUnresolved = new Set<string>(tokens);
  for (const sample of samples) {
    const substituted = substituteSmartPlaceholders(text, sample.state, sample.ctx);
    const remaining = extractTokens(substituted);
    for (const t of [...stillUnresolved]) {
      if (!remaining.has(t)) stillUnresolved.delete(t);
    }
    if (stillUnresolved.size === 0) return;
  }

  for (const token of stillUnresolved) {
    out.push({
      severity: 'MAJOR',
      family,
      scanId: SCAN_ID,
      code: 'TOKEN_UNRESOLVED',
      cardId,
      choiceId,
      filePath,
      message: `${field} on ${cardId}${choiceId ? `:${choiceId}` : ''} contains unresolved token {${token}}.`,
      details: { token, field },
    });
  }
}

function extractTokens(text: string): Set<string> {
  const out = new Set<string>();
  if (!text) return out;
  TOKEN_REGEX.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = TOKEN_REGEX.exec(text)) !== null) {
    out.add(m[1]);
  }
  return out;
}
