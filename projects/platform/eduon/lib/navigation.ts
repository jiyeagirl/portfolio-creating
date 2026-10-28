export const SITE_SCREENS = ["home", "course", "watch", "subscription", "mypage", "membership"] as const;
export type SiteScreen = (typeof SITE_SCREENS)[number];

export const ADMIN_SCREENS = ["content", "billing", "security"] as const;
export type AdminScreen = (typeof ADMIN_SCREENS)[number];

export const STUDIO_STATES = ["uploading", "paused", "transcoding", "failed", "review", "revision"] as const;
export type StudioState = (typeof STUDIO_STATES)[number];

export const SUB_PRESETS = ["free", "active", "cancelled", "expired"] as const;
export const PLAYBACK_STATES = ["normal", "locked", "network-error", "expired-url", "drm-error", "denied", "unsupported"] as const;
export type PlaybackState = (typeof PLAYBACK_STATES)[number];

export function pick<T extends string>(list: readonly T[], value: string | null): T | null {
  return list.includes(value as T) ? (value as T) : null;
}
