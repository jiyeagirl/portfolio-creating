/**
 * MarketFlow 로고 마크. 궤도를 도는 열린 링 안에 콘텐츠를 뜻하는 사각 노드를 두어
 * "자동화가 콘텐츠를 계속 순환시킨다"는 의미만 담는다. 실존 브랜드와 무관한 목업용 마크다.
 */
export function Mark({ size = 22, tone = "ink" }: { size?: number; tone?: "ink" | "light" }) {
  const fill = tone === "light" ? "#faf9f5" : "#141413";
  const accent = "#cc785c";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden fill="none">
      <path
        d="M12 3a9 9 0 1 1-7.5 4.03"
        stroke={fill}
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1.2" fill={accent} />
      <circle cx="4.4" cy="6.6" r="1.7" fill={fill} />
    </svg>
  );
}
