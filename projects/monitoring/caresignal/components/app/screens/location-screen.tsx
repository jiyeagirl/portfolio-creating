"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowsOutSimple, Clock, MapPin, NavigationArrow, Ruler } from "@phosphor-icons/react";
import { MiniMap } from "@/projects/monitoring/caresignal/components/mini-map";
import {
  Card,
  ScreenHeader,
  SectionTitle,
  StatTile,
  StatusBadge,
  Tag,
  Toggle,
} from "@/projects/monitoring/caresignal/components/app/ui";
import { photoUrl } from "@/projects/monitoring/caresignal/lib/photos";
import { guardians, location, riskEvents, user, visits } from "@/projects/monitoring/caresignal/lib/app-data";

/** 오늘 이동 경로. 지도 위 선과 아래 타임라인이 같은 좌표를 공유한다. */
const ROUTE = [
  { x: 40, y: 46 },
  { x: 40, y: 34 },
  { x: 54, y: 30 },
  { x: 62, y: 40 },
  { x: 68, y: 58 },
  { x: 60, y: 66 },
];

const ROUTE_STEPS = [
  { time: "오전 8시 54분", place: "자택 출발", note: "한빛아파트 3동" },
  { time: "오전 9시 12분", place: "한빛근린공원 도착", note: "340m 이동 · 42분 머무름" },
  { time: "오전 10시 40분", place: "정릉시장 입구", note: "620m 이동 · 28분 머무름" },
  { time: "오전 11시 52분", place: "자택 복귀", note: "생활권 복귀 알림 발송" },
  { time: "오후 4시 05분", place: "정릉2동 경로당", note: "240m 이동 · 1시간 12분 머무름" },
];

export function LocationScreen() {
  const [sharing, setSharing] = useState(true);
  const geofenceEvents = riskEvents.filter((event) => event.kind === "geofence");

  return (
    <div className="flex min-h-full w-full flex-col px-5 pb-[108px]">
      <ScreenHeader
        title="위치"
        description={`${location.safeZoneName} · ${location.safeZoneRadius}`}
        right={<StatusBadge status="safe" className="mt-2">생활권 안</StatusBadge>}
      />

      <MiniMap
        className="cs-image-shadow mt-5 h-[248px] w-full"
        route={ROUTE}
        markers={[
          { id: "home", x: 40, y: 46, kind: "home", label: "자택" },
          { id: "market", x: 54, y: 30, kind: "facility" },
          { id: "me", x: 60, y: 66, kind: "user", status: "safe", pulse: true, label: "현재 위치" },
        ]}
        safeZone={{ x: 48, y: 50, size: 74 }}
      />

      <Card className="mt-4 p-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eef4fb]">
            <MapPin size={19} weight="fill" className="text-[#0066cc]" />
          </span>
          <div className="flex-1">
            <p className="text-[17px] font-semibold leading-none text-[#1d1d1f]">
              {location.place}
            </p>
            <p className="mt-2 text-[13.5px] font-normal leading-[1.5] text-[#7a7a7a]">
              {location.detail} · {location.updated} 확인
            </p>
          </div>
          <button
            type="button"
            className="cs-press cs-focusable flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f5f7] text-[#333333]"
            aria-label="지도 크게 보기"
          >
            <ArrowsOutSimple size={17} weight="bold" />
          </button>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <StatTile label="오늘 이동" value={location.todayDistanceKm.toFixed(1)} unit="km" />
          <StatTile label="방문 장소" value={String(location.todayPlaces)} unit="곳" />
          <StatTile label="이탈" value="0" unit="회" />
        </div>
      </Card>

      <SectionTitle className="mt-8">안심 구역</SectionTitle>
      <div className="mt-3 divide-y divide-[#f0f0f0] rounded-[18px] border border-[#e0e0e0]">
        <div className="flex items-center gap-3 px-4 py-3.5">
          <Ruler size={19} weight="regular" className="text-[#7a7a7a]" />
          <div className="flex-1">
            <p className="text-[15px] font-semibold text-[#1d1d1f]">{location.safeZoneName}</p>
            <p className="mt-0.5 text-[13px] font-normal text-[#7a7a7a]">
              자택 중심 {location.safeZoneRadius}
            </p>
          </div>
          <Tag tone="primary">사용 중</Tag>
        </div>
        <div className="flex items-center gap-3 px-4 py-3.5">
          <Clock size={19} weight="regular" className="text-[#7a7a7a]" />
          <div className="flex-1">
            <p className="text-[15px] font-semibold text-[#1d1d1f]">야간 이탈 알림</p>
            <p className="mt-0.5 text-[13px] font-normal text-[#7a7a7a]">
              오후 9시 - 오전 6시에는 경계를 300m로 좁힙니다
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-4 py-3.5">
          <NavigationArrow size={19} weight="regular" className="text-[#7a7a7a]" />
          <div className="flex-1">
            <p className="text-[15px] font-semibold text-[#1d1d1f]">보호자 위치 공유</p>
            <p className="mt-0.5 text-[13px] font-normal text-[#7a7a7a]">
              {guardians
                .filter((g) => g.sharing)
                .map((g) => g.name)
                .join(", ")}
              에게 공유 중
            </p>
          </div>
          <Toggle checked={sharing} onChange={setSharing} label="보호자 위치 공유" />
        </div>
      </div>

      <SectionTitle className="mt-8">오늘 이동 경로</SectionTitle>
      <ol className="mt-4">
        {ROUTE_STEPS.map((step, index) => (
          <li key={step.time} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`mt-[5px] h-[9px] w-[9px] rounded-full ${
                  index === ROUTE_STEPS.length - 1 ? "bg-[#0066cc]" : "bg-[#c7c7cc]"
                }`}
              />
              {index < ROUTE_STEPS.length - 1 && <span className="h-full w-[2px] bg-[#f0f0f0]" />}
            </div>
            <div className="pb-4">
              <p className="text-[15px] font-semibold leading-[1.35] text-[#1d1d1f]">
                {step.place}
              </p>
              <p className="mt-0.5 text-[13px] font-normal text-[#7a7a7a]">
                {step.time} · {step.note}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <SectionTitle className="mt-4">최근 방문 기록</SectionTitle>
      <div className="cs-no-scrollbar -mx-5 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1">
        {visits.map((visit) => (
          <article
            key={visit.id}
            className="w-[188px] shrink-0 snap-start overflow-hidden rounded-[18px] border border-[#e0e0e0] bg-white"
          >
            <div className="relative h-[104px] w-full">
              <Image
                src={photoUrl(visit.photoId, 376, 208)}
                alt={visit.photoAlt}
                fill
                sizes="188px"
                className="object-cover"
              />
            </div>
            <div className="px-3.5 py-3">
              <p className="text-[15px] font-semibold leading-none text-[#1d1d1f]">{visit.place}</p>
              <p className="mt-2 text-[12.5px] font-normal leading-[1.45] text-[#7a7a7a]">
                {visit.timeLabel}
                <br />
                {visit.stayLabel} · {visit.distanceLabel}
              </p>
            </div>
          </article>
        ))}
      </div>

      <SectionTitle className="mt-8">이탈 알림 이력</SectionTitle>
      <div className="mt-2">
        {geofenceEvents.map((event) => (
          <div key={event.id} className="border-b border-[#f0f0f0] py-3.5 last:border-b-0">
            <div className="flex items-start gap-3">
              <span className="mt-[3px] h-[7px] w-[7px] shrink-0 rounded-full bg-[#ff9500]" />
              <div className="flex-1">
                <p className="text-[15px] font-semibold leading-[1.35] text-[#1d1d1f]">
                  {event.place}
                </p>
                <p className="mt-1 text-[13.5px] font-normal leading-[1.5] text-[#333333]">
                  {event.detail}
                </p>
                <p className="mt-1.5 text-[12.5px] font-normal text-[#7a7a7a]">
                  {event.dayLabel} {event.timeLabel}
                </p>
              </div>
            </div>
          </div>
        ))}
        <p className="pt-3 text-[13px] font-normal leading-[1.5] text-[#7a7a7a]">
          {user.name} 님의 생활권 설정은 {user.agency} {user.manager}가 관리합니다.
        </p>
      </div>
    </div>
  );
}
