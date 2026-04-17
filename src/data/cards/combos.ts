// Phase 6 — Combo registry.
//
// Each entry names a set of `requiredKeys` that must all be covered by cards
// played within the combo's `windowTurns`. Keys here match values set on
// `Card.comboKeys` by the hand-card registry and the family adapters.
//
// Bonuses are additive — never subtractive — so trying combos has no downside.

import type { CardCombo } from '../../engine/cards/combos';

export const COMBOS: readonly CardCombo[] = [
  {
    id: 'combo_iron_dawn',
    name: 'Iron Dawn',
    description:
      'Mass conscription with reserve deployment yields disciplined armies.',
    requiredKeys: ['mass_conscription', 'reserve_forces'],
    windowTurns: 1,
    bonusEffect: { militaryReadinessDelta: 10, militaryEquipmentDelta: 5 },
  },
  {
    id: 'combo_bread_and_circuses',
    name: 'Bread and Circuses',
    description:
      'A festival declared against the shadow of famine wins the commons twice over.',
    requiredKeys: ['festival_decree', 'famine_relief'],
    windowTurns: 2,
    bonusEffect: { commonerSatDelta: 15, stabilityDelta: 5 },
  },
  {
    id: 'combo_long_game',
    name: 'The Long Game',
    description:
      'A whisper at one court and an envoy at another converge into quiet advantage.',
    requiredKeys: ['espionage_sweep', 'diplomatic_overture'],
    windowTurns: 2,
    bonusEffect: { espionageNetworkDelta: 25 },
  },
  {
    id: 'combo_faithful_restoration',
    name: 'Faithful Restoration',
    description:
      'Religious gesture paired with a royal pardon restores the faith of the wayward.',
    requiredKeys: ['religious_gesture', 'royal_pardon'],
    windowTurns: 2,
    bonusEffect: { heterodoxyDelta: -20, clergySatDelta: 10 },
  },
  {
    id: 'combo_iron_borders',
    name: 'Iron Borders',
    description:
      'Stone walls and a seasoned garrison make the borderlands breathe easier.',
    requiredKeys: ['wall_construction', 'border_garrison'],
    windowTurns: 2,
    bonusEffect: { stabilityDelta: 8, regionDevelopmentDelta: 1 },
  },
  {
    id: 'combo_scholars_patronage',
    name: "Scholar's Patronage",
    description:
      'Learned ministers and a patient ledger compound into sharper governance.',
    requiredKeys: ['scholarly_order', 'scholarly_audit'],
    windowTurns: 2,
    bonusEffect: { treasuryDelta: 40, stabilityDelta: 3 },
  },
  {
    id: 'combo_crowns_favor',
    name: "Crown's Favor",
    description:
      'A court favor answered with a pardon binds the nobility closer to the throne.',
    requiredKeys: ['court_favor', 'royal_pardon'],
    windowTurns: 2,
    bonusEffect: { nobilitySatDelta: 15 },
  },
  {
    id: 'combo_velvet_glove',
    name: 'Velvet Glove',
    description:
      'Festivity softened by a pious gesture carries a steadier peace than either alone.',
    requiredKeys: ['festival_decree', 'religious_gesture'],
    windowTurns: 2,
    bonusEffect: { commonerSatDelta: 10, clergySatDelta: 5 },
  },
  {
    id: 'combo_merchants_peace',
    name: "Merchant's Peace",
    description:
      'A guild favor extended through a foreign envoy opens the trade lanes.',
    requiredKeys: ['merchant_favor', 'diplomatic_overture'],
    windowTurns: 2,
    bonusEffect: { merchantSatDelta: 12, treasuryDelta: 30 },
  },
  {
    id: 'combo_steel_resolve',
    name: 'Steel Resolve',
    description:
      'Drill hardens the reserves; the line holds.',
    requiredKeys: ['military_drill', 'reserve_forces'],
    windowTurns: 1,
    bonusEffect: { militaryReadinessDelta: 15, militaryMoraleDelta: 5 },
  },
  {
    id: 'combo_shadow_ledger',
    name: 'The Shadow Ledger',
    description:
      'Spies and collected debts together pry open a rival treasury.',
    requiredKeys: ['espionage_sweep', 'debt_called'],
    windowTurns: 2,
    bonusEffect: { espionageNetworkDelta: 15, treasuryDelta: 30 },
  },
  {
    id: 'combo_sovereigns_peace',
    name: "Sovereign's Peace",
    description:
      'Restraint voiced through a royal proclamation steadies the realm.',
    requiredKeys: ['sovereign_restraint', 'royal_proclamation'],
    windowTurns: 1,
    bonusEffect: { stabilityDelta: 10, commonerSatDelta: 5 },
  },
];

export const COMBO_BY_ID: Readonly<Record<string, CardCombo>> = Object.freeze(
  COMBOS.reduce<Record<string, CardCombo>>((acc, combo) => {
    acc[combo.id] = combo;
    return acc;
  }, {}),
);
