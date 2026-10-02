"use client";

/* 05 상점가 상세 — 강조 화면(spec.md 7절 2순위).
   이 화면의 핵심은 "상권 정보와 안전시설을 같은 화면에서 잇는 것"이다.
   업종 비중 → 입점 매장 → 인근 안전시설 → 추천 코스 순으로 상권과 안전을 번갈아 놓는다. */

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  CaretRight,
  Confetti,
  Flag,
  PersonSimpleWalk,
  Signpost,
  Storefront,
} from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { Toggle } from "@/components/shared/toggle";
import { AbstractMap, fitView } from "@/projects/youngin/real/components/abstract-map";
import {
  Badge,
  EmptyState,
  FacilityIcon,
  MixBar,
  OnnuriBadge,
  SectionHead,
  StoreIcon,
} from "@/projects/youngin/real/components/ui";
import {
  FACILITIES,
  QR_POINT,
  districtById,
  facilityById,
  festivalsOf,
  formatDistance,
  storesOf,
} from "@/projects/youngin/real/lib/mock-data";
import type { Route } from "@/projects/youngin/real/lib/navigation";
import type { StoreCategory } from "@/projects/youngin/real/lib/types";

export function DistrictDetailScreen({
  districtId,
  onNavigate,
  onBack,
}: {
  districtId: string;
  onNavigate: (route: Route) => void;
  onBack: () => void;
}) {
  const district = districtById(districtId);
  const [onnuriOnly, setOnnuriOnly] = useState(false);
  const [category, setCategory] = useState<StoreCategory | "전체">("전체");

  const stores = useMemo(() => storesOf(districtId), [districtId]);
  const filtered = useMemo(
    () =>
      stores
        .filter((s) => (onnuriOnly ? s.onnuriAccepted : true))
        .filter((s) => (category === "전체" ? true : s.category === category))
        .sort((a, b) => a.distance - b.distance),
    [stores, onnuriOnly, category],
  );

  if (!district) {
    return (
      <div className="min-h-full bg-[var(--cp-canvas)]">
        <ScreenHeader
          title="상점가"
          onBack={onBack}
          className="bg-[var(--cp-surface)] border-[var(--cp-hairline)]"
          titleClassName="text-[15.5px] font-bold text-[var(--cp-ink)]"
        />
        <p className="px-5 py-10 text-center text-[13px] text-[var(--cp-mute)]">
          상점가 정보를 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  const festivals = festivalsOf(districtId).filter((f) => f.status !== "종료");
  const linkedFacilities = district.facilityIds
    .map((id) => facilityById(id))
    .filter(Boolean)
    .slice(0, 4) as NonNullable<ReturnType<typeof facilityById>>[];
  const categories: (StoreCategory | "전체")[] = [
    "전체",
    ...Array.from(new Set(stores.map((s) => s.category))),
  ];

  return (
    <div className="min-h-full bg-[var(--cp-canvas)] pb-[124px]">
      <ScreenHeader
        title={district.name}
        subtitle={`${district.zoneCode} / 점포 ${district.storeCount}곳`}
        onBack={onBack}
        className="bg-[var(--cp-surface)] border-[var(--cp-hairline)]"
        titleClassName="text-[15.5px] font-bold tracking-[-0.02em] text-[var(--cp-ink)]"
        subtitleClassName="cp-num text-[11px] text-[var(--cp-mute)]"
      />

      {/* 내용이 맞는 상권 사진이 있는 구역만 사진을 쓰고, 없으면 구역 지도를 히어로로 쓴다.
          아무 사진이나 얹으면 캡션과 어긋난다(CLAUDE.md Images 규칙). */}
      <div className="relative">
        {district.photo ? (
          <Image
            src={`https://picsum.photos/id/${district.photo}/786/440`}
            alt={district.photoAlt ?? district.name}
            width={393}
            height={220}
            className="h-[196px] w-full object-cover"
          />
        ) : (
          <AbstractMap
            className="h-[196px] w-full"
            qrPoint={QR_POINT.coordinates}
            view={fitView(district.polygon, { aspect: 393 / 196, fill: 0.72 })}
            polygons={[
              {
                id: district.id,
                points: district.polygon,
                fill: "rgba(29,78,137,0.20)",
              },
            ]}
            markers={[
              {
                id: `${district.id}-hero`,
                point: district.center,
                count: district.storeCount,
                bg: "var(--cp-accent)",
              },
            ]}
          />
        )}
        {/* 지도 히어로는 사진보다 밝아서 흰 글씨가 뜬다. 그때만 그라데이션을 더 일찍, 더 짙게. */}
        <div
          className="absolute inset-0"
          style={{
            background: district.photo
              ? "linear-gradient(180deg, rgba(20,24,30,0) 40%, rgba(20,24,30,0.72) 100%)"
              : "linear-gradient(180deg, rgba(20,24,30,0) 18%, rgba(20,24,30,0.42) 52%, rgba(20,24,30,0.86) 100%)",
          }}
        />
        {/* 아래 시트가 -mt-6 로 사진을 파고들어오므로 히어로 카피는 pb-11 로 띄운다 */}
        <div className="absolute inset-x-0 bottom-0 p-5 pb-11">
          <div className="flex gap-1.5">
            <span className="cp-num rounded-full bg-white/22 px-2 py-[3px] text-[10.5px] font-bold text-white">
              {district.zoneCode}
            </span>
            {district.distance === 0 && (
              <span className="rounded-full bg-[var(--cp-ok)] px-2 py-[3px] text-[10.5px] font-bold text-white">
                지금 계신 상권
              </span>
            )}
          </div>
          <h1 className="mt-2 text-[24px] font-extrabold leading-7 tracking-[-0.03em] text-white">
            {district.name}
          </h1>
        </div>
      </div>

      {/* 구역 정보 — 사진 위로 올라오는 시트.
          좌우 여백이 있는 카드로 겹치면 카드 양옆으로 사진 끝단이 비어져 나와 깨져 보인다.
          화면 폭을 꽉 채우고 위쪽만 둥글린 시트로 사진 하단을 완전히 덮는다. */}
      <section className="relative z-10 -mt-6 rounded-t-[24px] bg-[var(--cp-surface)] px-5 pb-5 pt-5">
        <p className="text-[13.5px] leading-[21px] text-[var(--cp-body)]">{district.intro}</p>
        <dl className="mt-4 flex items-stretch gap-3 border-t border-[var(--cp-hairline)] pt-3.5">
          {[
            { label: "입점 점포", value: `${district.storeCount}곳` },
            { label: "온누리 가맹", value: `${district.onnuriCount}곳` },
            {
              label: "QR 지점에서",
              value: district.distance === 0 ? "0분" : `${district.walkMinutes}분`,
            },
          ].map((item, index) => (
            <div
              key={item.label}
              className={`min-w-0 flex-1 ${index > 0 ? "border-l border-[var(--cp-hairline)] pl-3" : ""}`}
            >
              <dd className="cp-num text-[19px] font-extrabold leading-6 tracking-[-0.02em] text-[var(--cp-ink)]">
                {item.value}
              </dd>
              <dt className="mt-0.5 truncate text-[11.5px] text-[var(--cp-mute)]">{item.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* 업종 비중 */}
      <section className="mt-7 px-5">
        <SectionHead title="업종 비중" desc={`${district.zoneCode} 등록 점포 기준`} />
        <div className="mt-3 rounded-2xl bg-[var(--cp-surface)] p-4 shadow-[var(--cp-shadow)]">
          <MixBar data={district.mix} />
        </div>
      </section>

      {/* 진행중 축제 */}
      {festivals.length > 0 && (
        <section className="mt-7 px-5">
          <SectionHead
            title="상점가 축제"
            actionLabel="전체보기"
            onAction={() => onNavigate({ name: "festivals" })}
          />
          <div className="mt-3 space-y-2.5">
            {festivals.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => onNavigate({ name: "festivalDetail", festivalId: f.id })}
                className="flex w-full items-center gap-3.5 rounded-2xl bg-[var(--cp-surface)] p-3.5 text-left shadow-[var(--cp-shadow)] transition-transform active:scale-[0.985]"
              >
                <Image
                  src={`https://picsum.photos/id/${f.photo}/200/200`}
                  alt={f.photoAlt}
                  width={56}
                  height={56}
                  className="h-14 w-14 shrink-0 rounded-[14px] object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <Badge tone={f.status === "진행중" ? "danger" : "warn"} dot={f.status === "진행중"}>
                      {f.status}
                    </Badge>
                    <span className="cp-num truncate text-[11.5px] text-[var(--cp-mute)]">
                      {f.time}
                    </span>
                  </span>
                  <span className="mt-1 block truncate text-[15px] font-bold tracking-[-0.02em] text-[var(--cp-ink)]">
                    {f.name}
                  </span>
                  <span className="mt-0.5 block truncate text-[12px] text-[var(--cp-mute)]">
                    {f.summary}
                  </span>
                </span>
                <Confetti size={18} weight="fill" className="shrink-0 text-[var(--cp-accent)]" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 입점 매장 */}
      <section className="mt-8">
        <div className="px-5">
          <SectionHead
            title="입점 매장"
            desc={`${filtered.length}곳 / QR 지점에서 가까운 순`}
          />
          <div className="mt-3 flex items-center justify-between rounded-[14px] border border-[var(--cp-hairline)] bg-[var(--cp-surface)] px-3.5 py-2.5">
            <span className="flex items-center gap-2 text-[13.5px] font-bold text-[var(--cp-ink)]">
              <Storefront size={16} weight="fill" className="text-[var(--cp-accent)]" />
              온누리 가맹점만 보기
              <span className="cp-num text-[12px] font-semibold text-[var(--cp-mute)]">
                {stores.filter((s) => s.onnuriAccepted).length}곳
              </span>
            </span>
            <Toggle
              checked={onnuriOnly}
              onChange={setOnnuriOnly}
              label="온누리 가맹점만 보기"
              size="sm"
              onClassName="bg-[var(--cp-accent)]"
              offClassName="bg-[var(--cp-hairline-strong)]"
            />
          </div>
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`h-8 shrink-0 rounded-full border px-3 text-[12.5px] font-bold transition-colors ${
                category === c
                  ? "border-[var(--cp-accent)] bg-[var(--cp-accent)] text-[var(--cp-on-accent)]"
                  : "border-[var(--cp-hairline)] bg-[var(--cp-surface)] text-[var(--cp-body)]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-3 px-5">
          {filtered.length === 0 ? (
            <EmptyState
              title="조건에 맞는 매장이 없습니다"
              desc="온누리 가맹 여부나 업종 필터를 바꿔 다시 확인해 주세요."
            />
          ) : (
            <ul className="overflow-hidden rounded-2xl bg-[var(--cp-surface)] shadow-[var(--cp-shadow)]">
              {filtered.map((store, index) => (
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
                        {store.subCategory} | {formatDistance(store.distance)} | {store.address}
                      </span>
                    </span>
                    <CaretRight size={15} weight="bold" className="shrink-0 text-[var(--cp-faint)]" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* 안전시설 연계 — 이 화면의 핵심. 상권 리스트 바로 아래 붙인다 */}
      <section className="mt-8 px-5">
        <SectionHead
          title="상점가 안 안전시설"
          desc="장 보는 동선에서 바로 닿는 시설만 모았습니다"
          actionLabel="지도"
          onAction={() => onNavigate({ name: "map" })}
        />
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {linkedFacilities.map((facility) => (
            <button
              key={facility.id}
              type="button"
              onClick={() => onNavigate({ name: "directions", targetId: facility.id })}
              className="rounded-2xl bg-[var(--cp-surface)] p-3.5 text-left shadow-[var(--cp-shadow)] transition-transform active:scale-[0.985]"
            >
              <FacilityIcon type={facility.type} size={36} />
              <span className="mt-2.5 block text-[13.5px] font-bold leading-[18px] tracking-[-0.02em] text-[var(--cp-ink)]">
                {facility.displayName}
              </span>
              <span className="cp-num mt-1 flex items-center gap-1 text-[11.5px] font-semibold text-[var(--cp-accent)]">
                <PersonSimpleWalk size={12} weight="fill" />
                {formatDistance(facility.distance)} / {facility.walkMinutes}분
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 추천 코스 */}
      <section className="mt-8 px-5">
        <SectionHead title="추천 코스" desc="입구에서 주차장까지 한 방향으로 도는 동선" />
        <div className="mt-3 overflow-hidden rounded-2xl bg-[var(--cp-surface)] shadow-[var(--cp-shadow)]">
          <AbstractMap
            className="h-[132px] w-full"
            qrPoint={QR_POINT.coordinates}
            qrLabel="현재 위치"
            view={fitView([...district.polygon, QR_POINT.coordinates], {
              aspect: 353 / 132,
              fill: 0.82,
            })}
            polygons={[{ id: district.id, points: district.polygon }]}
            markers={[
              {
                id: `${district.id}-center`,
                point: district.center,
                count: district.storeCount,
                bg: "var(--cp-accent)",
                label: district.zoneCode,
              },
            ]}
          />
          <ol className="px-4">
            {district.course.map((step, index) => {
              const last = index === district.course.length - 1;
              return (
                <li key={step.label} className="relative flex gap-3 py-3.5">
                  {!last && (
                    <span className="absolute bottom-0 left-[13px] top-[36px] w-px bg-[var(--cp-hairline)]" />
                  )}
                  <span className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--cp-accent-soft)] text-[var(--cp-accent)]">
                    {last ? (
                      <Flag size={13} weight="fill" />
                    ) : (
                      <Signpost size={13} weight="fill" />
                    )}
                  </span>
                  <span
                    className={`min-w-0 flex-1 ${
                      last ? "" : "border-b border-[var(--cp-hairline)] pb-3.5"
                    }`}
                  >
                    <span className="block text-[14px] font-bold tracking-[-0.02em] text-[var(--cp-ink)]">
                      {step.label}
                    </span>
                    <span className="mt-0.5 block text-[12.5px] leading-[18px] text-[var(--cp-body)]">
                      {step.note}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <p className="cp-num mt-6 px-5 text-[11px] leading-4 text-[var(--cp-faint)]">
        점포 정보는 상인회 제출 자료와 공공데이터포털 {QR_POINT.baseDate} 배포분을 대조해
        정리했습니다 / 반경 500m 안 시설 {FACILITIES.length}곳 연계
      </p>
    </div>
  );
}
