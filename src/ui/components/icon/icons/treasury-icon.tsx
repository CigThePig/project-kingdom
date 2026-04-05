import type { SVGIconProps } from '../icon';

export function TreasuryIcon({ className }: SVGIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Chunky coin: octagonal outer, square inner, thick crosshairs */}
      <polygon points="8,4 16,4 20,8 20,16 16,20 8,20 4,16 4,8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
      <rect x="10" y="10" width="4" height="4" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
      <line x1="12" y1="4" x2="12" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
      <line x1="12" y1="16" x2="12" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    </svg>
  );
}
