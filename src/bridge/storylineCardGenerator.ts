// Bridge Layer — Storyline Card Generator
// Translates ActiveStoryline branch points into CrisisPhaseData
// and storyline resolutions into LegacyCardData for the summary phase.

import type { ActiveStoryline } from '../engine/types';
import { StorylineStatus } from '../engine/types';
import type { CrisisPhaseData, CrisisCardData, ResponseCardData } from './crisisCardGenerator';
import { mechDeltaToEffectHints } from './crisisCardGenerator';
import type { LegacyCardData } from './summaryGenerator';
import { STORYLINE_TEXT } from '../data/text/events';
import { STORYLINE_POOL } from '../data/storylines/index';
import { STORYLINE_CHOICE_EFFECTS, STORYLINE_RESOLUTION_EFFECTS } from '../data/storylines/effects';
import { StyleAxis } from '../engine/types';

// ============================================================
// Storyline Branch → Crisis Card
// ============================================================

/**
 * Generates a CrisisPhaseData from an active storyline's current branch point.
 * Returns null if the storyline is resolved, dormant, or has no matching text.
 */
export function generateStorylineCrisisData(
  storyline: ActiveStoryline,
): CrisisPhaseData | null {
  if (storyline.status !== StorylineStatus.Active) return null;

  const textEntry = STORYLINE_TEXT[storyline.definitionId];
  if (!textEntry) return null;

  const branchText = textEntry.branchPoints[storyline.currentBranchId];
  if (!branchText) return null;

  const def = STORYLINE_POOL.find((s) => s.id === storyline.definitionId);
  if (!def) return null;

  const branchDef = def.branches.find((b) => b.branchId === storyline.currentBranchId);
  if (!branchDef) return null;

  // Resolution branches have only a conclude_arc choice — not a real crisis decision
  if (branchDef.isResolutionBranch) return null;

  const choiceEffects = STORYLINE_CHOICE_EFFECTS[storyline.definitionId] ?? {};

  const crisisCard: CrisisCardData = {
    eventId: `storyline:${storyline.id}`,
    definitionId: storyline.definitionId,
    title: textEntry.title,
    body: branchText.body,
    effects: [{ label: 'STORYLINE', type: 'warning' }],
  };

  const responses: ResponseCardData[] = branchDef.choices
    .filter((c) => c.choiceId !== 'conclude_arc')
    .map((choice) => {
      const delta = choiceEffects[choice.choiceId] ?? {};
      return {
        id: `storyline:${storyline.id}:${choice.choiceId}`,
        choiceId: choice.choiceId,
        title: branchText.choices[choice.choiceId] ?? choice.choiceId,
        effects: mechDeltaToEffectHints(delta),
        slotCost: 0,
        isFree: true,
      };
    });

  return { crisisCard, responses };
}

// ============================================================
// Storyline Resolution → Legacy Card
// ============================================================

/**
 * Generates a LegacyCardData when a storyline reaches its resolution branch.
 * The resolution effects are path-dependent — keyed by the mid-arc choice.
 * Returns null if the storyline is not at resolution or has no matching data.
 */
export function generateStorylineResolutionLegacy(
  storyline: ActiveStoryline,
): LegacyCardData | null {
  if (storyline.status !== StorylineStatus.Active) return null;

  const def = STORYLINE_POOL.find((s) => s.id === storyline.definitionId);
  if (!def) return null;

  const branchDef = def.branches.find((b) => b.branchId === storyline.currentBranchId);
  if (!branchDef || !branchDef.isResolutionBranch) return null;

  const textEntry = STORYLINE_TEXT[storyline.definitionId];
  if (!textEntry) return null;

  const branchText = textEntry.branchPoints[storyline.currentBranchId];
  if (!branchText) return null;

  // Resolution effects are keyed by the mid-arc choice
  const resolutionEffects = STORYLINE_RESOLUTION_EFFECTS[storyline.definitionId];
  if (!resolutionEffects) return null;

  // Find the mid-arc choice (the most recent non-opening decision)
  const midArcDecision = storyline.decisionHistory.length > 1
    ? storyline.decisionHistory[storyline.decisionHistory.length - 1]
    : storyline.decisionHistory[0];

  const midArcChoiceId = midArcDecision?.choiceId;
  const delta = midArcChoiceId ? resolutionEffects[midArcChoiceId] ?? {} : {};

  return {
    title: `${textEntry.title} — Resolved`,
    body: branchText.body,
    axis: StyleAxis.Authority, // storyline legacies don't map to a single axis
    threshold: 0,
    effects: mechDeltaToEffectHints(delta),
  };
}
