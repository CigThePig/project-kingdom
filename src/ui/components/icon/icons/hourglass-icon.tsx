import type { SVGIconProps } from '../icon';

export function HourglassIcon({ className }: SVGIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Chunky hourglass — angular pinch, thick bars */}
      <line x1="5" y1="3" x2="19" y2="3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
      <line x1="5" y1="21" x2="19" y2="21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
      <polygon points="7,3 17,3 14,10 17,21 7,21 10,10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
    </svg>
  );
}
