import type { SVGIconProps } from '../icon';

export function FlameIcon({ className }: SVGIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C12 2 7 8.5 7 13a5 5 0 0 0 10 0C17 8.5 12 2 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M12 22c-1.5 0-2.5-1.5-2.5-3 0-2 2.5-4 2.5-4s2.5 2 2.5 4c0 1.5-1 3-2.5 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
