// Phase 9 — Forecast Module: consequence preview with directional projections.
// Blueprint Reference: ui-blueprint.md §6.12

import styles from './forecast-module.module.css';

// ============================================================
// Props
// ============================================================

export interface ForecastProjection {
  turnOffset: number; // 1, 2, or 3
  direction: 'rising' | 'falling' | 'stable';
  confidence: number; // 0–100
}

interface ForecastModuleProps {
  title: string;
  projections: ForecastProjection[];
  summary: string;
}

// ============================================================
// Direction style map
// ============================================================

const DIRECTION_STYLE_MAP: Record<ForecastProjection['direction'], string> = {
  rising: 'directionRising',
  falling: 'directionFalling',
  stable: 'directionStable',
};

const DIRECTION_ARROWS: Record<ForecastProjection['direction'], string> = {
  rising: '\u25B2',   // ▲
  falling: '\u25BC',  // ▼
  stable: '\u2015',   // ―
};

// ============================================================
// Private sub-components
// ============================================================

function ProjectionBar({ projection }: { projection: ForecastProjection }) {
  const styleKey = DIRECTION_STYLE_MAP[projection.direction] as keyof typeof styles;
  const confidenceOpacity = 0.3 + (projection.confidence / 100) * 0.7;

  return (
    <div className={styles.projectionRow}>
      <span className={styles.turnLabel}>+{projection.turnOffset}</span>
      <div className={styles.barTrack}>
        <div
          className={styles.barFill + ' ' + styles[styleKey]}
          style={{ opacity: confidenceOpacity }}
          aria-label={`${projection.direction}, ${projection.confidence}% confidence`}
        />
      </div>
      <span className={styles.directionArrow + ' ' + styles[styleKey]}>
        {DIRECTION_ARROWS[projection.direction]}
      </span>
    </div>
  );
}

// ============================================================
// Forecast Module
// ============================================================

export function ForecastModule({ title, projections, summary }: ForecastModuleProps) {
  return (
    <div className={styles.module}>
      <h4 className={styles.title}>{title}</h4>

      <div className={styles.projections}>
        {projections.map((proj) => (
          <ProjectionBar key={proj.turnOffset} projection={proj} />
        ))}
      </div>

      <p className={styles.summary}>{summary}</p>
    </div>
  );
}
