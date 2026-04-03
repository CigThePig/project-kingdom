import { FailureCondition, PopulationClass } from '../../engine/types';
import { CLASS_LABELS } from './labels';

// ============================================================
// Report Template Type
// ============================================================

type ReportTemplate<T> = (data: T) => string;

// ============================================================
// Section Headers
// ============================================================

export const TREASURY_REPORT_HEADER = 'Treasury & Revenue Report';
export const FOOD_REPORT_HEADER = 'Agricultural & Provisions Report';
export const SOCIETY_REPORT_HEADER = 'Society & Population Report';
export const STABILITY_REPORT_HEADER = 'Stability Assessment';
export const MILITARY_REPORT_HEADER = 'Military Readiness Report';
export const FAITH_REPORT_HEADER = 'Faith & Cultural Affairs Report';
export const DIPLOMACY_REPORT_HEADER = 'Diplomatic Relations Report';
export const KNOWLEDGE_REPORT_HEADER = 'Knowledge & Research Report';

// ============================================================
// Dynamic Line Templates
// ============================================================

export const TREASURY_BALANCE_LINE: ReportTemplate<{
  balance: number;
  netFlow: number;
}> = ({ balance, netFlow }) => {
  const trend = netFlow >= 0 ? `surplus of ${netFlow}` : `deficit of ${Math.abs(netFlow)}`;
  return `The royal treasury holds ${balance} coin, with a projected ${trend} per month.`;
};

export const FOOD_RESERVES_LINE: ReportTemplate<{
  reserves: number;
  netFlow: number;
  seasonalModifier: number;
}> = ({ reserves, netFlow, seasonalModifier }) => {
  const trend = netFlow >= 0 ? 'accumulating' : 'depleting';
  const seasonNote =
    seasonalModifier < 0.8
      ? ' Seasonal conditions are unfavorable for production.'
      : seasonalModifier > 1.1
        ? ' Seasonal conditions favor abundant harvests.'
        : '';
  return `Food reserves stand at ${reserves} units, currently ${trend} at ${Math.abs(netFlow)} per month.${seasonNote}`;
};

export const CLASS_SATISFACTION_LINE: ReportTemplate<{
  populationClass: PopulationClass;
  satisfaction: number;
  delta: number;
}> = ({ populationClass, satisfaction, delta }) => {
  const label = CLASS_LABELS[populationClass];
  const direction = delta > 0 ? 'rising' : delta < 0 ? 'declining' : 'stable';
  return `${label} sentiment stands at ${satisfaction}, ${direction} (${delta >= 0 ? '+' : ''}${delta} this month).`;
};

export const MILITARY_READINESS_LINE: ReportTemplate<{
  readiness: number;
  forceSize: number;
  morale: number;
}> = ({ readiness, forceSize, morale }) =>
  `Military readiness is at ${readiness}. The realm fields ${forceSize} soldiers with morale at ${morale}.`;

export const NEIGHBOR_POSTURE_LINE: ReportTemplate<{
  neighborName: string;
  posture: string;
  relationshipScore: number;
}> = ({ neighborName, posture, relationshipScore }) =>
  `Relations with ${neighborName}: ${posture} (standing: ${relationshipScore}).`;

export const MILESTONE_UNLOCK_NOTICE: ReportTemplate<{
  branchName: string;
  milestoneIndex: number;
}> = ({ branchName, milestoneIndex }) =>
  `A milestone has been reached in ${branchName} — advancement tier ${milestoneIndex + 1} is now accessible.`;

// ============================================================
// Warning & Status Messages
// ============================================================

export const TREASURY_INSOLVENT_WARNING =
  'The treasury is insolvent. Without immediate intervention, the crown risks financial collapse.';

export const TREASURY_LOW_WARNING =
  'Treasury reserves are critically low. Continued expenditure at this rate is unsustainable.';

export const FOOD_FAMINE_WARNING =
  'Food reserves are exhausted. The population faces starvation. Immediate action is required.';

export const FOOD_LOW_WARNING =
  'Food reserves are dangerously low. Without increased production or reduced consumption, famine is imminent.';

export const STABILITY_CRITICAL_WARNING =
  'Kingdom stability has reached critical levels. Civil unrest threatens the foundations of governance.';

export const STABILITY_LOW_WARNING =
  'Stability is declining. Social tensions are rising across multiple classes and regions.';

export const SCHISM_ACTIVE_WARNING =
  'A schism divides the faithful. The religious unity of the realm is fractured, and the clergy is in turmoil.';

export const MILITARY_READINESS_LOW_WARNING =
  'Military readiness has fallen below operational thresholds. The realm is vulnerable to external aggression.';

// ============================================================
// Decree UI Label Strings
// ============================================================

export const DECREE_EFFECT_LABEL = 'Projected Effects';
export const DECREE_AFFECTED_CLASSES_LABEL = 'Affected Classes';
export const DECREE_SLOT_COST_LABEL = 'Action Cost';
export const DECREE_PREREQUISITES_LABEL = 'Prerequisites';

// ============================================================
// Turn Summary Section Headers
// ============================================================

export const TURN_SUMMARY_HEADER = 'Monthly Summary';
export const TURN_SUMMARY_CRITICAL_SECTION = 'Critical Matters';
export const TURN_SUMMARY_NOTABLE_SECTION = 'Notable Developments';
export const TURN_SUMMARY_ROUTINE_SECTION = 'Routine Proceedings';

// ============================================================
// Failure Condition Reports
// ============================================================

export const FAILURE_CONDITION_REPORTS: Record<FailureCondition, string> = {
  [FailureCondition.Famine]:
    'Prolonged famine has devastated the population. Starvation, disease, and despair have consumed the realm. The crown has failed in its most fundamental obligation — to feed its people.',
  [FailureCondition.Insolvency]:
    'The royal treasury has been exhausted beyond recovery. Creditors refuse further loans, soldiers go unpaid, and the apparatus of governance grinds to a halt. The crown is bankrupt in every sense.',
  [FailureCondition.Collapse]:
    'Civil order has disintegrated entirely. Without stability, the institutions of the realm can no longer function. The kingdom fractures into lawlessness and competing claims.',
  [FailureCondition.Conquest]:
    'A foreign power has overwhelmed the kingdom\'s defenses. All regions have fallen under occupation. The crown exists now only in memory and exile.',
  [FailureCondition.Overthrow]:
    'The nobility has lost all confidence in the crown. Through intrigue, alliance, and decisive action, a faction within the court has seized power. The reign has ended — not with invasion, but with betrayal.',
};
