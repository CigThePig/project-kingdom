// Bridge Layer — Reign Chronicle Logger
// Evaluates the just-resolved turn and returns 0-3 chronicle entries
// for events significant enough to record.

import { EventSeverity } from '../engine/types';
import type { GameState, ActiveEvent, Season, KnowledgeBranch, FailureCondition } from '../engine/types';
import type { ChronicleEntry } from '../ui/types';
import type { MonthDecision } from '../ui/types';
import {
  formatSeasonYear,
  crisisResolvedText,
  warStartedText,
  warEndedText,
  treatySignedText,
  milestoneText,
  storylineResolvedText,
  failureWarningText,
  constructionCompletedText,
} from '../data/text/chronicle-templates';

// ============================================================
// Chronicle entry generation
// ============================================================

export interface ChronicleLogEntry {
  turnNumber: number;
  season: Season;
  year: number;
  text: string;
  isProtected: boolean;
}

export function generateChronicleEntries(
  preState: GameState,
  postState: GameState,
  _decisions: MonthDecision[],
  resolvedEvents: ActiveEvent[],
  newMilestones: Array<{ branch: KnowledgeBranch; milestoneIndex: number }>,
  failureWarnings: FailureCondition[],
  completedConstructionIds: string[],
): ChronicleLogEntry[] {
  const entries: ChronicleLogEntry[] = [];
  const { season, year, turnNumber } = postState.turn;
  const seasonYear = formatSeasonYear(season, year);

  // 1. Crisis events resolved (Serious or Critical severity)
  for (const event of resolvedEvents) {
    if (event.severity === EventSeverity.Serious || event.severity === EventSeverity.Critical) {
      entries.push({
        turnNumber,
        season,
        year,
        text: `${seasonYear} \u2014 ${crisisResolvedText(event.definitionId, event.choiceMade ?? 'unknown')}`,
        isProtected: false,
      });
    }
  }

  // 2. Wars started — new conflicts that weren't in preState
  const preConflictIds = new Set(preState.activeConflicts.map((c) => c.id));
  for (const conflict of postState.activeConflicts) {
    if (!preConflictIds.has(conflict.id)) {
      entries.push({
        turnNumber,
        season,
        year,
        text: `${seasonYear} \u2014 ${warStartedText(conflict.neighborId)}`,
        isProtected: true,
      });
    }
  }

  // 3. Wars ended — conflicts in preState but not in postState
  const postConflictIds = new Set(postState.activeConflicts.map((c) => c.id));
  for (const conflict of preState.activeConflicts) {
    if (!postConflictIds.has(conflict.id)) {
      const playerWon = conflict.playerAdvantage > 0;
      entries.push({
        turnNumber,
        season,
        year,
        text: `${seasonYear} \u2014 ${warEndedText(conflict.neighborId, playerWon)}`,
        isProtected: true,
      });
    }
  }

  // 4. Treaties signed — new agreements not in preState
  for (const neighbor of postState.diplomacy.neighbors) {
    const preNeighbor = preState.diplomacy.neighbors.find((n) => n.id === neighbor.id);
    if (!preNeighbor) continue;
    const preAgreementIds = new Set(preNeighbor.activeAgreements.map((a) => a.agreementId));
    for (const agreement of neighbor.activeAgreements) {
      if (!preAgreementIds.has(agreement.agreementId)) {
        entries.push({
          turnNumber,
          season,
          year,
          text: `${seasonYear} \u2014 ${treatySignedText(neighbor.id, agreement.agreementId)}`,
          isProtected: false,
        });
      }
    }
  }

  // 5. Knowledge milestones
  for (const milestone of newMilestones) {
    entries.push({
      turnNumber,
      season,
      year,
      text: `${seasonYear} \u2014 ${milestoneText(milestone.branch, milestone.milestoneIndex)}`,
      isProtected: true,
    });
  }

  // 6. Storyline resolutions — newly resolved
  const preResolvedIds = new Set(preState.resolvedStorylineIds);
  for (const id of postState.resolvedStorylineIds) {
    if (!preResolvedIds.has(id)) {
      entries.push({
        turnNumber,
        season,
        year,
        text: `${seasonYear} \u2014 ${storylineResolvedText(id)}`,
        isProtected: true,
      });
    }
  }

  // 7. Failure warnings issued
  for (const condition of failureWarnings) {
    entries.push({
      turnNumber,
      season,
      year,
      text: `${seasonYear} \u2014 ${failureWarningText(condition)}`,
      isProtected: false,
    });
  }

  // 8. Construction completed
  for (const projectId of completedConstructionIds) {
    entries.push({
      turnNumber,
      season,
      year,
      text: `${seasonYear} \u2014 ${constructionCompletedText(projectId, '')}`,
      isProtected: false,
    });
  }

  // Limit to 3 most significant entries per season
  // Priority: protected first, then by reverse order
  entries.sort((a, b) => {
    if (a.isProtected !== b.isProtected) return a.isProtected ? -1 : 1;
    return 0;
  });

  return entries.slice(0, 3);
}

// ============================================================
// Chronicle capacity and pruning
// ============================================================

/**
 * Returns the max chronicle size for the given reign length.
 * Base 20 + 1 per 2 additional seasons beyond 20.
 */
export function getChronicleCapacity(turnNumber: number): number {
  if (turnNumber <= 20) return 20;
  return 20 + Math.floor((turnNumber - 20) / 2);
}

/**
 * Prune the chronicle to fit within capacity.
 * Removes oldest non-protected entries first.
 */
export function pruneChronicle(
  entries: ChronicleEntry[],
  capacity: number,
): ChronicleEntry[] {
  if (entries.length <= capacity) return entries;

  const protectedCount = entries.filter((e) => e.isProtected).length;

  // If protected alone exceed capacity, keep all protected (can't prune them)
  if (protectedCount >= capacity) return entries.filter((e) => e.isProtected);

  // Count how many unprotected entries we must drop (oldest first)
  const spaceForUnprotected = capacity - protectedCount;
  const totalUnprotected = entries.length - protectedCount;
  const excessUnprotected = totalUnprotected - spaceForUnprotected;

  // Single pass: preserve original order, skip the oldest unprotected entries
  let skipped = 0;
  return entries.filter((e) => {
    if (e.isProtected) return true;
    if (skipped < excessUnprotected) {
      skipped++;
      return false;
    }
    return true;
  });
}

/**
 * Convert ChronicleLogEntry to the UI ChronicleEntry format.
 */
export function toChronicleEntry(log: ChronicleLogEntry): ChronicleEntry {
  return {
    season: formatSeasonYear(log.season, log.year),
    text: log.text,
    isProtected: log.isProtected,
  };
}
