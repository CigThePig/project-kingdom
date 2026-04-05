// Bottom Sheet — slide-up panel replacing centered modals on mobile.
// On desktop (>1023px), renders as a centered card for graceful degradation.
// Supports swipe-to-dismiss via native touch events.

import { useRef, useCallback, useEffect } from 'react';

import styles from './bottom-sheet.module.css';

// ============================================================
// Props
// ============================================================

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

// ============================================================
// Constants
// ============================================================

const DISMISS_THRESHOLD = 100;

// ============================================================
// Bottom Sheet
// ============================================================

export function BottomSheet({ isOpen, onClose, children, title }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const currentTranslateY = useRef(0);
  const isDragging = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartY.current = touch.clientY;
    currentTranslateY.current = 0;
    isDragging.current = true;

    if (sheetRef.current) {
      sheetRef.current.style.transition = 'none';
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;

    const touch = e.touches[0];
    const delta = touch.clientY - touchStartY.current;

    // Only allow dragging downward
    if (delta > 0) {
      currentTranslateY.current = delta;
      if (sheetRef.current) {
        sheetRef.current.style.transform = `translateY(${delta}px)`;
      }
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;

    if (sheetRef.current) {
      sheetRef.current.style.transition = '';
    }

    if (currentTranslateY.current > DISMISS_THRESHOLD) {
      onClose();
    } else if (sheetRef.current) {
      sheetRef.current.style.transform = '';
    }

    currentTranslateY.current = 0;
  }, [onClose]);

  // Reset transform when opening
  useEffect(() => {
    if (isOpen && sheetRef.current) {
      sheetRef.current.style.transform = '';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div
        ref={sheetRef}
        className={styles.sheet}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.dragHandle}>
          <span className={styles.dragBar} />
        </div>

        {title && <h2 className={styles.title}>{title}</h2>}

        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}
