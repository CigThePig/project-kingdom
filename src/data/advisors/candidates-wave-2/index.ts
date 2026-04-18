// Phase 8 — Advisor Candidate Templates (wave-2).
//
// 12 authored candidate templates, three per seat. Each template carries the
// archetype metadata; concrete advisors are produced by
// `instantiateCandidate()` which attaches a procgen name, copies the
// personality modifiers, and rolls hide state on the declared flaws.
//
// Names are procgen (seeded by the run seed + archetype id) so two games
// with the same seed produce the same candidate names — but each new run
// draws a fresh population.

import {
  AdvisorPersonality,
  CouncilSeat,
  PopulationClass,
} from '../../../engine/types';

export interface CandidateTemplate {
  /** Stable archetype id — also used as the deterministic seed salt when
   *  generating the display name. */
  id: string;
  seat: CouncilSeat;
  personality: AdvisorPersonality;
  /** Flaw ids from `src/data/advisors/flaws.ts`. 1–2 entries. Flaws start
   *  hidden with `detectionChancePerTurn` ~4–8%. */
  flawIds: string[];
  patronClass: PopulationClass;
  background: string;
}

export const CANDIDATE_TEMPLATES: CandidateTemplate[] = [
  // --- Chancellor ---
  {
    id: 'cand_chancellor_prudent_exchequer',
    seat: CouncilSeat.Chancellor,
    personality: AdvisorPersonality.Prudent,
    flawIds: ['greedy'],
    patronClass: PopulationClass.Merchants,
    background: 'A graduate of the royal exchequer, patient with ledgers and slow to spend.',
  },
  {
    id: 'cand_chancellor_cunning_reformer',
    seat: CouncilSeat.Chancellor,
    personality: AdvisorPersonality.Reformist,
    flawIds: ['reformist', 'vendetta'],
    patronClass: PopulationClass.Commoners,
    background: 'A minor clerk who climbed on the back of the last reform commission.',
  },
  {
    id: 'cand_chancellor_iron_collector',
    seat: CouncilSeat.Chancellor,
    personality: AdvisorPersonality.Ironfist,
    flawIds: ['greedy'],
    patronClass: PopulationClass.Nobility,
    background: 'A hard-eyed tax commissioner with a reputation for making levies land.',
  },

  // --- Marshal ---
  {
    id: 'cand_marshal_battle_hardened_veteran',
    seat: CouncilSeat.Marshal,
    personality: AdvisorPersonality.BattleHardened,
    flawIds: ['drunkard'],
    patronClass: PopulationClass.MilitaryCaste,
    background: 'A veteran of three border campaigns. Moves stiffly; sees clearly.',
  },
  {
    id: 'cand_marshal_silver_tongue_captain',
    seat: CouncilSeat.Marshal,
    personality: AdvisorPersonality.SilverTongue,
    flawIds: ['vendetta'],
    patronClass: PopulationClass.Nobility,
    background: 'A younger son of the great houses, more at home at table than on patrol.',
  },
  {
    id: 'cand_marshal_ironfist_ranger',
    seat: CouncilSeat.Marshal,
    personality: AdvisorPersonality.Ironfist,
    flawIds: ['zealot'],
    patronClass: PopulationClass.MilitaryCaste,
    background: 'A border ranger promoted after the last bandit-sweep. Believes in order first.',
  },

  // --- Chamberlain ---
  {
    id: 'cand_chamberlain_silver_tongue_courtier',
    seat: CouncilSeat.Chamberlain,
    personality: AdvisorPersonality.SilverTongue,
    flawIds: ['drunkard'],
    patronClass: PopulationClass.Nobility,
    background: 'A courtier everyone recognises and no one fully trusts.',
  },
  {
    id: 'cand_chamberlain_prudent_steward',
    seat: CouncilSeat.Chamberlain,
    personality: AdvisorPersonality.Prudent,
    flawIds: ['vendetta'],
    patronClass: PopulationClass.Nobility,
    background: 'A steward of the royal household, keeper of many small keys.',
  },
  {
    id: 'cand_chamberlain_reformist_secretary',
    seat: CouncilSeat.Chamberlain,
    personality: AdvisorPersonality.Reformist,
    flawIds: ['reformist'],
    patronClass: PopulationClass.Commoners,
    background: 'A low-born secretary who won the court\'s ear by being right on small matters.',
  },

  // --- Spymaster ---
  {
    id: 'cand_spymaster_cunning_agent',
    seat: CouncilSeat.Spymaster,
    personality: AdvisorPersonality.Cunning,
    flawIds: ['vendetta'],
    patronClass: PopulationClass.Nobility,
    background: 'Served in three foreign capitals under three different names.',
  },
  {
    id: 'cand_spymaster_zealous_inquisitor',
    seat: CouncilSeat.Spymaster,
    personality: AdvisorPersonality.Zealous,
    flawIds: ['zealot'],
    patronClass: PopulationClass.Clergy,
    background: 'A former diocesan inquisitor with a long memory and a short list of friends.',
  },
  {
    id: 'cand_spymaster_scholar_cryptographer',
    seat: CouncilSeat.Spymaster,
    personality: AdvisorPersonality.Scholar,
    flawIds: ['drunkard'],
    patronClass: PopulationClass.Clergy,
    background: 'A cathedral cryptographer who reads three languages the court does not.',
  },
];
