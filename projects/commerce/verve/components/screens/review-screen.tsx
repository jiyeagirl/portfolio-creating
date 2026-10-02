"use client";

import { useMemo, useState } from "react";
import { Camera, Flag, ThumbsUp } from "@phosphor-icons/react";
import type { NavigateFn } from "@/projects/commerce/verve/lib/navigation";
import { findProduct, reviews as allReviews, reviewsFor } from "@/projects/commerce/verve/lib/mock-data";
import type { Review, SizeLabel } from "@/projects/commerce/verve/lib/types";
import { Button, Checkbox, RatingStars, SectionHeading, Select, TextArea } from "@/projects/commerce/verve/components/ui";

const SORTS = [
  { id: "latest", label: "최신순" },
  { id: "rating", label: "평점 높은순" },
  { id: "helpful", label: "도움순" },
] as const;

const FIT_OPTIONS: Review["fitSatisfaction"][] = ["작아요", "딱맞아요", "커요"];
const SIZE_OPTIONS: SizeLabel[] = ["XS", "S", "M", "L", "XL"];

export function ReviewScreen({ productId, onNavigate }: { productId?: string; onNavigate: NavigateFn }) {
  const product = productId ? findProduct(productId) : undefined;
  const baseReviews = productId ? reviewsFor(productId) : allReviews;

  const [extraReviews, setExtraReviews] = useState<Review[]>([]);
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("latest");
  const [helpfulIds, setHelpfulIds] = useState<Set<string>>(new Set());
  const [reportedIds, setReportedIds] = useState<Set<string>>(new Set());

  const [rating, setRating] = useState(5);
  const [fit, setFit] = useState<Review["fitSatisfaction"]>("딱맞아요");
  const [purchasedSize, setPurchasedSize] = useState<SizeLabel>("M");
  const [disclosed, setDisclosed] = useState(false);
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [body, setBody] = useState("");
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const list = useMemo(() => {
    const combined = [...extraReviews, ...baseReviews];
    if (sort === "rating") return [...combined].sort((a, b) => b.rating - a.rating);
    if (sort === "helpful") return [...combined].sort((a, b) => (b.helpfulCount + (helpfulIds.has(b.id) ? 1 : 0)) - (a.helpfulCount + (helpfulIds.has(a.id) ? 1 : 0)));
    return combined;
  }, [baseReviews, extraReviews, sort, helpfulIds]);

  const average = list.length ? list.reduce((sum, r) => sum + r.rating, 0) / list.length : 0;
  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: list.filter((r) => Math.round(r.rating) === star).length,
  }));

  const toggleHelpful = (id: string) => {
    setHelpfulIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleReport = (id: string) => {
    setReportedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = () => {
    if (!body.trim()) return;
    const review: Review = {
      id: `rv-new-${Date.now()}`,
      productId: productId ?? "p-run-01",
      author: "나",
      verified: true,
      rating,
      fitSatisfaction: fit,
      sizeSatisfaction: 90,
      purchasedSize,
      heightCm: disclosed && heightCm ? Number(heightCm) : undefined,
      weightKg: disclosed && weightKg ? Number(weightKg) : undefined,
      disclosed,
      body,
      photo: photoName ? product?.gallery[0] : undefined,
      date: "방금 전",
      helpfulCount: 0,
    };
    setExtraReviews((prev) => [review, ...prev]);
    setBody("");
    setPhotoName(null);
    setSubmitted(true);
    window.setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div className="verve-light min-h-full">
      <div className="mx-auto max-w-[900px] px-4 py-12 md:px-8 md:py-16">
        {product && (
          <button type="button" onClick={() => onNavigate("productDetail", product.id)} className="mb-6 flex items-center gap-3 text-left">
            <img src={product.gallery[0]} alt={product.name} className="h-14 w-12 object-cover" />
            <div>
              <p className="text-[12px] text-[var(--v-muted)]">상품으로 돌아가기</p>
              <p className="text-[14px] font-medium text-[var(--v-body-on-light)]">{product.name}</p>
            </div>
          </button>
        )}

        <SectionHeading title="리뷰" tone="light" body={`${list.length}개의 리뷰`} />

        <div className="mt-8 flex flex-col gap-8 border border-[var(--v-hairline-on-light)] p-6 md:flex-row md:items-center">
          <div className="text-center md:w-40 md:shrink-0">
            <p className="v-number text-[44px] font-medium text-[var(--v-body-on-light)]">{average.toFixed(1)}</p>
            <RatingStars rating={average} tone="light" showValue={false} />
          </div>
          <div className="flex-1 space-y-1.5">
            {breakdown.map((b) => (
              <div key={b.star} className="flex items-center gap-3 text-[12px] text-[var(--v-muted)]">
                <span className="w-8">{b.star}점</span>
                <div className="h-1.5 flex-1 bg-[var(--v-surface-strong-light)]">
                  <div className="h-full bg-[var(--v-primary)]" style={{ width: `${list.length ? (b.count / list.length) * 100 : 0}%` }} />
                </div>
                <span className="w-6 text-right">{b.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 리뷰 작성 */}
        <div className="mt-10 border border-[var(--v-hairline-on-light)] p-6">
          <p className="text-[14px] font-medium text-[var(--v-body-on-light)]">리뷰 작성</p>
          <div className="mt-4 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button key={i} type="button" onClick={() => setRating(i + 1)} aria-label={`${i + 1}점`}>
                <span className={`text-[22px] ${i < rating ? "text-[var(--v-primary)]" : "text-[var(--v-hairline-on-light)]"}`}>★</span>
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.65px] text-[var(--v-body-on-light)]">핏 만족도</p>
              <div className="flex gap-2">
                {FIT_OPTIONS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFit(f)}
                    className={`flex-1 border py-2 text-[12px] ${fit === f ? "border-[var(--v-body-on-light)] bg-[var(--v-body-on-light)] text-white" : "border-[var(--v-hairline-on-light)] text-[var(--v-body-on-light)]"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-[12px] font-medium uppercase tracking-[0.65px] text-[var(--v-body-on-light)]">구매 사이즈</p>
              <Select tone="light" value={purchasedSize} onChange={(e) => setPurchasedSize(e.target.value as SizeLabel)}>
                {SIZE_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <Checkbox tone="light" checked={disclosed} onChange={setDisclosed} label="키/몸무게 공개하고 다른 사용자의 사이즈 선택을 도와주기" />
            {disclosed && (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="키 (cm)"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  className="h-11 border border-[var(--v-hairline-on-light)] bg-white px-3 text-[13px] text-[var(--v-body-on-light)]"
                />
                <input
                  type="number"
                  placeholder="몸무게 (kg)"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="h-11 border border-[var(--v-hairline-on-light)] bg-white px-3 text-[13px] text-[var(--v-body-on-light)]"
                />
              </div>
            )}
          </div>

          <div className="mt-4">
            <TextArea tone="light" placeholder="착용감, 사이즈, 소재감을 자유롭게 남겨주세요" value={body} onChange={(e) => setBody(e.target.value)} />
          </div>

          <label className="mt-3 flex w-fit cursor-pointer items-center gap-2 text-[12px] text-[var(--v-muted)]">
            <Camera size={16} />
            {photoName ?? "착용 사진 첨부"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setPhotoName(e.target.files?.[0]?.name ?? null)} />
          </label>

          <Button tone="light" className="mt-5" onClick={handleSubmit}>
            {submitted ? "등록됨" : "리뷰 등록"}
          </Button>
        </div>

        {/* 정렬 */}
        <div className="mt-10 flex items-center justify-end gap-1 text-[12px]">
          {SORTS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSort(s.id)}
              className={`px-2 py-1 ${sort === s.id ? "font-semibold text-[var(--v-body-on-light)]" : "text-[var(--v-muted)]"}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="mt-4 divide-y divide-[var(--v-hairline-on-light)]">
          {list.map((r) => (
            <div key={r.id} className="py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RatingStars rating={r.rating} tone="light" showValue={false} />
                  <span className="text-[12px] font-medium text-[var(--v-body-on-light)]">{r.author}</span>
                  {r.verified && <span className="text-[11px] text-[var(--v-primary)]">구매 인증</span>}
                </div>
                <span className="text-[11px] text-[var(--v-muted)]">{r.date}</span>
              </div>

              <div className="mt-2 flex flex-wrap gap-2">
                <span className="bg-[var(--v-surface-strong-light)] px-2 py-1 text-[11px] text-[var(--v-muted)]">{r.purchasedSize} 구매 / {r.fitSatisfaction}</span>
                {r.disclosed && r.heightCm && r.weightKg && (
                  <span className="bg-[var(--v-surface-strong-light)] px-2 py-1 text-[11px] text-[var(--v-muted)]">
                    {r.heightCm}cm / {r.weightKg}kg
                  </span>
                )}
              </div>

              <p className="mt-3 text-[13px] leading-relaxed text-[var(--v-body-on-light)]">{r.body}</p>
              {r.photo && <img src={r.photo} alt="착용 사진" className="mt-3 h-40 w-32 object-cover" />}

              <div className="mt-3 flex items-center gap-4">
                <button type="button" onClick={() => toggleHelpful(r.id)} className="flex items-center gap-1.5 text-[11px] text-[var(--v-muted)] hover:text-[var(--v-body-on-light)]">
                  <ThumbsUp size={13} weight={helpfulIds.has(r.id) ? "fill" : "regular"} />
                  도움돼요 {r.helpfulCount + (helpfulIds.has(r.id) ? 1 : 0)}
                </button>
                <button type="button" onClick={() => toggleReport(r.id)} className="flex items-center gap-1.5 text-[11px] text-[var(--v-muted)] hover:text-[var(--v-primary)]">
                  <Flag size={13} weight={reportedIds.has(r.id) ? "fill" : "regular"} />
                  {reportedIds.has(r.id) ? "신고 접수됨" : "신고"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
