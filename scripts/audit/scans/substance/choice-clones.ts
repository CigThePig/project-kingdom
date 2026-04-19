// Substance scan §13.11 — choices on the same card whose mechanical signature
// is identical (modulo style tags / follow-ups), making the player's pick
// flavor-only. Per §13.11 the audit verdict is "merge or differentiate".
//
// Signature = sorted list of nonzero delta field names ⊕ sorted style-tag
// axis keys ⊕ flag for follow-up presence ⊕ flag for temp modifier presence.
// Two choices with identical signatures collapse into one cluster.

import { nonzeroFieldsOf } from '../../category-map';
import type { Corpus, Finding, Scan } from '../../types';
import { familyOf, fileOf } from '../shared';

export const SCAN_ID = 'substance.choice-clones';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const ev of corpus.eventById.values()) {
    if (ev.choices.length < 2) continue;
    if (corpus.familyByCardId.get(ev.id) === 'notification') continue;
    const choices = corpus.effects.events[ev.id] ?? corpus.assessments.effects[ev.id];
    if (!choices) continue;

    const buckets = new Map<string, string[]>();
    for (const c of ev.choices) {
      const sig = signatureOf(corpus, ev.id, c.choiceId, choices[c.choiceId]);
      const bucket = buckets.get(sig);
      if (bucket) bucket.push(c.choiceId);
      else buckets.set(sig, [c.choiceId]);
    }

    for (const [sig, choiceIds] of buckets) {
      if (choiceIds.length < 2) continue;
      out.push({
        severity: 'MAJOR',
        family: familyOf(corpus, ev.id),
        scanId: SCAN_ID,
        code: 'CHOICE_CLONES',
        cardId: ev.id,
        filePath: fileOf(corpus, ev.id),
        message: `Choices on ${ev.id} share a mechanical signature: ${choiceIds.join(', ')}.`,
        details: { choiceIds, signature: sig },
      });
    }
  }

  return out;
};

function signatureOf(
  corpus: Corpus,
  eventId: string,
  choiceId: string,
  delta: import('../../../../src/engine/types').MechanicalEffectDelta | undefined,
): string {
  const fields = nonzeroFieldsOf(delta).sort().join('|');
  const styleAxes = corpus.styleTags[eventId]?.[choiceId];
  const styles = styleAxes ? Object.keys(styleAxes).sort().join('|') : '';
  const hasTempMod = corpus.tempModifiers[eventId]?.[choiceId] ? '1' : '0';
  const ev = corpus.eventById.get(eventId);
  const hasFollowUp = ev && (ev.followUpEvents ?? []).some((fu) => fu.triggerChoiceId === choiceId) ? '1' : '0';
  return `f:${fields};s:${styles};t:${hasTempMod};u:${hasFollowUp}`;
}
