// Wiring scan §Phase-7 — cross-family overlap guard.
//
// Locks the no-overlap invariant verified in
// docs/audit/duplicate-reconciliation.md so a future content wave
// can't silently re-introduce a duplicate of a card that already
// lives in a sibling family. Each of the ten phase-7 overlap zones
// (marriage, tax, festival, border, guild, plague, trade,
// governance, military readiness, succession) carries:
//   - a `signature` regex applied to id + title + body that decides
//     whether a card is in the zone;
//   - a `canonicalFamilies` set listing which decision-slot families
//     are allowed to host a card in that zone (the post-phase-7
//     accepted state);
//   - an `allowlist` of card ids that are intentionally placed in
//     non-canonical families.
//
// Subjects are limited to primary decision-slot families
// (DECISION_SLOT_FAMILIES below). Non-decision-slot channels —
// notifications (post-resolution flavor), hand cards (tactical),
// assessments (intelligence reveal), world events (World Pulse), and
// `unknown` (classifier gap) — can't structurally compete for a
// monthly decision slot regardless of zone, so flagging them is just
// noise.
//
// Emits CROSS_FAMILY_OVERLAP (MINOR) when a card matches a zone but
// its family is not in that zone's canonical set and its id isn't on
// the allowlist. Adding a new card to the corpus that lands outside
// the canonical families forces the author to either move it or add
// an allowlist entry with a one-line justification — the same
// pattern the duplicate-reconciliation.md doc uses.

import type { Corpus, Family, Finding, Scan } from '../../types';

export const SCAN_ID = 'wiring.cross-family-overlap';

const DECISION_SLOT_FAMILIES: ReadonlySet<Family> = new Set<Family>([
  'petition',
  'crisis',
  'decree',
  'negotiation',
  'overture',
]);

interface ZoneRule {
  zone: string;
  signature: RegExp;
  canonicalFamilies: ReadonlySet<Family>;
  allowlist: ReadonlySet<string>;
  rationale: string;
}

// Word-boundary-anchored signatures — kept conservative on purpose so
// adjacent flavor (a one-line "the harvest festival passes" mention
// inside a non-festival card) doesn't pull cards into the wrong zone.
// When in doubt, the doc is the source of truth.
const ZONE_RULES: ZoneRule[] = [
  {
    zone: 'marriage',
    signature:
      /\b(marriage|wedding|betroth(?:ed|al)?|dowry|nuptial|spouse|consort|dynastic\s+alliance)\b/i,
    canonicalFamilies: new Set<Family>([
      'petition', // class proposes a match
      'decree', // crown declares the marriage
      'overture', // rival initiates dynastic alliance
      'crisis', // disrupted/broken match
      'negotiation', // multi-term marriage exchange (corpus convention; see doc)
    ]),
    allowlist: new Set<string>(),
    rationale:
      'Petition / decree / overture / crisis per phase-7 spec; negotiation kept by corpus convention (neg_marriage_alliance).',
  },
  {
    zone: 'tax',
    signature: /\b(tax(?:es|ation)?|levy|levies|tithes?|tariffs?|exchequer)\b/i,
    canonicalFamilies: new Set<Family>([
      'petition', // class asks for relief
      'decree', // crown decrees levy/exemption/reform
      'crisis', // enforcement breakdown (the §14 calibration shape)
      'overture', // rival economic-recovery overture w/ tax/credit term
    ]),
    allowlist: new Set<string>(),
    rationale:
      'Petition (relief), decree (levy/reform), crisis (enforcement breakdown), overture (rival credit/recovery offer that includes tax terms).',
  },
  {
    zone: 'festival',
    signature: /\b(festivals?|feasts?|jubilees?|saint['’]s\s+day|holy\s+day)\b/i,
    canonicalFamilies: new Set<Family>([
      'decree', // call_festival as active choice
      'petition', // class asks for festival tied to current state
    ]),
    allowlist: new Set<string>([
      // Clergy-proposed festival — petition-shape (3 choices) but sitting
      // in the Culture event family. Recorded in the reconciliation doc
      // for phase 10/12 to decide whether to retag the category.
      'evt_cultural_festival_proposal',
    ]),
    rationale:
      'Decree owns the active call; petition owns the class-asked variant.',
  },
  {
    zone: 'border',
    signature: /\b(border|frontier|incursion)\b/i,
    canonicalFamilies: new Set<Family>([
      'crisis', // active incursion / flashpoint (incl. border-war chain)
      'decree', // fortify / defense network
      'overture', // rival claim or demonstration
      'petition', // border captains / garrisons asking for support
    ]),
    allowlist: new Set<string>(),
    rationale:
      'Crisis (active incursion), decree (fortify), overture (rival claim), petition (border captains).',
  },
  {
    zone: 'guild',
    signature: /\bguilds?\b/i,
    canonicalFamilies: new Set<Family>([
      'petition', // guild asks
      'decree', // crown grants/revokes charter
      'crisis', // class-conflict status divergence (see allowlist note)
      'negotiation', // multi-term guild charter (e.g. neg_merchant_guild_charter, neg_commoner_charter)
    ]),
    allowlist: new Set<string>([
      // Class-conflict status-divergence crisis (merchants ≥70, nobility ≤40);
      // not a guild-charter revocation. Lives in class-conflict-events.ts.
      // Recorded in the reconciliation doc as KEEP.
      'evt_exp_cc_guild_noble_power_struggle',
    ]),
    rationale:
      'Petition (guild asks), decree (crown charter), crisis (status-divergence), negotiation (multi-term charter exchange).',
  },
  {
    zone: 'plague',
    signature: /\b(plague|pestilence|epidemic|contagion)\b/i,
    canonicalFamilies: new Set<Family>([
      'crisis', // outbreak escalation
      'decree', // future quarantine decree (none exist today)
      'petition', // future commonfolk supplication (none exist today)
    ]),
    allowlist: new Set<string>(),
    rationale:
      'Crisis-only family today; decree/petition slots reserved for future authoring (see doc GAP).',
  },
  {
    zone: 'trade',
    signature: /\b(trade|merchant\s+route|caravans?|tariffs?|monopoly)\b/i,
    canonicalFamilies: new Set<Family>([
      'negotiation',
      'decree',
      'petition',
      'overture',
      'crisis',
      'assessment',
    ]),
    allowlist: new Set<string>(),
    rationale: 'Broad zone — every authored family is canonical.',
  },
  {
    zone: 'governance',
    signature:
      /\b(govern(?:ance|ing)?|sumptuary|bureaucra(?:cy|ts?)|royal\s+decree)\b/i,
    canonicalFamilies: new Set<Family>([
      'decree',
      'petition',
      'crisis',
      'negotiation',
    ]),
    allowlist: new Set<string>(),
    rationale: 'Decree (crown reform), petition (class asks), crisis (governance shock), negotiation (power-sharing).',
  },
  {
    zone: 'military_readiness',
    signature:
      /\b(military\s+readiness|muster(?:ing)?|conscript(?:ion|ed)?|garrisons?)\b/i,
    canonicalFamilies: new Set<Family>([
      'decree',
      'petition',
      'crisis',
      'negotiation',
      'overture',
    ]),
    allowlist: new Set<string>(),
    rationale: 'Every primary decision-slot family is canonical.',
  },
  {
    zone: 'succession',
    signature: /\b(succession|heirs?|regent|throne|dynast(?:y|ies))\b/i,
    canonicalFamilies: new Set<Family>([
      'crisis',
      'negotiation',
      'overture',
      'decree', // future: proclaim heir / regent (none exist today)
      'petition', // future: class asks for succession clarity (none exist today)
    ]),
    allowlist: new Set<string>(),
    rationale:
      'Crisis (legitimacy shock), negotiation (succession pact), overture (rival presses claim). Decree/petition reserved for future authoring.',
  },
];

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const card of corpus.auditCards) {
    if (!DECISION_SLOT_FAMILIES.has(card.family)) continue;
    const haystack = `${card.id}\n${card.title ?? ''}\n${card.body ?? ''}`;
    for (const rule of ZONE_RULES) {
      if (!rule.signature.test(haystack)) continue;
      if (rule.canonicalFamilies.has(card.family)) continue;
      if (rule.allowlist.has(card.id)) continue;
      out.push({
        severity: 'MINOR',
        family: card.family,
        scanId: SCAN_ID,
        code: 'CROSS_FAMILY_OVERLAP',
        cardId: card.id,
        filePath: card.filePath,
        message:
          `${card.id} matches the '${rule.zone}' overlap zone but its family ('${card.family}') is not in the canonical set ` +
          `[${[...rule.canonicalFamilies].sort().join(', ')}]. ` +
          `Either move the card to a canonical family or add it to the '${rule.zone}' allowlist in scripts/audit/scans/wiring/cross-family-overlap.ts ` +
          `with a one-line justification (and update docs/audit/duplicate-reconciliation.md).`,
        confidence: 'HEURISTIC',
        details: {
          zone: rule.zone,
          rationale: rule.rationale,
        },
      });
    }
  }

  return out;
};
