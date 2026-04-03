// Phase 8 — Navigation Rail: left rail (desktop) / bottom bar (mobile).
// Blueprint Reference: ui-blueprint.md §3.5, ux-blueprint.md §5

import { useState } from 'react';

import type { ScreenId } from '../../../app';
import { NAV_LABELS } from '../../../data/text/labels';
import styles from './nav-rail.module.css';

// ============================================================
// Nav item definitions
// ============================================================

interface NavItem {
  id: ScreenId;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: NAV_LABELS.dashboard },
  { id: 'reports', label: NAV_LABELS.reports },
  { id: 'decrees', label: NAV_LABELS.decrees },
  { id: 'faith', label: NAV_LABELS.faith },
  { id: 'regions', label: NAV_LABELS.regions },
  { id: 'military', label: NAV_LABELS.military },
  { id: 'treasury', label: NAV_LABELS.treasury },
  { id: 'diplomacy', label: NAV_LABELS.diplomacy },
  { id: 'espionage', label: NAV_LABELS.espionage },
  { id: 'knowledge', label: NAV_LABELS.knowledge },
  { id: 'events', label: NAV_LABELS.events },
  { id: 'archive', label: NAV_LABELS.archive },
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
