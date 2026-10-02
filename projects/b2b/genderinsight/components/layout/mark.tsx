/**
 * GenderInsight 로고 마크. 균형을 이루는 두 개의 호가 서로를 감싸는 형태로
 * "형평, 균형"이라는 의미만 담는다. 실존 브랜드와 무관한 목업용 마크다.
 */
export function Mark({ size = 22, tone = "ink" }: { size?: number; tone?: "ink" | "light" }) {
  const fill = tone === "light" ? "#ffffff" : "#221b1d";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden fill="none">
      <path
        d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10c-1.94 0-3.5-1.343-3.5-3s1.56-3 3.5-3a3 3 0 1 0 0-8c-1.94 0-3.5-1.343-3.5-3s1.56-3 3.5-3z"
        fill={fill}
      />
      <circle cx="6.4" cy="12" r="3.4" fill={fill} opacity="0.45" />
    </svg>
  );
}
