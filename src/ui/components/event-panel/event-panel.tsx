// Phase 9 — Event Panel: event and storyline presentation.
// Blueprint Reference: ui-blueprint.md §6.2, §6.3, §8.7

import type { EventSeverity, EventCategory, MechanicalEffectDelta, PopulationClass } from '../../../engine/types';
import {
  EVENT_SEVERITY_LABELS,
  EVENT_CATEGORY_LABELS,
  CLASS_LABELS,
} from '../../../data/text/labels';
import { ConsequencePreview } from '../consequence-preview/consequence-preview';
import { Icon } from '../icon/icon';
import styles from './event-panel.module.css';

// ============================================================
// Props
// ============================================================

export interface EventPanelChoice {
  choiceId: string;
  label: string;
  slotCost: number;
  isFree: boolean;
  effects?: MechanicalEffectDelta;
}

interface EventPanelProps {
  eventId: string;
  title: string;
  body: string;
  severity: EventSeverity;
  category: EventCategory;
  choices: EventPanelChoice[];
  affectedClasses?: PopulationClass[];
  chainInfo?: { chainId: string; chainStep: number } | null;
  storylineInfo?: { storylineTitle: string; actNumber: number } | null;
  isResolved: boolean;
  choiceMade?: string | null;
  onChoiceSelect?: (eventId: string, choiceId: string) => void;
}

// ============================================================
// Internal helpers
// ============================================================

const SEVERITY_STYLE_MAP: Record<EventSeverity, string> = {
  Informational: 'severityNeutral',
  Notable: 'severityFaith',
  Serious: 'severityWarning',
  Critical: 'severityCritical',
};

const SEVERITY_ICON_MAP: Record<EventSeverity, string> = {
  Informational: 'events',
  Notable: 'flame',
  Serious: 'warning',
  Critical: 'critical',
};

// ============================================================
// Private sub-components
// ============================================================

function SeverityBadge({ severity }: { severity: EventSeverity }) {
  const styleKey = SEVERITY_STYLE_MAP[severity] as keyof typeof styles;
  return (
    <span className={styles.badge + ' ' + styles[styleKey]}>
      {EVENT_SEVERITY_LABELS[severity]}
    </span>
  );
}

function ChoiceButton({
  choice,
  eventId,
  isResolved,
  isSelected,
  onSelect,
}: {
  choice: EventPanelChoice;
  eventId: string;
  isResolved: boolean;
  isSelected: boolean;
  onSelect?: (eventId: string, choiceId: string) => void;
}) {
  return (
    <div className={styles.choiceWrapper}>
      <button
        className={
          styles.choiceButton +
          (isSelected ? ' ' + styles.choiceSelected : '') +
          (isResolved && !isSelected ? ' ' + styles.choiceDismissed : '')
        }
        disabled={isResolved}
        onClick={() => onSelect?.(eventId, choice.choiceId)}
        aria-label={`${choice.label}${choice.isFree ? ' (free action)' : ` (${choice.slotCost} action slot${choice.slotCost !== 1 ? 's' : ''})`}`}
      >
        <span className={styles.choiceLabel}>{choice.label}</span>
        {choice.isFree ? (
          <span className={styles.choiceCostFree}>Free</span>
        ) : (
          <span className={styles.choiceCost}>{choice.slotCost} slot{choice.slotCost !== 1 ? 's' : ''}</span>
        )}
      </button>
      {choice.effects && !isResolved && (
        <div className={styles.choiceEffects}>
          <ConsequencePreview effects={choice.effects} compact />
        </div>
      )}
    </div>
  );
}

// ============================================================
// Event Panel
// ============================================================

export function EventPanel({
  eventId,
  title,
  body,
  severity,
  category,
  choices,
  affectedClasses,
  chainInfo,
  storylineInfo,
  isResolved,
  choiceMade,
  onChoiceSelect,
}: EventPanelProps) {
  const isStoryline = storylineInfo != null;

  return (
    <article
      className={
        styles.panel +
        (isStoryline ? ' ' + styles.storyline : '') +
        (isResolved ? ' ' + styles.resolved : '')
      }
    >
      {/* Badge row */}
      <div className={styles.badgeRow}>
        <SeverityBadge severity={severity} />
        <Icon name={SEVERITY_ICON_MAP[severity]} size="1rem" />
        <span className={styles.badge + ' ' + styles.categoryBadge}>
          {EVENT_CATEGORY_LABELS[category]}
        </span>
      </div>

      {/* Storyline indicator */}
      {storylineInfo && (
        <div className={styles.storylineIndicator}>
          <Icon name="scroll" size="1rem" />
          <span className={styles.storylineTitle}>{storylineInfo.storylineTitle}</span>
          <span className={styles.storylineAct}>Act {storylineInfo.actNumber}</span>
        </div>
      )}

      {/* Chain indicator */}
      {chainInfo && (
        <span className={styles.chainIndicator}>
          Part {chainInfo.chainStep} of chain
        </span>
      )}

      {/* Title and body */}
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.body}>{body}</p>

      {/* Affected classes */}
      {affectedClasses && affectedClasses.length > 0 && (
        <div className={styles.classChips}>
          {affectedClasses.map((cls) => (
            <span key={cls} className={styles.classChip}>
              {CLASS_LABELS[cls]}
            </span>
          ))}
        </div>
      )}

      {/* Choice buttons */}
      {choices.length > 0 && (
        <div className={styles.choices}>
          {choices.map((choice) => (
            <ChoiceButton
              key={choice.choiceId}
              choice={choice}
              eventId={eventId}
              isResolved={isResolved}
              isSelected={choiceMade === choice.choiceId}
              onSelect={onChoiceSelect}
            />
          ))}
        </div>
      )}
    </article>
  );
}
