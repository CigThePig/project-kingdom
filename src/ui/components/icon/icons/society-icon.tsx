import type { SVGIconProps } from '../icon';

export function SocietyIcon({ className }: SVGIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Chunky people — angular head + body silhouettes */}
      {/* Center figure */}
      <rect x="10" y="4" width="4" height="4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
      <polygon points="8,20 10,10 14,10 16,20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
      {/* Left figure (smaller) */}
      <rect x="2" y="7" width="3" height="3" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
      <line x1="3.5" y1="11" x2="3.5" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
      {/* Right figure (smaller) */}
      <rect x="19" y="7" width="3" height="3" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
      <line x1="20.5" y1="11" x2="20.5" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    </svg>
  );
}
