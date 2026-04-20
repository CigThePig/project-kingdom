// World-events adapter — WORLD_EVENT_DEFINITIONS + WORLD_EVENT_TEXT +
// WORLD_EVENT_CHOICE_EFFECTS. Each choice is keyed by `effectsKey` (not the
// choiceId itself) in the effects table, so we index by that when populating
// declaredEffects. Resolves via world-event-resolution at runtime.

import { runtimePathFor } from '../runtime-paths';
import { getTextEntryForFamily } from '../text-sources';
import type { Corpus } from '../types';
import type { AuditCard } from '../ir';

import { buildCard, buildDecisionPath, defaultCoverage, fileFor } from './shared';

export function toAuditCards(corpus: Corpus): AuditCard[] {
  const out: AuditCard[] = [];

  for (const we of corpus.worldEvents.defs) {
    const text = getTextEntryForFamily(corpus, 'world', we.id);
    const hasText = text !== null && !!text.title && !!text.body;

    const choices = we.choices.map((c) => {
      const effects = (corpus.worldEvents.effects as Record<string, unknown>)[c.effectsKey] as
        | Record<string, unknown>
        | undefined;
      return buildDecisionPath({
        cardId: we.id,
        family: 'world',
        choiceId: c.id,
        label: text?.choiceLabels[c.id],
        effectSourceKind: effects ? 'world-event-effects' : 'none',
        textSourceKind: text?.sourceKind ?? 'none',
        declaredEffects: effects ?? null,
        runtimeTouchHints: [`effectsKey:${c.effectsKey}`],
      });
    });

    out.push(
      buildCard({
        id: we.id,
        family: 'world',
        sourceKind: 'authored',
        runtimePath: runtimePathFor('world'),
        filePath: fileFor(corpus, we.id),
        title: text?.title,
        body: text?.body,
        metadata: {
          category: we.category,
          severity: we.severity,
          minTurn: we.minTurn,
          spawnWeight: we.spawnWeight,
          durationTurns: we.durationTurns,
          seedSelector: we.seedSelector,
        },
        choices,
        coverage: defaultCoverage({
          textCoverage: hasText,
          effectCoverage: we.choices.length > 0,
          previewParityCoverage: true,
        }),
      }),
    );
  }

  return out;
}
