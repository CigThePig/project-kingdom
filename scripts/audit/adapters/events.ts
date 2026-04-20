// Events adapter — covers every EventDefinition in EVENT_POOL ∪ FOLLOW_UP_POOL
// (assessments have their own adapter). Family is whatever `classifyEvent`
// assigned: crisis, petition, notification, overture (pool-event overtures),
// or unknown. All of them resolve through event-resolution at runtime.

import { getTextEntryForFamily } from '../text-sources';
import { runtimePathFor } from '../runtime-paths';
import type { Corpus } from '../types';
import type { AuditCard } from '../ir';

import {
  buildCard,
  buildDecisionPath,
  defaultCoverage,
  eventConsequenceTag,
  fileFor,
  pressureKey,
} from './shared';

export function toAuditCards(corpus: Corpus): AuditCard[] {
  const out: AuditCard[] = [];

  for (const ev of corpus.eventById.values()) {
    const family = corpus.familyByCardId.get(ev.id) ?? 'unknown';
    if (family === 'assessment') continue; // handled by the assessments adapter
    if (family === 'world' || family === 'decree' || family === 'hand' || family === 'negotiation') continue;

    const text = getTextEntryForFamily(corpus, family, ev.id);
    const hasText = text !== null && !!text.title && !!text.body;

    const effectsByChoice = corpus.effects.events[ev.id] ?? {};
    const choices = ev.choices.map((c) => {
      const effects = effectsByChoice[c.choiceId] as Record<string, unknown> | undefined;
      const followUp = ev.followUpEvents?.find((f) => f.triggerChoiceId === c.choiceId);
      return buildDecisionPath({
        cardId: ev.id,
        family,
        choiceId: c.choiceId,
        label: text?.choiceLabels[c.choiceId],
        effectSourceKind: effects ? 'event-effects' : 'none',
        textSourceKind: text?.sourceKind ?? 'none',
        declaredEffects: effects ?? null,
        pressureKey: pressureKey('event', ev.id, c.choiceId),
        consequenceTagsProduced: [eventConsequenceTag(ev.id, c.choiceId)],
        followUps: followUp ? [followUp.followUpDefinitionId] : [],
      });
    });

    out.push(
      buildCard({
        id: ev.id,
        family,
        sourceKind: 'authored',
        runtimePath: runtimePathFor(family),
        filePath: fileFor(corpus, ev.id),
        title: text?.title,
        body: text?.body,
        metadata: {
          severity: ev.severity,
          category: ev.category,
          classification: ev.classification ?? 'standard',
          phase: ev.phase,
          chainId: ev.chainId,
          chainStep: ev.chainStep,
          chainNextDefinitionId: ev.chainNextDefinitionId,
          affectsClass: ev.affectsClass,
          affectsRegion: ev.affectsRegion,
          affectsNeighbor: ev.affectsNeighbor ?? null,
          relatedStorylineId: ev.relatedStorylineId,
          weight: ev.weight,
          repeatable: ev.repeatable ?? false,
        },
        choices,
        coverage: defaultCoverage({
          textCoverage: hasText,
          effectCoverage: Object.keys(effectsByChoice).length > 0,
          consequenceCoverage: true,
          pressureCoverage: true,
          previewParityCoverage: true,
        }),
      }),
    );
  }

  return out;
}
