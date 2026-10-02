/**
 * BrandPilot 마크. 방향키(파일럿)와 콘텐츠 카드가 겹친 형태를 단순 도형으로만 그린다.
 * 사진이나 그라데이션을 쓰지 않는다(minimalist-ui).
 */
export function Mark({ size = 22, tone = "accent" }: { size?: number; tone?: "accent" | "light" }) {
  const fg = tone === "light" ? "#ffffff" : "var(--bp-accent)";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2.5" y="4.5" width="14" height="14" rx="3.5" stroke={fg} strokeWidth="1.8" />
      <path d="M9 21 L21.5 3 L21.5 15.5 Z" fill={fg} />
    </svg>
  );
}
