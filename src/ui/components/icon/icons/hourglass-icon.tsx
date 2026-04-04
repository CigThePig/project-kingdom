import type { SVGIconProps } from '../icon';

export function HourglassIcon({ className }: SVGIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M6 3h12v5l-4 4 4 4v5H6v-5l4-4-4-4V3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="6" y1="3" x2="18" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="21" x2="18" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
