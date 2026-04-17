import { useState, useContext, useEffect, useCallback, useRef, lazy, Suspense } from 'react';

import { GameContext } from '../context/game-context';
import { RoundController } from './RoundController';
import { saveToStorage, loadFromStorage, hasSavedGame } from './hooks/useSave';

const TitleScreen = lazy(() => import('./phases/TitleScreen').then(m => ({ default: m.TitleScreen })));
const GameOverScreen = lazy(() => import('./phases/GameOverScreen').then(m => ({ default: m.GameOverScreen })));

type AppScreen = 'title' | 'playing' | 'gameOver';

export function AppShell() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('AppShell must be inside GameProvider');

  const [screen, setScreen] = useState<AppScreen>('title');
  const [savedTurn] = useState<number | undefined>(() => {
    if (!hasSavedGame()) return undefined;
    const save = loadFromStorage();
    return save?.gameState.turn.turnNumber;
  });

  // Auto-save after each turn resolution. We only want this to fire when the
  // turn number changes — not on every intra-turn state update — so we read
  // the live context through a ref rather than listing ctx/state as a dep.
  const ctxRef = useRef(ctx);
  useEffect(() => {
    ctxRef.current = ctx;
  });
  const turnNumber = ctx.state.gameState.turn.turnNumber;
  useEffect(() => {
    if (screen === 'playing' && turnNumber > 1) {
      const savedAt = saveToStorage(ctxRef.current.state);
      ctxRef.current.dispatch({ type: 'SAVE_COMPLETED', savedAt });
    }
  }, [turnNumber, screen]);

  const handleStartGame = useCallback((scenarioId: string) => {
    ctx.dispatch({ type: 'INIT_NEW_GAME', scenarioId: scenarioId === 'new_crown' ? undefined : scenarioId });
    setScreen('playing');
  }, [ctx]);

  const handleContinue = useCallback(() => {
    const save = loadFromStorage();
    if (save) {
      ctx.dispatch({ type: 'LOAD_SAVE', save });
      setScreen('playing');
    }
  }, [ctx]);

  const handleGameOver = useCallback(() => {
    setScreen('gameOver');
  }, []);

  const handleNewGameFromGameOver = useCallback(() => {
    setScreen('title');
  }, []);

  const fallback = (
    <div style={{
      fontFamily: 'var(--font-family-mono)',
      fontSize: 11,
      color: 'var(--color-text-secondary)',
      textAlign: 'center',
      padding: '24px 0',
      letterSpacing: 2,
      textTransform: 'uppercase',
    }}>
      The court assembles...
    </div>
  );

  return (
    <Suspense fallback={fallback}>
      {screen === 'title' && (
        <TitleScreen
          hasSave={hasSavedGame()}
          savedTurn={savedTurn}
          onStartGame={handleStartGame}
          onContinue={handleContinue}
        />
      )}

      {screen === 'playing' && (
        <RoundController onGameOver={handleGameOver} />
      )}

      {screen === 'gameOver' && (
        <GameOverScreen onNewGame={handleNewGameFromGameOver} />
      )}
    </Suspense>
  );
}
