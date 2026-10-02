"use client";

/* 07-b 축제 상세 — 기간, 시간, 프로그램, 장소, 부스/편의시설.
   프로그램은 시간대별 아코디언으로 접어 화면 길이를 통제한다. */

import Image from "next/image";
import { useState } from "react";
import {
  CalendarBlank,
  CaretDown,
  Confetti,
  MapPin,
  NavigationArrow,
  Storefront,
  Tent,
} from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { AbstractMap, fitView } from "@/projects/youngin/real/components/abstract-map";
import { Badge, SectionHead } from "@/projects/youngin/real/components/ui";
import {
  QR_POINT,
  districtById,
  festivalById,
  formatDistance,
} from "@/projects/youngin/real/lib/mock-data";
import type { Route } from "@/projects/youngin/real/lib/navigation";

export function FestivalDetailScreen({
  festivalId,
  onNavigate,
  onBack,
}: {
  festivalId: string;
  onNavigate: (route: Route) => void;
  onBack: () => void;
}) {
  const festival = festivalById(festivalId);
  const [openProgram, setOpenProgram] = useState(0);

  if (!festival) {
    return (
      <div className="min-h-full bg-[var(--cp-canvas)]">
        <ScreenHeader
          title="축제"
          onBack={onBack}
          className="bg-[var(--cp-surface)] border-[var(--cp-hairline)]"
          titleClassName="text-[15.5px] font-bold text-[var(--cp-ink)]"
        />
        <p className="px-5 py-10 text-center text-[13px] text-[var(--cp-mute)]">
          축제 정보를 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  const district = districtById(festival.districtId);

  return (
    <div className="min-h-full bg-[var(--cp-canvas)] pb-[112px]">
      <ScreenHeader
        title={festival.name}
        onBack={onBack}
        className="bg-[var(--cp-surface)] border-[var(--cp-hairline)]"
        titleClassName="text-[15.5px] font-bold tracking-[-0.02em] text-[var(--cp-ink)]"
      />

      <div className="relative">
        <Image
          src={`https://picsum.photos/id/${festival.photo}/786/460`}
          alt={festival.photoAlt}
          width={393}
          height={230}
          className={`h-[204px] w-full object-cover ${
            festival.status === "종료" ? "opacity-60 grayscale" : ""
          }`}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(20,24,30,0) 42%, rgba(20,24,30,0.76) 100%)",
          }}
        />
        {/* 아래 시트가 -mt-6 로 사진을 파고들어오므로 히어로 카피는 pb-11 로 띄운다 */}
        <div className="absolute inset-x-0 bottom-0 p-5 pb-11">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge
              tone={
                festival.status === "진행중" ? "danger" : festival.status === "예정" ? "warn" : "neutral"
              }
              dot={festival.status === "진행중"}
            >
              {festival.status}
            </Badge>
            <span className="cp-num rounded-full bg-white/22 px-2 py-[3px] text-[10.5px] font-semibold text-white">
              {district?.zoneCode ?? festival.venue} |{" "}
              {festival.distance === 0 ? "지금 계신 상권" : formatDistance(festival.distance)}
            </span>
          </div>
          <h1 className="mt-2 flex items-start gap-2 text-[23px] font-extrabold leading-7 tracking-[-0.03em] text-white">
            <Confetti size={22} weight="fill" className="mt-1 shrink-0" />
            {festival.name}
          </h1>
        </div>
      </div>

      {/* 기본 정보 — 사진 위로 올라오는 시트.
          좌우 여백이 있는 카드로 겹치면 카드 양옆으로 사진 끝단이 비어져 나온다.
          화면 폭을 꽉 채우고 위쪽만 둥글려 사진 하단을 완전히 덮는다. */}
      <section className="relative z-10 -mt-6 rounded-t-[24px] bg-[var(--cp-surface)] px-5 pb-5 pt-5">
        <div>
          <p className="text-[13.5px] leading-[20px] text-[var(--cp-body)]">{festival.summary}</p>
          <dl className="mt-3.5 border-t border-[var(--cp-hairline)]">
            {[
              { label: "기간", value: festival.period, icon: CalendarBlank },
              { label: "시간", value: festival.time, icon: CalendarBlank },
              /* 장소 이름만으로는 어디인지 알 수 없어 도로명 주소를 아래 줄에 붙인다 */
              { label: "장소", value: festival.venue, sub: festival.address, icon: MapPin },
            ].map((row, index) => (
              <div
                key={row.label}
                className={`flex items-start justify-between gap-4 py-3 ${
                  index > 0 ? "border-t border-[var(--cp-hairline)]" : ""
                }`}
              >
                <dt className="shrink-0 text-[13px] text-[var(--cp-mute)]">{row.label}</dt>
                <dd className="cp-num min-w-0 text-right text-[13px] font-semibold text-[var(--cp-ink)]">
                  {row.value}
                  {row.sub && (
                    <span className="mt-0.5 block text-[12px] font-medium text-[var(--cp-mute)]">
                      {row.sub}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>

          {district && (
            <button
              type="button"
              onClick={() => onNavigate({ name: "districtDetail", districtId: district.id })}
              className="mt-1 flex w-full items-center gap-3 border-t border-[var(--cp-hairline)] pt-3.5 text-left"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[var(--cp-accent-soft)] text-[var(--cp-accent)]">
                <Storefront size={17} weight="fill" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11.5px] font-semibold text-[var(--cp-mute)]">
                  주최 상점가
                </span>
                <span className="block truncate text-[13.5px] font-bold text-[var(--cp-accent)]">
                  {district.name} 상세 보기
                </span>
              </span>
            </button>
          )}
        </div>
      </section>

      {/* 프로그램 */}
      <section className="mt-7 px-5">
        <SectionHead
          title="프로그램"
          desc={`${festival.programs.length}개 / 시간대별`}
        />
        <div className="mt-3 overflow-hidden rounded-2xl bg-[var(--cp-surface)] px-4 shadow-[var(--cp-shadow)]">
          {festival.programs.map((program, index) => {
            const open = openProgram === index;
            return (
              <div
                key={program.title}
                className={index > 0 ? "border-t border-[var(--cp-hairline)]" : ""}
              >
                <button
                  type="button"
                  onClick={() => setOpenProgram(open ? -1 : index)}
                  aria-expanded={open}
                  className="flex w-full items-center gap-3 py-3.5 text-left"
                >
                  <span className="min-w-0 flex-1">
                    <span className="cp-num block text-[11.5px] font-bold text-[var(--cp-accent)]">
                      {program.time}
                    </span>
                    <span className="mt-0.5 block text-[14.5px] font-bold tracking-[-0.02em] text-[var(--cp-ink)]">
                      {program.title}
                    </span>
                  </span>
                  <CaretDown
                    size={14}
                    weight="bold"
                    className={`shrink-0 text-[var(--cp-faint)] transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {open && (
                  <p className="pb-4 text-[13px] leading-[19px] text-[var(--cp-body)]">
                    {program.detail}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 부스, 편의시설 */}
      <section className="mt-7 px-5">
        <SectionHead title="부스 / 편의시설" desc="행사 기간에만 운영합니다" />
        <ul className="mt-3 grid grid-cols-2 gap-2.5">
          {festival.booths.map((booth) => (
            <li
              key={booth.label}
              className="rounded-2xl bg-[var(--cp-surface)] p-3.5 shadow-[var(--cp-shadow)]"
            >
              <Tent size={19} weight="fill" className="text-[var(--cp-accent)]" />
              <p className="mt-2 text-[13px] font-semibold text-[var(--cp-body)]">{booth.label}</p>
              <p className="cp-num mt-0.5 text-[17px] font-extrabold tracking-[-0.02em] text-[var(--cp-ink)]">
                {booth.count}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* 위치 */}
      <section className="mt-7 px-5">
        <SectionHead title="행사 위치" desc="QR 지점 기준 상대 위치" />
        <div className="mt-3 overflow-hidden rounded-2xl shadow-[var(--cp-shadow)]">
          {/* 작은 지도라 라벨이 두 개면 서로 겹친다. 행사 마커는 아이콘만 두고
              "현재 위치" 라벨 하나만 남긴다. 구역에 맞춰 창을 잘라 확대한다. */}
          <AbstractMap
            className="h-[176px] w-full"
            qrPoint={QR_POINT.coordinates}
            qrLabel="현재 위치"
            view={
              district
                ? fitView([...district.polygon, QR_POINT.coordinates], {
                    aspect: 353 / 176,
                    fill: 0.78,
                  })
                : undefined
            }
            polygons={district ? [{ id: district.id, points: district.polygon }] : []}
            markers={
              district
                ? [
                    {
                      id: festival.id,
                      point: district.center,
                      fg: "var(--cp-accent)",
                      icon: Confetti,
                      active: true,
                    },
                  ]
                : []
            }
          />
        </div>
      </section>

      <div className="absolute inset-x-0 bottom-0 z-30 border-t border-[var(--cp-hairline)] bg-[var(--cp-surface)] px-5 pb-[34px] pt-3">
        <button
          type="button"
          onClick={() =>
            onNavigate(
              district
                ? { name: "districtDetail", districtId: district.id }
                : { name: "festivals" },
            )
          }
          className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[var(--cp-accent)] text-[16px] font-bold text-[var(--cp-on-accent)] transition-transform active:scale-[0.98]"
        >
          <NavigationArrow size={18} weight="fill" />
          행사장 상점가 보기
        </button>
      </div>
    </div>
  );
}
