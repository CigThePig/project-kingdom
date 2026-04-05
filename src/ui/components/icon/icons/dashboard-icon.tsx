import type { SVGIconProps } from '../icon';

export function DashboardIcon({ className }: SVGIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Chunky 2x2 grid — thick borders, sharp corners */}
      <rect x="3" y="3" width="8" height="8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
      <rect x="13" y="3" width="8" height="8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
      <rect x="3" y="13" width="8" height="8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
      <rect x="13" y="13" width="8" height="8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
    </svg>
  );
}
