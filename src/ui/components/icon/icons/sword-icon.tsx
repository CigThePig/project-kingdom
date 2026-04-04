import type { SVGIconProps } from '../icon';

export function SwordIcon({ className }: SVGIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <line x1="5" y1="19" x2="17" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="13" x2="14" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="3" y1="21" x2="5" y2="19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
