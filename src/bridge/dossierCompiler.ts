// Bridge Layer — Rival Kingdom Dossier Compiler
// Reads a NeighborState + player's EspionageState and produces a
// RivalDossier with detail gated by intelligence level.

import {
  RivalPersonality,
  NeighborDisposition,
} from '../engine/types';
import type {
  NeighborState,
  EspionageState,
  NeighborAction,
  GameState,
} from '../engine/types';
import type { RivalDossier } from '../ui/types';
import { NEIGHBOR_LABELS } from '../data/text/labels';
import {
  NEIGHBOR_RULER_NAMES,
  PERSONALITY_LABELS,
  MILITARY_STRENGTH_DESCRIPTORS,
  RECENT_ACTION_LABELS,
  SPYMASTER_ASSESSMENTS,
  SPYMASTER_AGENDA_LINES,
  DISPOSITION_TOWARD_PLAYER,
  getDispositionBucket,
  POSTURE_STATUS_LABELS,
  getSituationKey,
} from '../data/text/dossier-templates';
import {
  getNeighborDisplayName,
  getRegionDisplayName,
  getSettlementDisplayName,
} from './nameResolver';
import { computeMemoryDriftDelta } from '../engine/systems/rival-memory';

// ============================================================
// Intel level determination
// ============================================================

export function getIntelLevel(networkStrength: number): RivalDossier['intelLevel'] {
  if (networkStrength <= 10) return 'none';
  if (networkStrength <= 30) return 'minimal';
  if (networkStrength <= 60) return 'moderate';
  if (networkStrength <= 80) return 'strong';
  return 'exceptional';
}

// ============================================================
// Personality mapping
// ============================================================

export const DISPOSITION_TO_PERSONALITY: Record<NeighborDisposition, RivalPersonality> = {
  [NeighborDisposition.Aggressive]: RivalPersonality.AmbitiousMilitaristic,
  [NeighborDisposition.Opportunistic]: RivalPersonality.ExpansionistDiplomatic,
  [NeighborDisposition.Cautious]: RivalPersonality.DefensiveCautious,
  [NeighborDisposition.Mercantile]: RivalPersonality.MercantilePragmatic,
  [NeighborDisposition.Isolationist]: RivalPersonality.DevoutInsular,
};

// ============================================================
// Regard label from relationship score
// ============================================================

function getRegardLabel(score: number): string {
  if (score <= 20) return 'Hostile';
  if (score <= 40) return 'Wary';
  if (score <= 60) return 'Neutral';
  if (score <= 80) return 'Favorable';
  return 'Allied';
}

// ============================================================
// Military strength descriptor
// ============================================================

function getMilitaryDescriptor(strength: number): string {
  if (strength <= 30) return 'weak';
  if (strength <= 55) return 'moderate';
  if (strength <= 75) return 'strong';
  return 'overwhelming';
}

// ============================================================
// Known strengths generation
// ============================================================

function buildKnownStrengths(neighbor: NeighborState): string[] {
  const strengths: string[] = [];
  if (neighbor.militaryStrength >= 60) {
    strengths.push(MILITARY_STRENGTH_DESCRIPTORS[getMilitaryDescriptor(neighbor.militaryStrength)]);
  }
  if (neighbor.espionageCapability >= 50) {
    strengths.push('Maintains a capable intelligence network.');
  }
  if (neighbor.activeAgreements.length >= 2) {
    strengths.push('Engages in multiple active diplomatic agreements.');
  }
  if (neighbor.warWeariness <= 10 && neighbor.militaryStrength >= 40) {
    strengths.push('Fresh and ready for sustained conflict.');
  }
  if (strengths.length === 0) {
    strengths.push('No notable strengths detected.');
  }
  return strengths.slice(0, 3);
}

// ============================================================
// Diplomatic status string
// ============================================================

function buildDiplomaticStatus(neighbor: NeighborState): string {
  const base = POSTURE_STATUS_LABELS[neighbor.attitudePosture] ?? 'Unknown';
  if (neighbor.activeAgreements.length > 0) {
    const agreementNames = neighbor.activeAgreements.map((a) => a.agreementId).join(', ');
    return `${base} \u2014 ${agreementNames}`;
  }
  return base;
}

// ============================================================
// Trade status string
// ============================================================

function buildTradeStatus(neighbor: NeighborState): string | null {
  const tradeAgreements = neighbor.activeAgreements.filter((a) =>
    a.agreementId.toLowerCase().includes('trade'),
  );
  if (tradeAgreements.length === 0) return null;
  return `Active \u2014 ${tradeAgreements.length} trade route(s)`;
}

// ============================================================
// Confidence rating
// ============================================================

function getConfidenceRating(networkStrength: number): string {
  if (networkStrength <= 65) return 'Low';
  if (networkStrength <= 75) return 'Moderate';
  if (networkStrength <= 90) return 'High';
  return 'Very High';
}

// ============================================================
// Main compiler
// ============================================================

export function compileDossier(
  neighbor: NeighborState,
  espionage: EspionageState,
  recentActions: NeighborAction[],
  turn: number,
  gameState?: GameState,
): RivalDossier {
  const intelLevel = getIntelLevel(espionage.networkStrength);
  const personality = DISPOSITION_TO_PERSONALITY[neighbor.disposition];
  const kingdomName = neighbor.displayName ?? NEIGHBOR_LABELS[neighbor.id] ?? `Kingdom of ${neighbor.id}`;
  const rulerName = neighbor.rulerName ?? NEIGHBOR_RULER_NAMES[neighbor.id] ?? `The ruler of ${kingdomName}`;

  // Base fields — always visible
  const dossier: RivalDossier = {
    neighborId: neighbor.id,
    kingdomName,
    rulerName,
    personality,
    personalityLabel: PERSONALITY_LABELS[personality],
    regard: {
      label: getRegardLabel(neighbor.relationshipScore),
      score: neighbor.relationshipScore,
    },
    diplomaticStatus: intelLevel === 'none' ? 'Unknown' : buildDiplomaticStatus(neighbor),
    tradeStatus: intelLevel === 'none' ? null : buildTradeStatus(neighbor),
    knownStrengths: [],
    recentActions: [],
    spymasterAssessment: null,
    agendaAssessment: null,
    dispositionTowardPlayer: null,
    confidenceRating: null,
    intelLevel,
  };

  // Minimal: + military strength descriptor + diplomatic status
  // (diplomatic status already set above for non-'none')

  // Moderate: + known strengths + recent actions
  if (intelLevel === 'moderate' || intelLevel === 'strong' || intelLevel === 'exceptional') {
    dossier.knownStrengths = buildKnownStrengths(neighbor);

    // Recent actions from history
    const actionTexts: string[] = [];
    const history = neighbor.recentActionHistory ?? [];
    for (const entry of history.slice(-4)) {
      const label = RECENT_ACTION_LABELS[entry.summary];
      if (label) {
        const turnsAgo = turn - entry.turnNumber;
        const agoText = turnsAgo <= 1 ? 'this season' : `${turnsAgo} seasons ago`;
        actionTexts.push(`${label} (${agoText})`);
      }
    }
    // Also include recent NeighborActions from this turn
    for (const action of recentActions.slice(-2)) {
      const summary = action.actionType.toString();
      const label = RECENT_ACTION_LABELS[summary] ?? summary;
      actionTexts.push(label);
    }
    dossier.recentActions = actionTexts.slice(0, 4);

    // Phase 3 — agenda-aware line, gated by moderate+ intel.
    if (neighbor.agenda && gameState) {
      dossier.agendaAssessment = buildAgendaLine(neighbor, gameState, turn);
    }
  }

  // Phase 3 — Disposition toward player, derived from memory drift.
  // Surfaces at all intel levels above 'none' so the player sees one
  // relationship signal even without spymaster coverage.
  if (intelLevel !== 'none' && neighbor.memory && gameState) {
    const drift = computeMemoryDriftDelta(neighbor.memory, neighbor.id, gameState);
    const bucket = getDispositionBucket(drift);
    dossier.dispositionTowardPlayer = DISPOSITION_TOWARD_PLAYER[bucket];
  }

  // Strong: + spymaster assessment + confidence rating
  if (intelLevel === 'strong' || intelLevel === 'exceptional') {
    const situation = getSituationKey(neighbor.attitudePosture);
    const assessmentKey = `${personality}_${situation}`;
    const variants = SPYMASTER_ASSESSMENTS[assessmentKey];
    if (variants && variants.length > 0) {
      dossier.spymasterAssessment = variants[turn % variants.length];
    }
    dossier.confidenceRating = getConfidenceRating(espionage.networkStrength);
  }

  return dossier;
}

// Phase 3 — resolves the agenda's target placeholder and picks a line.
function buildAgendaLine(
  neighbor: NeighborState,
  state: GameState,
  turn: number,
): string | null {
  if (!neighbor.agenda) return null;
  const situation = getSituationKey(neighbor.attitudePosture);
  const key = `${neighbor.agenda.current}_${situation}`;
  const variants = SPYMASTER_AGENDA_LINES[key];
  if (!variants || variants.length === 0) return null;
  const line = variants[turn % variants.length];

  const targetId = neighbor.agenda.targetEntityId;
  if (!targetId) {
    // Strip {target} placeholder entirely (with surrounding spaces) for untargeted agendas.
    return line.replace(/\s*\{target\}\s*/g, ' ').trim();
  }
  const resolved = resolveTargetName(targetId, state);
  return line.replace(/\{target\}/g, resolved);
}

function resolveTargetName(entityId: string, state: GameState): string {
  if (entityId.startsWith('region_')) return getRegionDisplayName(entityId, state);
  if (entityId.startsWith('settlement_')) return getSettlementDisplayName(entityId, state);
  if (entityId.startsWith('neighbor_')) return getNeighborDisplayName(entityId, state);
  return entityId;
}
