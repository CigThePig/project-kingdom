import type { CSSProperties, KeyboardEvent, ReactNode, Ref } from 'react';

import { getAccentColor, getFamilyLabel, type CardFamily } from '../types';

interface CardProps {
  family: CardFamily;
  children: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
  className?: string;
  innerRef?: Ref<HTMLDivElement>;
}

export function Card({ family, children, style, onClick, className, innerRef }: CardProps) {
  const accent = getAccentColor(family);

  const handleKeyDown = onClick
    ? (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }
    : undefined;

  return (
    <div
      ref={innerRef}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={[
        'relative overflow-hidden rounded-2xl',
        'transition-[transform,border-color,box-shadow] duration-200 ease-in-out',
        onClick
          ? 'cursor-pointer active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-advisor)]'
          : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 16,
        padding: '20px 18px',
        boxShadow: 'var(--shadow-card-default)',
        ...style,
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: 2,
          background: `linear-gradient(90deg, ${accent}, ${accent}88)`,
        }}
      />

      {/* Family badge */}
      <div
        style={{
          fontFamily: 'var(--font-family-mono)',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: accent,
          marginBottom: 12,
        }}
      >
        {getFamilyLabel(family)}
      </div>

      {/* Content slot */}
      {children}

      {/* Bottom line */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: 1,
          background:
            'linear-gradient(90deg, transparent, var(--color-border-default), transparent)',
        }}
      />
    </div>
  );
}
