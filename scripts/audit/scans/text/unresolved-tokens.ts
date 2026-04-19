// Text scan §13.6 — text strings that contain `{tokens}` the smart-text
// substituter can't resolve. We run substituteSmartPlaceholders against
// several fixture states (early/mid/late game). A token is reported only
// when it fails in EVERY fixture — this avoids flagging tokens that
// legitimately resolve to empty in early states (memory clauses, etc.) but
// are well-formed.

import { substituteSmartPlaceholders } from '../../../../src/bridge/smartText';
import { buildSampleStates, type SampleState } from '../../fixtures/sample-states';
import type { Corpus, Finding, Scan } from '../../types';
import { familyOf, fileOf } from '../shared';

export const SCAN_ID = 'text.unresolved-tokens';

const TOKEN_REGEX = /\{([A-Za-z][A-Za-z0-9_/]*(?::[A-Za-z0-9_]+)?)\}/g;

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];
  const samples = buildSampleStates();

  // Standard events — title, body, choice labels.
  for (const ev of corpus.eventById.values()) {
    const text = corpus.text.events[ev.id];
    if (!text) continue;
    pushIfUnresolved(out, samples, text.title, ev.id, undefined, 'title', familyOf(corpus, ev.id), fileOf(corpus, ev.id));
    pushIfUnresolved(out, samples, text.body, ev.id, undefined, 'body', familyOf(corpus, ev.id), fileOf(corpus, ev.id));
    for (const [choiceId, label] of Object.entries(text.choices ?? {})) {
      pushIfUnresolved(out, samples, label, ev.id, choiceId, 'choice', familyOf(corpus, ev.id), fileOf(corpus, ev.id));
    }
  }

  // World event text.
  for (const we of corpus.worldEvents.defs) {
    const text = corpus.worldEvents.text[we.id];
    if (!text) continue;
    pushIfUnresolved(out, samples, text.title, we.id, undefined, 'title', 'world', fileOf(corpus, we.id));
    pushIfUnresolved(out, samples, text.body, we.id, undefined, 'body', 'world', fileOf(corpus, we.id));
    for (const [choiceId, label] of Object.entries(text.choices ?? {})) {
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
  text: string,
  cardId: string,
  choiceId: string | undefined,
  field: string,
  family: import('../../types').Family,
  filePath: string | undefined,
): void {
  if (!text || text.indexOf('{') === -1) return;
  // For each token in the source text, ask: did it remain unresolved in every
  // fixture? Tokens that resolve in any fixture are good — they're conditional.
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

  // What remains is unresolved across every fixture.
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
