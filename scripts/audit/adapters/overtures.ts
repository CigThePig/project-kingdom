// Overtures adapter — OVERTURE_TEXT is keyed by RivalAgenda (not by a card id),
// and the effect payload lives in INLINE_EFFECTS inside the generator. The
// generated-overture runtime path hasn't yet been round-tripped to actual
// mechanical effects by the scanner, so we leave generatedFamilyCoverage
// false and record what we do see (UI-facing effect hints, grant/deny paths)
// as metadata.

import type { RivalAgenda } from '../../../src/engine/types';

import { getTextEntryForFamily } from '../text-sources';
import { runtimePathFor } from '../runtime-paths';
import type { Corpus } from '../types';
import type { AuditCard } from '../ir';

import { buildCard, buildDecisionPath, defaultCoverage, fileFor } from './shared';

/** Synthetic cardId for an overture — agenda-keyed. */
function overtureCardId(agenda: RivalAgenda): string {
  return `overture:${agenda}`;
}

export function toAuditCards(corpus: Corpus): AuditCard[] {
  const out: AuditCard[] = [];

  for (const agenda of corpus.overtures.authoredAgendas) {
    const cardId = overtureCardId(agenda);
    const text = getTextEntryForFamily(corpus, 'overture', agenda);
    const hasText = text !== null && !!text.title && !!text.body;

    const grantPath = buildDecisionPath({
      cardId,
      family: 'overture',
      choiceId: 'grant',
      label: text?.choiceLabels.grant,
      effectSourceKind: 'generated-inline',
      textSourceKind: text?.sourceKind ?? 'none',
      runtimeTouchHints: ['overture-grant'],
    });

    const denyPath = buildDecisionPath({
      cardId,
      family: 'overture',
      choiceId: 'deny',
      label: text?.choiceLabels.deny,
      effectSourceKind: 'generated-inline',
      textSourceKind: text?.sourceKind ?? 'none',
      runtimeTouchHints: ['overture-deny'],
    });

    out.push(
      buildCard({
        id: cardId,
        family: 'overture',
        sourceKind: 'generated',
        runtimePath: runtimePathFor('overture'),
        filePath: fileFor(corpus, cardId),
        title: text?.title,
        body: text?.body,
        metadata: {
          agenda,
        },
        choices: [grantPath, denyPath],
        coverage: defaultCoverage({
          textCoverage: hasText,
          // Phase 5C — the runtime harness now dispatches overtures through
          // their real `applyActionEffects` -> `applyOvertureDecision` path,
          // so the generated family is covered. `effectCoverage` stays false
          // because OVERTURE_TEXT + INLINE_EFFECTS together are not a
          // mechanical-effect table the way ASSESSMENT_EFFECTS is — the real
          // effects live in `applyOvertureDecision` inline code.
          generatedFamilyCoverage: true,
          effectCoverage: false,
        }),
      }),
    );
  }

  return out;
}
