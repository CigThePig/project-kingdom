import {
  FailureCondition,
  FestivalInvestmentLevel,
  IntelligenceFundingLevel,
  MilitaryRecruitmentStance,
  PopulationClass,
  RationingLevel,
  ReligiousOrderType,
  ReligiousTolerance,
  TaxationLevel,
  TradeOpenness,
} from '../../engine/types';
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

// ============================================================
// Policy Effect Summaries
// ============================================================

export const TAXATION_EFFECT: Record<TaxationLevel, string> = {
  [TaxationLevel.Low]: 'Reduced tax revenue. Nobility and merchants are satisfied; treasury income falls.',
  [TaxationLevel.Moderate]: 'Standard taxation. Balanced revenue with tolerable burden on all classes.',
  [TaxationLevel.High]: 'Elevated tax revenue at the cost of satisfaction across taxable classes.',
  [TaxationLevel.Punitive]: 'Maximum extraction. Treasury surges but all classes suffer under the burden.',
};

export const TRADE_OPENNESS_EFFECT: Record<TradeOpenness, string> = {
  [TradeOpenness.Closed]: 'Borders sealed to commerce. Trade income collapses; merchants deeply dissatisfied.',
  [TradeOpenness.Restricted]: 'Limited trade permitted. Modest revenue with controlled foreign influence.',
  [TradeOpenness.Open]: 'Standard commerce. Healthy trade income and merchant satisfaction.',
  [TradeOpenness.Encouraged]: 'Actively promoted trade. Maximum merchant income with increased foreign exposure.',
};

export const RATIONING_EFFECT: Record<RationingLevel, string> = {
  [RationingLevel.Abundant]: 'Generous food distribution. Commoner satisfaction improves but reserves deplete faster.',
  [RationingLevel.Normal]: 'Standard provisions. Balanced consumption against available supply.',
  [RationingLevel.Rationed]: 'Restricted food access. Reserves last longer but commoner satisfaction declines.',
  [RationingLevel.Emergency]: 'Severe rationing. Minimal consumption preserves reserves at great cost to morale.',
};

export const TOLERANCE_EFFECT: Record<ReligiousTolerance, string> = {
  [ReligiousTolerance.Enforced]: 'Strict orthodoxy enforced. Clergy satisfied; heterodoxy suppressed. Dissent punished.',
  [ReligiousTolerance.Favored]: 'Tradition favored but alternatives tolerated. Clergy generally content.',
  [ReligiousTolerance.Tolerated]: 'Religious pluralism permitted. Clergy uneasy; heterodox movements find space.',
  [ReligiousTolerance.Suppressed]: 'Religious expression suppressed. Clergy deeply unhappy; faith level falls.',
};

export const FESTIVAL_EFFECT: Record<FestivalInvestmentLevel, string> = {
  [FestivalInvestmentLevel.None]: 'No festivals held. Faith suffers from absence of communal observance.',
  [FestivalInvestmentLevel.Modest]: 'Simple observances maintain baseline devotion at minimal cost.',
  [FestivalInvestmentLevel.Standard]: 'Regular celebrations strengthen faith and communal bonds.',
  [FestivalInvestmentLevel.Lavish]: 'Grand festivities greatly boost faith but strain the treasury.',
};

export const RECRUITMENT_EFFECT: Record<MilitaryRecruitmentStance, string> = {
  [MilitaryRecruitmentStance.Minimal]: 'Minimal enrollment. Military readiness declines but commoner labor is preserved.',
  [MilitaryRecruitmentStance.Voluntary]: 'Voluntary service. Balanced force size with acceptable labor impact.',
  [MilitaryRecruitmentStance.Conscript]: 'Forced conscription. Rapid force growth at significant cost to commoner satisfaction.',
  [MilitaryRecruitmentStance.WarFooting]: 'Total mobilization. Maximum military strength but devastating impact on labor and morale.',
};

export const INTELLIGENCE_FUNDING_EFFECT: Record<IntelligenceFundingLevel, string> = {
  [IntelligenceFundingLevel.None]: 'No intelligence funding. Espionage network atrophies; no covert operations possible.',
  [IntelligenceFundingLevel.Minimal]: 'Basic surveillance maintained. Limited operational capability.',
  [IntelligenceFundingLevel.Moderate]: 'Functional intelligence apparatus. Standard covert operations available.',
  [IntelligenceFundingLevel.Heavy]: 'Extensive intelligence network. Full operational capability at significant treasury cost.',
};

// ============================================================
// Society Screen — Class Descriptions
// ============================================================

export const CLASS_CONTRIBUTION_DESCRIPTIONS: Record<PopulationClass, string> = {
  [PopulationClass.Nobility]:
    'The nobility provides governance capacity, court intrigue management, and diplomatic connections. Their satisfaction directly influences stability through institutional loyalty.',
  [PopulationClass.Clergy]:
    'The clergy maintains faith institutions, supports cultural cohesion, and provides counsel. Their cooperation is essential for religious edicts and festival effectiveness.',
  [PopulationClass.Merchants]:
    'The merchant guild drives trade income, market efficiency, and economic growth. Their prosperity directly feeds the treasury through commerce taxes.',
  [PopulationClass.Commoners]:
    'The commonfolk provide the labor that sustains every system — agriculture, construction, and military conscription. Their satisfaction is the broadest contributor to stability.',
  [PopulationClass.MilitaryCaste]:
    'The military caste forms the professional core of the kingdom\'s defense. Their readiness, morale, and equipment determine the realm\'s ability to project force and deter aggression.',
};

export const CLASS_SATISFACTION_FACTORS: Record<PopulationClass, string> = {
  [PopulationClass.Nobility]:
    'Driven by taxation level on estates, perceived influence through stability, military readiness, and rivalry with ascending classes.',
  [PopulationClass.Clergy]:
    'Driven by religious tolerance policy, kingdom faith level, festival investment, and heterodoxy pressure.',
  [PopulationClass.Merchants]:
    'Driven by trade openness policy, taxation burden, and trade income trends.',
  [PopulationClass.Commoners]:
    'Driven by food reserves and rationing, taxation burden, military recruitment demands, and faith comfort.',
  [PopulationClass.MilitaryCaste]:
    'Driven by treasury balance for pay reliability, equipment condition, morale, and deployment posture.',
};

export const CLASS_RISK_DESCRIPTIONS: Record<string, string> = {
  critical:
    'Satisfaction has reached dangerous levels. Unrest events are highly likely. Immediate intervention required to prevent escalation.',
  restless:
    'Satisfaction is declining toward crisis. Pressure is building and unrest events become more probable.',
  uneasy:
    'Satisfaction is below comfortable levels. Continued neglect may push this class toward open discontent.',
  content:
    'Satisfaction is stable. No immediate risk from this class, though conditions may shift with policy changes.',
};

export const INTER_CLASS_DYNAMICS_SUMMARY =
  'Class interests frequently conflict. Policies that benefit one group often burden another. Taxation weighs on all but funds the state. Trade openness enriches merchants but may threaten noble influence. Military recruitment strengthens defense but drains commoner labor. Religious policy satisfies clergy but may alienate others.';

// ============================================================
// Society Screen — Faith & Culture Descriptions
// ============================================================

export const RELIGIOUS_ORDER_DESCRIPTIONS: Record<ReligiousOrderType, string> = {
  [ReligiousOrderType.Healing]:
    'Provides care to the sick and wounded. Improves commoner satisfaction and reduces attrition from disease.',
  [ReligiousOrderType.Scholarly]:
    'Preserves and advances knowledge. Contributes research progress and supports cultural scholarship.',
  [ReligiousOrderType.Martial]:
    'Warrior-monks who bolster military morale and readiness. Provides a faith-based combat bonus.',
  [ReligiousOrderType.Charitable]:
    'Distributes alms and provisions to the poor. Improves commoner satisfaction and strengthens faith among the populace.',
};

export const HETERODOXY_WARNING_TEXT =
  'Heterodox movements are gaining influence within the realm. If left unchecked, a religious schism may fracture the faithful.';

export const SCHISM_ACTIVE_TEXT =
  'A schism divides the faithful. The kingdom\'s religious unity has fractured, weakening clergy influence and faith stability.';
