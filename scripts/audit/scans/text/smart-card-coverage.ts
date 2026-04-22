// Text scan §3 — smart-card placeholder coverage. When a card declares that
// it affects a named engine entity (region, class, neighbor), the body must
// acknowledge that entity — either via a smart token the renderer will fill
// in, or by literal name. The §14 calibration anchor (`evt_exp_eco_tax_
// dispute`) is the canonical failure: `affectsRegion: true` but body reads
// "outlying villages" with no `{region}` / `{settlement}` / `{terrain}`
// token. This scan catches that shape.
//
// Unlike sibling text scans, this one does NOT gate on
// `runtimeDiffCoverage` — body and metadata flags are both populated by the
// family adapters during foundation-phase corpus loading, so the check is
// deterministic and runs on every card.

import { PopulationClass } from '../../../../src/engine/types';
import { CLASS_LABELS, CLASS_PLURAL_LABELS } from '../../../../src/data/text/labels';
import type { Corpus, Finding, Scan } from '../../types';

export const SCAN_ID = 'text.smart-card-coverage';

const REGION_TOKENS = /\{(region|settlement|terrain|condition_context|region_\w+)\}/i;
const CLASS_TOKENS = /\{class(?:_\w+)?\}/i;
const NEIGHBOR_TOKENS = /\{(neighbor|rival|neighbor_\w+)\}/i;

interface SmartCardMetadata {
  affectsRegion?: boolean;
  affectsClass?: PopulationClass | null;
  affectsNeighbor?: string | null;
}

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const card of corpus.auditCards) {
    const body = card.body;
    if (!body) continue;

    const meta = card.metadata as SmartCardMetadata | undefined;

    if (meta?.affectsRegion === true && !REGION_TOKENS.test(body)) {
      out.push({
        severity: 'MAJOR',
        family: card.family,
        scanId: SCAN_ID,
        code: 'SMART_CARD_COVERAGE_REGION',
        cardId: card.id,
        filePath: card.filePath,
        message: `${card.id}: \`affectsRegion: true\` but body does not reference the region (no {region}, {settlement}, {terrain}, or {condition_context} token).`,
        confidence: 'DETERMINISTIC',
        details: { dimension: 'region' },
      });
    }

    if (meta?.affectsClass != null) {
      const cls = meta.affectsClass;
      const singular = CLASS_LABELS[cls];
      const plural = CLASS_PLURAL_LABELS[cls];
      const namedLiterally =
        (singular && new RegExp(`\\b${escapeRegExp(singular)}\\b`, 'i').test(body)) ||
        (plural && new RegExp(`\\b${escapeRegExp(plural)}\\b`, 'i').test(body));
      if (!namedLiterally && !CLASS_TOKENS.test(body)) {
        out.push({
          severity: 'MAJOR',
          family: card.family,
          scanId: SCAN_ID,
          code: 'SMART_CARD_COVERAGE_CLASS',
          cardId: card.id,
          filePath: card.filePath,
          message: `${card.id}: \`affectsClass: ${cls}\` but body does not name the class (no {class} token and no literal "${singular}"/"${plural}").`,
          confidence: 'DETERMINISTIC',
          details: { dimension: 'class', className: singular, classPlural: plural },
        });
      }
    }

    if (meta?.affectsNeighbor && !NEIGHBOR_TOKENS.test(body)) {
      out.push({
        severity: 'MAJOR',
        family: card.family,
        scanId: SCAN_ID,
        code: 'SMART_CARD_COVERAGE_NEIGHBOR',
        cardId: card.id,
        filePath: card.filePath,
        message: `${card.id}: \`affectsNeighbor\` is set but body does not reference the neighbor (no {neighbor}, {rival}, or {neighbor_*} token).`,
        confidence: 'DETERMINISTIC',
        details: { dimension: 'neighbor', affectsNeighbor: meta.affectsNeighbor },
      });
    }
  }

  return out;
};

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
