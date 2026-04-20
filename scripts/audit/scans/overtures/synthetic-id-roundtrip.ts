// Phase 5C — Overture synthetic-id round-trip.
//
// Overtures are generated at runtime with eventIds of the form
//   `overture_<neighborId>_<agenda>_t<turn>`
// and choice ids of `<eventId>_grant` / `<eventId>_deny`. The engine parses
// these back via parseOvertureEventId. If the parser's regex disagrees with
// the generator format for any agenda, the overture fires but its effects
// never route — an ENGINE_MISMATCH.

import {
  isOvertureEventId,
  parseOvertureEventId,
} from '../../../../src/bridge/diplomaticOvertureGenerator';
import { RivalAgenda } from '../../../../src/engine/types';
import type { Corpus, Finding, Scan } from '../../types';

export const SCAN_ID = 'overtures.synthetic-id-roundtrip';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  const neighborId = 'neighbor_test';
  const turn = 42;

  for (const agenda of Object.values(RivalAgenda)) {
    // Only round-trip agendas that have an authored OVERTURE_TEXT entry —
    // the others are already flagged by agenda-coverage.
    if (!corpus.overtures.text[agenda]) continue;

    const eventId = `overture_${neighborId}_${agenda}_t${turn}`;
    const grantChoiceId = `${eventId}_grant`;
    const denyChoiceId = `${eventId}_deny`;
    const cardId = `overture:${agenda}`;

    if (!isOvertureEventId(eventId)) {
      out.push({
        severity: 'MAJOR',
        family: 'overture',
        scanId: SCAN_ID,
        code: 'OVERTURE_ID_ROUNDTRIP_FAIL',
        cardId,
        message: `overture:${agenda}: synthesized eventId "${eventId}" does not pass isOvertureEventId — the engine will not route it into the overture branch.`,
        confidence: 'ENGINE_MISMATCH',
      });
      continue;
    }

    const parsedFromEvent = parseOvertureEventId(eventId);
    const parsedFromGrant = parseOvertureEventId(grantChoiceId);
    const parsedFromDeny = parseOvertureEventId(denyChoiceId);

    if (!parsedFromEvent || parsedFromEvent.agenda !== agenda || parsedFromEvent.neighborId !== neighborId) {
      out.push({
        severity: 'MAJOR',
        family: 'overture',
        scanId: SCAN_ID,
        code: 'OVERTURE_ID_ROUNDTRIP_FAIL',
        cardId,
        message: `overture:${agenda}: parseOvertureEventId(eventId) did not round-trip agenda / neighbor — parsed=${JSON.stringify(parsedFromEvent)}`,
        confidence: 'ENGINE_MISMATCH',
        details: { input: eventId, parsed: parsedFromEvent },
      });
    }
    if (!parsedFromGrant?.grant || parsedFromGrant.agenda !== agenda) {
      out.push({
        severity: 'MAJOR',
        family: 'overture',
        scanId: SCAN_ID,
        code: 'OVERTURE_ID_ROUNDTRIP_FAIL',
        cardId,
        choiceId: 'grant',
        message: `overture:${agenda}: grant choiceId ("${grantChoiceId}") did not parse as grant=true.`,
        confidence: 'ENGINE_MISMATCH',
        details: { input: grantChoiceId, parsed: parsedFromGrant },
      });
    }
    if (!parsedFromDeny || parsedFromDeny.grant !== false) {
      out.push({
        severity: 'MAJOR',
        family: 'overture',
        scanId: SCAN_ID,
        code: 'OVERTURE_ID_ROUNDTRIP_FAIL',
        cardId,
        choiceId: 'deny',
        message: `overture:${agenda}: deny choiceId ("${denyChoiceId}") did not parse as grant=false.`,
        confidence: 'ENGINE_MISMATCH',
        details: { input: denyChoiceId, parsed: parsedFromDeny },
      });
    }
  }

  return out;
};
