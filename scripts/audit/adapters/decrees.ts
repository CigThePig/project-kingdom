// Decrees adapter — DECREE_POOL entries resolve via decree-resolution
// (single enactment path per decree, no player-visible choice). DECREE_EFFECTS
// carry the mechanical delta. The consequence tag format is
// `decree:<decreeId>`.

import { runtimePathFor } from '../runtime-paths';
import { getTextEntryForFamily } from '../text-sources';
import type { Corpus } from '../types';
import type { AuditCard } from '../ir';

import {
  buildCard,
  buildDecisionPath,
  decreeConsequenceTag,
  defaultCoverage,
  fileFor,
  pressureKey,
} from './shared';

export function toAuditCards(corpus: Corpus): AuditCard[] {
  const out: AuditCard[] = [];

  for (const d of corpus.decrees.pool) {
    const text = getTextEntryForFamily(corpus, 'decree', d.id);
    const hasText = !!d.title && !!d.effectPreview;

    // `decree:` handler-key membership tells us whether runtime actually
    // resolves this decree — a decree in DECREE_POOL without a handler key
    // is authored-but-dead.
    const hasHandler = corpus.decrees.handlerKeys.has(d.id);
    const effects = (corpus.decrees.effects as Record<string, unknown>)[d.id] ?? null;

    const choices = [
      buildDecisionPath({
        cardId: d.id,
        family: 'decree',
        choiceId: 'enact',
        label: d.title,
        effectSourceKind: effects ? 'decree-effects' : 'none',
        textSourceKind: text?.sourceKind ?? 'inline-decree',
        declaredEffects: effects as Record<string, unknown> | null,
        pressureKey: pressureKey('decree', d.id, d.id),
        consequenceTagsProduced: [decreeConsequenceTag(d.id)],
        previewText: d.effectPreview,
        runtimeTouchHints: hasHandler ? ['decree-resolution'] : ['decree-no-handler'],
      }),
    ];

    out.push(
      buildCard({
        id: d.id,
        family: 'decree',
        sourceKind: 'authored',
        runtimePath: runtimePathFor('decree'),
        filePath: fileFor(corpus, d.id),
        title: d.title,
        body: d.effectPreview,
        metadata: {
          category: d.category,
          slotCost: d.slotCost,
          tier: d.tier,
          chainId: d.chainId,
          previousTierDecreeId: d.previousTierDecreeId,
          isHighImpact: d.isHighImpact,
          isRepeatable: d.isRepeatable,
          cooldownTurns: d.cooldownTurns,
          knowledgePrerequisite: d.knowledgePrerequisite,
          affectedClasses: d.affectedClasses,
          hasHandler,
        },
        choices,
        coverage: defaultCoverage({
          textCoverage: hasText,
          effectCoverage: !!effects,
          consequenceCoverage: true,
          pressureCoverage: true,
          previewParityCoverage: true,
        }),
      }),
    );
  }

  return out;
}
