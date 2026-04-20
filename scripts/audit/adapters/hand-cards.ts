// Hand-cards adapter — HAND_CARDS + HAND_CARDS_EXPANDED both resolve via
// the card's inline `apply` function. We record metadata (expiresAfterTurns,
// requiresChoice) but leave astSemanticCoverage false — the M3 hand-card
// analyzer promotes that flag once it parses the apply body.

import { runtimePathFor } from '../runtime-paths';
import { getTextEntryForFamily } from '../text-sources';
import type { Corpus } from '../types';
import type { AuditCard, AuditDecisionPath } from '../ir';

import { buildCard, buildDecisionPath, defaultCoverage, fileFor } from './shared';

export function toAuditCards(corpus: Corpus): AuditCard[] {
  const out: AuditCard[] = [];

  for (const h of corpus.handCards) {
    const text = getTextEntryForFamily(corpus, 'hand', h.id);
    const hasText = !!h.title && !!h.body;

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
          // Flipped true by the M3 hand-card analyzer once apply bodies
          // are AST-classified.
          astSemanticCoverage: false,
          effectCoverage: false,
        }),
      }),
    );
  }

  return out;
}
