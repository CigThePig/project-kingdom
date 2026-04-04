// Phase 8E — Seasonal Transition Overlay
// Brief overlay with season name + icon on season change (1-2 second fade).
// Blueprint Reference: ui-blueprint.md §2.4; ux-blueprint.md §8

import { useEffect, useState, useRef } from 'react';

import { Season } from '../../../engine/types';
import { SEASON_LABELS } from '../../../data/text/labels';
import { Icon } from '../icon/icon';
import styles from './season-transition.module.css';

const SEASON_ICON_MAP: Record<Season, string> = {
  [Season.Spring]: 'plough',
  [Season.Summer]: 'flame',
  [Season.Autumn]: 'festival',
  [Season.Winter]: 'compass',
};

const SEASON_TAGLINES: Record<Season, string> = {
  [Season.Spring]: 'The land awakens',
  [Season.Summer]: 'The sun holds court',
  [Season.Autumn]: 'The harvest is weighed',
  [Season.Winter]: 'The cold descends',
};

interface SeasonTransitionProps {
  season: Season;
}

export function SeasonTransition({ season }: SeasonTransitionProps) {
  const [visible, setVisible] = useState(false);
  const [displaySeason, setDisplaySeason] = useState(season);
  const prevSeasonRef = useRef(season);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (prevSeasonRef.current !== season) {
      prevSeasonRef.current = season;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplaySeason(season);
      setVisible(true);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setVisible(false);
      }, 2000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [season]);

  if (!visible) return null;

  return (
    <div className={styles.overlay} data-season={displaySeason.toLowerCase()}>
      <div className={styles.content}>
        <Icon name={SEASON_ICON_MAP[displaySeason]} size="3rem" />
        <h2 className={styles.seasonName}>{SEASON_LABELS[displaySeason]}</h2>
        <p className={styles.tagline}>{SEASON_TAGLINES[displaySeason]}</p>
      </div>
    </div>
  );
}
