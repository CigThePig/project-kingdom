import { useState, useEffect, lazy, Suspense, useRef } from 'react';

import { Season } from './engine/types';
import { useCrownBar, useKingdomState, useIsGameOver, useGameOverConditions, useGameDispatch, useLastTurnResult } from './ui/hooks/use-game-state';
import { getMilestoneDefinition } from './data/knowledge';
import { useSave } from './ui/hooks/use-save';
import { SCREEN_TITLES } from './data/text/labels';
import { CrownBar } from './ui/components/crown-bar/crown-bar';
import { NavRail } from './ui/components/nav-rail/nav-rail';
import { IntelligencePanel } from './ui/components/intelligence-panel/intelligence-panel';
import { SeasonTransition } from './ui/components/season-transition/season-transition';
import { MilestoneCelebration } from './ui/components/milestone-celebration/milestone-celebration';
import { RightPanelProvider, useRightPanel } from './ui/context/right-panel-context';
import styles from './app.module.css';

// ============================================================
// Lazy-loaded screens (code splitting)
// ============================================================

const Dashboard = lazy(() => import('./ui/screens/dashboard/dashboard').then(m => ({ default: m.Dashboard })));
const Reports = lazy(() => import('./ui/screens/reports/reports').then(m => ({ default: m.Reports })));
const Events = lazy(() => import('./ui/screens/events/events').then(m => ({ default: m.Events })));
const Decrees = lazy(() => import('./ui/screens/decrees/decrees').then(m => ({ default: m.Decrees })));
const Society = lazy(() => import('./ui/screens/society/society').then(m => ({ default: m.Society })));
const Regions = lazy(() => import('./ui/screens/regions/regions').then(m => ({ default: m.Regions })));
const Military = lazy(() => import('./ui/screens/military/military').then(m => ({ default: m.Military })));
const Trade = lazy(() => import('./ui/screens/trade/trade').then(m => ({ default: m.Trade })));
const Diplomacy = lazy(() => import('./ui/screens/diplomacy/diplomacy').then(m => ({ default: m.Diplomacy })));
const Intelligence = lazy(() => import('./ui/screens/intelligence/intelligence').then(m => ({ default: m.Intelligence })));
const Knowledge = lazy(() => import('./ui/screens/knowledge/knowledge').then(m => ({ default: m.Knowledge })));
const Archive = lazy(() => import('./ui/screens/archive/archive').then(m => ({ default: m.Archive })));
const GameOver = lazy(() => import('./ui/screens/game-over/game-over').then(m => ({ default: m.GameOver })));

// ============================================================
// Screen Identifier
// ============================================================

export type ScreenId =
  | 'dashboard'
  | 'reports'
  | 'decrees'
  | 'treasury'
  | 'military'
  | 'diplomacy'
  | 'faith'
  | 'knowledge'
  | 'regions'
  | 'espionage'
  | 'events'
  | 'archive';

// ============================================================
// Seasonal body class mapping
// ============================================================

const SEASON_CLASS_MAP: Record<Season, string> = {
  [Season.Spring]: 'season-spring',
  [Season.Summer]: 'season-summer',
  [Season.Autumn]: 'season-autumn',
  [Season.Winter]: 'season-winter',
};

const ALL_SEASON_CLASSES = Object.values(SEASON_CLASS_MAP);

// ============================================================
// App Shell (inner, within RightPanelProvider)
// ============================================================

function AppShell() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('dashboard');
  const [intelPanelOpen, setIntelPanelOpen] = useState(false);
  const { season } = useCrownBar();
  const { save, autosave, load, hasSavedGame } = useSave();
  const { turn } = useKingdomState();
  const prevTurnRef = useRef(turn.turnNumber);
  const isGameOver = useIsGameOver();
  const gameOverConditions = useGameOverConditions();
  const dispatch = useGameDispatch();
  const { update: updateRightPanel } = useRightPanel();
  const lastTurnResult = useLastTurnResult();
  const [celebrationMilestone, setCelebrationMilestone] = useState<string | null>(null);

  // Sync activeScreen to right panel context.
  useEffect(() => {
    updateRightPanel({ screen: activeScreen });
  }, [activeScreen, updateRightPanel]);

  // Auto-load saved game on mount.
  useEffect(() => {
    if (hasSavedGame()) {
      load();
    }
    // Run only once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autosave after each turn resolution.
  useEffect(() => {
    if (turn.turnNumber > prevTurnRef.current) {
      autosave();
    }
    prevTurnRef.current = turn.turnNumber;
  }, [turn.turnNumber, autosave]);

  // Mid-turn save on beforeunload so progress is not lost.
  useEffect(() => {
    function handleBeforeUnload() {
      save({ isMidTurn: true });
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [save]);

  // Phase 8E: Trigger milestone celebration on newly unlocked milestones.
  useEffect(() => {
    if (lastTurnResult && lastTurnResult.newlyUnlockedMilestones.length > 0) {
      const first = lastTurnResult.newlyUnlockedMilestones[0];
      const def = getMilestoneDefinition(first.branch, first.milestoneIndex);
      if (def) {
        setCelebrationMilestone(def.name);
      }
    }
  }, [lastTurnResult]);

  useEffect(() => {
    document.body.classList.remove(...ALL_SEASON_CLASSES);
    document.body.classList.add(SEASON_CLASS_MAP[season]);

    return () => {
      document.body.classList.remove(...ALL_SEASON_CLASSES);
    };
  }, [season]);

  return (
    <div className={styles.shell}>
      <CrownBar
        onNavigateToEvents={() => setActiveScreen('events')}
        onToggleIntelPanel={() => setIntelPanelOpen((prev) => !prev)}
      />

      <NavRail activeScreen={activeScreen} onNavigate={setActiveScreen} />

      <main className={styles.content} key={activeScreen}>
        <h1 className={styles.contentTitle}>{SCREEN_TITLES[activeScreen]}</h1>
        <Suspense fallback={<div className={styles.screenLoader}>Preparing your dispatches, Your Majesty…</div>}>
          {activeScreen === 'dashboard' && (
            <Dashboard onNavigate={(screen) => { if (screen) setActiveScreen(screen as ScreenId); }} />
          )}
          {activeScreen === 'reports' && <Reports />}
          {activeScreen === 'events' && <Events />}
          {activeScreen === 'decrees' && <Decrees />}
          {activeScreen === 'faith' && <Society />}
          {activeScreen === 'regions' && <Regions />}
          {activeScreen === 'military' && <Military />}
          {activeScreen === 'treasury' && <Trade />}
          {activeScreen === 'diplomacy' && <Diplomacy />}
          {activeScreen === 'espionage' && <Intelligence />}
          {activeScreen === 'knowledge' && <Knowledge />}
          {activeScreen === 'archive' && <Archive />}
        </Suspense>
      </main>

      <IntelligencePanel
        isOpen={intelPanelOpen}
        onClose={() => setIntelPanelOpen(false)}
      />

      <SeasonTransition season={season} />

      <MilestoneCelebration
        milestoneName={celebrationMilestone}
        onComplete={() => setCelebrationMilestone(null)}
      />

      {isGameOver && gameOverConditions.length > 0 && (
        <Suspense fallback={null}>
          <GameOver
            conditions={gameOverConditions}
            onLoadSave={() => {
              if (hasSavedGame()) {
                load();
              }
            }}
            onNewGame={() => {
              dispatch({ type: 'INIT_NEW_GAME' });
              setActiveScreen('dashboard');
            }}
          />
        </Suspense>
      )}
    </div>
  );
}

// ============================================================
// App (wrapped with RightPanelProvider)
// ============================================================

export function App() {
  return (
    <RightPanelProvider>
      <AppShell />
    </RightPanelProvider>
  );
}
