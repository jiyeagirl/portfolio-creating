"use client";

import { useMemo, useState } from "react";
import { Bell, MagnifyingGlass, ShieldCheck } from "@phosphor-icons/react";
import { ProductCard } from "@/projects/community/waypoint/components/ui";
import { MapCanvas } from "@/projects/community/waypoint/components/map-canvas";
import {
  BottomSheet,
  FloatingChip,
  SheetSegment,
  type SheetStage,
} from "@/projects/community/waypoint/components/bottom-sheet";
import { ME, PRODUCTS, WAYPOINT_SPOTS } from "@/projects/community/waypoint/lib/mock-data";
import type { BottomNavKey, HomeTab } from "@/projects/community/waypoint/lib/navigation";
import type { ProductCategory } from "@/projects/community/waypoint/lib/types";

/* 아키타입 A4 — 맵 캔버스 + 바텀시트.

   spec.md의 Key Focus 첫 줄은 "'내 동선 홈'을 핵심 차별점으로 가장 강조"다. 그런데 이전
   구현(A1 섹션 스택)에서 지도는 화면 맨 아래의 **아무 동작 없는 버튼 하나**로만 존재했다:
   `<Button variant="secondary" full>지도 기반 동선 보기</Button>`. 제품의 핵심 차별점이
   UI에 존재하지 않았다는 뜻이다.

   A4로 바꾸면서 지도가 홈 전면이 되고, 매물은 지도 위 가격 핀으로 흩어진다. 목록은
   3단 스냅 시트 안으로 들어갔다.

   - 하단 탭바 없음. 시트 헤더의 세그먼트가 그 역할을 한다.
   - `SectionTitle`을 쓰지 않는다 — 이 아키타입에 섹션 반복이 없다.
   - `HeroCard`를 쓰지 않는다 — 지도 자체가 히어로다.
   - 필터는 지도 위 플로팅 칩. 시트 안이 아니라 지도 레이어에 있다. */

const CATEGORIES: ProductCategory[] = [
  "전자기기",
  "가구/인테리어",
  "패션/잡화",
  "취미/악기",
  "생활가전",
  "스포츠/레저",
];

/** 지도 핀에 들어가는 축약 가격. 만원 단위로 접어야 핀이 서로 겹치지 않는다. */
function pinPrice(won: number): string {
  if (won >= 10000) {
    const man = won / 10000;
    return `${Number.isInteger(man) ? man : man.toFixed(1)}만`;
  }
  return `${won.toLocaleString("ko-KR")}원`;
}

export function HomeScreen({
  onOpenProduct,
  onNavigate,
}: {
  onOpenProduct: (id: string) => void;
  onNavigate: (key: BottomNavKey) => void;
}) {
  const [tab, setTab] = useState<HomeTab>("route");
  const [category, setCategory] = useState<ProductCategory | "전체">("전체");
  const [stage, setStage] = useState<SheetStage>("half");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [liked, setLiked] = useState<Set<string>>(new Set(["p5", "p1"]));

  function toggleLike(id: string) {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  /* 내 동네 홈은 거리순, 내 동선 홈은 퇴근 동선 도달 시간순. 축이 다르다는 것이
     두 탭의 존재 이유이므로 정렬 기준까지 갈라 둔다. */
  const visible = useMemo(() => {
    const base = PRODUCTS.filter((p) => p.status !== "거래완료");
    const byCategory = category === "전체" ? base : base.filter((p) => p.category === category);
    return [...byCategory].sort((a, b) =>
      tab === "neighborhood" ? a.distanceM - b.distanceM : a.etaMin - b.etaMin,
    );
  }, [category, tab]);

  const active = visible.find((p) => p.id === activeId) ?? null;

  function selectPin(id: string) {
    setActiveId(id);
    if (stage === "peek") setStage("half");
  }

  return (
    <div className="waypoint wp-enter relative h-full overflow-hidden bg-[var(--wp-canvas)]">
      <MapCanvas
        pins={visible.map((p) => ({
          id: p.id,
          price: pinPrice(p.price),
          active: p.id === activeId,
          onSelect: () => selectPin(p.id),
        }))}
        spots={WAYPOINT_SPOTS.map((s) => ({ id: s.id, name: s.name }))}
        homeLabel="합정동"
        workLabel="역삼동"
        overlay={
          <>
            {/* 상단 컨트롤 — 지도 위에 떠 있고, 상태바(59px)를 비켜 앉는다. */}
            <div className="absolute inset-x-4 top-[67px] flex items-center gap-2">
              <div
                className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-white px-3.5 py-2.5"
                style={{ boxShadow: "var(--wp-shadow)" }}
              >
                <MagnifyingGlass size={16} className="shrink-0 text-[var(--wp-muted)]" />
                <span className="truncate text-[13.5px] text-[var(--wp-muted)]">
                  합정동에서 역삼동 사이 검색
                </span>
              </div>
              <button
                type="button"
                aria-label="알림"
                className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[var(--wp-ink)]"
                style={{ boxShadow: "var(--wp-shadow)" }}
              >
                <Bell size={18} />
                <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-[var(--wp-danger)]" />
              </button>
            </div>

            <div className="absolute inset-x-0 top-[123px] flex gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <FloatingChip
                label="전체"
                active={category === "전체"}
                onClick={() => setCategory("전체")}
              />
              {CATEGORIES.map((c) => (
                <FloatingChip
                  key={c}
                  label={c}
                  active={category === c}
                  onClick={() => setCategory(c)}
                />
              ))}
            </div>
          </>
        }
      />

      <BottomSheet
        stage={stage}
        onStageChange={setStage}
        header={
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <SheetSegment
                options={[
                  { key: "neighborhood" as HomeTab, label: "내 동네", tone: "home" },
                  { key: "route" as HomeTab, label: "내 동선", tone: "work" },
                ]}
                value={tab}
                onChange={setTab}
              />
              <button
                type="button"
                onClick={() => onNavigate("waypoint")}
                className="shrink-0 text-[12.5px] font-semibold text-[var(--wp-accent-2-ink)] transition-opacity active:opacity-60"
              >
                웨이스팟 {WAYPOINT_SPOTS.length}곳
              </button>
            </div>

            <div className="flex items-center gap-2 text-[12.5px] text-[var(--wp-muted)]">
              <span className="inline-flex items-center gap-1 text-[var(--wp-success)]">
                <ShieldCheck size={13} weight="fill" />
                {tab === "neighborhood" ? ME.homeDong : "집 / 직장 인증완료"}
              </span>
              <span className="text-[var(--wp-border-strong)]">|</span>
              <span className="tabular-nums">
                {visible.length}건 {tab === "neighborhood" ? "가까운 순" : "동선 도착 순"}
              </span>
            </div>
          </div>
        }
      >
        {active && (
          <div className="mb-2 rounded-[14px] bg-[var(--wp-surface-soft)] p-1">
            <ProductCard
              product={active}
              onClick={() => onOpenProduct(active.id)}
              liked={liked.has(active.id)}
              onToggleLike={() => toggleLike(active.id)}
              metaMode={tab === "route" ? "route" : undefined}
            />
          </div>
        )}

        <div className="divide-y divide-[var(--wp-border)]">
          {visible
            .filter((p) => p.id !== activeId)
            .map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onClick={() => onOpenProduct(p.id)}
                liked={liked.has(p.id)}
                onToggleLike={() => toggleLike(p.id)}
                metaMode={tab === "route" ? "route" : undefined}
              />
            ))}
        </div>
      </BottomSheet>
    </div>
  );
}
