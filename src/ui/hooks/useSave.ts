import { SAVE_STORAGE_KEY, SAVE_SCHEMA_VERSION } from '../../engine/constants';
import type { SaveFile } from '../../engine/types';
import type { GameContextState } from '../../context/game-context';

export function saveToStorage(state: GameContextState): number {
  const savedAt = Date.now();
  const saveFile: SaveFile = {
    version: SAVE_SCHEMA_VERSION,
    scenarioId: state.gameState.scenarioId,
    savedAt,
    isMidTurn: state.isMidTurn,
    gameState: state.gameState,
    turnHistory: state.turnHistory,
    eventHistory: state.eventHistory,
    intelligenceReports: state.intelligenceReports,
    chronicle: state.chronicle,
    recentlyOfferedDecreeIds: state.recentlyOfferedDecreeIds,
  };
  localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(saveFile));
  return savedAt;
}

export function loadFromStorage(): SaveFile | null {
  const raw = localStorage.getItem(SAVE_STORAGE_KEY);
  if (!raw) return null;
  let parsed: SaveFile;
  try {
    parsed = JSON.parse(raw) as SaveFile;
  } catch {
    return null;
  }
  if (typeof parsed !== 'object' || parsed === null || typeof parsed.version !== 'number') {
    return null;
  }
  // Refuse saves written by a newer schema than this build understands —
  // migration is one-way (old → new), so a future save can't be loaded.
  if (parsed.version > SAVE_SCHEMA_VERSION) {
    if (import.meta.env?.DEV) {
      console.warn(
        `[useSave] Ignoring save at schema v${parsed.version}; this build only understands up to v${SAVE_SCHEMA_VERSION}.`,
      );
    }
    return null;
  }
  return parsed;
}

export function hasSavedGame(): boolean {
  return localStorage.getItem(SAVE_STORAGE_KEY) !== null;
}

export function deleteSavedGame(): void {
  localStorage.removeItem(SAVE_STORAGE_KEY);
}
