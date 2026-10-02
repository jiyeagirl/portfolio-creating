"use client";

/* 04 골목형 상점가 목록 / 지도 — 리스트와 지도를 토글로 오간다.
   구역 경계는 지도 위 폴리곤으로만 표시하고 실지명 대신 구역 코드를 노출한다(spec.md 8절). */

import Image from "next/image";
import { useState } from "react";
import { CaretRight, PersonSimpleWalk, Storefront } from "@phosphor-icons/react";
import { AbstractMap } from "@/projects/youngin/real/components/abstract-map";
import { Badge, OnnuriBadge, QrContextStrip } from "@/projects/youngin/real/components/ui";
import { DISTRICTS, QR_POINT, formatDistance } from "@/projects/youngin/real/lib/mock-data";
import type { Route } from "@/projects/youngin/real/lib/navigation";
import type { District } from "@/projects/youngin/real/lib/types";

/** 구역 폴리곤을 바운딩 박스에 맞춰 축소한 썸네일. 사진이 없는 상권의 카드 시각물이다. */
function ZoneThumb({ district, size = 60 }: { district: District; size?: number }) {
  const xs = district.polygon.map((p) => p.x);
  const ys = district.polygon.map((p) => p.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const w = Math.max(...xs) - minX || 1;
  const h = Math.max(...ys) - minY || 1;
  const scale = 80 / Math.max(w, h);
  const points = district.polygon
    .map((p) => `${(p.x - minX) * scale + 10},${(p.y - minY) * scale + 10}`)
    .join(" ");

  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-[14px] bg-[var(--cp-sunken)]"
      style={{ width: size, height: size }}
    >
      <svg width={size - 8} height={size - 8} viewBox="0 0 100 100" aria-hidden>
        <polygon
          points={points}
          fill="var(--cp-accent-soft)"
          stroke="var(--cp-accent)"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function DistrictsScreen({ onNavigate }: { onNavigate: (route: Route) => void }) {
  const [view, setView] = useState<"list" | "map">("list");
  const [focus, setFocus] = useState<string>(DISTRICTS[0].id);

  const sorted = [...DISTRICTS].sort((a, b) => a.distance - b.distance);
  const hero = sorted[0];
  const rest = sorted.slice(1);

  return (
    <div className="relative h-full bg-[var(--cp-canvas)]">
      <div className="sticky top-0 z-30 bg-[var(--cp-surface)] pt-[59px]">
        <QrContextStrip code={QR_POINT.code} label={QR_POINT.label} />
        <div className="flex items-center justify-between gap-3 px-5 py-3">
          <div className="min-w-0">
            <h1 className="text-[20px] font-extrabold tracking-[-0.03em] text-[var(--cp-ink)]">
              골목형 상점가
            </h1>
            <p className="cp-num mt-0.5 text-[12px] text-[var(--cp-mute)]">
              {QR_POINT.city} {DISTRICTS.length}개 상권 / 거리순
            </p>
          </div>
          <div className="inline-flex shrink-0 rounded-full border border-[var(--cp-hairline)] bg-[var(--cp-soft)] p-[3px]">
            {(["list", "map"] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setView(key)}
                aria-pressed={view === key}
                className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-bold transition-colors ${
                  view === key
                    ? "bg-[var(--cp-surface)] text-[var(--cp-ink)] shadow-[0_1px_2px_rgba(20,24,30,0.08)]"
                    : "text-[var(--cp-mute)]"
                }`}
              >
                {key === "list" ? "목록" : "지도"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {view === "map" ? (
        <div className="relative h-[calc(100%-172px)]">
          <div className="absolute inset-0">
          <AbstractMap
            className="h-full w-full"
            qrPoint={QR_POINT.coordinates}
            qrLabel="현재 위치"
            polygons={DISTRICTS.map((d) => ({
              id: d.id,
              points: d.polygon,
              fill:
                d.id === focus ? "rgba(29,78,137,0.18)" : "rgba(29,78,137,0.07)",
              stroke: d.id === focus ? "var(--cp-accent)" : "var(--cp-accent-line)",
            }))}
            markers={DISTRICTS.map((d) => ({
              id: d.id,
              point: d.center,
              count: d.storeCount,
              bg: d.id === focus ? "var(--cp-accent)" : "var(--cp-accent-strong)",
              label: d.zoneCode,
              active: d.id === focus,
              onClick: () => setFocus(d.id),
            }))}
          />
          </div>

          {/* 선택 구역 요약 — 탭바 위에 얹는 불투명 카드 */}
          <div className="absolute inset-x-4 bottom-[104px] z-20 rounded-2xl bg-[var(--cp-surface)] p-4 shadow-[var(--cp-shadow-pop)]">
            {(() => {
              const d = DISTRICTS.find((item) => item.id === focus) ?? DISTRICTS[0];
              return (
                <>
                  <div className="flex items-center gap-2">
                    <Badge tone="accent">{d.zoneCode}</Badge>
                    {d.distance === 0 && <Badge tone="ok">지금 계신 상권</Badge>}
                  </div>
                  <h2 className="mt-2 text-[18px] font-extrabold tracking-[-0.02em] text-[var(--cp-ink)]">
                    {d.name}
                  </h2>
                  <p className="cp-num mt-1 text-[12.5px] text-[var(--cp-mute)]">
                    점포 {d.storeCount}곳 | 온누리 {d.onnuriCount}곳 |{" "}
                    {d.distance === 0 ? "도보 0분" : `${formatDistance(d.distance)} / 도보 ${d.walkMinutes}분`}
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate({ name: "districtDetail", districtId: d.id })}
                    className="mt-3.5 h-11 w-full rounded-full bg-[var(--cp-accent)] text-[14.5px] font-bold text-[var(--cp-on-accent)] transition-transform active:scale-[0.98]"
                  >
                    상점가 상세 보기
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      ) : (
        <div className="pb-[124px]">
          {/* 현재 서 있는 상권 — 유일하게 사진이 들어가는 카드 */}
          <section className="px-5 pt-4">
            <button
              type="button"
              onClick={() => onNavigate({ name: "districtDetail", districtId: hero.id })}
              className="block w-full overflow-hidden rounded-2xl bg-[var(--cp-surface)] text-left shadow-[var(--cp-shadow)] transition-transform active:scale-[0.985]"
            >
              <span className="relative block">
                <Image
                  src={`https://picsum.photos/id/${hero.photo}/720/420`}
                  alt={hero.photoAlt ?? hero.name}
                  width={360}
                  height={210}
                  className="h-[156px] w-full object-cover"
                />
                <span className="absolute left-3 top-3 flex gap-1.5">
                  <span className="cp-num rounded-full bg-[var(--cp-ink)]/80 px-2 py-[3px] text-[10.5px] font-bold text-white">
                    {hero.zoneCode}
                  </span>
                  <span className="rounded-full bg-[var(--cp-ok)] px-2 py-[3px] text-[10.5px] font-bold text-white">
                    지금 계신 상권
                  </span>
                </span>
              </span>
              <span className="block p-4">
                <span className="flex items-center gap-2">
                  <span className="text-[18px] font-extrabold tracking-[-0.02em] text-[var(--cp-ink)]">
                    {hero.name}
                  </span>
                  <OnnuriBadge compact />
                </span>
                <span className="cp-num mt-1 block text-[12.5px] text-[var(--cp-mute)]">
                  점포 {hero.storeCount}곳 | 온누리 가맹 {hero.onnuriCount}곳 | 도보 0분
                </span>
                <span className="mt-2.5 flex flex-wrap gap-1.5">
                  {hero.mainCategories.map((c) => (
                    <Badge key={c} tone="neutral">
                      {c}
                    </Badge>
                  ))}
                </span>
              </span>
            </button>
          </section>

          <section className="mt-7 px-5">
            <div className="flex items-baseline justify-between">
              <h2 className="text-[17px] font-extrabold tracking-[-0.02em] text-[var(--cp-ink)]">
                다른 상권
              </h2>
              <span className="cp-num text-[12px] font-semibold text-[var(--cp-mute)]">
                거리순 {rest.length}곳
              </span>
            </div>

            <ul className="mt-3 space-y-2.5">
              {rest.map((d) => (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate({ name: "districtDetail", districtId: d.id })}
                    className="flex w-full items-center gap-3.5 rounded-2xl bg-[var(--cp-surface)] p-3.5 text-left shadow-[var(--cp-shadow)] transition-transform active:scale-[0.985]"
                  >
                    <ZoneThumb district={d} />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <span className="truncate text-[15.5px] font-bold tracking-[-0.02em] text-[var(--cp-ink)]">
                          {d.name}
                        </span>
                        <span className="cp-num shrink-0 rounded-[6px] bg-[var(--cp-sunken)] px-1.5 py-[2px] text-[10.5px] font-bold text-[var(--cp-body)]">
                          {d.zoneCode}
                        </span>
                      </span>
                      <span className="cp-num mt-1 flex items-center gap-1 text-[12px] font-semibold text-[var(--cp-accent)]">
                        <PersonSimpleWalk size={12} weight="fill" />
                        {formatDistance(d.distance)} / 도보 {d.walkMinutes}분
                      </span>
                      <span className="cp-num mt-1 block truncate text-[12px] text-[var(--cp-mute)]">
                        <Storefront size={11} weight="fill" className="mr-1 inline align-[-1px]" />
                        점포 {d.storeCount}곳 | 온누리 {d.onnuriCount}곳 |{" "}
                        {d.mainCategories.join(", ")}
                      </span>
                    </span>
                    <CaretRight size={15} weight="bold" className="shrink-0 text-[var(--cp-faint)]" />
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <p className="cp-num mt-6 px-5 text-[11px] leading-4 text-[var(--cp-faint)]">
            상권 경계와 점포 수는 공공데이터 기준일 {QR_POINT.baseDate} 자료입니다
          </p>
        </div>
      )}
    </div>
  );
}
