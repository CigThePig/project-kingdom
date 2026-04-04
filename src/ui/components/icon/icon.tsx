// Phase 8B — Shared Icon Component
// Blueprint Reference: ui-blueprint.md §2.5 (Iconography)
//
// Renders inline SVG icons by name. Supports size and color via CSS custom properties.
// All icons use a consistent 24x24 viewBox with stroke-based rendering.

import type { CSSProperties } from 'react';
import styles from './icon.module.css';

import { TreasuryIcon } from './icons/treasury-icon';
import { FoodIcon } from './icons/food-icon';
import { StabilityIcon } from './icons/stability-icon';
import { NobilityIcon } from './icons/nobility-icon';
import { ClergyIcon } from './icons/clergy-icon';
import { MerchantsIcon } from './icons/merchants-icon';
import { CommonersIcon } from './icons/commoners-icon';
import { MilitaryClassIcon } from './icons/military-class-icon';
import { DashboardIcon } from './icons/dashboard-icon';
import { ReportsIcon } from './icons/reports-icon';
import { DecreesIcon } from './icons/decrees-icon';
import { PoliciesIcon } from './icons/policies-icon';
import { SocietyIcon } from './icons/society-icon';
import { RegionsIcon } from './icons/regions-icon';
import { MilitaryIcon } from './icons/military-icon';
import { TradeIcon } from './icons/trade-icon';
import { DiplomacyIcon } from './icons/diplomacy-icon';
import { IntelligenceIcon } from './icons/intelligence-icon';
import { KnowledgeIcon } from './icons/knowledge-icon';
import { EventsIcon } from './icons/events-icon';
import { ArchiveIcon } from './icons/archive-icon';
import { FlameIcon } from './icons/flame-icon';
import { TempleIcon } from './icons/temple-icon';
import { FestivalIcon } from './icons/festival-icon';
import { PloughIcon } from './icons/plough-icon';
import { SwordIcon } from './icons/sword-icon';
import { ScrollIcon } from './icons/scroll-icon';
import { ShipIcon } from './icons/ship-icon';
import { LyreIcon } from './icons/lyre-icon';
import { CompassIcon } from './icons/compass-icon';
import { TrendUpIcon } from './icons/trend-up-icon';
import { TrendDownIcon } from './icons/trend-down-icon';
import { TrendStableIcon } from './icons/trend-stable-icon';
import { WarningIcon } from './icons/warning-icon';
import { CriticalIcon } from './icons/critical-icon';
import { PositiveIcon } from './icons/positive-icon';
import { LockIcon } from './icons/lock-icon';
import { SealIcon } from './icons/seal-icon';
import { HourglassIcon } from './icons/hourglass-icon';
import { CloakIcon } from './icons/cloak-icon';
import { EnvelopeIcon } from './icons/envelope-icon';
import { ConfidenceIcon } from './icons/confidence-icon';

// Re-export all individual icons for direct use
export {
  TreasuryIcon, FoodIcon, StabilityIcon,
  NobilityIcon, ClergyIcon, MerchantsIcon, CommonersIcon, MilitaryClassIcon,
  DashboardIcon, ReportsIcon, DecreesIcon, PoliciesIcon, SocietyIcon,
  RegionsIcon, MilitaryIcon, TradeIcon, DiplomacyIcon, IntelligenceIcon,
  KnowledgeIcon, EventsIcon, ArchiveIcon,
  FlameIcon, TempleIcon, FestivalIcon,
  PloughIcon, SwordIcon, ScrollIcon, ShipIcon, LyreIcon, CompassIcon,
  TrendUpIcon, TrendDownIcon, TrendStableIcon,
  WarningIcon, CriticalIcon, PositiveIcon, LockIcon,
  SealIcon, HourglassIcon,
  CloakIcon, EnvelopeIcon, ConfidenceIcon,
};

export interface SVGIconProps {
  className?: string;
}

type IconComponent = (props: SVGIconProps) => JSX.Element;

const ICON_MAP: Record<string, IconComponent> = {
  treasury: TreasuryIcon,
  food: FoodIcon,
  stability: StabilityIcon,
  nobility: NobilityIcon,
  clergy: ClergyIcon,
  merchants: MerchantsIcon,
  commoners: CommonersIcon,
  'military-class': MilitaryClassIcon,
  dashboard: DashboardIcon,
  reports: ReportsIcon,
  decrees: DecreesIcon,
  policies: PoliciesIcon,
  society: SocietyIcon,
  regions: RegionsIcon,
  military: MilitaryIcon,
  trade: TradeIcon,
  diplomacy: DiplomacyIcon,
  intelligence: IntelligenceIcon,
  knowledge: KnowledgeIcon,
  events: EventsIcon,
  archive: ArchiveIcon,
  flame: FlameIcon,
  temple: TempleIcon,
  festival: FestivalIcon,
  plough: PloughIcon,
  sword: SwordIcon,
  scroll: ScrollIcon,
  ship: ShipIcon,
  lyre: LyreIcon,
  compass: CompassIcon,
  'trend-up': TrendUpIcon,
  'trend-down': TrendDownIcon,
  'trend-stable': TrendStableIcon,
  warning: WarningIcon,
  critical: CriticalIcon,
  positive: PositiveIcon,
  lock: LockIcon,
  seal: SealIcon,
  hourglass: HourglassIcon,
  cloak: CloakIcon,
  envelope: EnvelopeIcon,
  confidence: ConfidenceIcon,
};

export type IconName = keyof typeof ICON_MAP;

interface IconProps {
  name: string;
  size?: string;
  color?: string;
  className?: string;
}

export function Icon({ name, size, color, className }: IconProps) {
  const IconSVG = ICON_MAP[name];
  if (!IconSVG) return null;

  const style = {} as CSSProperties & Record<string, string>;
  if (size) style['--icon-size'] = size;
  if (color) style['--icon-color'] = color;

  return (
    <span
      className={`${styles.icon}${className ? ` ${className}` : ''}`}
      style={Object.keys(style).length > 0 ? style : undefined}
      role="img"
      aria-hidden="true"
    >
      <IconSVG />
    </span>
  );
}
