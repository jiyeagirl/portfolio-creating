"use client";

import { useState } from "react";
import Image from "next/image";
import { CaretLeft, CheckCircle, Clock, Package } from "@phosphor-icons/react";
import { BottomNav } from "@/projects/community/enclave/components/bottom-nav";
import { Badge, Button, EmptyState, HeroCard, formatWon } from "@/projects/community/enclave/components/ui";
import { MY_LOCKERS, PRODUCTS, picsumId } from "@/projects/community/enclave/lib/mock-data";
import type { BottomNavKey } from "@/projects/community/enclave/lib/navigation";
import type { LockerStatus } from "@/projects/community/enclave/lib/types";

function statusTone(status: LockerStatus) {
  if (status === "픽업완료") return "neutral" as const;
  if (status === "회수예정") return "warn" as const;
  return "accent" as const;
}

export function LockerScreen({ onNavigate }: { onNavigate: (key: BottomNavKey) => void }) {
  const [lockers, setLockers] = useState(MY_LOCKERS);
  const [selectedId, setSelectedId] = useState<string | null>(lockers[0]?.id ?? null);

  const selected = lockers.find((l) => l.id === selectedId);
  const product = selected ? PRODUCTS.find((p) => p.id === selected.productId) : undefined;

  function completePickup(id: string) {
    setLockers((prev) => prev.map((l) => (l.id === id ? { ...l, status: "픽업완료" } : l)));
  }

  return (
    <div className="enclave relative flex h-full flex-col bg-[var(--ec-canvas)]">
      {selected ? (
        <>
          <header className="flex items-center gap-2 px-3 pt-[59px] pb-2">
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              aria-label="목록으로"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--ec-ink)] transition-colors active:bg-[var(--ec-surface-soft)]"
            >
              <CaretLeft size={19} weight="bold" />
            </button>
            <h1 className="text-[15.5px] font-semibold text-[var(--ec-ink)]">무인택배함 픽업</h1>
          </header>

          <div className="flex-1 overflow-y-auto ec-scroll px-5 pb-[92px]">
            <HeroCard className="mt-1">
              <div className="flex flex-col items-center gap-4 px-6 py-8 text-center">
                <Badge tone={statusTone(selected.status)}>{selected.status}</Badge>
                <div>
                  <p className="text-[13px] text-[var(--ec-muted)]">{selected.label}</p>
                  <p className="mt-1 tabular-nums text-[40px] font-bold tracking-[0.1em] text-[var(--ec-ink)]">
                    {selected.pin}
                  </p>
                  <p className="text-[11.5px] text-[var(--ec-muted)]">보관함 인증번호 4자리</p>
                </div>
                <div className="grid grid-cols-8 gap-[3px] p-2">
                  {Array.from({ length: 64 }, (_, i) => (
                    <span
                      key={i}
                      className={`h-2 w-2 rounded-[1px] ${
                        (i * 7 + selected.pin.charCodeAt(0)) % 5 === 0 ? "bg-[var(--ec-ink)]" : "bg-transparent"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[12px] leading-5 text-[var(--ec-muted)]">
                  보관함 키패드에 위 번호를 입력하면 문이 열려요
                </p>
              </div>
            </HeroCard>

            {product && (
              <div className="mt-4 flex items-center gap-3 rounded-[14px] border border-[var(--ec-border)] bg-[var(--ec-surface)] p-3">
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[10px] bg-[var(--ec-surface-sunken)]">
                  <Image src={picsumId(product.photoId, 100, 100)} alt={product.title} fill sizes="48px" className="object-cover" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-medium text-[var(--ec-ink)]">{product.title}</p>
                  <p className="tabular-nums text-[13px] font-semibold text-[var(--ec-ink)]">{formatWon(product.price)}</p>
                </div>
              </div>
            )}

            <div className="mt-4 space-y-2 rounded-[14px] border border-[var(--ec-border)] bg-[var(--ec-surface)] p-4">
              <div className="flex items-center justify-between text-[12.5px]">
                <span className="text-[var(--ec-muted)]">보관함 크기</span>
                <span className="font-medium text-[var(--ec-ink)]">{selected.size}</span>
              </div>
              <div className="flex items-center justify-between text-[12.5px]">
                <span className="text-[var(--ec-muted)]">보관 시작</span>
                <span className="tabular-nums font-medium text-[var(--ec-ink)]">{selected.storedAt}</span>
              </div>
              <div className="flex items-center justify-between text-[12.5px]">
                <span className="text-[var(--ec-muted)]">보관 만료</span>
                <span className="tabular-nums font-medium text-[var(--ec-ink)]">{selected.expiresAt}</span>
              </div>
            </div>

            <div className="mt-5">
              {selected.status === "픽업대기" ? (
                <Button full size="lg" onClick={() => completePickup(selected.id)}>
                  픽업 완료 처리
                </Button>
              ) : (
                <div className="flex items-center justify-center gap-2 rounded-[14px] border border-[var(--ec-border)] py-3.5 text-[13.5px] font-medium text-[var(--ec-muted)]">
                  <CheckCircle size={16} weight="fill" className="text-[var(--ec-accent)]" />
                  처리 완료된 보관함이에요
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <header className="px-5 pb-3 pt-[59px]">
            <h1 className="text-[21px] font-bold tracking-[-0.01em] text-[var(--ec-ink)]">무인택배함</h1>
            <p className="mt-1 text-[13px] text-[var(--ec-body)]">비대면으로 안전하게 픽업하세요</p>
          </header>
          <div className="flex-1 overflow-y-auto ec-scroll px-5 pb-[92px]">
            {lockers.length === 0 ? (
              <EmptyState title="이용 중인 보관함이 없어요" body="거래가 성사되면 무인택배함을 배정받을 수 있어요" />
            ) : (
              <div className="space-y-2.5">
                {lockers.map((l) => {
                  const p = PRODUCTS.find((pd) => pd.id === l.productId);
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setSelectedId(l.id)}
                      className="flex w-full items-center gap-3 rounded-[16px] border border-[var(--ec-border)] bg-[var(--ec-surface)] p-3.5 text-left"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[var(--ec-accent-soft)] text-[var(--ec-accent-ink)]">
                        <Package size={19} weight="fill" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-[13.5px] font-semibold text-[var(--ec-ink)]">{l.label}</p>
                          <Badge tone={statusTone(l.status)}>{l.status}</Badge>
                        </div>
                        <p className="mt-1 truncate text-[12px] text-[var(--ec-muted)]">{p?.title}</p>
                        <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-[var(--ec-muted)]">
                          <Clock size={11} />
                          {l.expiresAt}까지
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      <BottomNav active="locker" onNavigate={onNavigate} />
    </div>
  );
}
