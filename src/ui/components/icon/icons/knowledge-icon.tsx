import type { SVGIconProps } from '../icon';

export function KnowledgeIcon({ className }: SVGIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M2 5c3-1 5-1 10 0v14c-5-1-7-1-10 0V5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M22 5c-3-1-5-1-10 0v14c5-1 7-1 10 0V5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
