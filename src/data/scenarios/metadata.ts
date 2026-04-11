import type { EffectHint } from '../../ui/types';

export interface ScenarioMetadata {
  id: string;
  title: string;
  tagline: string;
  body: string;
  difficulty: string;
  highlights: EffectHint[];
}

export const SCENARIO_METADATA: ScenarioMetadata[] = [
  {
    id: 'new_crown',
    title: 'The New Crown',
    tagline: 'A balanced start for new rulers',
    body: 'You inherit a modest but stable kingdom with balanced resources, neutral neighbors, and room to grow. Every path is open — your decisions alone will shape the realm.',
    difficulty: 'Standard',
    highlights: [
      { label: 'Balanced Start', type: 'neutral' },
      { label: 'Standard', type: 'positive' },
    ],
  },
  {
    id: 'fractured_inheritance',
    title: 'The Fractured Inheritance',
    tagline: 'A divided realm, a contested throne',
    body: 'Your predecessor left a kingdom riven by factional strife. Nobles scheme, the clergy demands influence, and the common folk grow restless. Unite the realm before it tears itself apart.',
    difficulty: 'Hard',
    highlights: [
      { label: 'Political Intrigue', type: 'warning' },
      { label: 'Hard', type: 'negative' },
    ],
  },
  {
    id: 'merchants_gambit',
    title: "The Merchant's Gambit",
    tagline: 'Wealth flows, but at what cost?',
    body: 'A prosperous trade kingdom with overflowing coffers but a neglected military and greedy neighbors eyeing your riches. Can gold buy security, or will it invite ruin?',
    difficulty: 'Hard',
    highlights: [
      { label: 'Trade Focus', type: 'positive' },
      { label: 'Hard', type: 'negative' },
    ],
  },
  {
    id: 'frozen_march',
    title: 'The Frozen March',
    tagline: 'Winter comes, and war follows',
    body: 'A large but under-equipped army, a hostile neighbor massing troops, and a brutal winter straining your food supplies. Survive the cold and the sword or perish in the snow.',
    difficulty: 'Very Hard',
    highlights: [
      { label: 'Military Crisis', type: 'negative' },
      { label: 'Very Hard', type: 'negative' },
    ],
  },
  {
    id: 'faithful_kingdom',
    title: 'The Faithful Kingdom',
    tagline: 'Devotion runs deep, but so do old wounds',
    body: 'A kingdom built on deep religious roots where the clergy wields enormous power. The military has been neglected, and a rival-faith neighbor grows bolder. Balance piety with pragmatism.',
    difficulty: 'Hard',
    highlights: [
      { label: 'Faith & Diplomacy', type: 'warning' },
      { label: 'Hard', type: 'negative' },
    ],
  },
];
