"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, FloppyDisk, Minus, Plus, X } from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { pexelsPhoto, VENDORS } from "@/projects/community/wedit/lib/mock-data";
import type { NavigateFn } from "@/projects/community/wedit/lib/navigation";
import { PriceText, RatingRow } from "@/projects/community/wedit/components/ui";

const RATING_ROWS: { key: "kindness" | "priceSatisfaction" | "resultSatisfaction" | "afterCare"; label: string }[] = [
  { key: "kindness", label: "친절도" },
  { key: "priceSatisfaction", label: "가격 만족도" },
  { key: "resultSatisfaction", label: "결과물 만족도" },
  { key: "afterCare", label: "사후 대응" },
];

export function CompareScreen({ onNavigate, ids }: { onNavigate: NavigateFn; ids: string[] }) {
  const [selected, setSelected] = useState<string[]>(ids.slice(0, 3));
  const [saved, setSaved] = useState(false);
  const vendors = selected.map((id) => VENDORS.find((v) => v.id === id)).filter((v) => !!v);
  const remaining = VENDORS.filter((v) => !selected.includes(v.id)).slice(0, 6);

  const colWidth = vendors.length > 0 ? `${100 / vendors.length}%` : "100%";

  return (
    <div className="flex min-h-full w-full flex-col bg-[var(--wd-canvas)] pb-10">
      <ScreenHeader
        title="업체 비교"
        subtitle={`${vendors.length}개 업체`}
        onBack={() => onNavigate("explore")}
        className="bg-white border-[var(--wd-border)]"
        titleClassName="text-[15.5px] font-semibold text-[var(--wd-ink)]"
        subtitleClassName="text-[11px] text-[var(--wd-muted)]"
      />

      <div className="flex gap-2 px-5 pt-4">
        {vendors.map((v) => (
          <div key={v.id} className="relative flex-1 overflow-hidden rounded-2xl border border-[var(--wd-border)] bg-white">
            <button
              type="button"
              onClick={() => setSelected((prev) => prev.filter((x) => x !== v.id))}
              aria-label="제거"
              className="absolute right-1.5 top-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-black/45 text-white"
            >
              <X size={11} weight="bold" />
            </button>
            <div className="relative h-16 w-full">
              <Image
                src={pexelsPhoto(v.photoId, 200, 140)}
                alt={v.name}
                fill
                sizes="120px"
                className="object-cover"
                style={v.photoCrop ? { objectPosition: v.photoCrop } : undefined}
              />
            </div>
            <p className="truncate px-2 py-1.5 text-center text-[11.5px] font-semibold text-[var(--wd-ink)]">
              {v.name}
            </p>
          </div>
        ))}
        {vendors.length < 3 && (
          <div className="flex-1 rounded-2xl border border-dashed border-[var(--wd-border)] p-2">
            <p className="mb-1 text-center text-[10.5px] text-[var(--wd-muted)]">추가</p>
            <div className="flex max-h-24 flex-col gap-1 overflow-y-auto">
              {remaining.slice(0, 4).map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelected((prev) => [...prev, v.id])}
                  className="flex items-center gap-1 rounded-lg bg-[var(--wd-surface-tint)] px-1.5 py-1 text-left"
                >
                  <Plus size={10} className="shrink-0 text-[var(--wd-accent)]" />
                  <span className="truncate text-[10px] font-medium text-[var(--wd-body)]">{v.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {vendors.length === 0 ? (
        <p className="px-5 pt-10 text-center text-[13px] text-[var(--wd-muted)]">
          비교할 업체를 추가해주세요.
        </p>
      ) : (
        <div className="mt-6 flex flex-col gap-6 px-5">
          <CompareSection title="평균 평점">
            <Row label="평균 평점">
              {vendors.map((v) => (
                <Cell key={v.id} width={colWidth}>
                  <RatingRow value={v.ratingAvg} />
                </Cell>
              ))}
            </Row>
            <Row label="후기 개수">
              {vendors.map((v) => (
                <Cell key={v.id} width={colWidth}>
                  <span className="text-[12.5px] font-semibold tabular-nums text-[var(--wd-ink)]">
                    {v.reviewCount}개
                  </span>
                </Cell>
              ))}
            </Row>
          </CompareSection>

          <CompareSection title="항목별 평점">
            {RATING_ROWS.map((r) => (
              <Row key={r.key} label={r.label}>
                {vendors.map((v) => (
                  <Cell key={v.id} width={colWidth}>
                    <span className="text-[12.5px] font-semibold tabular-nums text-[var(--wd-body)]">
                      {v.ratingBreakdown[r.key].toFixed(1)}
                    </span>
                  </Cell>
                ))}
              </Row>
            ))}
          </CompareSection>

          <CompareSection title="실결제가">
            <Row label="평균 실결제가">
              {vendors.map((v) => (
                <Cell key={v.id} width={colWidth}>
                  <span className="text-[13px] font-bold tabular-nums text-[var(--wd-accent-strong)]">
                    <PriceText value={v.avgPaidPrice} />
                  </span>
                </Cell>
              ))}
            </Row>
          </CompareSection>

          <CompareSection title="패키지 구성">
            {Array.from(new Set(vendors.flatMap((v) => v.packageItems.map((p) => p.label)))).map((label) => (
              <Row key={label} label={label}>
                {vendors.map((v) => {
                  const item = v.packageItems.find((p) => p.label === label);
                  return (
                    <Cell key={v.id} width={colWidth}>
                      {item?.included ? (
                        <Check size={15} weight="bold" className="text-[var(--wd-accent)]" />
                      ) : (
                        <Minus size={13} className="text-[var(--wd-muted)]" />
                      )}
                    </Cell>
                  );
                })}
              </Row>
            ))}
          </CompareSection>

          <CompareSection title="옵션 가격">
            {vendors.map((v) => (
              <div key={v.id} className="flex flex-col gap-1.5 py-3">
                <p className="text-[12px] font-semibold text-[var(--wd-ink)]">{v.name}</p>
                {v.optionItems.map((o) => (
                  <div key={o.label} className="flex items-center justify-between">
                    <span className="text-[11.5px] text-[var(--wd-muted)]">{o.label}</span>
                    <span className="text-[11.5px] font-semibold tabular-nums text-[var(--wd-body)]">
                      +<PriceText value={o.price} />
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </CompareSection>

          <button
            type="button"
            onClick={() => setSaved(true)}
            disabled={saved}
            className="mt-2 flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-[var(--wd-accent)] text-[15px] font-semibold text-white transition-all active:scale-[0.97] disabled:bg-[var(--wd-accent-soft)] disabled:text-[var(--wd-accent-strong)]"
          >
            <FloppyDisk size={17} weight={saved ? "fill" : "regular"} />
            {saved ? "비교함에 저장됨" : "비교함에 저장"}
          </button>
        </div>
      )}
    </div>
  );
}

function CompareSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[13px] font-semibold text-[var(--wd-ink)]">{title}</p>
      <div className="flex flex-col divide-y divide-[var(--wd-border)] rounded-2xl border border-[var(--wd-border)] bg-white px-3">
        {children}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 py-2.5">
      <span className="w-[76px] shrink-0 text-[11.5px] leading-[15px] text-[var(--wd-muted)]">{label}</span>
      <div className="flex flex-1 items-center">{children}</div>
    </div>
  );
}

function Cell({ width, children }: { width: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center" style={{ width }}>
      {children}
    </div>
  );
}
