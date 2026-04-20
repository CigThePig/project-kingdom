// Substance scan §13.5 — Pattern C cards (single acknowledge-style choice)
// that are surfaced through the regular monthly pipeline rather than seasonal
// dawn / end-of-season summaries / world pulse. Per §10, single-choice
// notifications belong in those slower channels, not in the player's tight
// monthly action budget.
//
// Heuristic: any event with exactly one choice that is `isFree` (slot cost 0)
// and lives in EVENT_POOL with phase !== 'opening' is suspect. We exclude
// follow-ups (they're earned consequence reveals — Pattern B), assessments
// (they're authored as multi-choice), and notifications classified as such
// when they live in EVENT_POOL. The findings are MAJOR — the §10 verdict is
// "relocate to seasonal channel".

import type { Corpus, Finding, Scan } from '../../types';
import { fileOf } from '../shared';

export const SCAN_ID = 'substance.single-choice-monthly';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  const followUpIds = new Set(corpus.events.followUpPool.map((e) => e.id));

  for (const ev of corpus.events.pool) {
    if (followUpIds.has(ev.id)) continue;
    if (ev.choices.length !== 1) continue;
    const c = ev.choices[0];
    if (!c.isFree) continue;
    // Per the scan's stated rationale, events explicitly classified as
    // 'notification' are already flagged as Pattern B / relocation candidates
    // via the family classifier; don't double-count them here.
    if (ev.classification === 'notification') continue;

    out.push({
      severity: 'MAJOR',
      family: 'notification',
      scanId: SCAN_ID,
      code: 'SINGLE_CHOICE_MONTHLY',
      cardId: ev.id,
      choiceId: c.choiceId,
      filePath: fileOf(corpus, ev.id),
      message: `Single-choice acknowledgement ${ev.id} surfaces through the monthly pool; relocate to seasonal dawn / end-of-season summary / world pulse per §10.`,
      details: {
        classification: ev.classification ?? 'standard',
        severity: ev.severity,
        phase: ev.phase,
      },
    });
  }

  return out;
};
