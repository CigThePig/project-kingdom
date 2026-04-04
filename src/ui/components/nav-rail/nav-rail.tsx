// Phase 8 — Navigation Rail: left rail (desktop) / bottom bar (mobile).
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

// Mobile bottom bar shows 5 items: Dashboard, Decrees, Events, Society (faith), More
const MOBILE_PRIMARY_IDS: ScreenId[] = ['dashboard', 'decrees', 'events', 'faith'];

const MOBILE_PRIMARY_ITEMS = NAV_ITEMS.filter((item) =>
  MOBILE_PRIMARY_IDS.includes(item.id),
);

const MOBILE_OVERFLOW_ITEMS = NAV_ITEMS.filter(
  (item) => !MOBILE_PRIMARY_IDS.includes(item.id),
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
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

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

      {/* Mobile: bottom bar with 5 items */}
      <div className={styles.mobileBar}>
        {MOBILE_PRIMARY_ITEMS.map((item) => (
          <button
            key={item.id}
            className={
              styles.mobileItem +
              (activeScreen === item.id ? ' ' + styles.active : '')
            }
            onClick={() => {
              onNavigate(item.id);
              setMoreMenuOpen(false);
            }}
            aria-current={activeScreen === item.id ? 'page' : undefined}
          >
            <Icon name={item.icon} size="1.125rem" />
            <span className={styles.mobileLabel}>{item.label}</span>
          </button>
        ))}

        <div className={styles.moreContainer}>
          <button
            className={
              styles.mobileItem +
              (moreMenuOpen ? ' ' + styles.active : '')
            }
            onClick={() => setMoreMenuOpen((prev) => !prev)}
            aria-expanded={moreMenuOpen}
            aria-haspopup="true"
          >
            <span className={styles.mobileLabel}>More</span>
          </button>

          {moreMenuOpen && (
            <ul className={styles.moreMenu} role="list">
              {MOBILE_OVERFLOW_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    className={
                      styles.moreMenuItem +
                      (activeScreen === item.id ? ' ' + styles.active : '')
                    }
                    onClick={() => {
                      onNavigate(item.id);
                      setMoreMenuOpen(false);
                    }}
                    aria-current={activeScreen === item.id ? 'page' : undefined}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
