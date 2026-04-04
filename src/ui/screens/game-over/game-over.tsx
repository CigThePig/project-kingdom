// Phase 4 — Game Over Screen: failure state display with assessment and restart options.
// Blueprint Reference: gameplay-blueprint.md §10.4; ux-blueprint.md §1.6

import type { FailureCondition } from '../../../engine/types';
import { useKingdomState } from '../../hooks/use-game-state';
import {
  FAILURE_CONDITION_LABELS,
  GAME_OVER_TITLE,
  GAME_OVER_NEW_GAME_LABEL,
  GAME_OVER_LOAD_SAVE_LABEL,
  GAME_OVER_ASSESSMENT_TITLE,
  GAME_OVER_TURNS_LABEL,
  GAME_OVER_TREASURY_LABEL,
  GAME_OVER_FOOD_LABEL,
  GAME_OVER_STABILITY_LABEL,
  GAME_OVER_POPULATION_LABEL,
} from '../../../data/text/labels';
import { FAILURE_CONDITION_REPORTS } from '../../../data/text/reports';
import styles from './game-over.module.css';

// ============================================================
// Props
// ============================================================

interface GameOverProps {
  conditions: FailureCondition[];
  onNewGame: () => void;
  onLoadSave: () => void;
}

// ============================================================
// Component
// ============================================================

export function GameOver({ conditions, onNewGame, onLoadSave }: GameOverProps) {
  const kingdom = useKingdomState();

  const primaryCondition = conditions[0];
  const failureLabel = FAILURE_CONDITION_LABELS[primaryCondition];
  const failureReport = FAILURE_CONDITION_REPORTS[primaryCondition];

  const totalPopulation = Object.values(kingdom.population).reduce(
    (sum, cls) => sum + cls.population,
    0,
  );

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <h1 className={styles.title}>{GAME_OVER_TITLE}</h1>
          <h2 className={styles.subtitle}>{failureLabel}</h2>
        </div>

        <hr className={styles.divider} />

        <p className={styles.report}>{failureReport}</p>

        <div className={styles.assessment}>
          <h3 className={styles.assessmentTitle}>{GAME_OVER_ASSESSMENT_TITLE}</h3>
          <div className={styles.assessmentGrid}>
            <div className={styles.assessmentItem}>
              <span className={styles.assessmentLabel}>{GAME_OVER_TURNS_LABEL}</span>
              <span className={styles.assessmentValue}>{kingdom.turn.turnNumber}</span>
            </div>
            <div className={styles.assessmentItem}>
              <span className={styles.assessmentLabel}>{GAME_OVER_TREASURY_LABEL}</span>
              <span className={styles.assessmentValue}>{kingdom.treasury.balance}</span>
            </div>
            <div className={styles.assessmentItem}>
              <span className={styles.assessmentLabel}>{GAME_OVER_FOOD_LABEL}</span>
              <span className={styles.assessmentValue}>{kingdom.food.reserves}</span>
            </div>
            <div className={styles.assessmentItem}>
              <span className={styles.assessmentLabel}>{GAME_OVER_STABILITY_LABEL}</span>
              <span className={styles.assessmentValue}>{kingdom.stability.value}</span>
            </div>
            <div className={styles.assessmentItem}>
              <span className={styles.assessmentLabel}>{GAME_OVER_POPULATION_LABEL}</span>
              <span className={styles.assessmentValue}>{totalPopulation}</span>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.buttonPrimary} onClick={onLoadSave}>
            {GAME_OVER_LOAD_SAVE_LABEL}
          </button>
          <button className={styles.buttonSecondary} onClick={onNewGame}>
            {GAME_OVER_NEW_GAME_LABEL}
          </button>
        </div>
      </div>
    </div>
  );
}
