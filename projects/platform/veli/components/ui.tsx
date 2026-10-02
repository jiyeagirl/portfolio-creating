"use client";

import type { ReactNode } from "react";
import { Car, ShieldCheck } from "@phosphor-icons/react";
import { ScreenHeader as SharedScreenHeader } from "@/components/shared/screen-header";
import type {
  CallResult,
  CtiStatus,
  SafeNumberStatus,
} from "@/projects/platform/veli/lib/types";

type Tone = "neutral" | "accent" | "success" | "warning" | "danger";

/* 칩은 색을 채운 덩어리가 아니라 가는 보더 + 아주 옅은 틴트로 표시한다.
   상태를 뜻하는 톤(success/warning/danger)에만 currentColor 도트를 붙여
   "지금 이 상태다"라는 의미를 더하고, 분류 라벨(neutral/accent)에는 도트를 넣지 않는다. */
const TONE_CLASS: Record<Tone, string> = {
  neutral: "border-[var(--vl-border)] text-[var(--vl-muted)]",
  accent: "border-[var(--vl-accent)]/25 bg-[var(--vl-accent)]/[0.06] text-[var(--vl-accent)]",
  success: "border-[var(--vl-success)]/25 bg-[var(--vl-success)]/[0.06] text-[var(--vl-success)]",
  warning: "border-[var(--vl-warning)]/25 bg-[var(--vl-warning)]/[0.06] text-[var(--vl-warning)]",
  danger: "border-[var(--vl-danger)]/25 bg-[var(--vl-danger)]/[0.06] text-[var(--vl-danger)]",
};

const DOT_TONES: Tone[] = ["success", "warning", "danger"];

/* 크리덴셜 표면(--vl-card) 위에 얹히는 칩용. 보더/배경을 카드 잉크 계열로 바꿔
   대비를 확보하고, 도트만 원래 톤 색을 유지해 의미 구분은 그대로 남긴다.
   라이트/다크에서 카드 표면이 뒤집히므로 흰색 하드코딩 대신 --vl-card-ink를 쓴다. */
const TONE_DOT_VAR: Partial<Record<Tone, string>> = {
  success: "var(--vl-success)",
  warning: "var(--vl-warning)",
  danger: "var(--vl-danger)",
};

export function Badge({
  tone = "neutral",
  children,
  className = "",
  onDark = false,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  onDark?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-[3px] text-[11px] font-semibold leading-none ${
        onDark
          ? "border-[var(--vl-card-ink)]/30 bg-[var(--vl-card-ink)]/[0.14] text-[var(--vl-card-ink)]"
          : TONE_CLASS[tone]
      } ${className}`}
    >
      {DOT_TONES.includes(tone) &&
        (onDark ? (
          <span
            className="h-[5px] w-[5px] shrink-0 rounded-full"
            style={{ background: TONE_DOT_VAR[tone] }}
            aria-hidden
          />
        ) : (
          <span className="h-[5px] w-[5px] shrink-0 rounded-full bg-current" aria-hidden />
        ))}
      {children}
    </span>
  );
}

const SAFE_NUMBER_STATUS_META: Record<SafeNumberStatus, { tone: Tone }> = {
  사용중: { tone: "success" },
  만료예정: { tone: "warning" },
  만료: { tone: "danger" },
  회수됨: { tone: "neutral" },
};

export function SafeNumberStatusBadge({
  status,
  onDark = false,
}: {
  status: SafeNumberStatus;
  onDark?: boolean;
}) {
  return (
    <Badge tone={SAFE_NUMBER_STATUS_META[status].tone} onDark={onDark}>
      {status}
    </Badge>
  );
}

const CTI_STATUS_META: Record<CtiStatus, { tone: Tone }> = {
  정상: { tone: "success" },
  지연: { tone: "warning" },
  점검중: { tone: "neutral" },
};

export function CtiStatusBadge({ status }: { status: CtiStatus }) {
  return (
    <Badge tone={CTI_STATUS_META[status].tone} className="text-[11px]">
      CTI {status}
    </Badge>
  );
}

const CALL_RESULT_META: Record<CallResult, { label: string; tone: Tone }> = {
  connected: { label: "연결 성공", tone: "success" },
  missed: { label: "부재중", tone: "warning" },
  failed: { label: "연결 실패", tone: "danger" },
};

export function CallResultBadge({ result }: { result: CallResult }) {
  const meta = CALL_RESULT_META[result];
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}

/* 차량 썸네일. 실물 사진 대신 등록된 차량 색상을 반영한 틴트 타일 + 아이콘. */
export function VehicleTile({
  color,
  size = 44,
}: {
  color: string;
  size?: number;
}) {
  const tint = vehicleTint(color);
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-[12px]"
      style={{ width: size, height: size, background: tint.bg }}
    >
      <Car size={size * 0.52} weight="fill" style={{ color: tint.fg }} />
    </span>
  );
}

function vehicleTint(color: string): { bg: string; fg: string } {
  if (color.includes("화이트")) return { bg: "#eef0f2", fg: "#8a8f98" };
  if (color.includes("블랙")) return { bg: "#e7e7ea", fg: "#3a3a3e" };
  if (color.includes("그레이") || color.includes("실버")) return { bg: "#eceef1", fg: "#6b7076" };
  if (color.includes("블루")) return { bg: "#e6f0fb", fg: "#2f6fb0" };
  if (color.includes("레드")) return { bg: "#fbeceb", fg: "#b9483f" };
  return { bg: "var(--vl-accent-soft)", fg: "var(--vl-accent)" };
}

/* 프로필 아바타. 실제 얼굴 사진 대신 이니셜 모노그램. */
export function InitialAvatar({
  name,
  size = 44,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--vl-accent-soft)] font-bold text-[var(--vl-accent)] ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {name.slice(0, 1)}
    </span>
  );
}

/* 안심번호 히어로 타일. 시트 안(상세 화면)에서 쓰는 축약형 크리덴셜 표면이다.
   홈의 큰 카드는 `components/credential-card.tsx`의 `CredentialCard`를 쓴다 — 둘은
   같은 --vl-card-* 표면을 공유하되 높이와 타입 크기가 다르다. */
export function SafeNumberHero({
  number,
  vehicleNumber,
  status,
}: {
  number: string;
  vehicleNumber: string;
  status: SafeNumberStatus;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-[16px] px-5 py-5"
      style={{
        background:
          "linear-gradient(152deg, var(--vl-card-edge) 0%, var(--vl-card) 62%, var(--vl-card) 100%)",
        boxShadow: "var(--vl-shadow-card)",
      }}
    >
      <ShieldCheck
        size={104}
        weight="fill"
        className="pointer-events-none absolute -right-4 -top-4 text-[var(--vl-card-ink)] opacity-[0.06]"
        aria-hidden
      />
      <div className="relative flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--vl-card-muted)]">
          내 안심번호
        </span>
        <SafeNumberStatusBadge status={status} onDark />
      </div>
      <p className="vl-num relative mt-2.5 text-[28px] font-bold leading-none tracking-[-0.02em] text-[var(--vl-card-ink)]">
        {number}
      </p>
      <p className="relative mt-2 text-[13px] text-[var(--vl-card-muted)]">
        {vehicleNumber} 차량에 연결됨
      </p>
    </div>
  );
}

export function AppBar({
  title,
  onBack,
  right,
  subtitle,
}: {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
  subtitle?: string;
}) {
  return (
    <SharedScreenHeader
      title={title}
      subtitle={subtitle}
      onBack={onBack}
      right={right}
      className="bg-[var(--vl-elevated)] border-[var(--vl-border)]"
      backButtonClassName="text-[var(--vl-ink)] hover:bg-[var(--vl-surface)] active:translate-y-[1px] active:opacity-70"
      titleClassName="text-[16px] font-bold tracking-tight"
      subtitleClassName="text-[11.5px] text-[var(--vl-muted)]"
    />
  );
}

export function SectionHead({
  title,
  note,
  action,
  onAction,
}: {
  title: string;
  note?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3 px-5">
      <div>
        <h2 className="text-[17px] font-bold tracking-tight">{title}</h2>
        {note && <p className="mt-0.5 text-[12.5px] text-[var(--vl-muted)]">{note}</p>}
      </div>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="shrink-0 text-[12.5px] font-semibold text-[var(--vl-muted)] transition-colors hover:text-[var(--vl-ink)]"
        >
          {action}
        </button>
      )}
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled = false,
  full = true,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  full?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${full ? "w-full" : ""} rounded-full bg-[var(--vl-accent)] px-5 py-3.5 text-[15px] font-bold text-[var(--vl-accent-fg)] transition-transform active:translate-y-[1px] active:opacity-70 disabled:cursor-not-allowed disabled:bg-[var(--vl-surface)] disabled:text-[var(--vl-muted)]`}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  full = true,
}: {
  children: ReactNode;
  onClick?: () => void;
  full?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${full ? "w-full" : ""} rounded-full border border-[var(--vl-border)] bg-[var(--vl-elevated)] px-5 py-3.5 text-[15px] font-bold text-[var(--vl-ink)] transition-transform active:translate-y-[1px] active:opacity-70`}
    >
      {children}
    </button>
  );
}

export function DangerGhostButton({
  children,
  onClick,
  full = true,
}: {
  children: ReactNode;
  onClick?: () => void;
  full?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${full ? "w-full" : ""} rounded-full border border-[var(--vl-danger)]/30 bg-[var(--vl-danger-soft)] px-5 py-3.5 text-[15px] font-bold text-[var(--vl-danger)] transition-transform active:translate-y-[1px] active:opacity-70`}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  helper,
  error,
  children,
}: {
  label: string;
  helper?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[13px] font-semibold text-[var(--vl-ink)]">{label}</span>
      {children}
      {helper && !error && <span className="text-[12px] text-[var(--vl-muted)]">{helper}</span>}
      {error && <span className="text-[12px] font-semibold text-[var(--vl-danger)]">{error}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-[8px] border border-[var(--vl-border)] bg-[var(--vl-elevated)] px-4 py-3 text-[14px] text-[var(--vl-ink)] outline-none transition-colors focus:border-[var(--vl-accent)]";

export function EmptyState({
  icon,
  title,
  body,
  action,
  onAction,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-8 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--vl-surface)] text-[var(--vl-muted)]">
        {icon}
      </span>
      <div>
        <p className="text-[15px] font-bold">{title}</p>
        <p className="mt-1 text-[13px] leading-relaxed text-[var(--vl-muted)]">{body}</p>
      </div>
      {action && (
        <button
          type="button"
          onClick={onAction}
          className="mt-1 rounded-full bg-[var(--vl-accent)] px-5 py-2.5 text-[13.5px] font-bold text-[var(--vl-accent-fg)] active:translate-y-[1px] active:opacity-70"
        >
          {action}
        </button>
      )}
    </div>
  );
}

export function ListRow({
  icon,
  label,
  value,
  onClick,
  danger = false,
}: {
  icon?: ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b border-[var(--vl-divider)] px-5 py-3.5 text-left last:border-b-0"
    >
      {icon && (
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
            danger ? "bg-[var(--vl-danger-soft)] text-[var(--vl-danger)]" : "bg-[var(--vl-surface)] text-[var(--vl-muted)]"
          }`}
        >
          {icon}
        </span>
      )}
      <span className={`flex-1 text-[14px] font-normal ${danger ? "text-[var(--vl-danger)]" : "text-[var(--vl-ink)]"}`}>
        {label}
      </span>
      {value && <span className="text-[13px] text-[var(--vl-muted)]">{value}</span>}
    </button>
  );
}
