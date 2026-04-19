// Phase F — Bond Name Resolver
// Resolves bond IDs to short descriptive phrases used in card bodies and the
// Codex "Bonds" domain. Kind-specific phrasing keeps the Diplomacy Overhaul
// bond types (marriages, hostages, vassalages, coalitions, trade leagues,
// religious accords, cultural exchanges) legible in prose without leaking
// internal enum values or raw neighbor IDs.

import type { Bond, GameState } from '../engine/types';
import { BOND_KIND_LABELS } from '../data/text/labels';
import { getNeighborDisplayName } from './nameResolver';

/**
 * Returns the bond object by stable `bondId`, or undefined if the diplomacy
 * state lacks a bonds list or the id is unknown.
 */
export function findBondById(bondId: string, state: GameState): Bond | undefined {
  return state.diplomacy.bonds?.find((b) => b.bondId === bondId);
}

/**
 * Resolves a bond's participants to display names, excluding the literal
 * "player" token used internally (notably for Vassalage.overlord when the
 * player is overlord).
 */
export function getBondParticipantNames(
  bond: Bond,
  state: GameState,
): string[] {
  return bond.participants
    .filter((pid) => pid !== 'player')
    .map((pid) => getNeighborDisplayName(pid, state));
}

/**
 * Returns a short descriptive phrase for the bond, e.g.
 *   "the marriage to Lady Sarielle"
 *   "the vassalage to Agroth"
 *   "the trade league with Veldraq and Highmarch"
 *   "the coalition against Marrowmoor"
 *
 * Falls back to the kind label + participants when kind-specific fields
 * (spouseName, hostageName) are missing.
 */
export function getBondDescriptor(
  bondId: string,
  state: GameState,
): string {
  const bond = findBondById(bondId, state);
  if (!bond) return 'the bond';
  return describeBond(bond, state);
}

/**
 * Descriptor variant that takes a `Bond` object directly — used by the
 * Codex compiler when it already has the bond in hand.
 */
export function describeBond(bond: Bond, state: GameState): string {
  const names = getBondParticipantNames(bond, state);
  const joined = joinNames(names);
  const label = BOND_KIND_LABELS[bond.kind] ?? String(bond.kind);

  switch (bond.kind) {
    case 'royal_marriage': {
      if (bond.spouseName) return `the marriage to ${bond.spouseName}`;
      return `the ${label}${joined ? ` with ${joined}` : ''}`;
    }
    case 'hostage_exchange': {
      if (bond.hostageName && joined) {
        return `the hostage exchange (${bond.hostageName}) with ${joined}`;
      }
      if (bond.hostageName) return `the hostage exchange for ${bond.hostageName}`;
      return `the ${label}${joined ? ` with ${joined}` : ''}`;
    }
    case 'vassalage': {
      if (bond.overlord === 'player') {
        return `the vassalage of ${joined || 'a sworn realm'}`;
      }
      const overlordName = getNeighborDisplayName(bond.overlord, state);
      return `the vassalage to ${overlordName}`;
    }
    case 'coalition': {
      const enemyName = getNeighborDisplayName(bond.commonEnemyId, state);
      return `the coalition against ${enemyName}`;
    }
    default:
      return `the ${label}${joined ? ` with ${joined}` : ''}`;
  }
}

function joinNames(names: string[]): string {
  if (names.length === 0) return '';
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
}
