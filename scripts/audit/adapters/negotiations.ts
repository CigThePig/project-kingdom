// Negotiations adapter — NEGOTIATION_POOL + NEGOTIATION_TEXT +
// NEGOTIATION_EFFECTS. Each term becomes one decision path, plus one reject
// path. Bond kinds come from TERM_ID_TO_BOND_KIND (src/bridge/negotiationBondMap)
// — the single source of truth the card generator and direct-effect applier
// both share. Resolves via direct-effect-negotiation at runtime.

import { TERM_ID_TO_BOND_KIND } from '../../../src/bridge/negotiationBondMap';

import { getTextEntryForFamily } from '../text-sources';
import { runtimePathFor } from '../runtime-paths';
import type { Corpus } from '../types';
import type { AuditCard, AuditDecisionPath } from '../ir';

import { buildCard, buildDecisionPath, defaultCoverage, fileFor } from './shared';

export function toAuditCards(corpus: Corpus): AuditCard[] {
  const out: AuditCard[] = [];

  for (const n of corpus.negotiations.pool) {
    const text = getTextEntryForFamily(corpus, 'negotiation', n.id);
    const hasText = text !== null && !!text.title && !!text.body;

    const effectsByTerm = corpus.negotiations.effects[n.id] ?? {};
    const choices: AuditDecisionPath[] = [];

    for (const term of n.terms) {
      const effects = effectsByTerm[term.termId] as Record<string, unknown> | undefined;
      const bondKind = TERM_ID_TO_BOND_KIND[term.termId];
      choices.push(
        buildDecisionPath({
          cardId: n.id,
          family: 'negotiation',
          choiceId: term.termId,
          label: text?.choiceLabels[term.termId],
          effectSourceKind: effects ? 'negotiation-effects' : 'none',
          textSourceKind: text?.sourceKind ?? 'none',
          declaredEffects: effects ?? null,
          runtimeTouchHints: bondKind ? ['creates-bond', `bond:${bondKind}`] : [],
          previewText: text?.termDescriptions?.[term.termId] ?? null,
        }),
      );
    }

    // Reject path — rejectLabel lives at top level of NEGOTIATION_TEXT.
    const rawText = corpus.negotiations.text[n.id];
    choices.push(
      buildDecisionPath({
        cardId: n.id,
        family: 'negotiation',
        choiceId: n.rejectChoiceId,
        label: rawText?.rejectLabel,
        effectSourceKind: 'none',
        textSourceKind: text?.sourceKind ?? 'none',
      }),
    );

    out.push(
      buildCard({
        id: n.id,
        family: 'negotiation',
        sourceKind: 'authored',
        runtimePath: runtimePathFor('negotiation'),
        filePath: fileFor(corpus, n.id),
        title: text?.title,
        body: text?.body,
        metadata: {
          severity: n.severity,
          category: n.category,
          context: n.context,
          weight: n.weight,
          termCount: n.terms.length,
          rejectChoiceId: n.rejectChoiceId,
        },
        choices,
        coverage: defaultCoverage({
          textCoverage: hasText,
          effectCoverage: Object.keys(effectsByTerm).length > 0,
          previewParityCoverage: true,
        }),
      }),
    );
  }

  return out;
}
