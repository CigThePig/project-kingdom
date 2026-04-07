import { useRef, useCallback } from 'react';

interface UseSwipeOptions {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  enabled?: boolean;
}

interface TouchTracking {
  startX: number;
  startTime: number;
  currentX: number;
  isDragging: boolean;
}

const COMMIT_FRACTION = 0.35;
const COMMIT_VELOCITY = 500; // px/s
const TRANSITION_MS = 350;
const EXIT_ROTATION = 20; // degrees

export function useSwipe({ onSwipeLeft, onSwipeRight, enabled = true }: UseSwipeOptions) {
  const ref = useRef<HTMLDivElement>(null);
  const tracking = useRef<TouchTracking>({
    startX: 0,
    startTime: 0,
    currentX: 0,
    isDragging: false,
  });
  const applyTransform = useCallback((dx: number) => {
    const el = ref.current;
    if (!el) return;
    const rotation = dx * 0.04;
    const opacity = Math.max(0.4, 1 - Math.abs(dx) / 400);
    el.style.transform = `translateX(${dx}px) rotate(${rotation}deg)`;
    el.style.opacity = String(opacity);
  }, []);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!enabled || !ref.current) return;
      const touch = e.touches[0];
      tracking.current = {
        startX: touch.clientX,
        startTime: Date.now(),
        currentX: touch.clientX,
        isDragging: true,
      };
      ref.current.style.transition = 'none';
    },
    [enabled],
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!tracking.current.isDragging || !ref.current) return;
      const touch = e.touches[0];
      tracking.current.currentX = touch.clientX;
      const dx = touch.clientX - tracking.current.startX;
      applyTransform(dx);
    },
    [applyTransform],
  );

  const onTouchEnd = useCallback(() => {
    const el = ref.current;
    if (!tracking.current.isDragging || !el) return;

    const t = tracking.current;
    const dx = t.currentX - t.startX;
    const elapsed = (Date.now() - t.startTime) / 1000; // seconds
    const velocity = elapsed > 0 ? Math.abs(dx) / elapsed : 0;
    const screenWidth = window.innerWidth;
    const committed =
      Math.abs(dx) > screenWidth * COMMIT_FRACTION || velocity > COMMIT_VELOCITY;

    tracking.current.isDragging = false;
    el.style.transition = `transform ${TRANSITION_MS}ms ease, opacity ${TRANSITION_MS}ms ease`;

    if (committed) {
      const direction = dx > 0 ? 1 : -1;
      el.style.transform = `translateX(${direction * screenWidth}px) rotate(${direction * EXIT_ROTATION}deg)`;
      el.style.opacity = '0';
      setTimeout(() => {
        if (direction > 0) onSwipeRight();
        else onSwipeLeft();
      }, TRANSITION_MS);
    } else {
      // Spring back
      el.style.transform = 'translateX(0) rotate(0deg)';
      el.style.opacity = '1';
    }
  }, [onSwipeLeft, onSwipeRight]);

  return {
    ref,
    handlers: { onTouchStart, onTouchMove, onTouchEnd },
  };
}
