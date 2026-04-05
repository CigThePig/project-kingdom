import type { SVGIconProps } from '../icon';

export function StabilityIcon({ className }: SVGIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Chunky pillar/column — angular, blocky architecture */}
      <line x1="7" y1="20" x2="17" y2="20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
      <rect x="9" y="8" width="6" height="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
      <line x1="7" y1="8" x2="17" y2="8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
      <polygon points="8,8 12,3 16,8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
    </svg>
  );
}
