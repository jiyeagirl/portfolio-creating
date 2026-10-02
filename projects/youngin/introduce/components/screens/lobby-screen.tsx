"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Baby,
  CaretRight,
  Coffee,
  Info,
  MagnifyingGlass,
  MapPin,
  Phone,
  Printer,
  QrCode,
  Ticket,
  Toilet,
  Wheelchair,
  Car,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import {
  BUILDING,
  FLOORS,
  LIVE_STATUS,
  NOTICES,
  SERVICES,
  searchServices,
} from "../../lib/mock-data";
import type { FloorId } from "../../lib/types";
import type { NavigateFn } from "../../lib/navigation";
import { Badge, Card, Photo, SERVICE_ICON, SectionHeader } from "../ui";

/* 사진 id 1076: 하늘을 배경으로 아래에서 올려다본 각진 건물 코너. 간판이나 문자가
   없어 청사 외관으로 쓸 수 있다.
   사진 id 42: 창가 긴 원목 공용 테이블 위 커피 두 잔과 휴대폰, 시민 휴게 카페.
   design.md 사진 매핑 참고. */
const EXTERIOR_PHOTO = 1076;
const CAFE_PHOTO = 42;

const QUICK_SERVICE_IDS = [
  "resident-copy",
  "family-cert",
  "passport",
  "seal-cert",
  "resident-abstract",
  "move-in",
];

const AMENITY_SHORTCUTS: { label: string; icon: Icon; floor: FloorId; facilityId: string }[] = [
  { label: "화장실", icon: Toilet, floor: 1, facilityId: "f1-restroom" },
  { label: "수유실", icon: Baby, floor: 1, facilityId: "f1-nursing" },
  { label: "장애인 화장실", icon: Wheelchair, floor: 1, facilityId: "f1-restroom-acc" },
  { label: "주차장", icon: Car, floor: 1, facilityId: "f1-parking" },
  { label: "휴게 카페", icon: Coffee, floor: 1, facilityId: "f1-cafe" },
];

function StatCell({ value, unit, label }: { value: string; unit?: string; label: string }) {
  return (
    <div className="flex-1 px-1 text-center">
      <p className="yi-num text-[20px] font-bold leading-7 tracking-[-0.02em] text-[var(--yi-ink)]">
        {value}
        {unit && <span className="ml-[1px] text-[12px] font-semibold">{unit}</span>}
      </p>
      <p className="mt-0.5 text-[11.5px] leading-[15px] text-[var(--yi-muted)]">{label}</p>
    </div>
  );
}

export function LobbyScreen({
  onNavigate,
  onOpenAmenities,
}: {
  onNavigate: NavigateFn;
  onOpenAmenities: () => void;
}) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchServices(query), [query]);
  const quickServices = QUICK_SERVICE_IDS.map(
    (id) => SERVICES.find((s) => s.id === id)!
  );

  return (
    <div className="pb-8">
      {/* Hero */}
      <header className="relative">
        {/* Photo carries its own `relative`, so the fill layer is a wrapper
            rather than a className on Photo itself. Portrait crop plus a low
            object-position keeps the bronze louver facade in frame instead of
            the pale sky, which washes out under the scrim. */}
        <div className="absolute inset-0">
          <Photo
            id={EXTERIOR_PHOTO}
            alt="용인시청 본관 외관"
            className="h-full w-full"
            request={[700, 1000]}
            objectPosition="50% 78%"
            priority
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,26,45,0.52) 0%, rgba(8,32,58,0.44) 40%, rgba(9,40,72,0.88) 100%)",
          }}
        />
        <div className="relative px-5 pb-12 pt-[72px]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/16 px-2.5 py-1 text-[11px] font-semibold text-white">
            <QrCode size={12} weight="bold" />
            QR 안내판으로 접속했습니다
          </span>
          <h1 className="mt-3 text-[28px] font-bold leading-9 tracking-[-0.03em] text-white">
            {BUILDING.name} {BUILDING.wing}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-[14px] font-medium text-white/85">
            <MapPin size={15} weight="fill" />
            현재 위치 {BUILDING.entryPoint}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            <Badge tone="success" className="bg-[#D7F0E2] text-[#0B5A38]">
              지금 운영 중
            </Badge>
            <span className="yi-num text-[12px] font-medium text-white/75">
              {BUILDING.hours} | 18:00 마감
            </span>
          </div>
        </div>
      </header>

      {/* Search, floating over the hero seam */}
      <div className="relative -mt-7 px-5">
        <div className="yi-raised flex h-[52px] items-center gap-2.5 rounded-[14px] border border-[var(--yi-border)] bg-[var(--yi-surface)] px-4">
          <MagnifyingGlass size={19} weight="bold" className="shrink-0 text-[var(--yi-primary)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="민원명 또는 부서명을 검색하세요"
            aria-label="민원 서비스 검색"
            className="min-w-0 flex-1 bg-transparent text-[15px] text-[var(--yi-ink)] outline-none placeholder:text-[var(--yi-muted-soft)]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="검색어 지우기"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--yi-surface-soft)] text-[var(--yi-muted)]"
            >
              <X size={12} weight="bold" />
            </button>
          )}
        </div>

        {query.trim() !== "" && (
          <Card className="mt-2 overflow-hidden">
            {results.length === 0 ? (
              <p className="px-4 py-5 text-center text-[13.5px] text-[var(--yi-muted)]">
                검색 결과가 없습니다. 1층 종합안내데스크에서 안내받으실 수 있습니다.
              </p>
            ) : (
              results.slice(0, 5).map((s, i) => {
                const IconCmp = SERVICE_ICON[s.icon];
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onNavigate("service", { serviceId: s.id })}
                    className={`yi-press flex w-full items-center gap-3 px-4 py-3 text-left ${
                      i === Math.min(results.length, 5) - 1
                        ? ""
                        : "border-b border-[var(--yi-border)]"
                    }`}
                  >
                    <IconCmp size={18} weight="duotone" className="shrink-0 text-[var(--yi-primary)]" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14.5px] font-semibold text-[var(--yi-ink)]">
                        {s.name}
                      </span>
                      <span className="block truncate text-[12px] text-[var(--yi-muted)]">
                        {s.place}
                      </span>
                    </span>
                    <CaretRight size={14} weight="bold" className="shrink-0 text-[var(--yi-muted-soft)]" />
                  </button>
                );
              })
            )}
          </Card>
        )}
      </div>

      {/* Live status strip */}
      <div className="mt-5 px-5">
        <div className="flex items-center rounded-[14px] border border-[var(--yi-border)] bg-[var(--yi-surface)] py-3.5">
          <StatCell value={String(LIVE_STATUS.waitingTotal)} unit="명" label="현재 대기" />
          <span className="h-8 w-px bg-[var(--yi-border)]" />
          <StatCell
            value={`${LIVE_STATUS.kioskFree}/${LIVE_STATUS.kioskTotal}`}
            label="발급기 이용 가능"
          />
          <span className="h-8 w-px bg-[var(--yi-border)]" />
          <StatCell value={String(LIVE_STATUS.parkingFree)} unit="면" label="주차 여유" />
        </div>
        <p className="mt-2 px-1 text-[11.5px] leading-[16px] text-[var(--yi-muted-soft)]">
          {LIVE_STATUS.busiestCounter}가 가장 혼잡합니다 ({LIVE_STATUS.busiestWait}). {LIVE_STATUS.quietCounter}는 {LIVE_STATUS.quietWait}입니다.
        </p>
      </div>

      {/* Frequent services */}
      <section className="mt-7">
        <SectionHeader
          title="자주 찾는 민원"
          desc="누르면 처리 창구와 준비물을 바로 확인할 수 있습니다"
        />
        <div className="grid grid-cols-3 gap-2 px-5">
          {quickServices.map((s) => {
            const IconCmp = SERVICE_ICON[s.icon];
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onNavigate("service", { serviceId: s.id })}
                className="yi-press flex h-[96px] flex-col items-center justify-center gap-2 rounded-[14px] border border-[var(--yi-border)] bg-[var(--yi-surface)] px-1.5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[var(--yi-primary-soft)]">
                  <IconCmp size={19} weight="duotone" className="text-[var(--yi-primary)]" />
                </span>
                <span className="w-full text-center text-[12px] font-semibold leading-[16px] text-[var(--yi-ink)]">
                  {s.short}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Floors */}
      <section className="mt-7">
        <SectionHeader
          title="층별 안내"
          desc="층을 고르면 배치도에서 창구 위치를 볼 수 있습니다"
          action="배치도 열기"
          onAction={() => onNavigate("floor", { floor: 1 })}
        />
        <div className="space-y-2 px-5">
          {FLOORS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onNavigate("floor", { floor: f.id })}
              className="yi-press flex w-full items-center gap-4 rounded-[16px] border border-[var(--yi-border)] bg-[var(--yi-surface)] px-4 py-3.5 text-left"
            >
              <span className="yi-num flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[var(--yi-primary)] text-[15px] font-bold text-[var(--yi-on-primary)]">
                {f.label}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="truncate text-[15px] font-semibold text-[var(--yi-ink)]">
                    {f.name}
                  </span>
                  {f.id === BUILDING.entryFloor && (
                    <Badge tone="primary">현재 층</Badge>
                  )}
                </span>
                <span className="mt-0.5 block text-[12.5px] leading-[17px] text-[var(--yi-muted)]">
                  {f.summary}
                </span>
              </span>
              <CaretRight size={16} weight="bold" className="shrink-0 text-[var(--yi-muted-soft)]" />
            </button>
          ))}
        </div>
      </section>

      {/* Amenities */}
      <section className="mt-7">
        <SectionHeader
          title="편의시설 바로가기"
          action="전체 보기"
          onAction={onOpenAmenities}
        />
        <div className="flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {AMENITY_SHORTCUTS.map((a) => {
            const IconCmp = a.icon;
            return (
              <button
                key={a.label}
                type="button"
                onClick={() => onNavigate("floor", { floor: a.floor, facilityId: a.facilityId })}
                className="yi-press flex h-[78px] w-[84px] shrink-0 flex-col items-center justify-center gap-1.5 rounded-[14px] border border-[var(--yi-border)] bg-[var(--yi-surface)]"
              >
                <IconCmp size={20} weight="duotone" className="text-[var(--yi-cat-amenity)]" />
                <span className="px-1 text-center text-[11.5px] font-semibold leading-[15px] text-[var(--yi-body)]">
                  {a.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Cafe photo card, doubling as the 2층 대기 안내 */}
        <div className="mt-3 px-5">
          <button
            type="button"
            onClick={() => onNavigate("floor", { floor: 1, facilityId: "f1-cafe" })}
            className="yi-press flex w-full items-stretch gap-0 overflow-hidden rounded-[16px] border border-[var(--yi-border)] bg-[var(--yi-surface)] text-left"
          >
            <Photo
              id={CAFE_PHOTO}
              alt="창가 공용 테이블이 있는 시민 휴게 카페"
              className="h-[92px] w-[104px] shrink-0"
              sizes="104px"
            />
            <span className="flex min-w-0 flex-1 flex-col justify-center px-4 py-3">
              <span className="text-[14.5px] font-semibold text-[var(--yi-ink)]">
                대기 중에는 시민 휴게 카페에서
              </span>
              <span className="mt-1 text-[12.5px] leading-[17px] text-[var(--yi-muted)]">
                카페 안에도 번호표 호출 화면이 있어 자리에서 순서를 확인할 수 있습니다.
              </span>
            </span>
          </button>
        </div>
      </section>

      {/* Desk and ticket guidance */}
      <section className="mt-7 px-5">
        <div className="overflow-hidden rounded-[16px] border border-[var(--yi-border)] bg-[var(--yi-surface)]">
          <div className="flex items-start gap-3 border-b border-[var(--yi-border)] px-4 py-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#E2F3F0]">
              <Info size={19} weight="duotone" className="text-[var(--yi-cat-info)]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14.5px] font-semibold text-[var(--yi-ink)]">종합안내데스크</p>
              <p className="mt-1 text-[13px] leading-[19px] text-[var(--yi-body)]">
                정문으로 들어와 정면 8m입니다. 휠체어 대여와 서류 작성 도움을 받을 수 있습니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("floor", { floor: 1, facilityId: "f1-info" })}
              aria-label="종합안내데스크 위치 보기"
              className="yi-press mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--yi-surface-soft)]"
            >
              <ArrowRight size={14} weight="bold" className="text-[var(--yi-muted)]" />
            </button>
          </div>
          <div className="flex items-start gap-3 border-b border-[var(--yi-border)] px-4 py-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#EDEBFA]">
              <Ticket size={19} weight="duotone" className="text-[var(--yi-cat-kiosk)]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14.5px] font-semibold text-[var(--yi-ink)]">번호표 발급 안내</p>
              <p className="mt-1 text-[13px] leading-[19px] text-[var(--yi-body)]">
                창구 방문 전 종합민원실 입구 발급기에서 번호표를 먼저 뽑아 주세요.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("floor", { floor: 1, facilityId: "f1-ticket" })}
              aria-label="번호표 발급기 위치 보기"
              className="yi-press mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--yi-surface-soft)]"
            >
              <ArrowRight size={14} weight="bold" className="text-[var(--yi-muted)]" />
            </button>
          </div>
          <div className="flex items-start gap-3 px-4 py-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#EDEBFA]">
              <Printer size={19} weight="duotone" className="text-[var(--yi-cat-kiosk)]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14.5px] font-semibold text-[var(--yi-ink)]">무인민원발급기</p>
              <p className="mt-1 text-[13px] leading-[19px] text-[var(--yi-body)]">
                등본, 초본 등 42종을 대기 없이 발급합니다. 평일 07:00부터 22:00까지 운영합니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("floor", { floor: 1, facilityId: "f1-kiosk" })}
              aria-label="무인민원발급기 위치 보기"
              className="yi-press mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--yi-surface-soft)]"
            >
              <ArrowRight size={14} weight="bold" className="text-[var(--yi-muted)]" />
            </button>
          </div>
        </div>
      </section>

      {/* Notices */}
      <section className="mt-7">
        <SectionHeader title="안내 사항" />
        <div className="space-y-2 px-5">
          {NOTICES.map((n) => (
            <div
              key={n.id}
              className="flex gap-3 rounded-[14px] border px-4 py-3.5"
              style={{
                borderColor: n.tone === "warning" ? "#F0DCC2" : "var(--yi-border)",
                background: n.tone === "warning" ? "#FDF6EC" : "var(--yi-surface)",
              }}
            >
              <WarningCircle
                size={18}
                weight="duotone"
                className="mt-px shrink-0"
                style={{
                  color: n.tone === "warning" ? "var(--yi-warning)" : "var(--yi-muted)",
                }}
              />
              <div className="min-w-0">
                <p className="text-[13.5px] font-semibold text-[var(--yi-ink)]">{n.title}</p>
                <p className="mt-1 text-[12.5px] leading-[18px] text-[var(--yi-body)]">{n.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hours */}
      <section className="mt-7 px-5">
        <div className="rounded-[16px] bg-[var(--yi-surface-soft)] px-4 py-4">
          <h3 className="text-[14.5px] font-semibold text-[var(--yi-ink)]">운영 시간</h3>
          <dl className="mt-2.5 space-y-1.5">
            {[
              ["창구 운영", BUILDING.hours],
              ["점심시간", BUILDING.lunch],
              ["휴무", BUILDING.closedDays],
              ["주소", BUILDING.address],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-3">
                <dt className="w-[60px] shrink-0 text-[12.5px] text-[var(--yi-muted)]">{k}</dt>
                <dd className="yi-num min-w-0 flex-1 text-[12.5px] leading-[18px] text-[var(--yi-body)]">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
          <a
            href={`tel:${BUILDING.tel}`}
            className="yi-press mt-3.5 flex h-11 items-center justify-center gap-2 rounded-[12px] border border-[var(--yi-border-strong)] bg-[var(--yi-surface)] text-[14px] font-semibold text-[var(--yi-body)]"
          >
            <Phone size={17} weight="fill" className="text-[var(--yi-primary)]" />
            <span className="yi-num">{BUILDING.tel}</span> 대표번호로 문의
          </a>
        </div>
        <p className="mt-3 px-1 text-center text-[11px] leading-[16px] text-[var(--yi-muted-soft)]">
          {BUILDING.scannedAt} 기준 안내입니다.
        </p>
      </section>
    </div>
  );
}
