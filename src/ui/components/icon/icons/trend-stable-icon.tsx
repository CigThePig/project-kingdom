import type { SVGIconProps } from '../icon';

export function TrendStableIcon({ className }: SVGIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="4" cy="12" r="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="20" cy="12" r="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}
