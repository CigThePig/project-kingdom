import { useState, useEffect } from 'react';

import { Season } from './engine/types';
import { useCrownBar } from './ui/hooks/use-game-state';
import { SCREEN_TITLES } from './data/text/labels';
import { CrownBar } from './ui/components/crown-bar/crown-bar';
import { NavRail } from './ui/components/nav-rail/nav-rail';
import { IntelligencePanel } from './ui/components/intelligence-panel/intelligence-panel';
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
        <p className={styles.contentPlaceholder}>
          Screen content will be implemented in a later phase.
        </p>
      </main>

      <IntelligencePanel
        isOpen={intelPanelOpen}
        onClose={() => setIntelPanelOpen(false)}
      />
    </div>
  );
}
