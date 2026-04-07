import type { ReactNode } from 'react';

interface CardTitleProps {
  children: ReactNode;
}

export function CardTitle({ children }: CardTitleProps) {
  return (
    <h2
      style={{
        fontFamily: 'var(--font-family-heading)',
        fontSize: 17,
        fontWeight: 700,
        lineHeight: 1.3,
        color: 'var(--color-text-primary)',
        margin: '0 0 8px',
      }}
    >
      {children}
    </h2>
  );
}
