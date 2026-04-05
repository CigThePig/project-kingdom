import type { SVGIconProps } from '../icon';

export function DecreesIcon({ className }: SVGIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Chunky royal seal — octagonal stamp with cross */}
      <polygon points="9,4 15,4 19,8 19,14 15,18 9,18 5,14 5,8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
      <line x1="12" y1="7" x2="12" y2="15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
      <line x1="8" y1="11" x2="16" y2="11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
      {/* Ribbon base */}
      <polyline points="8,18 6,22 12,20 18,22 16,18" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
    </svg>
  );
}
