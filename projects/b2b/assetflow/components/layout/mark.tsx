/**
 * AssetFlow 로고 마크. 두 개의 사면체가 맞물린 형태로 "자산이 한 방향으로
 * 흘러 나간다"는 의미만 담는다. 실존 브랜드와 무관한 목업용 마크다.
 */
export function Mark({ size = 22, tone = "ink" }: { size?: number; tone?: "ink" | "light" }) {
  const fill = tone === "light" ? "#ffffff" : "#171717";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden fill="none">
      <path d="M12 2 22 8v8l-4 2.4V10.4L12 6.8 6 10.4V22L2 19.6V8z" fill={fill} />
      <path d="M12 11.2 18 14.8V22l-6-3.6L8.6 20.4v-4.2z" fill={fill} opacity="0.45" />
    </svg>
  );
}
