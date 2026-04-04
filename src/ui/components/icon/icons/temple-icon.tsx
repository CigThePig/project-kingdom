import type { SVGIconProps } from '../icon';

export function TempleIcon({ className }: SVGIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <polyline points="4,10 12,4 20,10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="6" y1="10" x2="6" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="10" x2="10" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="14" y1="10" x2="14" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="18" y1="10" x2="18" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="3" y1="20" x2="21" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
