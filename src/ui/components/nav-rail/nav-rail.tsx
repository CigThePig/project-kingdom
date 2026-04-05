// Phase 8 — Navigation Rail: left rail (desktop) / retro-RPG grid nav (mobile).
// Blueprint Reference: ui-blueprint.md §3.5, ux-blueprint.md §5

import { useState } from 'react';

import type { ScreenId } from '../../../app';
import { NAV_LABELS } from '../../../data/text/labels';
import { Icon } from '../icon/icon';
import styles from './nav-rail.module.css';

// ============================================================
// Nav item definitions
// ============================================================

interface NavItem {
  id: ScreenId;
  label: string;
  icon: string;
}

/* Map each screen ID to its icon name from the Icon system */
const SCREEN_ICON_MAP: Record<ScreenId, string> = {
  dashboard: 'dashboard',
  reports: 'reports',
  decrees: 'decrees',
  faith: 'society',
  regions: 'regions',
  military: 'military',
  treasury: 'trade',
  diplomacy: 'diplomacy',
  espionage: 'intelligence',
  knowledge: 'knowledge',
  events: 'events',
  archive: 'archive',
};

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: NAV_LABELS.dashboard, icon: SCREEN_ICON_MAP.dashboard },
  { id: 'reports', label: NAV_LABELS.reports, icon: SCREEN_ICON_MAP.reports },
  { id: 'decrees', label: NAV_LABELS.decrees, icon: SCREEN_ICON_MAP.decrees },
  { id: 'faith', label: NAV_LABELS.faith, icon: SCREEN_ICON_MAP.faith },
  { id: 'regions', label: NAV_LABELS.regions, icon: SCREEN_ICON_MAP.regions },
  { id: 'military', label: NAV_LABELS.military, icon: SCREEN_ICON_MAP.military },
  { id: 'treasury', label: NAV_LABELS.treasury, icon: SCREEN_ICON_MAP.treasury },
  { id: 'diplomacy', label: NAV_LABELS.diplomacy, icon: SCREEN_ICON_MAP.diplomacy },
  { id: 'espionage', label: NAV_LABELS.espionage, icon: SCREEN_ICON_MAP.espionage },
  { id: 'knowledge', label: NAV_LABELS.knowledge, icon: SCREEN_ICON_MAP.knowledge },
  { id: 'events', label: NAV_LABELS.events, icon: SCREEN_ICON_MAP.events },
  { id: 'archive', label: NAV_LABELS.archive, icon: SCREEN_ICON_MAP.archive },
];

// Mobile quick-access: 3 primary + 1 menu button
const MOBILE_QUICK_IDS: ScreenId[] = ['dashboard', 'decrees', 'events'];

const MOBILE_QUICK_ITEMS = NAV_ITEMS.filter((item) =>
  MOBILE_QUICK_IDS.includes(item.id),
);

// ============================================================
// Props
// ============================================================

interface NavRailProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

// ============================================================
// Nav Rail
// ============================================================

export function NavRail({ activeScreen, onNavigate }: NavRailProps) {
  const [gridOpen, setGridOpen] = useState(false);

  function handleGridSelect(screen: ScreenId) {
    onNavigate(screen);
    setGridOpen(false);
  }

  return (
    <nav
      className={styles.rail}
      style={{ gridArea: 'nav' }}
      aria-label="Main navigation"
    >
      {/* Desktop: full list */}
      <ul className={styles.desktopList} role="list">
        {NAV_ITEMS.map((item) => (
          <li key={item.id}>
            <button
              className={
                styles.navItem +
                (activeScreen === item.id ? ' ' + styles.active : '')
              }
              onClick={() => onNavigate(item.id)}
              aria-current={activeScreen === item.id ? 'page' : undefined}
            >
              <Icon name={item.icon} size="1.25rem" />
              <span className={styles.label}>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* Mobile: 3 quick-access + Menu button */}
      <div className={styles.mobileBar}>
        {MOBILE_QUICK_ITEMS.map((item) => (
          <button
            key={item.id}
            className={
              styles.mobileItem +
              (activeScreen === item.id ? ' ' + styles.active : '')
            }
            onClick={() => {
              onNavigate(item.id);
              setGridOpen(false);
            }}
            aria-current={activeScreen === item.id ? 'page' : undefined}
          >
            <Icon name={item.icon} size="1.125rem" />
            <span className={styles.mobileLabel}>{item.label}</span>
          </button>
        ))}

        <button
          className={
            styles.menuButton +
            (gridOpen ? ' ' + styles.active : '')
          }
          onClick={() => setGridOpen((prev) => !prev)}
          aria-expanded={gridOpen}
          aria-haspopup="true"
        >
          <Icon name="dashboard" size="1.25rem" />
          <span className={styles.mobileLabel}>Menu</span>
        </button>
      </div>

      {/* Full-screen 3x4 grid overlay */}
      {gridOpen && (
        <div
          className={styles.gridOverlay}
          onClick={() => setGridOpen(false)}
        >
          <div
            className={styles.gridPanel}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.gridContainer}>
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  className={
                    styles.gridCell +
                    (activeScreen === item.id ? ' ' + styles.gridCellActive : '')
                  }
                  onClick={() => handleGridSelect(item.id)}
                  aria-current={activeScreen === item.id ? 'page' : undefined}
                >
                  <Icon name={item.icon} size="1.5rem" />
                  <span className={styles.gridLabel}>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
