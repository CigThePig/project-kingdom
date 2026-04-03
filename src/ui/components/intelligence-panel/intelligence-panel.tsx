// Phase 8 — Intelligence Panel: right contextual panel (desktop) / slide-up sheet (mobile).
// Blueprint Reference: ui-blueprint.md §3.1, §3.3, §3.4

import { useIntelligenceReports } from '../../hooks/use-game-state';
import styles from './intelligence-panel.module.css';

// ============================================================
// Props
// ============================================================

interface IntelligencePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// ============================================================
// Intelligence Panel
// ============================================================

export function IntelligencePanel({ isOpen, onClose }: IntelligencePanelProps) {
  const reports = useIntelligenceReports();

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
          <h2 className={styles.panelTitle}>Intelligence</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close intelligence panel"
          >
            &times;
          </button>
        </header>

        <div className={styles.reportList}>
          {reports.length === 0 ? (
            <p className={styles.emptyState}>
              No intelligence reports available. Fund intelligence operations to
              begin receiving field reports.
            </p>
          ) : (
            reports.map((report) => (
              <article key={report.id} className={styles.reportCard}>
                <p className={styles.reportFindings}>{report.findings}</p>
                <span className={styles.reportConfidence}>
                  Confidence: {report.confidenceLevel}%
                </span>
              </article>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
