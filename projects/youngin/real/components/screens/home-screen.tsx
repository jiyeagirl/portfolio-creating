"use client";

/* 01 QR 진입 / 통합 메인 — 스캔 직후 첫 화면.
   "지금 어디에 서 있는가"를 먼저 확정하고, 안전시설 / 상점가 / 축제 세 갈래로 흘려보낸다. */

import Image from "next/image";
import {
  ArrowRight,
  CaretRight,
  Clock,
  Confetti,
  Heartbeat,
  MapTrifold,
  Megaphone,
  PersonSimpleWalk,
  Storefront,
} from "@phosphor-icons/react";
import { Emblem } from "@/projects/youngin/real/components/emblem";
import {
  Badge,
  FacilityIcon,
  OnnuriBadge,
  SectionHead,
  StoreIcon,
} from "@/projects/youngin/real/components/ui";
import {
  DISTRICTS,
  FACILITIES,
  FESTIVALS,
  QR_POINT,
  STORES,
  formatDistance,
} from "@/projects/youngin/real/lib/mock-data";
import type { Route } from "@/projects/youngin/real/lib/navigation";

const NEAREST_FACILITIES = [...FACILITIES].sort((a, b) => a.distance - b.distance).slice(0, 5);
const NEAREST_STORES = [...STORES].sort((a, b) => a.distance - b.distance).slice(0, 4);
const HOME_DISTRICT = DISTRICTS[0];
const LIVE_FESTIVAL = FESTIVALS[0];

/* 바로가기 카드는 A 상권 하나가 아니라 등록된 상권 전체를 요약한다 */
const TOTAL_STORES = DISTRICTS.reduce((sum, d) => sum + d.storeCount, 0);
const AED_COUNT = FACILITIES.filter((f) => f.type === "AED").length;
const SAFETY_COUNT = FACILITIES.filter((f) => f.type === "AED" || f.type === "대피소").length;

export function HomeScreen({ onNavigate }: { onNavigate: (route: Route) => void }) {
  return (
    <div className="min-h-full bg-[var(--cp-canvas)] pb-[124px]">
      {/* 스캔 지점 확정 영역 — 화면에서 유일하게 액센트를 면으로 쓰는 자리 */}
      <header className="bg-[var(--cp-accent)] px-5 pb-7 pt-[70px] text-[var(--cp-on-accent)]">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Emblem size={26} tone="light" />
            <span className="text-[14px] font-extrabold tracking-[-0.03em]">CIVICPIN</span>
          </span>
          <span className="cp-num rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold">
            {QR_POINT.code}
          </span>
        </div>

        <p className="mt-6 text-[12.5px] font-semibold text-white/70">
          {QR_POINT.city} {QR_POINT.dong}
        </p>
        <h1 className="mt-1.5 text-[27px] font-extrabold leading-[34px] tracking-[-0.03em]">
          {QR_POINT.label}
          <br />
          기준으로 안내합니다
        </h1>
        <p className="cp-num mt-3 flex items-center gap-1.5 text-[12px] text-white/70">
          <Clock size={13} weight="fill" />
          {QR_POINT.scannedAt} 스캔
        </p>

        <dl className="mt-6 flex items-stretch gap-3 rounded-2xl bg-white/12 p-3.5">
          {[
            { label: "주변 AED, 대피소", value: `${SAFETY_COUNT}곳` },
            { label: "가장 가까운 AED", value: `${NEAREST_FACILITIES.find((f) => f.type === "AED")?.distance ?? 0}m` },
            { label: "상점가 가맹점", value: `${HOME_DISTRICT.onnuriCount}곳` },
          ].map((item, index) => (
            <div
              key={item.label}
              className={`min-w-0 flex-1 ${index > 0 ? "border-l border-white/15 pl-3" : ""}`}
            >
              <dd className="cp-num text-[19px] font-extrabold leading-6 tracking-[-0.02em]">
                {item.value}
              </dd>
              <dt className="mt-0.5 truncate text-[11px] text-white/65">{item.label}</dt>
            </div>
          ))}
        </dl>
      </header>

      {/* 세 갈래 바로가기 — 균등 3분할 대신 1 + 2 비대칭 배치 */}
      <section className="-mt-4 px-5">
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate({ name: "map" })}
            className="col-span-2 flex items-center gap-3.5 rounded-2xl bg-[var(--cp-surface)] p-4 text-left shadow-[var(--cp-shadow)] transition-transform active:scale-[0.985]"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[var(--cp-aed-soft)] text-[var(--cp-aed)]">
              <Heartbeat size={24} weight="fill" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15.5px] font-bold tracking-[-0.02em] text-[var(--cp-ink)]">
                생활안전시설 찾기
              </span>
              <span className="cp-num mt-0.5 block text-[12.5px] text-[var(--cp-mute)]">
                AED {AED_COUNT}대 | 대피소, 쉼터, 화장실 지도 보기
              </span>
            </span>
            <CaretRight size={16} weight="bold" className="shrink-0 text-[var(--cp-faint)]" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate({ name: "districts" })}
            className="rounded-2xl bg-[var(--cp-surface)] p-4 text-left shadow-[var(--cp-shadow)] transition-transform active:scale-[0.985]"
          >
            <Storefront size={22} weight="fill" className="text-[var(--cp-accent)]" />
            <span className="mt-2.5 block text-[14.5px] font-bold tracking-[-0.02em] text-[var(--cp-ink)]">
              골목형 상점가
            </span>
            <span className="cp-num mt-0.5 block text-[12px] text-[var(--cp-mute)]">
              {DISTRICTS.length}개 상권 / {TOTAL_STORES}곳
            </span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate({ name: "festivals" })}
            className="rounded-2xl bg-[var(--cp-surface)] p-4 text-left shadow-[var(--cp-shadow)] transition-transform active:scale-[0.985]"
          >
            <Confetti size={22} weight="fill" className="text-[var(--cp-accent)]" />
            <span className="mt-2.5 block text-[14.5px] font-bold tracking-[-0.02em] text-[var(--cp-ink)]">
              상점가 축제
            </span>
            <span className="cp-num mt-0.5 block text-[12px] text-[var(--cp-mute)]">
              진행중 2건 / 예정 2건
            </span>
          </button>
        </div>
      </section>

      {/* 진행중 축제 — 사진이 한 장 들어가는 자리 */}
      <section className="mt-7 px-5">
        <button
          type="button"
          onClick={() => onNavigate({ name: "festivalDetail", festivalId: LIVE_FESTIVAL.id })}
          className="relative block w-full overflow-hidden rounded-2xl text-left shadow-[var(--cp-shadow)] transition-transform active:scale-[0.985]"
        >
          <Image
            src={`https://picsum.photos/id/${LIVE_FESTIVAL.photo}/720/440`}
            alt={LIVE_FESTIVAL.photoAlt}
            width={360}
            height={220}
            className="h-[168px] w-full object-cover"
          />
          <span
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(20,24,30,0.05) 0%, rgba(20,24,30,0.28) 46%, rgba(20,24,30,0.86) 100%)",
            }}
          />
          <span className="absolute inset-x-0 bottom-0 p-4">
            <span className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--cp-danger)] px-2 py-[3px] text-[10.5px] font-bold text-white">
                <span className="h-[5px] w-[5px] rounded-full bg-white" />
                진행중
              </span>
              <span className="cp-num rounded-full bg-white/22 px-2 py-[3px] text-[10.5px] font-semibold text-white">
                지금 계신 상점가
              </span>
            </span>
            <span className="mt-2 block text-[18px] font-extrabold leading-6 tracking-[-0.02em] text-white">
              {LIVE_FESTIVAL.name}
            </span>
            <span className="cp-num mt-1 block text-[12px] text-white/80">
              {LIVE_FESTIVAL.time} | {LIVE_FESTIVAL.venue}
            </span>
          </span>
        </button>
      </section>

      {/* 가까운 안전, 편의시설 캐러셀 */}
      <section className="mt-8">
        <div className="px-5">
          <SectionHead
            title="지금 여기서 가장 가까운 곳"
            desc="QR 지점 기준 직선거리 순"
            actionLabel="지도"
            onAction={() => onNavigate({ name: "map" })}
          />
        </div>
        <div className="mt-3.5 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {NEAREST_FACILITIES.map((facility) => (
            <button
              key={facility.id}
              type="button"
              onClick={() => onNavigate({ name: "directions", targetId: facility.id })}
              className="w-[188px] shrink-0 snap-start rounded-2xl bg-[var(--cp-surface)] p-3.5 text-left shadow-[var(--cp-shadow)] transition-transform active:scale-[0.985]"
            >
              <span className="flex items-start justify-between">
                <FacilityIcon type={facility.type} size={38} />
                <Badge tone={facility.alwaysOpen ? "ok" : "neutral"}>
                  {facility.alwaysOpen ? "24시간" : "운영시간"}
                </Badge>
              </span>
              <span className="mt-3 block text-[14px] font-bold leading-[19px] tracking-[-0.02em] text-[var(--cp-ink)]">
                {facility.displayName}
              </span>
              <span className="cp-num mt-1.5 flex items-center gap-1 text-[12px] font-semibold text-[var(--cp-accent)]">
                <PersonSimpleWalk size={13} weight="fill" />
                {formatDistance(facility.distance)} / 도보 {facility.walkMinutes}분
              </span>
              <span className="mt-1 block truncate text-[11.5px] text-[var(--cp-mute)]">
                {facility.address}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 상점가 추천 — 캐러셀과 다른 리스트 구조로 리듬을 바꾼다 */}
      <section className="mt-8 px-5">
        <SectionHead
          title="상점가에서 가까운 가게"
          desc={`${HOME_DISTRICT.name} / ${HOME_DISTRICT.zoneCode}`}
          actionLabel="전체보기"
          onAction={() => onNavigate({ name: "districtDetail", districtId: HOME_DISTRICT.id })}
        />
        <ul className="mt-3 overflow-hidden rounded-2xl bg-[var(--cp-surface)] shadow-[var(--cp-shadow)]">
          {NEAREST_STORES.map((store, index) => (
            <li key={store.id}>
              <button
                type="button"
                onClick={() => onNavigate({ name: "storeDetail", storeId: store.id })}
                className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-[var(--cp-soft)] ${
                  index > 0 ? "border-t border-[var(--cp-hairline)]" : ""
                }`}
              >
                {store.photo ? (
                  <Image
                    src={`https://picsum.photos/id/${store.photo}/160/160`}
                    alt={store.photoAlt ?? store.name}
                    width={44}
                    height={44}
                    className="h-11 w-11 shrink-0 rounded-[12px] object-cover"
                  />
                ) : (
                  <StoreIcon category={store.category} size={44} />
                )}
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="truncate text-[14.5px] font-bold tracking-[-0.02em] text-[var(--cp-ink)]">
                      {store.name}
                    </span>
                    {store.onnuriAccepted && <OnnuriBadge compact />}
                  </span>
                  <span className="cp-num mt-0.5 block truncate text-[12px] text-[var(--cp-mute)]">
                    {store.subCategory} | {formatDistance(store.distance)} | 도보 {store.walkMinutes}분
                  </span>
                </span>
                <CaretRight size={15} weight="bold" className="shrink-0 text-[var(--cp-faint)]" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* 공지 */}
      <section className="mt-7 px-5">
        <div className="rounded-2xl border border-[var(--cp-hairline)] bg-[var(--cp-soft)] p-4">
          <p className="flex items-center gap-1.5 text-[12px] font-bold text-[var(--cp-accent)]">
            <Megaphone size={14} weight="fill" />
            {QR_POINT.city} 공지
          </p>
          <p className="mt-2 text-[14px] font-bold leading-[20px] tracking-[-0.02em] text-[var(--cp-ink)]">
            7월 1일부터 무더위쉼터를 확대 운영합니다
          </p>
          <p className="mt-1.5 text-[12.5px] leading-[18px] text-[var(--cp-body)]">
            정류장 그늘막과 경로당 쉼터는 7월 1일부터 9월 15일까지 상시 가동합니다. 운영
            시간은 시설별로 다르니 상세 화면에서 확인해 주세요.
          </p>
          <button
            type="button"
            onClick={() => onNavigate({ name: "map" })}
            className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-bold text-[var(--cp-accent)]"
          >
            쉼터 위치 보기
            <ArrowRight size={13} weight="bold" />
          </button>
        </div>
      </section>

      <footer className="mt-6 px-5">
        <p className="cp-num flex items-center gap-1.5 text-[11px] leading-4 text-[var(--cp-faint)]">
          <MapTrifold size={12} weight="fill" />
          공공데이터 기준일 {QR_POINT.baseDate} / 정보가 다르면 상세 화면에서 신고할 수 있습니다
        </p>
      </footer>
    </div>
  );
}
