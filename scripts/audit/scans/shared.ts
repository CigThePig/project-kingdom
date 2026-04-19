// Card Audit — shared scan helpers.

import type { Corpus, Family } from '../types';

export function familyOf(corpus: Corpus, cardId: string): Family {
  return corpus.familyByCardId.get(cardId) ?? 'unknown';
}

export function fileOf(corpus: Corpus, cardId: string): string | undefined {
  return corpus.filePathByCardId.get(cardId);
}

/** True when the card is a follow-up that exists in FOLLOW_UP_POOL only. */
export function isFollowUpOnly(corpus: Corpus, cardId: string): boolean {
  const inMain = corpus.events.pool.some((e) => e.id === cardId);
  if (inMain) return false;
  return corpus.events.followUpPool.some((e) => e.id === cardId);
}
