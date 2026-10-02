"use client";

import { useMemo, useState } from "react";
import { Check } from "@phosphor-icons/react";
import {
  AppBar,
  Badge,
  Card,
  PhotoTile,
  PriceTag,
  PrimaryButton,
  Tabs,
} from "@/projects/commerce/snowpeak/components/ui";
import { LIFT_PASSES } from "@/projects/commerce/snowpeak/lib/mock-data";
import type { CartItem, LiftPass, LiftPassCategory } from "@/projects/commerce/snowpeak/lib/types";
import type { NavigateFn } from "@/projects/commerce/snowpeak/lib/navigation";

type PassTab = "lift" | "season";

const LIFT_CATEGORIES: LiftPassCategory[] = ["1일권", "반일권", "야간권"];

const HERO_PHOTO: Record<PassTab, string> = {
  lift: "https://images.pexels.com/photos/29952995/pexels-photo-29952995.jpeg?auto=compress&cs=tinysrgb&w=1200",
  season: "https://images.pexels.com/photos/19771985/pexels-photo-19771985.jpeg?auto=compress&cs=tinysrgb&w=1200",
};

/** 시즌권 탭 사진이 "흐린 하늘 아래 체어리프트 홀로 탑승"으로 빈 배경처럼 보인다는 피드백에 따라
 *  리프트 라인이 여러 봉우리를 가로지르는 항공뷰로 교체. 리프트권 탭 사진은 그대로 둔다. */
const HERO_ALT: Record<PassTab, string> = {
  lift: "붉은 곤돌라 캐빈 여러 대가 설사면 위 케이블을 타고 이동하는 모습",
  season: "체어리프트 라인이 여러 봉우리를 가로지르는 리조트 슬로프 항공뷰",
};

const HERO_COPY: Record<PassTab, { title: string; body: string }> = {
  lift: { title: "오늘 탈 만큼만", body: "1일권부터 야간권까지 원하는 시간만 골라 담으세요" },
  season: { title: "시즌 내내 무제한", body: "전 슬로프를 시즌 끝까지 무제한으로 즐기는 프리미엄 패스" },
};

export function LiftSeasonScreen({
  onNavigate,
  onAddToCart,
}: {
  onNavigate: NavigateFn;
  onAddToCart: (item: CartItem) => void;
}) {
  const [tab, setTab] = useState<PassTab>("lift");

  const passes = useMemo(
    () =>
      LIFT_PASSES.filter((pass) =>
        tab === "season"
          ? pass.category === "시즌권"
          : (LIFT_CATEGORIES as string[]).includes(pass.category)
      ),
    [tab]
  );

  function handlePurchase(pass: LiftPass) {
    onAddToCart({
      cartId: crypto.randomUUID(),
      kind: pass.category === "시즌권" ? "season" : "lift",
      refId: pass.id,
      name: pass.name,
      detail: pass.validity,
      quantity: 1,
      unitPrice: pass.price,
    });
    onNavigate("cart");
  }

  const hero = HERO_COPY[tab];

  return (
    <div className="snowpeak flex h-full flex-col bg-[var(--sp-bg)]">
      <AppBar title="리프트권 / 시즌권" onBack={() => onNavigate("bookHub")} />

      <div className="flex-1 overflow-y-auto pb-10">
        <div className="relative h-[128px] w-full overflow-hidden">
          <PhotoTile src={HERO_PHOTO[tab]} alt={HERO_ALT[tab]} className="absolute inset-0 h-full w-full" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(19,26,34,0) 25%, rgba(19,26,34,.78) 100%)" }}
          />
          <div className="absolute inset-x-0 bottom-0 px-5 pb-4">
            <p className="text-[16px] font-semibold text-white">{hero.title}</p>
            <p className="mt-0.5 text-[12px] leading-relaxed text-white/80">{hero.body}</p>
          </div>
        </div>

        <Tabs
          value={tab}
          items={[
            { key: "lift", label: "리프트권" },
            { key: "season", label: "시즌권" },
          ]}
          onChange={setTab}
        />

        <div className="flex flex-col gap-3 px-5 pt-4">
          {passes.map((pass) => {
            const isSeason = pass.category === "시즌권";
            const isPremium = pass.id === "season-premium";
            const lowStock = pass.stock <= 30;

            return (
              <Card
                key={pass.id}
                className={
                  isSeason
                    ? "border border-[var(--sp-accent)]/35 bg-[var(--sp-accent-soft)]"
                    : "border border-[var(--sp-border)]"
                }
              >
                <div className="flex items-center gap-1.5">
                  <Badge tone={isSeason ? "ink" : "neutral"}>{pass.category}</Badge>
                  {isPremium && <Badge tone="warn">베스트</Badge>}
                </div>

                <h3 className="mt-2.5 text-[16px] font-semibold text-[var(--sp-ink)]">{pass.name}</h3>
                <p className="mt-0.5 text-[12.5px] text-[var(--sp-mute)]">{pass.validity}</p>

                <ul className="mt-3 flex flex-col gap-1.5">
                  {pass.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2 text-[13px] text-[var(--sp-body)]">
                      <Check size={13} weight="bold" className="shrink-0 text-[var(--sp-accent)]" />
                      {perk}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex items-center gap-1.5">
                  <Badge tone={lowStock ? "warn" : "success"}>
                    {lowStock ? `잔여 ${pass.stock}매` : "구매 가능"}
                  </Badge>
                </div>

                <div className="mt-3 flex items-end justify-between gap-3 border-t border-[var(--sp-border)] pt-3">
                  <PriceTag price={pass.price} size={isSeason ? "lg" : "md"} />
                  <PrimaryButton onClick={() => handlePurchase(pass)} size="sm" full={false} trailingIcon={false}>
                    구매하기
                  </PrimaryButton>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
