/**
 * BuildBid 로고 마크. 위로 향하는 두 개의 막대가 저울처럼 교차하는 형태로
 * "역경매(입찰)로 균형가를 찾는다"는 의미만 담는다. 실존 브랜드와 무관한
 * 목업용 마크다.
 */
export function Mark({ size = 22, tone = "ink" }: { size?: number; tone?: "ink" | "light" }) {
  const fill = tone === "light" ? "#ffffff" : "#1d1d1f";
  const accent = tone === "light" ? "#ffffff" : "#0066cc";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden fill="none">
      <rect x="2" y="10" width="9" height="12" rx="1.5" fill={fill} opacity={tone === "light" ? 0.5 : 0.35} />
      <rect x="13" y="4" width="9" height="18" rx="1.5" fill={accent} />
    </svg>
  );
}
