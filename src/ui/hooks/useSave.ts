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
  };
  localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(saveFile));
  return savedAt;
}

export function loadFromStorage(): SaveFile | null {
  const raw = localStorage.getItem(SAVE_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SaveFile;
  } catch {
    return null;
  }
}

export function hasSavedGame(): boolean {
  return localStorage.getItem(SAVE_STORAGE_KEY) !== null;
}

export function deleteSavedGame(): void {
  localStorage.removeItem(SAVE_STORAGE_KEY);
}
