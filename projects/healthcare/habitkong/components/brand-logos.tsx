/**
 * Third-party app icons for the health-data integration rows.
 *
 * These are the real marks, not stand-ins, because an integration list that
 * shows a generic heart glyph for both providers doesn't read as a real
 * integration. Neither logo exists in Phosphor or simple-icons, so both are
 * drawn here rather than pulled from a package.
 *
 * Apple Health — geometry and color sampled from the shipping 1024px app icon
 * (heart bounding box 229x212 centred at 61.4% / 36.5% of the tile; heart
 * gradient #FF3297 -> #FF041D; tile #FFFFFF -> #ECECEC).
 * Google Fit — the four official paths from the 2018 mark, unmodified, in
 * Google's brand colors (#EA4335 / #FBBC04 / #34A853 / #4285F4).
 *
 * Both render as complete app-icon tiles (iOS squircle radius is 22.37% of the
 * tile), so they drop straight into a list row without an extra container.
 */

const SQUIRCLE = 0.2237;

export function AppleHealthLogo({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      role="img"
      aria-label="Apple Health"
      style={{ borderRadius: size * SQUIRCLE }}
    >
      <defs>
        <linearGradient id="ah-tile" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#ECECEC" />
        </linearGradient>
        <linearGradient id="ah-heart" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FF3297" />
          <stop offset="0.55" stopColor="#FF0F4C" />
          <stop offset="1" stopColor="#FF041D" />
        </linearGradient>
      </defs>

      <rect width="512" height="512" fill="url(#ah-tile)" />

      {/* Heart: 229 wide x 212 tall, centred on (314.5, 187). Stroked with its
          own fill so the lobes and the bottom tip stay rounded like Apple's. */}
      <path
        d="M314.5 285
           C 279 256 214 213 214 158
           C 214 127 237 105 265 105
           C 287 105 305 119 314.5 138
           C 324 119 342 105 364 105
           C 392 105 415 127 415 158
           C 415 213 350 256 314.5 285 Z"
        fill="url(#ah-heart)"
        stroke="url(#ah-heart)"
        strokeWidth="16"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GoogleFitLogo({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      role="img"
      aria-label="Google Fit"
      style={{ borderRadius: size * SQUIRCLE }}
    >
      <rect width="512" height="512" fill="#FFFFFF" />
      {/* Mark is 236.2 x 200 in its own units; scaled to 295 x 250 and centred
          so it reads at the same weight as the Apple heart beside it. */}
      <g transform="translate(108 131) scale(1.25)">
        <path
          fill="#EA4335"
          d="M22.6 105.8l11.9 11.9 25.7-25.6-11.8-11.9-5.4-5.4c-4.3-4.3-6.6-9.9-6.6-16 0-5.3 1.8-10.1 4.9-13.9 4.2-5.3 10.6-8.7 17.8-8.7 6.1 0 11.7 2.4 16.1 6.7l5.3 5.1 11.9 12 25.8-25.6-12-11.9-5.4-5.2C90.1 6.6 75.4 0 59.1 0 26.4 0 0 26.4 0 58.9 0 67 1.6 74.7 4.6 81.8c3 7.1 7.3 13.4 12.7 18.7l5.3 5.3"
        />
        <polyline
          fill="#FBBC04"
          points="81.5,122.2 118.2,85.7 92.4,60 60.2,92.1 60.2,92.1 34.5,117.7 48.3,131.6 60.2,143.4 72.6,131"
        />
        <polygon
          fill="#34A853"
          points="143.8,175.6 201.8,117.7 176,92.1 118.1,149.9 85.9,117.8 60.2,143.4 92.4,175.6 92.3,175.7 118.1,200 118.1,200 118.1,200 143.9,175.6 143.9,175.6"
        />
        <path
          fill="#4285F4"
          d="M218.9 100.5c12-12 18.9-30.4 17-49-2.8-28.2-26.2-49.4-54.6-51.3C163.4-1 147 5.7 135.4 17.3L92.4 60l25.7 25.7 43-42.8c5.2-5.1 12.4-7.5 19.8-6.3 9.6 1.5 17.4 9.4 18.7 19 1 7.2-1.4 14.2-6.5 19.3L176 92.1l25.8 25.6 17.1-17.2z"
        />
      </g>
    </svg>
  );
}

export const INTEGRATION_LOGO: Record<string, (props: { size?: number }) => React.ReactElement> = {
  apple: AppleHealthLogo,
  google: GoogleFitLogo,
};
