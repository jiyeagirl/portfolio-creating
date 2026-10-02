/* 지자체 로고 대신 쓰는 추상 플레이스홀더 엠블럼(spec.md 8절).
   특정 지역을 연상시키는 상징(캐릭터, 지형, 문장)을 쓰지 않고, QR 격자와 핀만 겹쳐
   서비스 기능 자체를 나타낸다. 실제 지자체 CI 로 교체될 자리를 표시하는 용도다. */

export function Emblem({
  size = 28,
  tone = "accent",
}: {
  size?: number;
  tone?: "accent" | "light" | "ink";
}) {
  const fg = tone === "light" ? "#ffffff" : tone === "ink" ? "var(--cp-ink)" : "var(--cp-accent)";
  const soft =
    tone === "light" ? "rgba(255,255,255,0.34)" : tone === "ink" ? "var(--cp-hairline-strong)" : "var(--cp-accent-line)";

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      {/* QR 파인더 패턴 3개 — 스캔으로 열리는 서비스라는 표식 */}
      <rect x="2.5" y="2.5" width="9" height="9" rx="2.4" stroke={fg} strokeWidth="2" />
      <rect x="20.5" y="2.5" width="9" height="9" rx="2.4" stroke={soft} strokeWidth="2" />
      <rect x="2.5" y="20.5" width="9" height="9" rx="2.4" stroke={soft} strokeWidth="2" />
      {/* 핀 — 지금 서 있는 지점 */}
      <path
        d="M25 16.5c-3.04 0-5.5 2.4-5.5 5.37 0 3.9 4.62 7.72 5.06 8.07a.7.7 0 0 0 .88 0c.44-.35 5.06-4.17 5.06-8.07 0-2.97-2.46-5.37-5.5-5.37Z"
        fill={fg}
      />
      <circle cx="25" cy="21.8" r="1.9" fill={tone === "light" ? "var(--cp-accent)" : "#ffffff"} />
    </svg>
  );
}

export function Wordmark({ tone = "accent" }: { tone?: "accent" | "light" | "ink" }) {
  const color = tone === "light" ? "#ffffff" : tone === "ink" ? "var(--cp-ink)" : "var(--cp-accent)";
  return (
    <span className="flex items-center gap-2">
      <Emblem size={24} tone={tone} />
      <span
        className="text-[15px] font-extrabold tracking-[-0.03em]"
        style={{ color }}
      >
        CIVICPIN
      </span>
    </span>
  );
}
