import type { SVGIconProps } from '../icon';

export function MerchantsIcon({ className }: SVGIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <line x1="12" y1="4" x2="12" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 10L6 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M12 10L18 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="6" cy="16" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="18" cy="16" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}
