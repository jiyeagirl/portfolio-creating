"use client";

/*
 * 사용자 웹(다크 우선) 프리미티브. 토큰은 styles/eduon.css의 --eo-*.
 * 눌림 피드백은 배경 톤만 (design.md Motion). 썸네일 16:9, radius 10.
 */

import { useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Play, X } from "@phosphor-icons/react";
import { photoUrl } from "@/projects/platform/eduon/lib/mock-data";
import type { Course } from "@/projects/platform/eduon/lib/types";

/*
 * 디자인시스템 jobright: 기본 CTA는 블랙 필(brand), 민트 그린 필(signature)은 구독하기 한 가지 행동에만.
 * light는 바탕 반대색 필 (흰 바탕에서는 블랙, 영상 위 .eo-dark에서는 흰색).
 */
type Variant = "brand" | "signature" | "light" | "outline" | "ghost";

const VARIANT: Record<Variant, string> = {
  brand: "bg-[var(--eo-ink)] text-white hover:bg-[var(--eo-ink-hover)] active:bg-[var(--eo-ink-press)]",
  signature: "border border-black bg-[var(--eo-brand)] text-black hover:bg-[var(--eo-brand-hover)] active:bg-[var(--eo-brand-press)]",
  light: "bg-[var(--eo-fg)] text-[var(--eo-canvas)] hover:opacity-90 active:opacity-80",
  outline: "border border-[var(--eo-hair-2)] text-[var(--eo-fg)] hover:bg-[var(--eo-raised-2)] active:bg-[var(--eo-raised-3)]",
  ghost: "text-[var(--eo-fg-2)] hover:bg-[var(--eo-raised-2)] hover:text-[var(--eo-fg)] active:bg-[var(--eo-raised-3)]",
};

export function Btn({
  variant = "outline",
  size = "md",
  icon,
  children,
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: "sm" | "md" | "lg"; icon?: ReactNode }) {
  const sz = size === "sm" ? "h-9 px-4 text-[14px]" : size === "lg" ? "h-12 px-6 text-[16px]" : "h-11 px-5 text-[15px]";
  return (
    <button
      type="button"
      {...rest}
      className={`inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--eo-focus)] disabled:cursor-not-allowed disabled:opacity-40 ${sz} ${VARIANT[variant]} ${className}`}
    >
      {icon}
      {children}
    </button>
  );
}

export function IconBtn({ label, children, onClick, className = "" }: { label: string; children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--eo-fg-2)] transition-colors hover:bg-[var(--eo-raised-2)] hover:text-[var(--eo-fg)] active:bg-[var(--eo-raised-3)] ${className}`}
    >
      {children}
    </button>
  );
}

export function Chip({ on, children, onClick }: { on: boolean; children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`inline-flex h-9 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-[14px] font-medium transition-colors ${
        on
          ? "bg-[var(--eo-fg)] text-[var(--eo-canvas)]"
          : "border border-[var(--eo-hair-2)] text-[var(--eo-fg-2)] hover:bg-[var(--eo-raised-2)] hover:text-[var(--eo-fg)]"
      }`}
    >
      {children}
    </button>
  );
}

export function CourseImage({ course, w = 640, className = "", children }: { course: Course; w?: number; className?: string; children?: ReactNode }) {
  return (
    <div className={`relative aspect-video overflow-hidden rounded-[16px] bg-[var(--eo-raised-2)] ${className}`}>
      <CourseFill course={course} w={w} />
      {children}
    </div>
  );
}

/** 썸네일을 칸에 꽉 채운다. 이미지가 없으면 썸네일과 같은 톤의 타이틀 타일 */
export function CourseFill({ course, w = 960 }: { course: Course; w?: number }) {
  if (course.photo !== null)
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={photoUrl(course.photo, w, Math.round((w * 9) / 16))} alt="" className="absolute inset-0 h-full w-full object-cover" />;
  return (
    <span className="absolute inset-0 flex flex-col justify-end bg-[#14171c] p-[7%] text-left text-white [container-type:inline-size]">
      <span className="absolute left-[5%] top-[7%] rounded-[4px] bg-[var(--eo-brand)] px-[1.6cqw] py-[0.6cqw] text-[3.4cqw] font-bold leading-none text-black">EduOn</span>
      <span className="text-[6.6cqw] font-bold leading-[1.25] tracking-[-0.01em]">{course.title}</span>
    </span>
  );
}

export function PlayMark({ size = 44 }: { size?: number }) {
  return (
    <span
      className="flex items-center justify-center rounded-full bg-[rgba(15,18,22,0.72)] text-white"
      style={{ width: size, height: size }}
    >
      <Play size={size * 0.42} weight="fill" />
    </span>
  );
}

/** 진행 막대 (이어보기, 플레이어 탐색). 4px */
export function Meter({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`h-1 w-full overflow-hidden rounded-full bg-[rgba(0,0,0,0.14)] ${className}`}>
      <div className="h-full rounded-full bg-[var(--eo-brand)]" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

/** 섹션 진입 1회 (IntersectionObserver). design.md Motion */
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    /* 스크롤 없이 찍는 전체 페이지 캡처나 인쇄에서도 비지 않도록 잠시 뒤에는 무조건 보인다 */
    const fallback = window.setTimeout(() => setSeen(true), 900);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);
  return (
    <div ref={ref} className={`${seen ? "eo-rise" : "opacity-0"} ${className}`}>
      {children}
    </div>
  );
}

/** 우측 슬라이드오버 (데스크톱) / 아래에서 올라오는 시트 (모바일) */
export function Sheet({ open, onClose, label, children, width = 520 }: { open: boolean; onClose: () => void; label: string; children: ReactNode; width?: number }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="닫기" onClick={onClose} className="eo-fade absolute inset-0 bg-[rgba(0,0,0,0.4)]" />
      <style>{`@keyframes eo-sheet-up{from{transform:translateY(100%)}to{transform:none}}@keyframes eo-sheet-in{from{opacity:0;transform:translateX(32px)}to{opacity:1;transform:none}}`}</style>
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className="eo-thin-scroll absolute inset-x-0 bottom-0 top-0 flex flex-col overflow-y-auto bg-[var(--eo-canvas)] [animation:eo-sheet-up_300ms_var(--eo-ease)_both] md:inset-y-0 md:left-auto md:right-0 md:w-[var(--sheet-w)] md:border-l md:border-[var(--eo-hair)] md:shadow-[var(--eo-float-shadow)] md:[animation:eo-sheet-in_300ms_var(--eo-ease)_both]"
        style={{ ["--sheet-w" as string]: `${width}px` }}
      >
        <IconBtn label="닫기" onClick={onClose} className="absolute right-3 top-3 z-10 bg-[rgba(15,18,22,0.7)] text-white">
          <X size={20} />
        </IconBtn>
        {children}
      </aside>
    </div>
  );
}

export function Dialog({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button type="button" aria-label="닫기" onClick={onClose} className="eo-fade absolute inset-0 bg-[rgba(0,0,0,0.4)]" />
      <div role="dialog" aria-modal="true" className="eo-rise relative w-full max-w-[480px] rounded-t-[24px] border border-[var(--eo-hair)] bg-[var(--eo-canvas)] p-6 shadow-[var(--eo-float-shadow)] sm:rounded-[24px]">
        <h2 className="pr-8 text-[24px] font-semibold leading-[32px]">{title}</h2>
        <button type="button" aria-label="닫기" onClick={onClose} className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-[var(--eo-fg-3)] hover:bg-[var(--eo-raised-2)]">
          <X size={18} />
        </button>
        <div className="mt-4 text-[15px] leading-[24px] text-[var(--eo-fg-2)]">{children}</div>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">{footer}</div>
      </div>
    </div>
  );
}


export function useSiteToast() {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    if (!msg) return;
    const t = window.setTimeout(() => setMsg(null), 2800);
    return () => window.clearTimeout(t);
  }, [msg]);
  const node = msg ? (
    <div role="status" className="eo-rise fixed bottom-6 left-1/2 z-[70] w-max max-w-[calc(100%-32px)] -translate-x-1/2 rounded-full bg-[var(--eo-fg)] px-5 py-3 text-[14px] font-medium text-[var(--eo-canvas)] shadow-[var(--eo-float-shadow)]">
      {msg}
    </div>
  ) : null;
  return { show: setMsg, node };
}
