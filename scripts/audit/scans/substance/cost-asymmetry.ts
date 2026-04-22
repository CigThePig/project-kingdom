// Substance scan §5.3 — cost asymmetry. When every choice on a Pattern A
// card carries the same `slotCost`, the card is flattening its decision
// space: no "cheap today, costly later" option, no free acknowledge, no
// paid aggressive play. §5.3 prescribes mixing at least one `isFree: true`
// or `slotCost: 0` against paid options where the fiction allows. Uniform
// slotCost is a MINOR finding.
//
// Reads the adapter-threaded `_slotCost` field from each choice's
// declaredEffects (see `scripts/audit/adapters/events.ts`). Cards whose
// adapter does not expose `_slotCost` (decrees, hand cards) are skipped
// silently — this is a Pattern A event-family scan.

import type { Corpus, Family, Finding, Scan } from '../../types';

export const SCAN_ID = 'substance.cost-asymmetry';

const FAMILIES: ReadonlySet<Family> = new Set<Family>([
  'crisis',
  'petition',
  'notification',
  'unknown',
]);

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const card of corpus.auditCards) {
    if (!FAMILIES.has(card.family)) continue;
    if (card.choices.length < 2) continue;

    const costs: number[] = [];
    let complete = true;
    for (const choice of card.choices) {
      const raw = (choice.declaredEffects as { _slotCost?: unknown } | null)?._slotCost;
      if (typeof raw !== 'number') {
        complete = false;
        break;
      }
      costs.push(raw);
    }
    if (!complete) continue;

    const unique = new Set(costs);
    if (unique.size !== 1) continue;

    const [only] = [...unique];
    out.push({
      severity: 'MINOR',
      family: card.family,
      scanId: SCAN_ID,
      code: 'CHOICES_UNIFORM_SLOT_COST',
      cardId: card.id,
      filePath: card.filePath,
      message: `${card.id}: all ${card.choices.length} choices share slotCost=${only}. §5.3 expects cost differentiation — mix at least one isFree / slotCost:0 against paid options where the fiction allows.`,
      confidence: 'DETERMINISTIC',
      details: { slotCost: only, choiceCount: card.choices.length },
    });
  }

  return out;
};
