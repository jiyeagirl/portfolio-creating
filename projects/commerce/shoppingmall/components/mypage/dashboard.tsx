"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  CaretRight,
  Gear,
  Heart,
  MapPin,
  Medal,
  Package,
  PencilSimple,
  Trash,
  X,
} from "@phosphor-icons/react";
import { addresses, customer, orders, orderStatusColor } from "@/projects/commerce/shoppingmall/lib/account";
import { formatPrice, products } from "@/projects/commerce/shoppingmall/lib/products";

const WISHLIST_IDS = ["p-01", "p-04", "p-09", "p-11", "p-15", "p-16"];
const wishlist = products.filter((p) => WISHLIST_IDS.includes(p.id));

const TABS = [
  { key: "orders", label: "주문내역", icon: Package },
  { key: "wishlist", label: "위시리스트", icon: Heart },
  { key: "address", label: "배송지 관리", icon: MapPin },
  { key: "profile", label: "회원정보", icon: Gear },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function initials(name: string) {
  return name.slice(-2);
}

export function AccountDashboard() {
  const [tab, setTab] = useState<TabKey>("orders");
  const [wishlistIds, setWishlistIds] = useState<string[]>(WISHLIST_IDS);

  const visibleWishlist = wishlist.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-12 sm:px-10 sm:py-16 lg:px-16">
      <div className="mb-10 flex flex-col gap-1">
        <h1 className="text-[28px] font-semibold tracking-tight sm:text-[32px]">
          마이페이지
        </h1>
        <p className="text-[15px] text-muted">
          {customer.name}님, 오늘도 좋은 하루 보내세요.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr]">
        <aside className="flex flex-col gap-6">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-[15px] font-semibold text-accent-foreground">
                {initials(customer.name)}
              </div>
              <div>
                <p className="text-[15px] font-semibold">{customer.name}</p>
                <p className="text-[12px] text-muted">{customer.email}</p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1.5 text-accent">
              <Medal size={16} weight="fill" />
              <span className="text-[12px] font-semibold tracking-wide">
                {customer.tier} MEMBER
              </span>
              <span className="text-[11px] text-accent/70">
                · {customer.memberSince} 가입
              </span>
            </div>

            <div className="mt-5 border-t border-border pt-5">
              <div className="flex items-baseline justify-between">
                <span className="text-[12px] text-muted">보유 포인트</span>
                <span className="text-[15px] font-semibold">
                  {customer.points.toLocaleString("ko-KR")}P
                </span>
              </div>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${customer.tierProgress * 100}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] text-muted">
                다음 등급까지 {customer.pointsToNextTier.toLocaleString("ko-KR")}원
                남았어요
              </p>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left text-[14px] font-medium transition-colors ${
                  tab === key
                    ? "bg-foreground text-background"
                    : "text-foreground/80 hover:bg-surface"
                }`}
              >
                <Icon size={17} weight={tab === key ? "fill" : "regular"} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="min-w-0">
          {tab === "orders" && (
            <section>
              <div className="mb-6 flex items-baseline justify-between">
                <h2 className="text-[19px] font-semibold tracking-tight">
                  주문내역
                </h2>
                <span className="text-[13px] text-muted">
                  최근 6개월 · 총 {orders.length}건
                </span>
              </div>
              <ul className="divide-y divide-border rounded-2xl border border-border">
                {orders.map((order) => (
                  <li
                    key={order.id}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface">
                        <Image
                          src={order.thumbnail}
                          alt={order.items}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] text-muted">
                            {order.date}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${orderStatusColor[order.status]}`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="mt-1 text-[14px] font-medium">
                          {order.items}
                        </p>
                        <p className="mt-0.5 text-[12px] text-muted">
                          주문번호 {order.id}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 pl-20 sm:pl-0">
                      <span className="text-[15px] font-semibold">
                        {formatPrice(order.total)}
                      </span>
                      <Link
                        href="#"
                        className="flex items-center gap-1 text-[13px] font-medium text-muted transition-colors hover:text-foreground"
                      >
                        상세보기
                        <CaretRight size={13} weight="bold" />
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {tab === "wishlist" && (
            <section>
              <div className="mb-6 flex items-baseline justify-between">
                <h2 className="text-[19px] font-semibold tracking-tight">
                  위시리스트
                </h2>
                <span className="text-[13px] text-muted">
                  {visibleWishlist.length}개 상품
                </span>
              </div>
              {visibleWishlist.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border py-20 text-center">
                  <p className="text-[14px] text-muted">
                    아직 담은 상품이 없어요.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
                  {visibleWishlist.map((product) => (
                    <div key={product.id} className="group">
                      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-surface">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(min-width: 640px) 30vw, 45vw"
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setWishlistIds((prev) =>
                              prev.filter((id) => id !== product.id),
                            )
                          }
                          aria-label="위시리스트에서 삭제"
                          className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 backdrop-blur transition-transform active:scale-90"
                        >
                          <X size={14} weight="bold" className="text-black/70" />
                        </button>
                      </div>
                      <div className="mt-2.5 space-y-0.5">
                        <p className="text-[12px] text-muted">
                          {product.category}
                        </p>
                        <p className="text-[13.5px] font-medium leading-snug">
                          {product.name}
                        </p>
                        <p className="text-[13.5px] font-semibold">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {tab === "address" && (
            <section>
              <div className="mb-6 flex items-baseline justify-between">
                <h2 className="text-[19px] font-semibold tracking-tight">
                  배송지 관리
                </h2>
                <button
                  type="button"
                  className="text-[13px] font-medium text-accent transition-colors hover:opacity-80"
                >
                  + 새 배송지 추가
                </button>
              </div>
              <div className="flex flex-col gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="flex flex-col gap-3 rounded-2xl border border-border p-5 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-semibold">
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent">
                            기본 배송지
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-[13px] text-foreground/85">
                        {addr.recipient} · {addr.phone}
                      </p>
                      <p className="mt-1 text-[13px] text-muted">
                        {addr.address}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        aria-label="배송지 수정"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-border transition-colors hover:bg-surface"
                      >
                        <PencilSimple size={14} weight="regular" />
                      </button>
                      <button
                        type="button"
                        aria-label="배송지 삭제"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-border transition-colors hover:bg-surface"
                      >
                        <Trash size={14} weight="regular" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === "profile" && (
            <section>
              <h2 className="mb-6 text-[19px] font-semibold tracking-tight">
                회원정보
              </h2>
              <div className="flex flex-col divide-y divide-border rounded-2xl border border-border">
                {[
                  { label: "이름", value: customer.name },
                  { label: "이메일", value: customer.email },
                  { label: "전화번호", value: "010-4821-9036" },
                  { label: "가입일", value: `${customer.memberSince}.02` },
                  { label: "회원 등급", value: `${customer.tier} MEMBER` },
                ].map((field) => (
                  <div
                    key={field.label}
                    className="flex items-center justify-between px-6 py-4"
                  >
                    <span className="text-[13px] text-muted">
                      {field.label}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="text-[14px] font-medium">
                        {field.value}
                      </span>
                      <button
                        type="button"
                        className="text-[13px] font-medium text-muted transition-colors hover:text-foreground"
                      >
                        수정
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
