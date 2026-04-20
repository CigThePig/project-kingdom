// Assessments adapter — ASSESSMENT_POOL members reuse EventDefinition shape
// but resolve through direct-effect-assessment (applyDirectEffects in
// src/engine/resolution/apply-action-effects.ts), NOT the event-resolution
// pipeline. Their text lives in ASSESSMENT_TEXT and effects in
// ASSESSMENT_EFFECTS. See assessmentCardGenerator.ts for the runtime path.

import { getTextEntryForFamily } from '../text-sources';
import { runtimePathFor } from '../runtime-paths';
import type { Corpus } from '../types';
import type { AuditCard } from '../ir';

import { buildCard, buildDecisionPath, defaultCoverage, fileFor } from './shared';

export function toAuditCards(corpus: Corpus): AuditCard[] {
  const out: AuditCard[] = [];

  for (const a of corpus.assessments.pool) {
    const text = getTextEntryForFamily(corpus, 'assessment', a.id);
    const hasText = text !== null && !!text.title && !!text.body;

    const effectsByChoice = corpus.assessments.effects[a.id] ?? {};
    const choices = a.choices.map((c) => {
      const effects = effectsByChoice[c.choiceId] as Record<string, unknown> | undefined;
      return buildDecisionPath({
        cardId: a.id,
        family: 'assessment',
        choiceId: c.choiceId,
        label: text?.choiceLabels[c.choiceId],
        effectSourceKind: effects ? 'assessment-effects' : 'none',
        textSourceKind: text?.sourceKind ?? 'none',
        declaredEffects: effects ?? null,
        runtimeTouchHints: ['direct-effect-assessment'],
      });
    });

    out.push(
      buildCard({
        id: a.id,
        family: 'assessment',
        sourceKind: 'authored',
        runtimePath: runtimePathFor('assessment'),
        filePath: fileFor(corpus, a.id),
        title: text?.title,
        body: text?.body,
        metadata: {
          severity: a.severity,
          category: a.category,
          weight: a.weight,
        },
        choices,
        coverage: defaultCoverage({
          textCoverage: hasText,
          effectCoverage: Object.keys(effectsByChoice).length > 0,
          previewParityCoverage: true,
        }),
      }),
    );
  }

  return out;
}
