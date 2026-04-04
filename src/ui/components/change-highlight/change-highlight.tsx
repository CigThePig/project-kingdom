// Phase 8E — Change Highlight Wrapper
// Briefly highlights a value when it changes between turns (flash + directional arrow).
// Blueprint Reference: ux-blueprint.md §8 (Feedback Patterns)

import { useEffect, useRef, useState } from 'react';

import { Icon } from '../icon/icon';
import styles from './change-highlight.module.css';

interface ChangeHighlightProps {
  value: number;
  children: React.ReactNode;
  /** Whether to show the directional arrow icon. Defaults to true. */
  showArrow?: boolean;
}

export function ChangeHighlight({ value, children, showArrow = true }: ChangeHighlightProps) {
  const prevValueRef = useRef(value);
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const prev = prevValueRef.current;
    prevValueRef.current = value;

    if (prev === value) return;

    const direction = value > prev ? 'up' : 'down';
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFlash(direction);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setFlash(null);
    }, 1500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value]);

  return (
    <span
      className={`${styles.wrapper}${flash ? ` ${styles[flash]}` : ''}`}
      data-flash={flash ?? undefined}
    >
      {children}
      {flash && showArrow && (
        <span className={styles.arrow}>
          <Icon
            name={flash === 'up' ? 'trend-up' : 'trend-down'}
            size="0.75em"
          />
        </span>
      )}
    </span>
  );
}
