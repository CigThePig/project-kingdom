// Bridge Layer — Active Situations Tracker
// Scans GameState for all active ongoing situations.
// Pure function: state in, ActiveSituation[] out.

import { StorylineStatus } from '../engine/types';
import type { GameState } from '../engine/types';
import type { ActiveSituation } from '../ui/types';
import { NEIGHBOR_LABELS, REGION_LABELS } from '../data/text/labels';
import { CONFLICT_PHASE_LABELS, FAILURE_CONDITION_LABELS } from '../data/text/labels';
import { CONSTRUCTION_CATEGORY_LABELS, STORYLINE_CATEGORY_LABELS } from '../data/text/labels';

// ============================================================
// Advantage descriptor
// ============================================================

function advantageDescription(advantage: number): string {
  if (advantage <= -50) return 'Severe disadvantage';
  if (advantage <= -20) return 'Losing ground';
  if (advantage < 20) return 'Contested';
  if (advantage < 50) return 'Gaining advantage';
  return 'Dominant position';
}

// ============================================================
// Main compiler
// ============================================================

export function compileActiveSituations(state: GameState): ActiveSituation[] {
  const situations: ActiveSituation[] = [];

  // 1. Active conflicts (wars)
  for (const conflict of state.activeConflicts) {
    const neighborName = NEIGHBOR_LABELS[conflict.neighborId] ?? conflict.neighborId;
    const phaseLabel = CONFLICT_PHASE_LABELS[conflict.phase] ?? conflict.phase;
    const statusLines: string[] = [
      phaseLabel,
      advantageDescription(conflict.playerAdvantage),
      `Casualties: ${conflict.playerCasualties} sustained`,
      `${conflict.turnsElapsed} season(s) elapsed`,
    ];
    if (conflict.targetRegionId) {
      const regionName = REGION_LABELS[conflict.targetRegionId] ?? conflict.targetRegionId;
      statusLines.splice(1, 0, `Threatened region: ${regionName}`);
    }
    situations.push({
      id: `war_${conflict.id}`,
      type: 'war',
      title: `War with ${neighborName}`,
      statusLines: statusLines.slice(0, 4),
      urgency: 'high',
    });
  }

  // 2. Construction projects
  for (const project of state.constructionProjects) {
    if (project.turnsRemaining <= 0) continue;
    const regionName = REGION_LABELS[project.targetRegionId] ?? project.targetRegionId;
    const categoryLabel = CONSTRUCTION_CATEGORY_LABELS[project.category] ?? project.category;
    situations.push({
      id: `construction_${project.id}`,
      type: 'construction',
      title: `${categoryLabel} Under Construction`,
      statusLines: [
        `Region: ${regionName}`,
        `${project.turnsRemaining} season(s) remaining`,
        `Category: ${categoryLabel}`,
      ],
      urgency: 'low',
    });
  }

  // 3. Diplomatic agreements (treaty and trade)
  for (const neighbor of state.diplomacy.neighbors) {
    const neighborName = NEIGHBOR_LABELS[neighbor.id] ?? neighbor.id;
    for (const agreement of neighbor.activeAgreements) {
      const isTrade = agreement.agreementId.toLowerCase().includes('trade');
      const type = isTrade ? 'trade' : 'treaty';
      const title = isTrade
        ? `Trade Agreement with ${neighborName}`
        : `Treaty with ${neighborName}`;
      const statusLines: string[] = [
        `Agreement: ${agreement.agreementId}`,
      ];
      if (agreement.turnsRemaining !== null) {
        statusLines.push(`${agreement.turnsRemaining} season(s) remaining`);
      } else {
        statusLines.push('Indefinite duration');
      }
      situations.push({
        id: `${type}_${agreement.agreementId}_${neighbor.id}`,
        type,
        title,
        statusLines,
        urgency: 'low',
      });
    }
  }

  // 4. Espionage — report if network is active
  if (state.espionage.networkStrength > 20) {
    const statusLines: string[] = [
      `Network strength: ${state.espionage.networkStrength}`,
      `Counter-intelligence: ${state.espionage.counterIntelligenceLevel}`,
    ];
    situations.push({
      id: 'espionage_network',
      type: 'espionage',
      title: 'Intelligence Network Active',
      statusLines,
      urgency: 'medium',
    });
  }

  // 5. Failure condition warnings
  for (const condition of state.activeFailureConditions) {
    const label = FAILURE_CONDITION_LABELS[condition] ?? condition;
    const statusLines: string[] = [`Warning: ${label} approaching`];

    // Add specific counter info where available
    if (condition === 'Famine' as unknown) {
      statusLines.push(`Empty turns: ${state.food.consecutiveTurnsEmpty}`);
    } else if (condition === 'Insolvency' as unknown) {
      statusLines.push(`Insolvent turns: ${state.treasury.consecutiveTurnsInsolvent}`);
    } else if (condition === 'Collapse' as unknown) {
      statusLines.push(`Stability at zero: ${state.stability.consecutiveTurnsAtZero} turn(s)`);
    } else if (condition === 'Overthrow' as unknown) {
      statusLines.push(`Overthrow risk: ${state.consecutiveTurnsOverthrowRisk} turn(s)`);
    }

    statusLines.push('Immediate action required');

    situations.push({
      id: `failure_${condition}`,
      type: 'failureWarning',
      title: `Warning: ${label} Approaching`,
      statusLines,
      urgency: 'high',
    });
  }

  // 6. Active storylines
  for (const storyline of state.activeStorylines) {
    if (storyline.status !== StorylineStatus.Active) continue;
    const categoryLabel = STORYLINE_CATEGORY_LABELS[storyline.category] ?? storyline.category;
    const statusLines: string[] = [
      `Type: ${categoryLabel}`,
      `Current stage: ${storyline.currentBranchId}`,
    ];
    if (storyline.turnsUntilNextBranchPoint !== null) {
      statusLines.push(`Next development in ${storyline.turnsUntilNextBranchPoint} season(s)`);
    }
    const urgency =
      storyline.turnsUntilNextBranchPoint !== null && storyline.turnsUntilNextBranchPoint <= 1
        ? 'medium' as const
        : 'low' as const;
    situations.push({
      id: `storyline_${storyline.id}`,
      type: 'storyline',
      title: categoryLabel,
      statusLines,
      urgency,
    });
  }

  return situations;
}
