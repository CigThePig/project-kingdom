// Phase 12 — World Event Definitions
// Ten initial events that affect the region, not a single kingdom. Each
// declares its spread rule (which AdjacencyKind values transmit it), seed
// selector, per-turn effects on every affected kingdom, and player-facing
// choices that surface as a crisis card when the event reaches the player.

import type { WorldEventDefinition } from '../../engine/types';
import { EventSeverity } from '../../engine/types';

export const WORLD_EVENT_DEFINITIONS: WorldEventDefinition[] = [
  {
    id: 'we_black_pox',
    category: 'plague',
    severity: EventSeverity.Critical,
    minTurn: 18,
    spawnWeight: 10,
    durationTurns: 14,
    spread: {
      transmittedBy: ['land', 'river', 'sea'],
      baseProbabilityPerTurn: 0.25,
      blockedBy: ['mountain_pass'],
    },
    seedSelector: 'coastal',
    perTurnEffects: [
      { kind: 'stability', value: -2 },
      { kind: 'food', value: -1 },
      { kind: 'rival_mood', value: -2 },
    ],
    choices: [
      { id: 'quarantine', effectsKey: 'we_black_pox__quarantine' },
      { id: 'send_aid', effectsKey: 'we_black_pox__send_aid' },
      { id: 'ignore', effectsKey: 'we_black_pox__ignore' },
    ],
  },

  {
    id: 'we_long_winter',
    category: 'climatic',
    severity: EventSeverity.Serious,
    minTurn: 10,
    spawnWeight: 8,
    durationTurns: 12,
    spread: {
      transmittedBy: ['land', 'river'],
      baseProbabilityPerTurn: 0.35,
      blockedBy: [],
    },
    seedSelector: 'border',
    perTurnEffects: [
      { kind: 'food', value: -2 },
      { kind: 'military_readiness', value: -1 },
    ],
    choices: [
      { id: 'stockpile', effectsKey: 'we_long_winter__stockpile' },
      { id: 'open_granaries', effectsKey: 'we_long_winter__open_granaries' },
      { id: 'tax_relief', effectsKey: 'we_long_winter__tax_relief' },
    ],
  },

  {
    id: 'we_great_devaluation',
    category: 'economic_shock',
    severity: EventSeverity.Serious,
    minTurn: 14,
    spawnWeight: 8,
    durationTurns: 10,
    spread: {
      transmittedBy: ['land', 'river', 'sea'],
      baseProbabilityPerTurn: 0.4,
      blockedBy: [],
    },
    seedSelector: 'coastal',
    perTurnEffects: [
      { kind: 'treasury', value: -2 },
      { kind: 'stability', value: -1 },
    ],
    choices: [
      { id: 'debase_coinage', effectsKey: 'we_great_devaluation__debase_coinage' },
      { id: 'tighten_mint', effectsKey: 'we_great_devaluation__tighten_mint' },
      { id: 'absorb_loss', effectsKey: 'we_great_devaluation__absorb_loss' },
    ],
  },

  {
    id: 'we_pilgrim_movement',
    category: 'religious_movement',
    severity: EventSeverity.Notable,
    minTurn: 8,
    spawnWeight: 7,
    durationTurns: 16,
    spread: {
      transmittedBy: ['land', 'river', 'sea'],
      baseProbabilityPerTurn: 0.3,
      blockedBy: [],
    },
    seedSelector: 'any',
    perTurnEffects: [
      { kind: 'faith', value: 1 },
      { kind: 'treasury', value: -1 },
    ],
    choices: [
      { id: 'endorse', effectsKey: 'we_pilgrim_movement__endorse' },
      { id: 'tax_pilgrims', effectsKey: 'we_pilgrim_movement__tax_pilgrims' },
      { id: 'forbid', effectsKey: 'we_pilgrim_movement__forbid' },
    ],
  },

  {
    id: 'we_mercenary_uprising',
    category: 'mercenary',
    severity: EventSeverity.Serious,
    minTurn: 16,
    spawnWeight: 7,
    durationTurns: 10,
    spread: {
      transmittedBy: ['land'],
      baseProbabilityPerTurn: 0.25,
      blockedBy: ['sea', 'mountain_pass'],
    },
    seedSelector: 'border',
    perTurnEffects: [
      { kind: 'stability', value: -1 },
      { kind: 'military_readiness', value: -2 },
      { kind: 'treasury', value: -1 },
    ],
    choices: [
      { id: 'hire_company', effectsKey: 'we_mercenary_uprising__hire_company' },
      { id: 'crush_them', effectsKey: 'we_mercenary_uprising__crush_them' },
      { id: 'negotiate', effectsKey: 'we_mercenary_uprising__negotiate' },
    ],
  },

  {
    id: 'we_comet_year',
    category: 'celestial',
    severity: EventSeverity.Notable,
    minTurn: 6,
    spawnWeight: 5,
    durationTurns: 6,
    spread: {
      transmittedBy: [],
      baseProbabilityPerTurn: 0,
      blockedBy: [],
    },
    seedSelector: 'all_kingdoms',
    perTurnEffects: [
      { kind: 'heterodoxy', value: 1 },
      { kind: 'stability', value: -1 },
    ],
    choices: [
      { id: 'proclaim_omen', effectsKey: 'we_comet_year__proclaim_omen' },
      { id: 'dismiss', effectsKey: 'we_comet_year__dismiss' },
      { id: 'fund_observatory', effectsKey: 'we_comet_year__fund_observatory' },
    ],
  },

  {
    id: 'we_heretical_doctrine',
    category: 'religious_movement',
    severity: EventSeverity.Serious,
    minTurn: 12,
    spawnWeight: 6,
    durationTurns: 18,
    spread: {
      transmittedBy: ['land', 'river'],
      baseProbabilityPerTurn: 0.28,
      blockedBy: [],
    },
    seedSelector: 'any',
    perTurnEffects: [
      { kind: 'heterodoxy', value: 2 },
      { kind: 'faith', value: -1 },
      { kind: 'stability', value: -1 },
    ],
    choices: [
      { id: 'inquisition', effectsKey: 'we_heretical_doctrine__inquisition' },
      { id: 'tolerate', effectsKey: 'we_heretical_doctrine__tolerate' },
      { id: 'council_of_faith', effectsKey: 'we_heretical_doctrine__council_of_faith' },
    ],
  },

  {
    id: 'we_locust_years',
    category: 'agricultural',
    severity: EventSeverity.Serious,
    minTurn: 14,
    spawnWeight: 6,
    durationTurns: 14,
    spread: {
      transmittedBy: ['land', 'river'],
      baseProbabilityPerTurn: 0.3,
      blockedBy: ['sea', 'mountain_pass'],
    },
    seedSelector: 'border',
    perTurnEffects: [
      { kind: 'food', value: -3 },
      { kind: 'treasury', value: -1 },
    ],
    choices: [
      { id: 'ration', effectsKey: 'we_locust_years__ration' },
      { id: 'import_grain', effectsKey: 'we_locust_years__import_grain' },
      { id: 'levy_farms', effectsKey: 'we_locust_years__levy_farms' },
    ],
  },

  {
    id: 'we_trade_league',
    category: 'cooperative',
    severity: EventSeverity.Notable,
    minTurn: 20,
    spawnWeight: 5,
    durationTurns: 24,
    spread: {
      transmittedBy: ['land', 'river', 'sea'],
      baseProbabilityPerTurn: 0.45,
      blockedBy: [],
    },
    seedSelector: 'coastal',
    perTurnEffects: [
      { kind: 'treasury', value: 1 },
      { kind: 'diplomacy_to_player', value: 1 },
    ],
    choices: [
      { id: 'join_league', effectsKey: 'we_trade_league__join_league' },
      { id: 'undercut', effectsKey: 'we_trade_league__undercut' },
      { id: 'abstain', effectsKey: 'we_trade_league__abstain' },
    ],
  },

  {
    id: 'we_calling_crusade',
    category: 'religious_movement',
    severity: EventSeverity.Critical,
    minTurn: 24,
    spawnWeight: 4,
    durationTurns: 12,
    spread: {
      transmittedBy: ['land', 'river', 'sea'],
      baseProbabilityPerTurn: 0.35,
      blockedBy: [],
    },
    seedSelector: 'any',
    perTurnEffects: [
      { kind: 'faith', value: 1 },
      { kind: 'military_readiness', value: -1 },
      { kind: 'treasury', value: -2 },
    ],
    choices: [
      { id: 'answer_call', effectsKey: 'we_calling_crusade__answer_call' },
      { id: 'send_levies', effectsKey: 'we_calling_crusade__send_levies' },
      { id: 'decline', effectsKey: 'we_calling_crusade__decline' },
    ],
  },
];
