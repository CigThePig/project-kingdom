// Phase 6 — Right Panel Context: per-screen contextual state for the right panel.
// Blueprint Reference: ui-blueprint.md §5

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import type { KnowledgeBranch, PopulationClass } from '../../engine/types';

// ============================================================
// Types
// ============================================================

export interface RightPanelData {
  /** Which screen is currently active — drives which context section renders. */
  screen: string;
  /** Selected decree ID on the Decrees screen. */
  selectedDecreeId?: string;
  /** Selected class on the Society screen. */
  selectedClassId?: PopulationClass;
  /** Selected intelligence operation ID on the Intelligence screen. */
  selectedOperationId?: string;
  /** Selected knowledge branch on the Knowledge screen. */
  selectedBranchId?: KnowledgeBranch;
  /** Selected event ID on the Events screen. */
  selectedEventId?: string;
}

interface RightPanelContextValue {
  data: RightPanelData;
  update: (partial: Partial<RightPanelData>) => void;
}

// ============================================================
// Context
// ============================================================

const RightPanelContext = createContext<RightPanelContextValue | null>(null);

// ============================================================
// Provider
// ============================================================

export function RightPanelProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<RightPanelData>({ screen: 'dashboard' });

  const update = useCallback((partial: Partial<RightPanelData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  }, []);

  return (
    <RightPanelContext.Provider value={{ data, update }}>
      {children}
    </RightPanelContext.Provider>
  );
}

// ============================================================
// Hook
// ============================================================

export function useRightPanel(): RightPanelContextValue {
  const ctx = useContext(RightPanelContext);
  if (!ctx) {
    throw new Error('useRightPanel must be used within a RightPanelProvider');
  }
  return ctx;
}
