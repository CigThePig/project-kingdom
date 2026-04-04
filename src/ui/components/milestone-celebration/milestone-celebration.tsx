// Phase 8E — Milestone Celebration
// Visual burst on knowledge milestone unlock (expanding ring + glow + text).
// Blueprint Reference: ux-blueprint.md §8 (Feedback Patterns)

import { useEffect, useState, useRef } from 'react';

import { Icon } from '../icon/icon';
import styles from './milestone-celebration.module.css';

interface MilestoneCelebrationProps {
  /** The milestone title to display. Setting a new non-empty value triggers the celebration. */
  milestoneName: string | null;
  /** Called after the celebration animation completes. */
  onComplete?: () => void;
}

export function MilestoneCelebration({ milestoneName, onComplete }: MilestoneCelebrationProps) {
  const [active, setActive] = useState(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevNameRef = useRef(milestoneName);

  useEffect(() => {
    if (milestoneName && milestoneName !== prevNameRef.current) {
      prevNameRef.current = milestoneName;
      setDisplayName(milestoneName);
      setActive(true);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setActive(false);
        onComplete?.();
      }, 2500);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [milestoneName, onComplete]);

  if (!active || !displayName) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.ring} />
      <div className={styles.content}>
        <Icon name="knowledge" size="2.5rem" />
        <p className={styles.label}>Milestone Unlocked</p>
        <h3 className={styles.name}>{displayName}</h3>
      </div>
    </div>
  );
}
