import type { SVGIconProps } from '../icon';

export function ShipIcon({ className }: SVGIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M3 18L5 11h14l2 7H3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="12" y1="11" x2="12" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 3L18 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M2 21c2-1 4-1 6 0s4 1 6 0 4-1 6 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
