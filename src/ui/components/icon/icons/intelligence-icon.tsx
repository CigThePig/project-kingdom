import type { SVGIconProps } from '../icon';

export function IntelligenceIcon({ className }: SVGIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Chunky lantern — angular, blocky silhouette */}
      <rect x="8" y="6" width="8" height="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
      <line x1="10" y1="6" x2="10" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
      <line x1="14" y1="6" x2="14" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
      <line x1="10" y1="4" x2="14" y2="4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
      <line x1="12" y1="18" x2="12" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
      <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
    </svg>
  );
}
