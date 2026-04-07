export function SelectionBadge() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{
        background: 'rgba(0, 0, 0, 0.45)',
        borderRadius: 16,
        zIndex: 10,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-family-mono)',
          fontSize: 13,
          fontWeight: 800,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: 'var(--color-accent-response)',
        }}
      >
        &#10003; SELECTED
      </span>
    </div>
  );
}
