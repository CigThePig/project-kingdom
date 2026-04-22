// Text scan §4.4 — trigger coherence. If a body references a specific state
// ("during the ongoing drought", "as the treasury empties", "with the northern
// march restive"), the card's `triggerConditions` must gate on that state.
// Otherwise the card can fire when its own text is wrong — the body describes
// a world state that isn't required to hold.
//
// Heuristic: lowercase body, scan for known state keywords, and check that
// the card's triggerConditions contain at least one condition whose `type`
// could plausibly produce that state. No runtime fingerprint required.
//
// Family filter: events-backed monthly families (crisis, petition,
// notification, unknown). Decrees use a different prereq model
// (`statePrerequisites` with its own shape) and overtures/negotiations/
// assessments are generated or schema-driven.
//
// Confidence: HEURISTIC — false-positive risk from synonyms ("parched" vs
// "drought") is acceptable at v1. MAJOR because an uncoherent trigger makes
// the smart-card rewrite rules §3 (smart-card placeholder coverage) and §4.4
// actively misleading to the player.

import type { EventTriggerCondition } from '../../../../src/engine/events/event-engine';
import type { Corpus, Family, Finding, Scan } from '../../types';

export const SCAN_ID = 'text.trigger-coherence';

const FAMILIES: ReadonlySet<Family> = new Set<Family>([
  'crisis',
  'petition',
  'notification',
  'unknown',
]);

type TriggerType = EventTriggerCondition['type'];

/**
 * Body-keyword → expected trigger-type set. When a body contains the key
 * phrase, the card's triggerConditions must include at least one condition
 * whose `type` is in the mapped set (or `any_of` wrapping one).
 *
 * Kept small and lexical on purpose: every entry here is a gross shape, not
 * a prose judgement. When authors use synonyms this scan misses — accept it
 * as v1 and revisit via finding volume.
 */
const STATE_WORD_MAP: ReadonlyArray<{
  pattern: RegExp;
  keyword: string;
  expected: readonly TriggerType[];
}> = [
  {
    pattern: /\b(drought|parched|withered crops|failed harvest)\b/i,
    keyword: 'drought',
    expected: ['food_below', 'season_is', 'consequence_tag_present'],
  },
  {
    pattern: /\b(famine|starvation|starving)\b/i,
    keyword: 'famine',
    expected: ['food_below', 'population_below', 'consequence_tag_present'],
  },
  {
    pattern: /\b(restive|unrest|rebellion|rioting|in revolt)\b/i,
    keyword: 'unrest',
    expected: [
      'class_satisfaction_below',
      'stability_below',
      'region_loyalty_below',
      'consequence_tag_present',
    ],
  },
  {
    pattern: /\b(hostile|tensions? flare|saber[- ]rattl)/i,
    keyword: 'hostile',
    expected: [
      'neighbor_relationship_below',
      'neighbor_action_recent',
      'neighbor_in_crisis',
    ],
  },
  {
    pattern: /\b(empty treasury|treasury (?:is|are|has been|stands?) (?:empty|bare|depleted)|coffers (?:are|stand|is|have been)? ?empty|coffers (?:are|have been) depleted)\b/i,
    keyword: 'empty treasury',
    expected: ['treasury_below'],
  },
  {
    pattern: /\b(heretic|heresy|heterodox|schism)\b/i,
    keyword: 'heterodox',
    expected: ['heterodoxy_above', 'schism_active', 'consequence_tag_present'],
  },
  {
    pattern: /\b(depression|recession|trade collapse|merchants despair)\b/i,
    keyword: 'economic_downturn',
    expected: [
      'economic_phase_is',
      'merchant_confidence_below',
      'trade_volume_below',
    ],
  },
];

function hasMatchingTrigger(
  conditions: readonly EventTriggerCondition[],
  expected: readonly TriggerType[],
): boolean {
  for (const c of conditions) {
    if (expected.includes(c.type)) return true;
    if (c.type === 'any_of' && c.conditions) {
      if (hasMatchingTrigger(c.conditions, expected)) return true;
    }
  }
  return false;
}

export const scan: Scan = (corpus: Corpus): Finding[] => {
  const out: Finding[] = [];

  for (const card of corpus.auditCards) {
    if (!FAMILIES.has(card.family)) continue;
    const body = card.body ?? '';
    if (!body) continue;

    const triggerConditions = (card.metadata as {
      triggerConditions?: EventTriggerCondition[];
    }).triggerConditions;
    if (!triggerConditions) continue;

    for (const rule of STATE_WORD_MAP) {
      if (!rule.pattern.test(body)) continue;
      if (hasMatchingTrigger(triggerConditions, rule.expected)) continue;

      out.push({
        severity: 'MAJOR',
        family: card.family,
        scanId: SCAN_ID,
        code: 'TRIGGER_BODY_STATE_UNGATED',
        cardId: card.id,
        filePath: card.filePath,
        message: `${card.id}: body references "${rule.keyword}" but triggerConditions do not gate on matching state (expected one of: ${rule.expected.join(', ')}). Card can fire when its own text is wrong.`,
        confidence: 'HEURISTIC',
        details: {
          stateWord: rule.keyword,
          expectedTypes: [...rule.expected],
          actualTypes: triggerConditions.map((c) => c.type),
        },
      });
    }
  }

  return out;
};
