import type { SVGIconProps } from '../icon';

export function CloakIcon({ className }: SVGIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3C8 3 5 6 5 10v8c0 1 1 3 3 3h8c2 0 3-2 3-3v-8c0-4-3-7-7-7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M9 12c0 0 1.5 2 3 2s3-2 3-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="10" cy="10" r="0.5" stroke="currentColor" strokeWidth="1" fill="currentColor" />
      <circle cx="14" cy="10" r="0.5" stroke="currentColor" strokeWidth="1" fill="currentColor" />
    </svg>
  );
}
