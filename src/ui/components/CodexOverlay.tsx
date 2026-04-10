// Codex Overlay — full-screen overlay with 4 tabbed sections.
// Entry: slide up from bottom, 350ms. Exit: slide down, 300ms.
// Dismiss: X button or swipe down gesture.

import { useState, useRef, useEffect, useCallback } from 'react';

import type { CodexDomain, RivalDossier, ActiveSituation, ChronicleEntry, CodexSection } from '../types';
import { KingdomStateCards } from './codex/KingdomStateCards';
import { RivalDossierCards } from './codex/RivalDossierCards';
import { ActiveSituationsCards } from './codex/ActiveSituationsCards';
import { ReignChronicleCards } from './codex/ReignChronicleCards';

// ============================================================
// Tab definitions
// ============================================================

interface TabDef {
  id: CodexSection;
  label: string;
  color: string;
}

const TABS: TabDef[] = [
  { id: 'kingdom', label: 'Kingdom', color: 'var(--color-warning)' },
  { id: 'rivals', label: 'Rivals', color: 'var(--color-accent-advisor)' },
  { id: 'situations', label: 'Situations', color: 'var(--color-negative)' },
  { id: 'chronicle', label: 'Chronicle', color: 'var(--color-accent-response)' },
];

// ============================================================
// Component
// ============================================================

interface CodexOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  kingdomState: CodexDomain[];
  rivals: RivalDossier[];
  situations: ActiveSituation[];
  chronicle: ChronicleEntry[];
  initialSection?: CodexSection;
}

export function CodexOverlay({
  isOpen,
  onClose,
  kingdomState,
  rivals,
  situations,
  chronicle,
  initialSection,
}: CodexOverlayProps) {
  const [activeTab, setActiveTab] = useState<CodexSection>(initialSection ?? 'kingdom');
  const [isExiting, setIsExiting] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);

  // Reset tab when opening with a specific section
  useEffect(() => {
    if (isOpen && initialSection) {
      setActiveTab(initialSection);
    }
  }, [isOpen, initialSection]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;
    const overlay = overlayRef.current;
    if (!overlay) return;

    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusable = overlay.querySelectorAll<HTMLElement>(focusableSelector);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function handleTab(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;
      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        handleClose();
      }
    }

    document.addEventListener('keydown', handleTab);
    document.addEventListener('keydown', handleEscape);
    first?.focus();

    return () => {
      document.removeEventListener('keydown', handleTab);
      document.removeEventListener('keydown', handleEscape);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsExiting(false);
      onClose();
    }, 300);
  }, [onClose]);

  // Swipe down to dismiss
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartY.current === null) return;
      const delta = e.changedTouches[0].clientY - touchStartY.current;
      touchStartY.current = null;
      if (delta > 80) {
        handleClose();
      }
    },
    [handleClose],
  );

  if (!isOpen && !isExiting) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Kingdom Codex"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(var(--color-bg-primary-rgb, 20, 18, 15), 0.97)',
        display: 'flex',
        flexDirection: 'column',
        animation: isExiting
          ? 'codexSlideDown 300ms ease forwards'
          : 'codexSlideUp 350ms ease both',
      }}
    >
      {/* Header: close button + tabs */}
      <div
        style={{
          padding: '12px 16px 0',
          flexShrink: 0,
        }}
      >
        {/* Close button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span
            style={{
              fontFamily: 'var(--font-family-mono)',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 2,
              textTransform: 'uppercase',
              color: 'var(--color-text-secondary)',
            }}
          >
            CODEX
          </span>
          <button
            onClick={handleClose}
            aria-label="Close Codex"
            style={{
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              color: 'var(--color-text-secondary)',
              fontSize: 20,
              cursor: 'pointer',
              borderRadius: 8,
              transition: 'color 150ms ease',
            }}
          >
            &#x2715;
          </button>
        </div>

        {/* Tab pills */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            paddingBottom: 12,
            borderBottom: '1px solid var(--color-border-default)',
          }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '8px 4px',
                  fontFamily: 'var(--font-family-mono)',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  border: `1px solid ${isActive ? tab.color : 'var(--color-border-default)'}`,
                  borderRadius: 8,
                  background: isActive ? `${tab.color}22` : 'transparent',
                  color: isActive ? tab.color : 'var(--color-text-disabled)',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  minHeight: 44,
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 16px 24px',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {activeTab === 'kingdom' && <KingdomStateCards domains={kingdomState} />}
        {activeTab === 'rivals' && <RivalDossierCards rivals={rivals} />}
        {activeTab === 'situations' && <ActiveSituationsCards situations={situations} />}
        {activeTab === 'chronicle' && <ReignChronicleCards entries={chronicle} />}
      </div>

      {/* CSS keyframe animations */}
      <style>{`
        @keyframes codexSlideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes codexSlideDown {
          from { transform: translateY(0); }
          to { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
}
