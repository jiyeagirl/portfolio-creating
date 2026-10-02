"use client";

import { useState } from "react";
import {
  CalendarBlank,
  CoatHanger,
  Dress,
  MagnifyingGlass,
  MapPin,
  Moped,
  Pants,
  Ruler,
  ShirtFolded,
  Sparkle,
  TShirt,
  WashingMachine,
} from "@phosphor-icons/react";
import type { Category, NavigateFn, Occasion } from "@/projects/platform/dressday/lib/types";
import { CATEGORIES, HERO_PHOTO, OCCASIONS, PRODUCTS } from "@/projects/platform/dressday/lib/catalog";
import { ADDRESSES, DELIVERY_SLOTS, REGIONS } from "@/projects/platform/dressday/lib/site-data";
import {
  CONTAINER,
  Chip,
  Photo,
  ProductCard,
  ProductImage,
  Reveal,
  SaveButton,
} from "@/projects/platform/dressday/components/site/ui";
import { won } from "@/projects/platform/dressday/lib/catalog";

const CATEGORY_ICON: Record<Category, typeof Dress> = {
  원피스: Dress,
  "블라우스, 셔츠": ShirtFolded,
  니트: TShirt,
  아우터: CoatHanger,
  스커트: Dress,
  팬츠: Pants,
  셋업: CoatHanger,
};

const FLOW = [
  { icon: MagnifyingGlass, title: "받을 날과 사이즈로 찾기", body: "오늘 받을 수 있는 옷만 골라 보여 드려요." },
  { icon: Moped, title: "원하는 30분에 수령", body: "18:00 전 주문은 그날 저녁 21:30 전에 도착해요." },
  { icon: CalendarBlank, title: "입고 싶은 만큼 이용", body: "1일 단위로 연장할 수 있고, 연장료는 같은 금액이에요." },
  { icon: WashingMachine, title: "라이더 회수, 세탁은 저희가", body: "고른 시간에 문 앞에서 가져가요. 드라이클리닝은 대여료에 포함돼요." },
];

export function HomeScreen({ onNavigate, onOpenProduct }: { onNavigate: NavigateFn; onOpenProduct: (id: string) => void }) {
  const [category, setCategory] = useState<Category | "전체">("전체");
  const [occasion, setOccasion] = useState<Occasion | null>(null);

  const todayList = PRODUCTS.filter((p) => p.today && (category === "전체" || p.category === category)).slice(0, 8);
  const popular = PRODUCTS.filter((p) => p.rank).sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
  const fresh = PRODUCTS.filter((p) => p.isNew);
  // 큰 카드는 위 두 블록(오늘 받을 수 있는 옷, 인기)에 나오지 않은 사진 상품
  const lead = fresh.find((p) => p.photo && !p.today && !p.rank) ?? fresh[0];
  const restNew = fresh.filter((p) => p !== lead);
  const firstSlot = DELIVERY_SLOTS.find((s) => s.left > 0);

  return (
    <div>
      {/* 히어로: 검색 우선 */}
      <section className={`${CONTAINER} grid items-center gap-8 pb-12 pt-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-16 lg:pb-16 lg:pt-14`}>
        <div className="min-w-0">
          <h1 className="dd-enter dd-balance text-[28px] font-bold leading-10 tracking-[-0.02em]">
            오늘 입을 옷,
            <br />
            오늘 저녁에 받으세요
          </h1>
          <p className="dd-enter dd-pretty mt-3 max-w-[520px] text-[16px] text-[var(--dd-body)]" style={{ animationDelay: "50ms" }}>
            18:00까지 예약하면 오늘 안에 문 앞으로 가져가요. 반납은 원하는 시간에 라이더가 회수해요.
          </p>

          {/* 데스크톱: 64px 알약 3분할 + orb */}
          <div className="dd-enter mt-8 hidden h-16 items-center rounded-full border border-[var(--dd-hairline)] bg-white pl-2 pr-2 shadow-[var(--dd-float)] md:flex" style={{ animationDelay: "100ms" }}>
            <SearchSegment label="받는 날" value="오늘, 9월 18일 (금)" />
            <span aria-hidden className="h-8 w-px bg-[var(--dd-hairline)]" />
            <SearchSegment label="받는 곳" value={ADDRESSES[0].line.replace("서울 ", "")} grow />
            <span aria-hidden className="h-8 w-px bg-[var(--dd-hairline)]" />
            <SearchSegment label="사이즈" value="S (55)" />
            <button
              type="button"
              onClick={() => onNavigate("browse")}
              aria-label="오늘 받을 수 있는 옷 찾기"
              className="dd-press ml-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--dd-primary)] text-white active:bg-[var(--dd-primary-active)]"
            >
              <MagnifyingGlass size={20} weight="bold" />
            </button>
          </div>

          {/* 모바일: 조건 3줄 카드 */}
          <div className="dd-enter mt-6 overflow-hidden rounded-[14px] border border-[var(--dd-hairline)] bg-white shadow-[var(--dd-float)] md:hidden" style={{ animationDelay: "100ms" }}>
            <MobileRow icon={CalendarBlank} label="받는 날" value="오늘, 9월 18일 (금)" />
            <MobileRow icon={MapPin} label="받는 곳" value={ADDRESSES[0].line.replace("서울 ", "")} />
            <MobileRow icon={Ruler} label="사이즈" value="S (55)" />
            <div className="p-3">
              <button
                type="button"
                onClick={() => onNavigate("browse")}
                className="dd-press flex h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-[var(--dd-primary)] text-[16px] font-medium text-white active:bg-[var(--dd-primary-active)]"
              >
                <MagnifyingGlass size={18} weight="bold" />
                오늘 받을 옷 찾기
              </button>
            </div>
          </div>

          <div className="dd-enter dd-scroll-x -mx-6 mt-5 flex items-center gap-2 overflow-x-auto px-6 md:mx-0 md:flex-wrap md:px-0" style={{ animationDelay: "150ms" }}>
            {OCCASIONS.map((o) => (
              <Chip key={o} on={occasion === o} onClick={() => setOccasion(occasion === o ? null : o)}>
                {o}
              </Chip>
            ))}
          </div>
          {firstSlot && (
            <p className="dd-num mt-5 flex items-center gap-2 text-[14px] text-[var(--dd-body)]">
              <Moped size={18} className="shrink-0 text-[var(--dd-ink)]" />
              지금 예약하면 <span className="font-semibold text-[var(--dd-ink)]">{firstSlot.time}</span> 도착
            </p>
          )}
        </div>

        <div className="hidden lg:block">
          <Photo id={HERO_PHOTO.id} alt={HERO_PHOTO.alt} w={800} h={1000} className="aspect-[4/5] w-full rounded-[14px]" />
        </div>
      </section>

      {/* 카테고리 탭 + 오늘 받을 수 있는 옷 (조건 목록) */}
      <Reveal className={`${CONTAINER}`}>
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-[22px] font-medium leading-[26px] tracking-[-0.02em]">오늘 받을 수 있는 옷</h2>
          <button type="button" onClick={() => onNavigate("browse")} className="shrink-0 text-[14px] font-medium underline underline-offset-4">
            S 사이즈 {PRODUCTS.filter((p) => p.today && p.stock.S !== undefined).length}벌 모두 보기
          </button>
        </div>
        <div className="dd-scroll-x -mx-6 mt-5 flex gap-7 overflow-x-auto border-b border-[var(--dd-hairline)] px-6 lg:mx-0 lg:px-0">
          {(["전체", ...CATEGORIES] as const).map((c) => {
            const on = category === c;
            const Icon = c === "전체" ? Sparkle : CATEGORY_ICON[c];
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={on}
                className={`relative flex shrink-0 flex-col items-center gap-2 pb-3 text-[13px] ${on ? "font-semibold text-[var(--dd-ink)]" : "text-[var(--dd-muted)]"}`}
              >
                <Icon size={28} weight={on ? "fill" : "regular"} />
                {c}
                {on && <span aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 bg-[var(--dd-ink)]" />}
              </button>
            );
          })}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
          {todayList.map((p) => (
            <ProductCard key={p.id} product={p} onOpen={() => onOpenProduct(p.id)} saved={p.id === "wrap-midi"} />
          ))}
        </div>
      </Reveal>

      {/* 인기: 가로 레일 (페이지에서 한 번) */}
      <Reveal className="mt-16 bg-[var(--dd-soft)] py-12 lg:mt-24 lg:py-16">
        <div className={CONTAINER}>
          <h2 className="text-[22px] font-medium leading-[26px] tracking-[-0.02em]">이번 주 가장 많이 빌린 옷</h2>
          <p className="mt-1 text-[14px] text-[var(--dd-muted)]">9월 11일 ~ 9월 17일 대여 횟수 기준</p>
        </div>
        <div className="dd-scroll-x mt-6 overflow-x-auto">
          <ol className={`${CONTAINER} flex gap-4`}>
            {popular.map((p) => (
              <li key={p.id} className="w-[42%] shrink-0 md:w-[30%] lg:w-[calc((100%-64px)/5)]">
                <button type="button" onClick={() => onOpenProduct(p.id)} className="dd-zoom block w-full text-left">
                  <div className="relative">
                    <ProductImage product={p} w={480} h={640} className="aspect-[3/4] w-full rounded-[14px]" iconSize={36} />
                    <span className="dd-num absolute bottom-3 left-3 flex h-8 min-w-8 items-center justify-center rounded-full bg-white px-2 text-[14px] font-semibold shadow-[var(--dd-float)]">
                      {p.rank}
                    </span>
                  </div>
                  <span className="mt-3 block truncate text-[15px] font-semibold">{p.name}</span>
                  <span className="dd-num mt-0.5 block whitespace-nowrap text-[14px] text-[var(--dd-muted)]">{won(p.price)} / 1일</span>
                  <span className="dd-num block whitespace-nowrap text-[13px] font-medium text-[var(--dd-ink)]">이번 주 {p.week}회</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      {/* 신규: 편집 그리드 */}
      <Reveal className={`${CONTAINER} mt-16 lg:mt-24`}>
        <h2 className="text-[22px] font-medium leading-[26px] tracking-[-0.02em]">새로 들어온 옷</h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-6">
          <button type="button" onClick={() => onOpenProduct(lead.id)} className="dd-zoom group relative block overflow-hidden rounded-[14px] text-left">
            <ProductImage product={lead} w={900} h={1125} className="aspect-[4/5] w-full lg:aspect-auto lg:h-full" />
            <div className="absolute inset-x-0 bottom-0 rounded-b-[14px] bg-gradient-to-t from-black/60 to-transparent px-6 pb-6 pt-20 text-white">
              <p className="text-[14px] text-white/80">{lead.label}</p>
              <p className="mt-1 text-[21px] font-bold leading-[30px]">{lead.name}</p>
              <p className="dd-num mt-1 text-[15px]">{won(lead.price)} / 1일</p>
            </div>
          </button>
          <div className="grid grid-cols-2 gap-4 lg:gap-6">
            {restNew.slice(0, 4).map((p, i) => (
              <div key={p.id} className={i > 1 ? "hidden lg:block" : ""}>
                <div className="dd-zoom relative">
                  <button type="button" onClick={() => onOpenProduct(p.id)} className="block w-full">
                    <ProductImage product={p} w={480} h={480} className="aspect-square w-full rounded-[14px]" iconSize={36} />
                  </button>
                  <SaveButton className="absolute right-1 top-1" />
                </div>
                <button type="button" onClick={() => onOpenProduct(p.id)} className="mt-3 block w-full text-left">
                  <span className="block truncate text-[15px] font-semibold">{p.name}</span>
                  <span className="dd-num block text-[14px] text-[var(--dd-muted)]">
                    {p.color}, {won(p.price)} / 1일
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* 이용 흐름 */}
      <Reveal className={`${CONTAINER} mt-16 lg:mt-24`}>
        <h2 className="text-[22px] font-medium leading-[26px] tracking-[-0.02em]">받고, 입고, 돌려주기</h2>
        <ul className="mt-6 grid gap-6 border-t border-[var(--dd-hairline)] pt-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {FLOW.map((f) => (
            <li key={f.title} className="flex gap-4 lg:flex-col lg:gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--dd-strong)]">
                <f.icon size={24} />
              </span>
              <div className="min-w-0">
                <p className="text-[16px] font-semibold">{f.title}</p>
                <p className="dd-pretty mt-1 text-[14px] leading-5 text-[var(--dd-muted)]">{f.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* 당일 배송 가능 지역 */}
      <Reveal className={`${CONTAINER} mt-16 lg:mt-24`}>
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-16">
          <div>
            <h2 className="text-[22px] font-medium leading-[26px] tracking-[-0.02em]">당일 배송 지역</h2>
            <p className="dd-pretty mt-2 text-[15px] text-[var(--dd-body)]">서울 8개 구. 다른 지역은 다음 날 오전 배송이에요.</p>
          </div>
          <table className="w-full text-left text-[15px]">
            <thead>
              <tr className="border-b border-[var(--dd-ink)] text-[13px] text-[var(--dd-muted)]">
                <th className="py-3 font-medium">지역</th>
                <th className="py-3 text-right font-medium">당일 주문 마감</th>
                <th className="hidden py-3 text-right font-medium sm:table-cell">도착 시간대</th>
              </tr>
            </thead>
            <tbody>
              {REGIONS.map((r) => (
                <tr key={r.gu} className="border-b border-[var(--dd-hairline-soft)]">
                  <td className="py-3.5">
                    <span className="font-medium">{r.gu}</span>
                    {r.note && <span className="ml-2 text-[13px] text-[var(--dd-muted)]">{r.note}</span>}
                  </td>
                  <td className={`dd-num py-3.5 text-right ${r.cutoff === "17:00" ? "font-semibold" : ""}`}>{r.cutoff}</td>
                  <td className="dd-num hidden py-3.5 text-right text-[var(--dd-muted)] sm:table-cell">{r.window}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </div>
  );
}

function SearchSegment({ label, value, grow }: { label: string; value: string; grow?: boolean }) {
  return (
    <button type="button" className={`flex min-w-0 flex-col justify-center rounded-full px-6 py-2 text-left active:bg-[var(--dd-soft)] ${grow ? "flex-1" : "shrink-0"}`}>
      <span className="text-[12px] font-bold text-[var(--dd-ink)]">{label}</span>
      <span className="truncate text-[15px] text-[var(--dd-body)]">{value}</span>
    </button>
  );
}

function MobileRow({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <button type="button" className="flex w-full items-center gap-3 border-b border-[var(--dd-hairline-soft)] px-4 py-3 text-left">
      <Icon size={20} className="shrink-0 text-[var(--dd-muted)]" />
      <span className="w-14 shrink-0 text-[13px] font-bold">{label}</span>
      <span className="min-w-0 flex-1 truncate text-[15px] text-[var(--dd-body)]">{value}</span>
    </button>
  );
}
