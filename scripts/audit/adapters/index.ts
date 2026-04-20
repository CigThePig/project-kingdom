// Adapter registry — each family's toAuditCards imported once and combined.
// Consumers (loadCorpus in corpus.ts) call `buildAllAuditCards(corpus)` which
// runs every adapter in a stable order and concatenates the results.

import { toAuditCards as eventsAdapter } from './events';
import { toAuditCards as assessmentsAdapter } from './assessments';
import { toAuditCards as negotiationsAdapter } from './negotiations';
import { toAuditCards as overturesAdapter } from './overtures';
import { toAuditCards as handCardsAdapter } from './hand-cards';
import { toAuditCards as decreesAdapter } from './decrees';
import { toAuditCards as worldEventsAdapter } from './world-events';

import type { AuditCard } from '../ir';
import type { Corpus } from '../types';

export function buildAllAuditCards(corpus: Corpus): AuditCard[] {
  return [
    ...eventsAdapter(corpus),
    ...assessmentsAdapter(corpus),
    ...negotiationsAdapter(corpus),
    ...overturesAdapter(corpus),
    ...handCardsAdapter(corpus),
    ...decreesAdapter(corpus),
    ...worldEventsAdapter(corpus),
  ];
}

export {
  eventsAdapter,
  assessmentsAdapter,
  negotiationsAdapter,
  overturesAdapter,
  handCardsAdapter,
  decreesAdapter,
  worldEventsAdapter,
};
