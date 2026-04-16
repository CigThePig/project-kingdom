// Bridge Layer — Advisor Generator
// Generates a short advisor briefing for the Season Dawn phase.

import type { GameState } from '../engine/types';
import { EconomicPhase } from '../engine/types';
import type { ContextLine } from '../ui/types';
import { ECONOMIC_PHASE_LABELS } from '../data/text/labels';

export interface AdvisorBriefing {
  lines: string[];
  statusBadges?: ContextLine[];
}

/** Map condition types to advisor warning text. */
const CONDITION_ADVISOR_WARNINGS: Partial<Record<string, string>> = {
  Drought: 'Drought conditions persist — crops suffer.',
  Flood: 'Flooding threatens lowland settlements.',
  HarshWinter: 'A harsh winter strains supplies and morale.',
  Plague: 'Plague spreads through the populace.',
  Famine: 'Famine grips the kingdom.',
  Blight: 'Blight afflicts the fields.',
  Banditry: 'Banditry plagues the roads — trade suffers.',
  Corruption: 'Corruption festers among the nobility.',
  Unrest: 'Civil unrest threatens the kingdom\'s stability.',
  CriminalUnderworld: 'A criminal underworld undermines security.',
};

export function generateAdvisorBriefing(state: GameState): AdvisorBriefing {
  const warnings: string[] = [];

  // Critical resource warnings (checked first, shown preferentially)
  if (state.food.reserves < 50) {
    warnings.push('Food stores are nearly exhausted.');
  }
  if (state.treasury.balance < 100) {
    warnings.push('The treasury is dangerously low.');
  }
  if (state.stability.value < 40) {
    warnings.push('Stability is critically low.');
  }
  if (state.faithCulture.schismActive) {
    warnings.push('A religious schism divides the faithful.');
  }
  if (state.military.readiness < 30) {
    warnings.push('The military is unready for conflict.');
  }
  if (state.food.netFlowPerTurn < 0) {
    warnings.push('We are consuming more food than we produce.');
  }
  if (state.treasury.netFlowPerTurn < -20) {
    warnings.push('Revenue is falling. Consider revising tax policy.');
  }

  // Active condition warnings from the environment system
  if (state.environment) {
    for (const condition of state.environment.activeConditions) {
      const text = CONDITION_ADVISOR_WARNINGS[condition.type];
      if (text && !warnings.includes(text)) {
        warnings.push(text);
      }
    }
  }

  // Causal trend detection: if the same system appears as a root cause
  // in 3+ recent chains, surface a trend warning.
  if (state.causalLedger) {
    const rootCauseCounts = new Map<string, number>();
    for (const chain of state.causalLedger.recentChains) {
      const system = chain.rootCause.system;
      rootCauseCounts.set(system, (rootCauseCounts.get(system) ?? 0) + 1);
    }
    for (const [system, count] of rootCauseCounts) {
      if (count >= 3) {
        warnings.push(`Recurring pressure from ${system} — a pattern is forming.`);
      }
    }
  }

  // Population dynamics warnings
  if (state.populationDynamics) {
    if (state.populationDynamics.migrationPressure < -40) {
      warnings.push('People are fleeing the kingdom in alarming numbers.');
    } else if (state.populationDynamics.migrationPressure < -20) {
      warnings.push('Migration outflow is a growing concern.');
    }
    if (state.populationDynamics.currentTotalPopulation > state.populationDynamics.housingCapacity) {
      warnings.push('The population exceeds housing capacity — overcrowding worsens.');
    }
    if (state.populationDynamics.recentDeathSurplus > state.populationDynamics.recentBirthSurplus * 1.5) {
      warnings.push('Deaths outpace births — the population declines.');
    }
  }

  // Build status badges — structured overview of kingdom state
  const statusBadges: ContextLine[] = [];

  if (state.economy) {
    const phase = state.economy.cyclePhase;
    const phaseLabel = ECONOMIC_PHASE_LABELS[phase];
    const tone: ContextLine['tone'] =
      phase === EconomicPhase.Depression || phase === EconomicPhase.Recession
        ? 'pressure'
        : phase === EconomicPhase.Growth || phase === EconomicPhase.Boom
        ? 'opportunity'
        : 'info';
    statusBadges.push({ text: `Economy: ${phaseLabel}`, tone });
  }

  if (state.populationDynamics) {
    const pd = state.populationDynamics;
    if (pd.recentDeathSurplus > pd.recentBirthSurplus) {
      statusBadges.push({ text: 'Population: declining', tone: 'pressure' });
    } else if (pd.migrationPressure > 20) {
      statusBadges.push({ text: 'Population: growing', tone: 'opportunity' });
    }
  }

  if (state.environment?.activeConditions?.length) {
    const count = state.environment.activeConditions.length;
    const hasSevere = state.environment.activeConditions.some((c) => c.severity === 'Severe');
    statusBadges.push({
      text: `${count} active condition${count !== 1 ? 's' : ''}`,
      tone: hasSevere ? 'crisis' : 'pressure',
    });
  }

  if (warnings.length === 0) {
    return {
      lines: ['The kingdom is stable. The court awaits your word.'],
      statusBadges: statusBadges.length ? statusBadges : undefined,
    };
  }

  // Cap at 4 most important warnings (expanded from 3 to accommodate conditions)
  return {
    lines: warnings.slice(0, 4),
    statusBadges: statusBadges.length ? statusBadges : undefined,
  };
}
