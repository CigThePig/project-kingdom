// Substance scan §13.11 — choices on the same card whose mechanical signature
// is identical (modulo style tags / follow-ups), making the player's pick
// flavor-only. Per §13.11 the audit verdict is "merge or differentiate".
//
// Signature = sorted list of nonzero delta field names ⊕ sorted style-tag
// axis keys ⊕ flag for follow-up presence ⊕ flag for temp modifier presence.
// Two choices with identical signatures collapse into one cluster.
//
// Phase 6 upgrade: when every choice on a card has a runtimeFingerprint,
// compare the fingerprint's `touches[]` and `classes[]` shape in addition
// to the table signature. Table-signature collisions whose runtime diffs
// diverge are demoted to POLISH (false-positive protection) and labeled
// ENGINE_MISMATCH; collisions the runtime corroborates fire as MAJOR with
// RUNTIME_GROUNDED confidence.

import { nonzeroFieldsOf } from '../../category-map';
import type { AuditCard, RuntimeFingerprint } from '../../ir';
import type { Corpus, Finding, Scan } from '../../types';
import { familyOf, fileOf } from '../shared';

export const SCAN_ID = 'substance.choice-clones';

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  const auditCardIndex = new Map<string, AuditCard>();
  for (const card of corpus.auditCards) auditCardIndex.set(card.id, card);

  for (const ev of corpus.eventById.values()) {
    if (ev.choices.length < 2) continue;
    if (corpus.familyByCardId.get(ev.id) === 'notification') continue;
    const choices = corpus.effects.events[ev.id] ?? corpus.assessments.effects[ev.id];
    if (!choices) continue;

    const auditCard = auditCardIndex.get(ev.id);

    const buckets = new Map<string, string[]>();
    for (const c of ev.choices) {
      const sig = signatureOf(corpus, ev.id, c.choiceId, choices[c.choiceId]);
      const bucket = buckets.get(sig);
      if (bucket) bucket.push(c.choiceId);
      else buckets.set(sig, [c.choiceId]);
    }

    for (const [sig, choiceIds] of buckets) {
      if (choiceIds.length < 2) continue;

      // Collect runtime fingerprints (if any) for every cloned choice.
      const fingerprints = choiceIds.map((cid) => {
        const fp = auditCard?.choices.find((p) => p.choiceId === cid)?.runtimeFingerprint;
        return { choiceId: cid, fp };
      });
      const allHaveFp = fingerprints.every((x) => x.fp != null);

      if (allHaveFp) {
        const runtimeSig = fingerprints.map((x) => runtimeSignatureOf(x.fp!));
        const runtimeAllMatch = runtimeSig.every((s) => s === runtimeSig[0]);
        if (runtimeAllMatch) {
          out.push({
            severity: 'MAJOR',
            family: familyOf(corpus, ev.id),
            scanId: SCAN_ID,
            code: 'CHOICE_CLONES',
            cardId: ev.id,
            filePath: fileOf(corpus, ev.id),
            message: `Choices on ${ev.id} share a mechanical signature and produce identical runtime diffs: ${choiceIds.join(', ')}.`,
            confidence: 'RUNTIME_GROUNDED',
            details: { choiceIds, signature: sig, runtimeSignature: runtimeSig[0] },
          });
        } else {
          // Table-signature collision whose runtime diffs diverge — the scanner's
          // signature model is incomplete for this card. Demote to POLISH /
          // ENGINE_MISMATCH so content authors aren't misled.
          out.push({
            severity: 'POLISH',
            family: familyOf(corpus, ev.id),
            scanId: SCAN_ID,
            code: 'CHOICE_CLONES_TABLE_ONLY',
            cardId: ev.id,
            filePath: fileOf(corpus, ev.id),
            message: `Choices on ${ev.id} share a table signature (${choiceIds.join(', ')}) but the runtime diffs differ — the scanner's clone signature may undercount a meaningful difference.`,
            confidence: 'ENGINE_MISMATCH',
            details: {
              choiceIds,
              signature: sig,
              runtimeSignatures: runtimeSig,
            },
          });
        }
      } else {
        // No runtime coverage — fall back to the table heuristic.
        out.push({
          severity: 'MAJOR',
          family: familyOf(corpus, ev.id),
          scanId: SCAN_ID,
          code: 'CHOICE_CLONES',
          cardId: ev.id,
          filePath: fileOf(corpus, ev.id),
          message: `Choices on ${ev.id} share a mechanical signature: ${choiceIds.join(', ')}.`,
          confidence: 'HEURISTIC',
          details: { choiceIds, signature: sig },
        });
      }
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

function runtimeSignatureOf(fp: RuntimeFingerprint): string {
  const touches = [...new Set(fp.touches)].sort().join('|');
  const classes = [...new Set(fp.classes)].sort().join('|');
  return `t:${touches};c:${classes}`;
}
