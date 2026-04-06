// Phase 6 — Context-Aware Right Panel (formerly Intelligence Panel).
// Renders per-screen contextual content.
// Blueprint Reference: ui-blueprint.md §5; ux-blueprint.md §6

import {
  PopulationClass,
  StorylineStatus,
} from '../../../engine/types';
import type { ForecastProjection } from '../forecast-module/forecast-module';
import {
  useKingdomState,
  useIntelligenceReports,
  useLastTurnResult,
  useTurnHistory,
} from '../../hooks/use-game-state';
import { useRightPanel } from '../../context/right-panel-context';
import { ForecastModule } from '../forecast-module/forecast-module';
import { ConsequencePreview } from '../consequence-preview/consequence-preview';
import { DECREE_POOL } from '../../../data/decrees/index';
import { DECREE_EFFECTS } from '../../../data/decrees/effects';
import { getDecreeAvailability, getChainDecrees } from '../../../engine/systems/decree-progression';
import { EVENT_TEXT, STORYLINE_TEXT } from '../../../data/text/events';
import { EVENT_CHOICE_EFFECTS } from '../../../data/events/effects';
import {
  CLASS_LABELS,
  KNOWLEDGE_BRANCH_LABELS,
  FAILURE_WARNING_MESSAGES,
  INTELLIGENCE_OP_LABELS,
  INTELLIGENCE_OP_DESCRIPTIONS,
  INTELLIGENCE_OP_RISK_LABELS,
  DECREE_CHAIN_LABELS,
  DECREE_ENACTED_LABEL,
} from '../../../data/text/labels';
import {
  CLASS_SATISFACTION_FACTORS,
  CLASS_RISK_DESCRIPTIONS,
  KNOWLEDGE_BRANCH_DESCRIPTIONS,
  RIGHT_PANEL_FORECAST_HEADER,
  RIGHT_PANEL_RISK_HEADER,
  RIGHT_PANEL_STORYLINE_HEADER,
  RIGHT_PANEL_CONSEQUENCE_HEADER,
  RIGHT_PANEL_SATISFACTION_HEADER,
  RIGHT_PANEL_RISK_ASSESSMENT_HEADER,
  RIGHT_PANEL_ADVANCEMENT_HEADER,
  RIGHT_PANEL_EVENT_CONTEXT_HEADER,
} from '../../../data/text/reports';
import styles from './intelligence-panel.module.css';

// ============================================================
// Props
// ============================================================

interface IntelligencePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// ============================================================
// Helpers
// ============================================================

function computeDirection(netFlow: number): ForecastProjection['direction'] {
  if (netFlow > 0) return 'rising';
  if (netFlow < 0) return 'falling';
  return 'stable';
}

function getSatisfactionRiskKey(satisfaction: number): string {
  if (satisfaction < 20) return 'critical';
  if (satisfaction < 35) return 'restless';
  if (satisfaction < 50) return 'uneasy';
  return 'content';
}

// ============================================================
// Context Renderers
// ============================================================

function DashboardContext() {
  const kingdom = useKingdomState();
  const lastResult = useLastTurnResult();

  const treasuryForecast: ForecastProjection[] = [
    { turnOffset: 1, direction: computeDirection(kingdom.treasury.netFlowPerTurn), confidence: 70 },
    { turnOffset: 2, direction: computeDirection(kingdom.treasury.netFlowPerTurn), confidence: 50 },
    { turnOffset: 3, direction: computeDirection(kingdom.treasury.netFlowPerTurn), confidence: 30 },
  ];

  const foodForecast: ForecastProjection[] = [
    { turnOffset: 1, direction: computeDirection(kingdom.food.netFlowPerTurn), confidence: 65 },
    { turnOffset: 2, direction: computeDirection(kingdom.food.netFlowPerTurn), confidence: 45 },
    { turnOffset: 3, direction: computeDirection(kingdom.food.netFlowPerTurn), confidence: 25 },
  ];

  const failureWarnings = lastResult?.failureWarnings ?? [];
  const activeStorylines = kingdom.activeStorylines.filter(
    (s) => s.status === StorylineStatus.Active,
  );

  // Risk factors: low satisfaction classes + failure warnings
  const riskFactors: string[] = [];
  for (const cls of Object.values(PopulationClass)) {
    if (kingdom.population[cls].satisfaction < 35) {
      riskFactors.push(`${CLASS_LABELS[cls]} sentiment is low (${kingdom.population[cls].satisfaction}).`);
    }
  }
  for (const fw of failureWarnings) {
    riskFactors.push(FAILURE_WARNING_MESSAGES[fw.condition][fw.severity]);
  }

  return (
    <>
      <section className={styles.contextSection}>
        <h3 className={styles.contextSectionTitle}>{RIGHT_PANEL_FORECAST_HEADER}</h3>
        <ForecastModule
          title="Treasury"
          projections={treasuryForecast}
          summary={kingdom.treasury.netFlowPerTurn >= 0 ? 'Surplus.' : 'Deficit.'}
        />
        <ForecastModule
          title="Food"
          projections={foodForecast}
          summary={kingdom.food.netFlowPerTurn >= 0 ? 'Accumulating.' : 'Depleting.'}
        />
      </section>

      {riskFactors.length > 0 && (
        <section className={styles.contextSection}>
          <h3 className={styles.contextSectionTitle}>{RIGHT_PANEL_RISK_HEADER}</h3>
          {riskFactors.slice(0, 3).map((rf, i) => (
            <p key={i} className={styles.riskItem}>{rf}</p>
          ))}
        </section>
      )}

      {activeStorylines.length > 0 && (
        <section className={styles.contextSection}>
          <h3 className={styles.contextSectionTitle}>{RIGHT_PANEL_STORYLINE_HEADER}</h3>
          {activeStorylines.map((s) => {
            const text = STORYLINE_TEXT[s.definitionId];
            return (
              <div key={s.id} className={styles.storylineItem}>
                <span className={styles.storylineItemTitle}>{text?.title ?? s.definitionId}</span>
                <span className={styles.storylineItemNote}>{text?.statusNote ?? ''}</span>
              </div>
            );
          })}
        </section>
      )}
    </>
  );
}

function DecreesContext() {
  const { data } = useRightPanel();
  const kingdom = useKingdomState();
  const selectedId = data.selectedDecreeId;

  if (!selectedId) {
    return <p className={styles.emptyState}>Select a decree to view its projected impact.</p>;
  }

  const decree = DECREE_POOL.find((d) => d.id === selectedId);
  if (!decree) return null;

  const effects = DECREE_EFFECTS[selectedId];
  const progression = getDecreeAvailability(decree, kingdom.issuedDecrees, kingdom.turn.turnNumber);
  const chainDecrees = decree.chainId ? getChainDecrees(decree.chainId) : [];

  return (
    <section className={styles.contextSection}>
      <h3 className={styles.contextSectionTitle}>{RIGHT_PANEL_CONSEQUENCE_HEADER}</h3>
      <p className={styles.contextItemTitle}>{decree.title}</p>
      {progression.status === 'enacted' && (
        <span className={styles.classChip}>{DECREE_ENACTED_LABEL}</span>
      )}
      {progression.status === 'cooldown' && (
        <span className={styles.classChip}>{progression.reason}</span>
      )}
      <p className={styles.contextItemBody}>{decree.effectPreview}</p>
      {effects && <ConsequencePreview effects={effects} />}
      {decree.affectedClasses.length > 0 && (
        <div className={styles.chipRow}>
          {decree.affectedClasses.map((cls) => (
            <span key={cls} className={styles.classChip}>{CLASS_LABELS[cls]}</span>
          ))}
        </div>
      )}
      {decree.prerequisites.length > 0 && (
        <div className={styles.prerequisitesList}>
          <span className={styles.contextItemLabel}>Prerequisites:</span>
          {decree.prerequisites.map((p) => (
            <span key={p} className={styles.prerequisiteItem}>{p}</span>
          ))}
        </div>
      )}
      {/* Chain progression display */}
      {chainDecrees.length > 1 && (
        <div className={styles.prerequisitesList}>
          <span className={styles.contextItemLabel}>
            {decree.chainId ? (DECREE_CHAIN_LABELS[decree.chainId] ?? 'Progression') : 'Progression'}:
          </span>
          {chainDecrees.map((cd) => {
            const cdIssued = kingdom.issuedDecrees.some((d) => d.decreeId === cd.id);
            return (
              <span
                key={cd.id}
                className={styles.prerequisiteItem}
                style={{ opacity: cdIssued ? 0.5 : 1, textDecoration: cdIssued ? 'line-through' : 'none' }}
              >
                {cd.tier}. {cd.title}{cd.id === decree.id ? ' (current)' : ''}
              </span>
            );
          })}
        </div>
      )}
    </section>
  );
}

function SocietyContext() {
  const { data } = useRightPanel();
  const kingdom = useKingdomState();
  const history = useTurnHistory();
  const selectedClass = data.selectedClassId;

  if (!selectedClass) {
    return <p className={styles.emptyState}>Select a population class to view satisfaction details.</p>;
  }

  const classState = kingdom.population[selectedClass];
  const riskKey = getSatisfactionRiskKey(classState.satisfaction);

  // Historical trend from turn history (last 5 entries)
  const recentTurns = history.slice(-5);

  return (
    <section className={styles.contextSection}>
      <h3 className={styles.contextSectionTitle}>{RIGHT_PANEL_SATISFACTION_HEADER}</h3>
      <p className={styles.contextItemTitle}>{CLASS_LABELS[selectedClass]}</p>
      <p className={styles.contextItemBody}>
        Satisfaction: {classState.satisfaction} ({classState.satisfactionDeltaLastTurn >= 0 ? '+' : ''}{classState.satisfactionDeltaLastTurn} this turn)
      </p>
      <p className={styles.contextItemBody}>
        {CLASS_SATISFACTION_FACTORS[selectedClass]}
      </p>

      {recentTurns.length > 0 && (
        <div className={styles.trendRow}>
          <span className={styles.contextItemLabel}>Recent stability trend:</span>
          {recentTurns.map((entry) => (
            <span key={entry.turnNumber} className={styles.trendValue}>
              T{entry.turnNumber}: {entry.snapshotSummary.stabilityValue}
            </span>
          ))}
        </div>
      )}

      <div className={styles.riskAssessment}>
        <h4 className={styles.contextItemLabel}>{RIGHT_PANEL_RISK_ASSESSMENT_HEADER}</h4>
        <p className={styles.contextItemBody}>{CLASS_RISK_DESCRIPTIONS[riskKey]}</p>
      </div>
    </section>
  );
}

function IntelligenceContext() {
  const reports = useIntelligenceReports();

  if (reports.length === 0) {
    return (
      <p className={styles.emptyState}>
        No intelligence reports available. Fund intelligence operations to begin receiving field reports.
      </p>
    );
  }

  return (
    <section className={styles.contextSection}>
      <h3 className={styles.contextSectionTitle}>Intelligence Reports</h3>
      {reports.map((report) => (
        <article key={report.id} className={styles.reportCard}>
          <p className={styles.contextItemTitle}>
            {INTELLIGENCE_OP_LABELS[report.operationType]}
          </p>
          <p className={styles.reportFindings}>{report.findings}</p>
          <span className={styles.reportConfidence}>
            Confidence: {report.confidenceLevel}%
          </span>
          <p className={styles.contextItemBody}>
            {INTELLIGENCE_OP_DESCRIPTIONS[report.operationType]}
          </p>
          <p className={styles.riskItem}>
            Risk: {INTELLIGENCE_OP_RISK_LABELS[report.operationType]}
          </p>
        </article>
      ))}
    </section>
  );
}

function KnowledgeContext() {
  const { data } = useRightPanel();
  const kingdom = useKingdomState();
  const selectedBranch = data.selectedBranchId;

  if (!selectedBranch) {
    return <p className={styles.emptyState}>Select a knowledge branch to view advancement details.</p>;
  }

  const branchState = kingdom.knowledge.branches[selectedBranch];
  const progressPerTurn = kingdom.knowledge.progressPerTurn;

  // Estimate turns to next milestone (rough: milestones at every 100 progress points)
  const MILESTONE_THRESHOLD = 100;
  const progressToNext = MILESTONE_THRESHOLD - (branchState.progressValue % MILESTONE_THRESHOLD);
  const estimatedTurns = progressPerTurn > 0
    ? Math.ceil(progressToNext / progressPerTurn)
    : Infinity;

  return (
    <section className={styles.contextSection}>
      <h3 className={styles.contextSectionTitle}>{RIGHT_PANEL_ADVANCEMENT_HEADER}</h3>
      <p className={styles.contextItemTitle}>{KNOWLEDGE_BRANCH_LABELS[selectedBranch]}</p>
      <p className={styles.contextItemBody}>{KNOWLEDGE_BRANCH_DESCRIPTIONS[selectedBranch]}</p>
      <p className={styles.contextItemBody}>
        Progress: {branchState.progressValue} | Milestones unlocked: {branchState.currentMilestoneIndex}
      </p>
      <p className={styles.contextItemBody}>
        Research rate: {progressPerTurn} per turn
        {estimatedTurns !== Infinity && ` — estimated ${estimatedTurns} turn${estimatedTurns !== 1 ? 's' : ''} to next milestone`}
      </p>
      {branchState.unlockedAdvancements.length > 0 && (
        <div className={styles.chipRow}>
          {branchState.unlockedAdvancements.map((a) => (
            <span key={a} className={styles.classChip}>{a}</span>
          ))}
        </div>
      )}
    </section>
  );
}

function EventsContext() {
  const { data } = useRightPanel();
  const kingdom = useKingdomState();
  const selectedEventId = data.selectedEventId;

  if (!selectedEventId) {
    return <p className={styles.emptyState}>Select an event to view background context.</p>;
  }

  const event = kingdom.activeEvents.find((e) => e.id === selectedEventId);
  if (!event) return <p className={styles.emptyState}>Event not found.</p>;

  const textEntry = EVENT_TEXT[event.definitionId];
  const effects = EVENT_CHOICE_EFFECTS[event.definitionId];

  // Check if this event is part of a storyline
  const storyline = event.relatedStorylineId
    ? kingdom.activeStorylines.find((s) => s.id === event.relatedStorylineId)
    : null;
  const storylineText = storyline
    ? STORYLINE_TEXT[storyline.definitionId]
    : null;

  // Find related chain events
  const chainEvents = event.chainId
    ? kingdom.activeEvents.filter(
        (e) => e.chainId === event.chainId && e.id !== event.id,
      )
    : [];

  return (
    <section className={styles.contextSection}>
      <h3 className={styles.contextSectionTitle}>{RIGHT_PANEL_EVENT_CONTEXT_HEADER}</h3>
      {textEntry && (
        <>
          <p className={styles.contextItemTitle}>{textEntry.title}</p>
          <p className={styles.contextItemBody}>{textEntry.body}</p>
        </>
      )}

      {/* Consequence preview for each choice */}
      {effects && (
        <div className={styles.choiceEffectsSection}>
          {Object.entries(effects).map(([choiceId, delta]) => {
            const choiceLabel = textEntry?.choices[choiceId] ?? choiceId;
            return (
              <div key={choiceId} className={styles.choiceEffectItem}>
                <span className={styles.contextItemLabel}>{choiceLabel}:</span>
                <ConsequencePreview effects={delta} compact />
              </div>
            );
          })}
        </div>
      )}

      {/* Chain events */}
      {chainEvents.length > 0 && (
        <div className={styles.chainSection}>
          <span className={styles.contextItemLabel}>Related chain events:</span>
          {chainEvents.map((ce) => {
            const ceText = EVENT_TEXT[ce.definitionId];
            return (
              <span key={ce.id} className={styles.chainItem}>
                {ceText?.title ?? ce.definitionId} (Step {ce.chainStep})
                {ce.isResolved ? ' — Resolved' : ''}
              </span>
            );
          })}
        </div>
      )}

      {/* Storyline arc summary */}
      {storyline && storylineText && (
        <div className={styles.storylineArcSection}>
          <span className={styles.contextItemLabel}>Storyline: {storylineText.title}</span>
          <span className={styles.storylineItemNote}>{storylineText.statusNote}</span>
          {storyline.decisionHistory.length > 0 && (
            <span className={styles.contextItemBody}>
              Prior decisions: {storyline.decisionHistory.length} branch point{storyline.decisionHistory.length !== 1 ? 's' : ''} resolved.
            </span>
          )}
        </div>
      )}
    </section>
  );
}

// ============================================================
// Intelligence Panel (Context-Aware Right Panel)
// ============================================================

export function IntelligencePanel({ isOpen, onClose }: IntelligencePanelProps) {
  const { data } = useRightPanel();

  // Determine title based on active screen
  const PANEL_TITLES: Record<string, string> = {
    dashboard: 'Strategic Overview',
    decrees: 'Decree Detail',
    faith: 'Society Detail',
    espionage: 'Intelligence',
    knowledge: 'Knowledge Detail',
    events: 'Event Context',
  };

  const title = PANEL_TITLES[data.screen] ?? 'Intelligence';

  return (
    <>
      {isOpen && (
        <div
          className={styles.backdrop}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={styles.panel}
        style={{ gridArea: 'intel' }}
        data-open={isOpen}
      >
        <header className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>{title}</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close panel"
          >
            &times;
          </button>
        </header>

        <div className={styles.panelContent}>
          {data.screen === 'dashboard' && <DashboardContext />}
          {data.screen === 'decrees' && <DecreesContext />}
          {data.screen === 'faith' && <SocietyContext />}
          {data.screen === 'espionage' && <IntelligenceContext />}
          {data.screen === 'knowledge' && <KnowledgeContext />}
          {data.screen === 'events' && <EventsContext />}
          {!['dashboard', 'decrees', 'faith', 'espionage', 'knowledge', 'events'].includes(data.screen) && (
            <IntelligenceContext />
          )}
        </div>
      </aside>
    </>
  );
}
