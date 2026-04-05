import type { SVGIconProps } from '../icon';

export function EventsIcon({ className }: SVGIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Chunky bell — angular, blocky silhouette */}
      <line x1="12" y1="2" x2="12" y2="4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
      <path d="M6,16 L6,10 L8,6 L16,6 L18,10 L18,16 Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
      <line x1="4" y1="16" x2="20" y2="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
      <line x1="10" y1="19" x2="14" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
    </svg>
  );
}
