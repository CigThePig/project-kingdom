import type { SVGIconProps } from '../icon';

export function FoodIcon({ className }: SVGIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Chunky wheat sheaf: angular stalks with blocky grain heads */}
      <line x1="12" y1="21" x2="12" y2="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
      <line x1="8" y1="21" x2="12" y2="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
      <line x1="16" y1="21" x2="12" y2="14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" />
      {/* Grain heads — angular chevrons */}
      <polyline points="12,10 10,7 12,4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
      <polyline points="12,10 14,7 12,4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
      <polyline points="10,12 7,10 8,7" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
      <polyline points="14,12 17,10 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
    </svg>
  );
}
