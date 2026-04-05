import type { SVGIconProps } from '../icon';

export function CompassIcon({ className }: SVGIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Chunky compass — octagonal frame with angular needle */}
      <polygon points="8,3 16,3 21,8 21,16 16,21 8,21 3,16 3,8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
      {/* North needle */}
      <polygon points="12,5 14,11 12,12 10,11" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" fill="currentColor" />
      {/* South needle */}
      <polygon points="12,19 10,13 12,12 14,13" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
    </svg>
  );
}
