import type { ReactNode } from 'react';

interface CardBodyProps {
  children: ReactNode;
}

export function CardBody({ children }: CardBodyProps) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-family-body)',
        fontSize: 13.5,
        fontWeight: 400,
        lineHeight: 1.55,
        color: 'var(--color-text-secondary)',
        margin: 0,
      }}
    >
      {children}
    </p>
  );
}
