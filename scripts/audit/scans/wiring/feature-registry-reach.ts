// Wiring scan — KINGDOM_FEATURE_REGISTRY entries that reference unknown
// producer keys, and decree producers that lack a registry entry (informational
// MINOR — many decrees legitimately produce no kingdom feature).
//
// Registry keys carry a `decree:<decreeId>` or `event:<eventId>:<choiceId>`
// prefix. An unknown prefix is a CRITICAL wiring error; a known prefix that
// targets a missing decree/event is also CRITICAL.

import type { Corpus, Finding, Scan } from '../../types';
import { familyOf, fileOf } from '../shared';

export const SCAN_ID = 'wiring.feature-registry-reach';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  const decreeIds = new Set(corpus.decrees.pool.map((d) => d.id));

  for (const key of Object.keys(corpus.featureRegistry)) {
    if (key.startsWith('decree:')) {
      const decreeId = key.slice('decree:'.length);
      if (!decreeIds.has(decreeId)) {
        out.push({
          severity: 'CRITICAL',
          family: 'decree',
          scanId: SCAN_ID,
          code: 'FEATURE_REGISTRY_ORPHAN',
          cardId: decreeId,
          filePath: fileOf(corpus, decreeId),
          message: `KINGDOM_FEATURE_REGISTRY references unknown decree ${decreeId}.`,
          details: { registryKey: key },
        });
      }
      continue;
    }

    if (key.startsWith('event:')) {
      // 'event:<eventId>:<choiceId>'
      const rest = key.slice('event:'.length);
      const sep = rest.indexOf(':');
      const eventId = sep < 0 ? rest : rest.slice(0, sep);
      const choiceId = sep < 0 ? null : rest.slice(sep + 1);
      const ev = corpus.eventById.get(eventId);
      if (!ev) {
        out.push({
          severity: 'CRITICAL',
          family: familyOf(corpus, eventId),
          scanId: SCAN_ID,
          code: 'FEATURE_REGISTRY_ORPHAN',
          cardId: eventId,
          filePath: fileOf(corpus, eventId),
          message: `KINGDOM_FEATURE_REGISTRY references unknown event ${eventId}.`,
          details: { registryKey: key },
        });
        continue;
      }
      if (choiceId && !ev.choices.some((c) => c.choiceId === choiceId)) {
        out.push({
          severity: 'CRITICAL',
          family: familyOf(corpus, eventId),
          scanId: SCAN_ID,
          code: 'FEATURE_REGISTRY_ORPHAN',
          cardId: eventId,
          choiceId,
          filePath: fileOf(corpus, eventId),
          message: `KINGDOM_FEATURE_REGISTRY references unknown choice ${eventId}:${choiceId}.`,
          details: { registryKey: key },
        });
      }
      continue;
    }

    out.push({
      severity: 'MAJOR',
      family: 'unknown',
      scanId: SCAN_ID,
      code: 'FEATURE_REGISTRY_UNKNOWN_PREFIX',
      cardId: key,
      message: `KINGDOM_FEATURE_REGISTRY key ${key} uses an unrecognized prefix (expected 'decree:' or 'event:').`,
    });
  }

  return out;
};
