"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import {
  Card,
  Chip,
  GlyphTile,
  ProgressBar,
  SectionHead,
} from "@/projects/youngin/festival/components/ui";
import {
  BADGES,
  FESTIVAL,
  MISSIONS,
  getFacility,
} from "@/projects/youngin/festival/lib/mock-data";
import type { FestivalNavigate } from "@/projects/youngin/festival/lib/navigation";

export function MissionScreen({
  doneIds,
  onComplete,
  onNavigate,
}: {
  doneIds: string[];
  onComplete: (id: string) => void;
  onNavigate: FestivalNavigate;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  const done = MISSIONS.filter((m) => doneIds.includes(m.id));
  const todo = MISSIONS.filter((m) => !doneIds.includes(m.id));
  const percent = Math.round((done.length / MISSIONS.length) * 100);
  const nextBadge = BADGES.find((b) => b.require > done.length);

  return (
    <div className="fs-screen-in pb-[104px]">
      <header
        className="sticky top-0 z-20 pb-4 pt-[59px]"
        style={{ background: "var(--fs-surface)", boxShadow: "0 1px 0 var(--fs-line)" }}
      >
        <div className="flex items-end justify-between gap-3 px-5 pt-3">
          <div>
            <h1 className="text-[21px] font-bold leading-[27px] text-[var(--fs-ink)]">
              미션 참여
            </h1>
            <p className="festival-num mt-0.5 text-[12.5px] text-[var(--fs-muted)]">
              {FESTIVAL.today} {FESTIVAL.dayLabel} | 미션 {MISSIONS.length}개
            </p>
          </div>
          <Chip tone="gold" icon="solar:gift-bold">
            기념품 응모
          </Chip>
        </div>
      </header>

      {/* 진행 현황 */}
      <section className="px-5 pt-4">
        <div className="rounded-[14px] px-4 py-4" style={{ background: "var(--fs-dark)" }}>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[12px] font-semibold" style={{ color: "var(--fs-on-dark-muted)" }}>
                오늘의 미션 진행률
              </p>
              <p
                className="festival-num mt-1 text-[32px] font-bold leading-[38px]"
                style={{ color: "var(--fs-on-dark)" }}
              >
                {done.length}
                <span className="text-[18px]" style={{ color: "var(--fs-on-dark-muted)" }}>
                  {" / "}
                  {MISSIONS.length}
                </span>
              </p>
            </div>
            <span
              className="festival-num text-[26px] font-bold"
              style={{ color: "var(--fs-accent)" }}
            >
              {percent}%
            </span>
          </div>
          <div className="mt-3">
            <ProgressBar percent={percent} />
          </div>
          <p className="mt-3 text-[12.5px] leading-[18px]" style={{ color: "var(--fs-on-dark-muted)" }}>
            {nextBadge
              ? `${nextBadge.require - done.length}개 더 완료하면 ${nextBadge.name} 배지를 받습니다.`
              : "모든 미션을 완료했습니다. 종합안내소에서 기념품을 받아 가세요."}
          </p>
        </div>
      </section>

      {/* 배지 */}
      <section className="pt-6">
        <SectionHead title="완료 배지" meta={`${BADGES.filter((b) => done.length >= b.require).length}개 획득`} />
        <div className="festival-scroll-x flex gap-2.5 overflow-x-auto px-5 pb-1">
          {BADGES.map((b) => {
            const got = done.length >= b.require;
            return (
              <div
                key={b.id}
                className="w-[120px] shrink-0 rounded-[14px] border px-3 py-3.5 text-center"
                style={{
                  background: got ? "var(--fs-gold-soft)" : "var(--fs-surface)",
                  borderColor: got ? "transparent" : "var(--fs-line)",
                }}
              >
                <div
                  className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full ${got ? "fs-stamp" : ""}`}
                  style={{
                    background: got ? "var(--fs-gold)" : "var(--fs-surface-sunk)",
                    color: got ? "#ffffff" : "var(--fs-faint)",
                  }}
                >
                  <Icon icon={b.icon} width="23" height="23" />
                </div>
                <p
                  className="mt-2 truncate text-[13px] font-bold"
                  style={{ color: got ? "var(--fs-gold)" : "var(--fs-faint)" }}
                >
                  {b.name}
                </p>
                <p className="mt-0.5 text-[11px] leading-[15px] text-[var(--fs-muted)]">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 남은 미션 */}
      <section className="pt-6">
        <SectionHead title="남은 미션" meta={`${todo.length}개 | 미션을 눌러 펼치세요`} />
        <div className="flex flex-col gap-2.5 px-5">
          {todo.map((m) => {
            const facility = getFacility(m.facilityId);
            const open = openId === m.id;
            return (
              <Card key={m.id} className="px-4 py-3.5">
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : m.id)}
                  aria-expanded={open}
                  className="flex w-full items-start gap-3 text-left"
                >
                  <GlyphTile icon={m.icon} tone="program" size={42} radius={12} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="truncate text-[15px] font-bold text-[var(--fs-ink)]">
                        {m.title}
                      </h3>
                      {m.needsQr && <Chip tone="line">QR 인증</Chip>}
                    </div>
                    <p className="festival-num mt-0.5 truncate text-[12px] text-[var(--fs-muted)]">
                      {facility.name} | {facility.zone}구역 | 도보 {facility.walkMin}분
                    </p>
                  </div>
                  <Icon
                    icon={open ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"}
                    width="18"
                    height="18"
                    style={{ color: "var(--fs-faint)" }}
                    className="mt-2 shrink-0"
                  />
                </button>

                {open && (
                  <div className="mt-3">
                    <p className="text-[13px] leading-[19px] text-[var(--fs-body)]">{m.desc}</p>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => onNavigate("map", facility.id)}
                        className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-[12px] text-[13.5px] font-bold transition-transform duration-150 active:scale-[0.97]"
                        style={{
                          background: "var(--fs-surface)",
                          color: "var(--fs-ink)",
                          boxShadow: "inset 0 0 0 1px var(--fs-line)",
                        }}
                      >
                        <Icon icon="solar:route-bold" width="17" height="17" />
                        지도에서 길찾기
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          /* QR이 필요 없는 미션은 위치 확인만으로 바로 완료된다. */
                          if (!m.needsQr) onComplete(m.id);
                          onNavigate(m.needsQr ? "scan" : "missionDone", m.id);
                        }}
                        className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-[12px] text-[13.5px] font-bold transition-transform duration-150 active:scale-[0.97]"
                        style={{ background: "var(--fs-accent)", color: "var(--fs-on-accent)" }}
                      >
                        <Icon
                          icon={m.needsQr ? "solar:qr-code-bold" : "solar:check-circle-bold"}
                          width="17"
                          height="17"
                        />
                        {m.needsQr ? "QR 인증하기" : "완료하기"}
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* 완료한 미션 */}
      {done.length > 0 && (
        <section className="pt-6">
          <SectionHead title="완료한 미션" meta={`${done.length}개`} />
          <div
            className="mx-5 overflow-hidden rounded-[14px] border"
            style={{ background: "var(--fs-surface)", borderColor: "var(--fs-line)" }}
          >
            {done.map((m, i) => {
              const facility = getFacility(m.facilityId);
              return (
                <div
                  key={m.id}
                  className="flex items-center gap-3 px-4 py-3.5"
                  style={{ borderTop: i === 0 ? "none" : "1px solid var(--fs-line-soft)" }}
                >
                  <GlyphTile icon={m.icon} tone="gold" size={40} radius={11} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-bold text-[var(--fs-ink)]">{m.title}</p>
                    <p className="festival-num mt-0.5 truncate text-[11.5px] text-[var(--fs-muted)]">
                      {facility.name} | {m.doneAt ?? "방금 완료"}
                    </p>
                  </div>
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    style={{ background: "var(--fs-gold)", color: "#ffffff" }}
                  >
                    <Icon icon="solar:check-read-bold" width="17" height="17" />
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 이벤트 응모 */}
      <section className="px-5 pt-6">
        <div
          className="rounded-[14px] px-4 py-4"
          style={{ background: "var(--fs-gold-soft)" }}
        >
          <div className="flex items-center gap-2">
            <Icon
              icon="solar:gift-bold"
              width="20"
              height="20"
              style={{ color: "var(--fs-gold)" }}
            />
            <h2 className="text-[14.5px] font-bold" style={{ color: "var(--fs-gold)" }}>
              기념품 응모 안내
            </h2>
          </div>
          <p className="mt-2 text-[13px] leading-[19px] text-[var(--fs-body)]">
            미션 5개를 완료하면 포은 문양 기념 배지 추첨에 자동 응모됩니다. 당첨자는 9월 20일
            17시에 종합안내소 게시판과 이 화면에서 안내합니다.
          </p>
          <p className="festival-num mt-2.5 text-[11.5px] text-[var(--fs-muted)]">
            현재 응모 상태 : {done.length >= 5 ? "응모 완료" : `미션 ${5 - done.length}개 남음`}
          </p>
        </div>
      </section>
    </div>
  );
}
