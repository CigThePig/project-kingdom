// Bridge Layer — Advisor Generator
// Generates a short advisor briefing for the Season Dawn phase.

import type { GameState } from '../engine/types';

export interface AdvisorBriefing {
  lines: string[];
}

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

  if (warnings.length === 0) {
    return { lines: ['The kingdom is stable. The court awaits your word.'] };
  }

  // Cap at 3 most important warnings
  return { lines: warnings.slice(0, 3) };
}
