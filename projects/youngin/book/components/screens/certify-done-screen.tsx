"use client";

import { Icon } from "@iconify/react";
import { THIS_MONTH, USER } from "@/projects/youngin/book/lib/mock-data";
import type { BookNavigate } from "@/projects/youngin/book/lib/navigation";
import { BadgeMark, Stamp } from "@/projects/youngin/book/components/stamp";

type Kind = "visit" | "read";

const COPY: Record<
  Kind,
  {
    eyebrow: string;
    headline: string;
    stampLabel: string;
    stampDate: string;
    rows: { label: string; value: string }[];
    badge?: { name: string; description: string; icon: string };
  }
> = {
  visit: {
    eyebrow: "방문 인증 완료",
    headline: "처인도서관\n방문 스탬프를 받았어요",
    stampLabel: "처인",
    stampDate: "2026.08.07",
    rows: [
      { label: "적립 스탬프", value: "방문 2개 (신규 지점 2배)" },
      { label: "미션 진행", value: "아직 안 가 본 지점 두 곳 1/2" },
      { label: "이번 달 방문", value: "5곳" },
    ],
    badge: undefined,
  },
  read: {
    eyebrow: "완독 인증 완료",
    headline: "물의 기억\n완독 스탬프를 받았어요",
    stampLabel: "완독",
    stampDate: "2026.08.07",
    rows: [
      { label: "적립 스탬프", value: "완독 2개 (추천도서 가산)" },
      { label: "미션 진행", value: "8월의 책 1/1 달성" },
      { label: "이번 달 완독", value: "7권" },
    ],
    badge: {
      name: "추천도서 완독",
      description: "이달의 추천도서를 완독했습니다",
      icon: "solar:medal-ribbon-star-bold",
    },
  },
};

export function CertifyDoneScreen({
  kind = "read",
  onNavigate,
}: {
  kind?: string;
  onNavigate: BookNavigate;
}) {
  const copy = COPY[(kind === "visit" ? "visit" : "read") as Kind];

  return (
    <div
      className="flex min-h-full flex-col px-6 pb-[42px] pt-[59px]"
      style={{ background: "var(--bk-dark)" }}
    >
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={() => onNavigate("home")}
          aria-label="닫기"
          className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full"
        >
          <Icon
            icon="solar:close-circle-linear"
            width="24"
            height="24"
            color="var(--bk-on-dark-muted)"
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center pb-6">
        <Stamp
          label={copy.stampLabel}
          date={copy.stampDate}
          kind={kind === "visit" ? "visit" : "read"}
          seed={copy.stampLabel}
          size={132}
          animate
          color="#6FB891"
        />

        <p className="mt-7 text-[12.5px] font-semibold tracking-[0.02em] text-[#6FB891]">
          {copy.eyebrow}
        </p>
        <h1 className="mt-2 whitespace-pre-line text-center text-[24px] font-bold leading-[1.35] tracking-[-0.02em] text-[var(--bk-on-dark)]">
          {copy.headline}
        </h1>

        <div
          className="mt-5 w-full rounded-[14px] p-1"
          style={{ background: "var(--bk-dark-soft)" }}
        >
          {copy.rows.map((row, index) => (
            <div key={row.label}>
              {index > 0 && (
                <div className="mx-4 h-px" style={{ background: "rgba(240,238,228,0.08)" }} />
              )}
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-[13px] text-[var(--bk-on-dark-muted)]">{row.label}</span>
                <span className="book-num text-[13.5px] font-semibold text-[var(--bk-on-dark)]">
                  {row.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {copy.badge && (
          <div
            className="mt-3 flex w-full items-center gap-3.5 rounded-[14px] p-4"
            style={{ background: "rgba(111,184,145,0.12)" }}
          >
            <BadgeMark tier="gold" icon={copy.badge.icon} earned size={48} />
            <div className="min-w-0 flex-1">
              <p className="text-[11.5px] font-semibold text-[#6FB891]">새 배지 획득</p>
              <p className="mt-0.5 text-[15px] font-semibold text-[var(--bk-on-dark)]">
                {copy.badge.name}
              </p>
              <p className="mt-0.5 text-[12px] text-[var(--bk-on-dark-muted)]">
                {copy.badge.description}
              </p>
            </div>
          </div>
        )}

        <p className="book-num mt-4 text-center text-[12.5px] leading-[1.6] text-[var(--bk-on-dark-muted)]">
          {USER.nickname}님의 누적 스탬프 {USER.totalStamps + 2}개
          <br />
          {THIS_MONTH.label} 참여자 상위 {THIS_MONTH.rankPercent}%
        </p>
      </div>

      <div className="grid gap-2.5">
        <button
          type="button"
          onClick={() => onNavigate("record")}
          className="h-[52px] w-full rounded-[10px] text-[15.5px] font-semibold transition-transform duration-150 active:scale-[0.97]"
          style={{ background: "#6FB891", color: "#0F1A15" }}
        >
          내 독서기록 보기
        </button>
        <button
          type="button"
          onClick={() => onNavigate("share")}
          className="h-[48px] w-full rounded-[10px] border text-[14.5px] font-semibold"
          style={{ borderColor: "rgba(240,238,228,0.2)", color: "var(--bk-on-dark)" }}
        >
          가족, 친구에게 공유하기
        </button>
      </div>
    </div>
  );
}
