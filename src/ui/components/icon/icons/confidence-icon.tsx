import type { SVGIconProps } from '../icon';

export function ConfidenceIcon({ className }: SVGIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <line x1="8" y1="20" x2="8" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="20" x2="12" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="20" x2="16" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
