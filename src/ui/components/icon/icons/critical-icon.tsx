import type { SVGIconProps } from '../icon';

export function CriticalIcon({ className }: SVGIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Chunky X in octagon — angular, bold */}
      <polygon points="8,3 16,3 21,8 21,16 16,21 8,21 3,16 3,8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
      <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
      <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
    </svg>
  );
}
