/** Apple Health / Google Fit 앱 아이콘을 닮은 간단한 기하학적 마크.
 * 실제 트레이드마크 아트웍을 그대로 복제하지 않고, 두 플랫폼을 한눈에 구분할 수
 * 있도록 각자의 색과 실루엣(하트 vs 링)만 재구성했다. */

export function AppleHealthMark({ size = 32 }: { size?: number }) {
  const id = "wl-apple-health-grad";
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <defs>
        <linearGradient id={id} x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FF5F6D" />
          <stop offset="1" stopColor="#FF9A44" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="30" height="30" rx="8" fill="white" stroke="#EFE6DD" strokeWidth="1" />
      <path
        d="M16 23.2c-.3 0-.6-.1-.8-.3-2.4-2-7.1-6-7.1-9.6 0-2.5 1.9-4.4 4.3-4.4 1.5 0 2.8.8 3.6 2 .8-1.2 2.1-2 3.6-2 2.4 0 4.3 1.9 4.3 4.4 0 3.6-4.7 7.6-7.1 9.6-.2.2-.5.3-.8.3Z"
        fill={`url(#${id})`}
      />
      <path
        d="M9.5 15.5h2.4l1.2-2.2 1.6 3.6 1.1-1.9h6.2"
        stroke="white"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
    </svg>
  );
}

export function GoogleFitMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <circle cx="16" cy="16" r="15" fill="white" stroke="#EDEDED" strokeWidth="1" />
      <path d="M16 3a13 13 0 0 1 11.3 6.5L16 16Z" fill="#4285F4" />
      <path d="M27.3 9.5A13 13 0 0 1 22 25.4L16 16Z" fill="#EA4335" />
      <path d="M22 25.4A13 13 0 0 1 8.7 24L16 16Z" fill="#FBBC05" />
      <path d="M8.7 24A13 13 0 0 1 16 3v13Z" fill="#34A853" />
      <circle cx="16" cy="16" r="6.2" fill="white" />
      <path
        d="M13.2 16.4h1.4l.9-1.6 1.1 2.6.8-1.4h2.4"
        stroke="#4285F4"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
