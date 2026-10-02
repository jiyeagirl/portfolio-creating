export function Mark({ size = 22, inverted = false }: { size?: number; inverted?: boolean }) {
  const fg = inverted ? "#EEF0FA" : "var(--ot-accent)";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2" y="2" width="13" height="13" rx="4" stroke={fg} strokeWidth="2" />
      <rect x="9" y="9" width="13" height="13" rx="4" fill={fg} />
    </svg>
  );
}
