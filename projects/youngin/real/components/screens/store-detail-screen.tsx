"use client";

/* 06 개별 매장 상세 — 위치는 도로명 주소를 첫 줄로 쓰고(행정동만 △△ 가명 표기),
   "상점가 내 N구역" 상대 위치를 보조 줄로 붙인다.
   매장 정보 아래에 주변 공공시설을 이어 붙여 상권과 안전시설의 연결을 여기서도 유지한다. */

import Image from "next/image";
import { useState } from "react";
import {
  CaretRight,
  Check,
  Clock,
  Copy,
  Flag,
  NavigationArrow,
  PersonSimpleWalk,
  Storefront,
} from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import {
  Badge,
  FacilityIcon,
  OnnuriBadge,
  SectionHead,
  StoreIcon,
} from "@/projects/youngin/real/components/ui";
import {
  CATEGORY_LABEL,
  FACILITIES,
  QR_POINT,
  districtById,
  formatDistance,
  storeById,
} from "@/projects/youngin/real/lib/mock-data";
import type { Route } from "@/projects/youngin/real/lib/navigation";

export function StoreDetailScreen({
  storeId,
  onNavigate,
  onBack,
}: {
  storeId: string;
  onNavigate: (route: Route) => void;
  onBack: () => void;
}) {
  const store = storeById(storeId);
  const [copied, setCopied] = useState(false);
  const [reported, setReported] = useState(false);

  if (!store) {
    return (
      <div className="min-h-full bg-[var(--cp-canvas)]">
        <ScreenHeader
          title="매장"
          onBack={onBack}
          className="bg-[var(--cp-surface)] border-[var(--cp-hairline)]"
          titleClassName="text-[15.5px] font-bold text-[var(--cp-ink)]"
        />
        <p className="px-5 py-10 text-center text-[13px] text-[var(--cp-mute)]">
          매장 정보를 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  const district = districtById(store.districtId);
  const nearby = [...FACILITIES].sort((a, b) => a.distance - b.distance).slice(0, 4);

  return (
    <div className="min-h-full bg-[var(--cp-canvas)] pb-[112px]">
      <ScreenHeader
        title={store.name}
        onBack={onBack}
        className="bg-[var(--cp-surface)] border-[var(--cp-hairline)]"
        titleClassName="text-[15.5px] font-bold tracking-[-0.02em] text-[var(--cp-ink)]"
      />

      {store.photo && (
        <Image
          src={`https://picsum.photos/id/${store.photo}/786/440`}
          alt={store.photoAlt ?? store.name}
          width={393}
          height={220}
          className="h-[184px] w-full object-cover"
        />
      )}

      {/* 매장 요약 — 사진이 있으면 사진 위로 올라오는 시트로 쓴다.
          좌우 여백이 있는 카드로 겹치면 카드 양옆으로 사진 끝단이 비어져 나온다. */}
      <section
        className={`relative z-10 bg-[var(--cp-surface)] px-5 pb-5 pt-5 ${
          store.photo ? "-mt-6 rounded-t-[24px]" : ""
        }`}
      >
        <div>
          <div className="flex items-start gap-3">
            {!store.photo && <StoreIcon category={store.category} size={44} />}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge tone="neutral">{CATEGORY_LABEL[store.category]}</Badge>
                {store.onnuriAccepted ? (
                  <OnnuriBadge />
                ) : (
                  <Badge tone="line">온누리 미가맹</Badge>
                )}
              </div>
              <h1 className="mt-2 text-[21px] font-extrabold leading-7 tracking-[-0.03em] text-[var(--cp-ink)]">
                {store.name}
              </h1>
              <p className="cp-num mt-1.5 flex items-center gap-1 text-[13px] font-semibold text-[var(--cp-accent)]">
                <PersonSimpleWalk size={14} weight="fill" />
                {formatDistance(store.distance)} / 도보 {store.walkMinutes}분
              </p>
            </div>
          </div>

          {store.blurb && (
            <p className="mt-3.5 text-[13.5px] leading-[20px] text-[var(--cp-body)]">{store.blurb}</p>
          )}
        </div>
      </section>

      {/* 위치 / 영업 정보 */}
      <section className="mt-5 px-5">
        <div className="overflow-hidden rounded-2xl bg-[var(--cp-surface)] shadow-[var(--cp-shadow)]">
          <div className="flex items-start gap-3 px-4 py-3.5">
            <div className="min-w-0 flex-1">
              {/* 첫 줄은 도로명 주소. "3구역"만 있으면 어디인지 감이 오지 않아
                  주소를 앞세우고, 골목 안 위치는 아래 보조 줄로 남긴다. */}
              <p className="text-[12px] font-semibold text-[var(--cp-mute)]">위치</p>
              <p className="mt-1 text-[14px] font-semibold leading-[20px] text-[var(--cp-ink)]">
                {store.address}
              </p>
              <p className="mt-1 text-[11.5px] leading-[16px] text-[var(--cp-faint)]">
                {store.relativeLocation}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(store.address);
                setCopied(true);
              }}
              aria-label="주소 복사"
              className="flex shrink-0 items-center gap-1 rounded-full border border-[var(--cp-hairline)] px-2.5 py-1.5 text-[12px] font-bold text-[var(--cp-body)] transition-colors active:bg-[var(--cp-sunken)]"
            >
              {copied ? <Check size={13} weight="bold" /> : <Copy size={13} weight="bold" />}
              {copied ? "복사됨" : "복사"}
            </button>
          </div>

          <dl className="border-t border-[var(--cp-hairline)] px-4">
            {[
              { label: "업종", value: `${CATEGORY_LABEL[store.category]} / ${store.subCategory}` },
              { label: "영업시간", value: store.hours },
              {
                label: "온누리상품권",
                value: store.onnuriAccepted ? "가맹점 (지류, 카드, 모바일)" : "미가맹",
              },
            ].map((row, index) => (
              <div
                key={row.label}
                className={`flex items-start justify-between gap-4 py-3 ${
                  index > 0 ? "border-t border-[var(--cp-hairline)]" : ""
                }`}
              >
                <dt className="shrink-0 text-[13px] text-[var(--cp-mute)]">{row.label}</dt>
                <dd className="min-w-0 text-right text-[13px] font-semibold text-[var(--cp-ink)]">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>

          {district && (
            <button
              type="button"
              onClick={() => onNavigate({ name: "districtDetail", districtId: district.id })}
              className="flex w-full items-center gap-3 border-t border-[var(--cp-hairline)] px-4 py-3.5 text-left transition-colors active:bg-[var(--cp-soft)]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[var(--cp-accent-soft)] text-[var(--cp-accent)]">
                <Storefront size={17} weight="fill" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13.5px] font-bold text-[var(--cp-ink)]">
                  {district.name}
                </span>
                <span className="cp-num mt-0.5 block text-[11.5px] text-[var(--cp-mute)]">
                  {district.zoneCode} | 입점 점포 {district.storeCount}곳
                </span>
              </span>
              <CaretRight size={15} weight="bold" className="shrink-0 text-[var(--cp-faint)]" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setReported(true)}
          className="mt-2.5 flex items-center gap-1.5 px-1 text-[12.5px] font-semibold text-[var(--cp-mute)]"
        >
          <Flag size={13} weight="bold" />
          {reported ? "신고가 접수되었습니다. 검수 후 반영됩니다" : "정보 오류 신고"}
        </button>
      </section>

      {/* 주변 공공시설 */}
      <section className="mt-8 px-5">
        <SectionHead
          title="주변 공공시설"
          desc="QR 지점 기준 가까운 순"
          actionLabel="지도"
          onAction={() => onNavigate({ name: "map" })}
        />
        <ul className="mt-3 overflow-hidden rounded-2xl bg-[var(--cp-surface)] shadow-[var(--cp-shadow)]">
          {nearby.map((facility, index) => (
            <li key={facility.id}>
              <button
                type="button"
                onClick={() => onNavigate({ name: "directions", targetId: facility.id })}
                className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-[var(--cp-soft)] ${
                  index > 0 ? "border-t border-[var(--cp-hairline)]" : ""
                }`}
              >
                <FacilityIcon type={facility.type} size={38} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-bold tracking-[-0.02em] text-[var(--cp-ink)]">
                    {facility.displayName}
                  </span>
                  <span className="cp-num mt-0.5 block truncate text-[12px] text-[var(--cp-mute)]">
                    {facility.address} | {formatDistance(facility.distance)}
                  </span>
                </span>
                <CaretRight size={15} weight="bold" className="shrink-0 text-[var(--cp-faint)]" />
              </button>
            </li>
          ))}
        </ul>

        <p className="cp-num mt-3 flex items-center gap-1.5 px-1 text-[11px] text-[var(--cp-faint)]">
          <Clock size={12} weight="fill" />
          매장 정보 기준일 {QR_POINT.baseDate} / 상인회 제출 자료 기준
        </p>
      </section>

      {/* 하단 고정 CTA — 불투명 표면, backdrop-blur 금지 */}
      <div className="absolute inset-x-0 bottom-0 z-30 border-t border-[var(--cp-hairline)] bg-[var(--cp-surface)] px-5 pb-[34px] pt-3">
        <button
          type="button"
          onClick={() => onNavigate({ name: "directions", targetId: store.id })}
          className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[var(--cp-accent)] text-[16px] font-bold text-[var(--cp-on-accent)] transition-transform active:scale-[0.98]"
        >
          <NavigationArrow size={18} weight="fill" />
          길찾기
        </button>
      </div>
    </div>
  );
}
