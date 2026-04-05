import type { SVGIconProps } from '../icon';

export function WarningIcon({ className }: SVGIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Chunky warning triangle — sharp miter joins, thick strokes */}
      <polygon points="12,3 2,21 22,21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
      <line x1="12" y1="10" x2="12" y2="15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
      <rect x="11" y="17" width="2" height="2" fill="currentColor" />
    </svg>
  );
}
