// Player-facing text for legacy cards triggered by ruling style threshold crossings.
// Each axis has two directions (positive/negative) and two thresholds (30/45).

import { StyleAxis } from '../../engine/types';

interface LegacyTextEntry {
  title: string;
  body: string;
}

type ThresholdKey = `${StyleAxis}_${'positive' | 'negative'}_${30 | 45}`;

export const LEGACY_TEXT: Record<ThresholdKey, LegacyTextEntry> = {
  // Authority axis — positive = Authoritarian
  [`${StyleAxis.Authority}_positive_30`]: {
    title: 'The Iron Hand',
    body: 'Your rule grows firm. Nobles whisper of a strong sovereign who commands obedience. The common folk feel the tightening grip, but order prevails.',
  },
  [`${StyleAxis.Authority}_positive_45`]: {
    title: 'Absolute Authority',
    body: 'None question the crown\'s word. Your decrees carry the weight of law unchallengeable. The nobility flourishes under your patronage, though the streets grow quiet with deference — or fear.',
  },
  // Authority axis — negative = Permissive
  [`${StyleAxis.Authority}_negative_30`]: {
    title: 'The Open Court',
    body: 'Your willingness to listen has become legend. Petitioners travel from far provinces knowing they will be heard. Some nobles grumble about weakened tradition.',
  },
  [`${StyleAxis.Authority}_negative_45`]: {
    title: 'The People\'s Sovereign',
    body: 'Power flows upward from the people in your kingdom. Local councils govern with real authority. The nobility watches their ancient privileges erode, but the commons have never been more content.',
  },

  // Economy axis — positive = Mercantilist
  [`${StyleAxis.Economy}_positive_30`]: {
    title: 'The Merchant\'s Crown',
    body: 'Gold flows through your kingdom\'s veins. Trade routes hum with activity and merchant guilds grow powerful. The common folk work harder than ever to feed the engines of commerce.',
  },
  [`${StyleAxis.Economy}_positive_45`]: {
    title: 'Empire of Commerce',
    body: 'Your kingdom is a marketplace unto itself. Foreign traders flock to your ports and the treasury overflows. Yet the gap between merchant princes and common laborers yawns ever wider.',
  },
  // Economy axis — negative = Populist
  [`${StyleAxis.Economy}_negative_30`]: {
    title: 'Champion of the Commons',
    body: 'Your policies favor the many over the few. Granaries are full, wages fair, and the people prosper. Merchants mutter about lost opportunities and constrained ambition.',
  },
  [`${StyleAxis.Economy}_negative_45`]: {
    title: 'The Just Realm',
    body: 'Wealth is shared broadly across your kingdom. No child goes hungry, no family lacks shelter. The merchant class chafes under regulations, but the commons sing your praises in the fields.',
  },

  // Military axis — positive = Martial
  [`${StyleAxis.Military}_positive_30`]: {
    title: 'The Warrior King',
    body: 'Your armies march with pride and purpose. The military caste holds a place of honor in your court. Neighbors tread carefully, and your soldiers stand ready.',
  },
  [`${StyleAxis.Military}_positive_45`]: {
    title: 'The Sword Unsheathed',
    body: 'Your kingdom is a fortress. Every border bristles with steel, every garrison fully manned. The military caste revels in glory, though the cost of eternal readiness weighs on the realm.',
  },
  // Military axis — negative = Pacifist
  [`${StyleAxis.Military}_negative_30`]: {
    title: 'The Diplomat\'s Way',
    body: 'Words have replaced swords in your court. Envoys carry more weight than generals, and treaties are your strongest fortifications. Some warriors feel their purpose slipping away.',
  },
  [`${StyleAxis.Military}_negative_45`]: {
    title: 'The Peace Weaver',
    body: 'Your kingdom is renowned for diplomacy. Conflicts are resolved through negotiation, and your ambassadors are welcomed in every court. The military withers, but alliances hold strong.',
  },

  // Faith axis — positive = Theocratic
  [`${StyleAxis.Faith}_positive_30`]: {
    title: 'Defender of the Faith',
    body: 'The clergy speaks highly of your devotion. Temples rise, festivals flourish, and the faithful rejoice. Merchants find new regulations guided by religious doctrine.',
  },
  [`${StyleAxis.Faith}_positive_45`]: {
    title: 'The Sacred Crown',
    body: 'Faith and governance are one in your kingdom. The clergy stands at your right hand, and divine law shapes every decree. Commerce bends to religious will, but the faithful have never been more devoted.',
  },
  // Faith axis — negative = Secular
  [`${StyleAxis.Faith}_negative_30`]: {
    title: 'The Rational Throne',
    body: 'Pragmatism guides your rule. Scholars and engineers gain influence while the clergy\'s political power wanes. Knowledge and reason light the path forward.',
  },
  [`${StyleAxis.Faith}_negative_45`]: {
    title: 'The Enlightened Crown',
    body: 'Your kingdom embraces reason above all. Universities rival cathedrals in grandeur, and policy is guided by evidence, not doctrine. The clergy warns of divine displeasure, but progress marches on.',
  },
};
