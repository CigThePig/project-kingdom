import { useState, useEffect } from 'react';

import { Season } from './engine/types';
import { useCrownBar } from './ui/hooks/use-game-state';
import { SCREEN_TITLES } from './data/text/labels';
import { CrownBar } from './ui/components/crown-bar/crown-bar';
import { NavRail } from './ui/components/nav-rail/nav-rail';
import { IntelligencePanel } from './ui/components/intelligence-panel/intelligence-panel';
import { Dashboard } from './ui/screens/dashboard/dashboard';
import { Reports } from './ui/screens/reports/reports';
import { Events } from './ui/screens/events/events';
import { Decrees } from './ui/screens/decrees/decrees';
import { Society } from './ui/screens/society/society';
import { Regions } from './ui/screens/regions/regions';
import { Military } from './ui/screens/military/military';
import { Trade } from './ui/screens/trade/trade';
import { Diplomacy } from './ui/screens/diplomacy/diplomacy';
import { Intelligence } from './ui/screens/intelligence/intelligence';
import { Knowledge } from './ui/screens/knowledge/knowledge';
import { Archive } from './ui/screens/archive/archive';
import styles from './app.module.css';

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
// App Shell
// ============================================================

export function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('dashboard');
  const [intelPanelOpen, setIntelPanelOpen] = useState(false);
  const { season } = useCrownBar();

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

      <main className={styles.content}>
        <h1 className={styles.contentTitle}>{SCREEN_TITLES[activeScreen]}</h1>
        {activeScreen === 'dashboard' && (
          <Dashboard onNavigateToEvents={() => setActiveScreen('events')} />
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
      </main>

      <IntelligencePanel
        isOpen={intelPanelOpen}
        onClose={() => setIntelPanelOpen(false)}
      />
    </div>
  );
}
