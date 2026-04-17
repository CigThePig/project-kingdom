// Chronicle Templates — text generation for the Reign Chronicle.
// Maps event types to human-readable chronicle entry summaries.

import { FailureCondition, Season } from '../../engine/types';
import type { GameState } from '../../engine/types';
import { SEASON_LABELS, FAILURE_CONDITION_LABELS } from './labels';
import { getNeighborDisplayName } from '../../bridge/nameResolver';

// ============================================================
// Season + Year label
// ============================================================

export function formatSeasonYear(season: Season, year: number): string {
  return `${SEASON_LABELS[season]}, Year ${year}`;
}

// ============================================================
// Chronicle entry text generators
// ============================================================

export function crisisResolvedText(eventId: string, choiceId: string): string {
  return `Crisis "${eventId}" was addressed. The crown chose: ${choiceId}.`;
}

export function warStartedText(neighborId: string, state: GameState): string {
  const name = getNeighborDisplayName(neighborId, state);
  return `War declared by ${name}. The kingdom mobilized for conflict.`;
}

export function warEndedText(neighborId: string, playerVictory: boolean, state: GameState): string {
  const name = getNeighborDisplayName(neighborId, state);
  return playerVictory
    ? `The war with ${name} ended in victory.`
    : `The war with ${name} concluded. Peace terms were accepted.`;
}

export function treatySignedText(neighborId: string, agreementId: string, state: GameState): string {
  const name = getNeighborDisplayName(neighborId, state);
  return `A treaty (${agreementId}) was signed with ${name}.`;
}

export function treatyBrokenText(neighborId: string, state: GameState): string {
  const name = getNeighborDisplayName(neighborId, state);
  return `The treaty with ${name} was broken.`;
}

export function milestoneText(branch: string, milestoneIndex: number): string {
  return `Knowledge milestone ${milestoneIndex + 1} was achieved in ${branch} research.`;
}

export function storylineResolvedText(storylineId: string): string {
  return `A major storyline reached its conclusion: ${storylineId}.`;
}

export function failureWarningText(condition: FailureCondition): string {
  const label = FAILURE_CONDITION_LABELS[condition] ?? condition;
  return `Warning: ${label} threatens the realm. Urgent action needed.`;
}

export function rulingStyleThresholdText(axis: string, value: number): string {
  const direction = value > 0 ? 'authoritative' : 'permissive';
  return `The crown's ${axis.toLowerCase()} stance has become notably ${direction}.`;
}

export function decreeEnactedText(decreeName: string): string {
  return `The crown enacted: ${decreeName}.`;
}

export function constructionCompletedText(projectName: string, regionId: string): string {
  if (regionId) {
    return `Construction completed: ${projectName} in ${regionId}.`;
  }
  return `Construction completed: ${projectName}.`;
}
