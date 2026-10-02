"use client";

/* 03 길찾기 — QR 지점이 출발점으로 고정되고 목적지만 바꾸는 구조.
   강조 화면(spec.md 7절 1순위). 경로는 추상 지도 위 폴리라인 + 구간별 안내 리스트로 만든다. */

import { useState } from "react";
import {
  ArrowElbowLeft,
  ArrowElbowRight,
  ArrowUp,
  Clock,
  Flag,
  MagnifyingGlass,
  MapPin,
  NavigationArrow,
  PersonSimpleWalk,
  Path,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { AbstractMap, fitView } from "@/projects/youngin/real/components/abstract-map";
import { Badge, FACILITY_TONE } from "@/projects/youngin/real/components/ui";
import {
  FACILITIES,
  QR_POINT,
  STORES,
  destinationById,
  formatDistance,
} from "@/projects/youngin/real/lib/mock-data";
import { routeTo, type Maneuver } from "@/projects/youngin/real/lib/routes";
import type { Route } from "@/projects/youngin/real/lib/navigation";
import type { FacilityType } from "@/projects/youngin/real/lib/types";

const MANEUVER_ICON: Record<Maneuver, Icon> = {
  start: NavigationArrow,
  straight: ArrowUp,
  left: ArrowElbowLeft,
  right: ArrowElbowRight,
  cross: PersonSimpleWalk,
  arrive: Flag,
};

/** 목적지 후보 — 지도에서 고르는 대신 화면 안에서 바로 바꿔 볼 수 있게 한다. */
const CANDIDATES = [
  ...FACILITIES.slice(0, 6).map((f) => ({ id: f.id, name: f.displayName, tag: f.type as string })),
  ...STORES.slice(0, 3).map((s) => ({ id: s.id, name: s.name, tag: s.subCategory })),
];

export function DirectionsScreen({
  targetId,
  onNavigate,
  onBack,
}: {
  targetId: string;
  onNavigate: (route: Route) => void;
  onBack: () => void;
}) {
  const [current, setCurrent] = useState(targetId);
  const [started, setStarted] = useState(false);

  const target = destinationById(current);
  const walk = routeTo(current);

  if (!target || !walk) {
    return (
      <div className="min-h-full bg-[var(--cp-canvas)]">
        <ScreenHeader
          title="길찾기"
          onBack={onBack}
          className="bg-[var(--cp-surface)] border-[var(--cp-hairline)]"
          titleClassName="text-[15.5px] font-bold text-[var(--cp-ink)]"
        />
        <p className="px-5 py-10 text-center text-[13px] text-[var(--cp-mute)]">
          목적지 정보를 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  const facilityType = FACILITIES.find((f) => f.id === current)?.type as FacilityType | undefined;
  const tone = facilityType ? FACILITY_TONE[facilityType] : undefined;
  const arriveAt = `${15}:${String(24 + walk.minutes).padStart(2, "0")}`;

  return (
    <div className="min-h-full bg-[var(--cp-canvas)] pb-[104px]">
      <ScreenHeader
        title="도보 길찾기"
        subtitle={`${QR_POINT.code} 지점 출발`}
        onBack={onBack}
        className="bg-[var(--cp-surface)] border-[var(--cp-hairline)]"
        titleClassName="text-[15.5px] font-bold tracking-[-0.02em] text-[var(--cp-ink)]"
        subtitleClassName="cp-num text-[11px] text-[var(--cp-mute)]"
      />

      {/* 출발지와 목적지가 몇 퍼센트 안에 붙어 있어 전체 지도로는 경로가 점처럼 보인다.
          경로 바운딩 박스에 맞춰 창을 잘라 확대한다(지도 박스 393x268 비율). */}
      <AbstractMap
        className="h-[268px] w-full border-b border-[var(--cp-hairline)]"
        qrPoint={QR_POINT.coordinates}
        qrLabel="출발"
        route={walk.waypoints}
        view={fitView(walk.waypoints, { aspect: 393 / 268, fill: 0.5, min: 20 })}
        markers={[
          {
            id: target.id,
            point: target.coordinates,
            fg: tone?.fg ?? "var(--cp-accent)",
            icon: tone?.icon ?? MapPin,
            active: true,
            label: target.name,
          },
        ]}
      />

      {/* 요약 시트 — 지도 위로 올려 화면 위쪽 리듬을 끊는다.
          좌우 여백이 있는 카드로 겹치면 카드 양옆으로 지도 끝단이 비어져 나오므로
          화면 폭을 꽉 채우고 위쪽만 둥글린다. */}
      <section className="relative z-10 -mt-6 rounded-t-[24px] bg-[var(--cp-surface)] px-5 pb-5 pt-5">
        <div>
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-[var(--cp-mute)]">예상 도보</p>
              <p className="cp-num mt-1 text-[30px] font-extrabold leading-9 tracking-[-0.03em] text-[var(--cp-ink)]">
                {walk.minutes}분
                <span className="ml-2 text-[17px] font-bold text-[var(--cp-body)]">
                  {formatDistance(walk.distance)}
                </span>
              </p>
            </div>
            <p className="cp-num shrink-0 rounded-full bg-[var(--cp-accent-soft)] px-2.5 py-1.5 text-[12px] font-bold text-[var(--cp-accent)]">
              {arriveAt} 도착
            </p>
          </div>

          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {walk.notes.map((note) => (
              <Badge key={note} tone="line">
                {note}
              </Badge>
            ))}
          </div>

          <div className="mt-4 space-y-0 border-t border-[var(--cp-hairline)] pt-3.5">
            <div className="flex items-center gap-2.5 py-1.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--cp-ink)] text-white">
                <NavigationArrow size={12} weight="fill" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10.5px] font-bold text-[var(--cp-faint)]">출발 (고정)</span>
                <span className="block truncate text-[13.5px] font-semibold text-[var(--cp-ink)]">
                  {QR_POINT.label}
                </span>
              </span>
            </div>
            <div className="ml-3 h-3 w-px bg-[var(--cp-hairline-strong)]" />
            <div className="flex items-center gap-2.5 py-1.5">
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white"
                style={{ background: tone?.fg ?? "var(--cp-accent)" }}
              >
                <Flag size={12} weight="fill" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10.5px] font-bold text-[var(--cp-faint)]">도착</span>
                <span className="block truncate text-[13.5px] font-semibold text-[var(--cp-ink)]">
                  {target.name}
                </span>
                <span className="block truncate text-[11.5px] text-[var(--cp-mute)]">
                  {target.address}
                </span>
              </span>
              <span className="cp-num shrink-0 rounded-full bg-[var(--cp-sunken)] px-2 py-1 text-[11px] font-bold text-[var(--cp-body)]">
                {target.kind}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 목적지 바꾸기 */}
      <section className="mt-6">
        <div className="flex items-center gap-2 px-5">
          <MagnifyingGlass size={15} weight="bold" className="text-[var(--cp-mute)]" />
          <h2 className="text-[14px] font-bold tracking-[-0.02em] text-[var(--cp-ink)]">
            목적지 바꾸기
          </h2>
          <span className="cp-num text-[12px] text-[var(--cp-mute)]">
            지도에서 마커를 눌러도 됩니다
          </span>
        </div>
        <div className="mt-2.5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CANDIDATES.map((c) => {
            const active = c.id === current;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setCurrent(c.id);
                  setStarted(false);
                }}
                aria-pressed={active}
                className={`shrink-0 rounded-[14px] border px-3.5 py-2.5 text-left transition-colors ${
                  active
                    ? "border-[var(--cp-accent)] bg-[var(--cp-accent-soft)]"
                    : "border-[var(--cp-hairline)] bg-[var(--cp-surface)]"
                }`}
              >
                <span
                  className={`block max-w-[148px] truncate text-[13px] font-bold ${
                    active ? "text-[var(--cp-accent)]" : "text-[var(--cp-ink)]"
                  }`}
                >
                  {c.name}
                </span>
                <span className="mt-0.5 block text-[11px] text-[var(--cp-mute)]">{c.tag}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 구간별 안내 */}
      <section className="mt-7 px-5">
        <div className="flex items-baseline justify-between">
          <h2 className="flex items-center gap-1.5 text-[17px] font-extrabold tracking-[-0.02em] text-[var(--cp-ink)]">
            <Path size={17} weight="bold" className="text-[var(--cp-accent)]" />
            구간 안내
          </h2>
          <span className="cp-num text-[12px] font-semibold text-[var(--cp-mute)]">
            {walk.steps.length}개 구간
          </span>
        </div>

        <ol className="mt-3 rounded-2xl bg-[var(--cp-surface)] px-4 shadow-[var(--cp-shadow)]">
          {walk.steps.map((step, index) => {
            const Icon = MANEUVER_ICON[step.maneuver];
            const last = index === walk.steps.length - 1;
            return (
              /* 구분선은 li 에 건다. 안쪽 span 은 항상 마지막 자식이라
                 last:border-b-0 이 전 항목에 걸려 선이 아예 안 그려졌다. */
              <li
                key={`${step.title}-${index}`}
                className="relative flex gap-3 border-b border-[var(--cp-hairline)] py-4 last:border-b-0"
              >
                {!last && (
                  <span className="absolute bottom-0 left-[15px] top-[42px] w-px bg-[var(--cp-hairline)]" />
                )}
                <span
                  className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    step.maneuver === "arrive"
                      ? "bg-[var(--cp-accent)] text-[var(--cp-on-accent)]"
                      : "bg-[var(--cp-sunken)] text-[var(--cp-body)]"
                  }`}
                >
                  <Icon size={15} weight="bold" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="text-[14.5px] font-bold tracking-[-0.02em] text-[var(--cp-ink)]">
                      {step.title}
                    </span>
                    {step.distance > 0 && (
                      <span className="cp-num shrink-0 text-[12.5px] font-bold text-[var(--cp-accent)]">
                        {step.distance}m
                      </span>
                    )}
                  </span>
                  <span className="mt-1 block text-[12.5px] leading-[18px] text-[var(--cp-body)]">
                    {step.detail}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>

        <p className="cp-num mt-3 flex items-center gap-1.5 px-1 text-[11px] text-[var(--cp-faint)]">
          <Clock size={12} weight="fill" />
          보행 속도 시속 4km 기준 / 신호 대기는 포함하지 않았습니다
        </p>
      </section>

      {/* 하단 고정 CTA — 프레임 바닥에 닿으므로 불투명 표면 + absolute 만 쓴다 */}
      <div className="absolute inset-x-0 bottom-0 z-30 border-t border-[var(--cp-hairline)] bg-[var(--cp-surface)] px-5 pb-[34px] pt-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onNavigate({ name: "map", focusId: current })}
            aria-label="지도에서 보기"
            className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-[var(--cp-hairline)] text-[var(--cp-body)] transition-colors active:bg-[var(--cp-sunken)]"
          >
            <MapPin size={20} weight="bold" />
          </button>
          <button
            type="button"
            onClick={() => setStarted((prev) => !prev)}
            className={`h-[52px] flex-1 rounded-full text-[16px] font-bold transition-transform active:scale-[0.98] ${
              started
                ? "border border-[var(--cp-hairline)] bg-[var(--cp-surface)] text-[var(--cp-body)]"
                : "bg-[var(--cp-accent)] text-[var(--cp-on-accent)]"
            }`}
          >
            {started ? `안내 중 / ${formatDistance(walk.distance)} 남음` : "도보 안내 시작"}
          </button>
        </div>
      </div>
    </div>
  );
}
