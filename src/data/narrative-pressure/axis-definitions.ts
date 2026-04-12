// Narrative Pressure — Axis Definitions
// Metadata for each narrative axis: names, descriptions, and Codex display text.
// No logic beyond simple lookups.

import type { NarrativePressure } from '../../engine/types';

export interface NarrativeAxisDefinition {
  id: keyof NarrativePressure;
  name: string;
  theme: string;
  codexHeadline: string;
  codexDescription: string;
}

export const NARRATIVE_AXIS_DEFINITIONS: Record<keyof NarrativePressure, NarrativeAxisDefinition> = {
  authority: {
    id: 'authority',
    name: 'Iron Crown',
    theme: 'Centralized power, suppression, control',
    codexHeadline: 'The Crown Tightens Its Grip',
    codexDescription: 'The realm bends to the will of the throne. Dissent is met with force, and order is maintained through strength of decree.',
  },
  piety: {
    id: 'piety',
    name: 'Faith Ascendant',
    theme: 'Religious dominance, orthodox power',
    codexHeadline: 'Faith Shapes the Realm',
    codexDescription: 'The clergy wield growing influence, and the faithful look to the temple before the throne. Doctrine is law.',
  },
  commerce: {
    id: 'commerce',
    name: 'Merchant Tide',
    theme: 'Mercantile power, economic expansion',
    codexHeadline: 'Gold Moves the Kingdom',
    codexDescription: 'Trade routes multiply and merchant halls grow grand. The flow of coin reshapes the balance of power.',
  },
  militarism: {
    id: 'militarism',
    name: 'Drums of War',
    theme: 'Military buildup, aggressive posture',
    codexHeadline: 'The Realm Arms for Conflict',
    codexDescription: 'Forges burn day and night. The sound of marching boots echoes through the kingdom as the military grows in strength and ambition.',
  },
  reform: {
    id: 'reform',
    name: 'Voice of the People',
    theme: 'Progressive change, commoner empowerment',
    codexHeadline: 'Winds of Change Blow',
    codexDescription: 'The common folk find their voice. Reforms ripple through the kingdom, challenging old hierarchies and ancient privilege.',
  },
  intrigue: {
    id: 'intrigue',
    name: 'Shadow Court',
    theme: 'Espionage, manipulation, hidden power',
    codexHeadline: 'Shadows Deepen at Court',
    codexDescription: 'Whispers carry more weight than proclamations. The kingdom\'s true power moves through hidden channels and secret agreements.',
  },
  openness: {
    id: 'openness',
    name: 'Wide Horizon',
    theme: 'Cultural exchange, foreign engagement',
    codexHeadline: 'The Kingdom Looks Outward',
    codexDescription: 'Foreign faces appear in every market. New ideas flow freely across borders, and the kingdom embraces the world beyond its walls.',
  },
  isolation: {
    id: 'isolation',
    name: 'Closed Gates',
    theme: 'Protectionism, tradition, insularity',
    codexHeadline: 'The Borders Close',
    codexDescription: 'The kingdom turns inward. Tradition is prized over novelty, and the gates close against the uncertain world beyond.',
  },
};
