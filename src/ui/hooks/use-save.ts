// Phase 7 — LocalStorage save/load with versioned JSON schema.
// Blueprint Reference: gameplay-blueprint.md §13 — Save and Persistence Model; ux-blueprint.md §10.5

import { useContext, useCallback } from 'react';

import type { SaveFile } from '../../engine/types';
import { SAVE_SCHEMA_VERSION, SAVE_STORAGE_KEY } from '../../engine/constants';
import { GameContext } from '../context/game-context';

// ============================================================
// Hook
// ============================================================

export interface SaveAPI {
  /** Persist current state to localStorage. Defaults isMidTurn from context state. */
  save: (options?: { isMidTurn?: boolean }) => void;
  /** Autosave at end of turn (isMidTurn = false). */
  autosave: () => void;
  /** Load from localStorage. Returns the SaveFile on success, or null. Dispatches LOAD_SAVE. */
  load: () => SaveFile | null;
  /** Remove the save from localStorage. */
  deleteSave: () => void;
  /** Check whether a saved game exists without parsing. */
  hasSavedGame: () => boolean;
  /** Timestamp of the last successful save, or null. */
  lastSavedAt: number | null;
}

export function useSave(): SaveAPI {
  const ctx = useContext(GameContext);
  if (ctx === null) {
    throw new Error('useSave must be used within a <GameProvider>');
  }

  const { state, dispatch } = ctx;

  const save = useCallback(
    (options?: { isMidTurn?: boolean }): void => {
      const saveFile: SaveFile = {
        version: SAVE_SCHEMA_VERSION,
        scenarioId: state.gameState.scenarioId,
        savedAt: Date.now(),
        isMidTurn: options?.isMidTurn ?? state.isMidTurn,
        gameState: state.gameState,
        turnHistory: state.turnHistory,
        eventHistory: state.eventHistory,
        intelligenceReports: state.intelligenceReports,
      };

      try {
        localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(saveFile));
        dispatch({ type: 'SAVE_COMPLETED', savedAt: saveFile.savedAt });
      } catch {
        // localStorage may be full or unavailable. Silently fail for now;
        // a future phase can surface a user-facing warning.
      }
    },
    [state, dispatch],
  );

  const autosave = useCallback((): void => {
    save({ isMidTurn: false });
  }, [save]);

  const load = useCallback((): SaveFile | null => {
    try {
      const raw = localStorage.getItem(SAVE_STORAGE_KEY);
      if (raw === null) {
        return null;
      }

      const parsed: unknown = JSON.parse(raw);

      // Validate schema version before accepting the save.
      if (
        typeof parsed !== 'object' ||
        parsed === null ||
        !('version' in parsed) ||
        (parsed as { version: unknown }).version !== SAVE_SCHEMA_VERSION
      ) {
        // Version mismatch or corrupt data. Future migrations would go here.
        return null;
      }

      const saveFile = parsed as SaveFile;
      dispatch({ type: 'LOAD_SAVE', save: saveFile });
      return saveFile;
    } catch {
      // Corrupt JSON or other localStorage error.
      return null;
    }
  }, [dispatch]);

  const deleteSave = useCallback((): void => {
    localStorage.removeItem(SAVE_STORAGE_KEY);
  }, []);

  const hasSavedGame = useCallback((): boolean => {
    return localStorage.getItem(SAVE_STORAGE_KEY) !== null;
  }, []);

  return {
    save,
    autosave,
    load,
    deleteSave,
    hasSavedGame,
    lastSavedAt: state.lastSavedAt,
  };
}
