// Hand-cards adapter — HAND_CARDS + HAND_CARDS_EXPANDED both resolve via
// the card's inline `apply` function. The M3.2 hand-card analyzer walks
// each apply body via ts-morph and returns a StructuralMarkerSummary; when
// we find one, we attach it to the decision path and flip
// astSemanticCoverage true.

import { analyzeHandCards } from '../ast/hand-card-analyzer';
import { runtimePathFor } from '../runtime-paths';
import { getTextEntryForFamily } from '../text-sources';
import type { Corpus } from '../types';
import type { AuditCard, AuditDecisionPath } from '../ir';

import { buildCard, buildDecisionPath, defaultCoverage, fileFor } from './shared';

export function toAuditCards(corpus: Corpus): AuditCard[] {
  const out: AuditCard[] = [];
  const markerIndex = analyzeHandCards();

  for (const h of corpus.handCards) {
    const text = getTextEntryForFamily(corpus, 'hand', h.id);
    const hasText = !!h.title && !!h.body;
    const markers = markerIndex.get(h.id);

    // Every hand card plays through a single path. requiresChoice splits the
    // UI selector but the mechanical `apply` signature is the same — keep one
    // decision path, expose requiresChoice in metadata so hand-specific
    // scans can branch on it.
    const choices: AuditDecisionPath[] = [
      buildDecisionPath({
        cardId: h.id,
        family: 'hand',
        choiceId: 'play',
        label: h.title,
        effectSourceKind: 'inline-apply',
        textSourceKind: text?.sourceKind ?? 'inline-hand',
        runtimeTouchHints: ['inline-hand-apply'],
        declaredStructuralMarkers: markers,
      }),
    ];

    out.push(
      buildCard({
        id: h.id,
        family: 'hand',
        sourceKind: 'inline',
        runtimePath: runtimePathFor('hand'),
        filePath: fileFor(corpus, h.id),
        title: h.title,
        body: h.body,
        metadata: {
          expiresAfterTurns: h.expiresAfterTurns,
          requiresChoice: h.requiresChoice ?? null,
        },
        choices,
        coverage: defaultCoverage({
          textCoverage: hasText,
          astSemanticCoverage: !!markers,
          effectCoverage: false,
        }),
      }),
    );
  }

  return out;
}
