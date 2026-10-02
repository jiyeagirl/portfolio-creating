"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, SealCheck } from "@phosphor-icons/react";
import { AppBar, PrimaryButton, ProductTile, SectionHead, inputClass } from "@/projects/commerce/pawfit/components/ui";
import { ORDERS, PETS, PRODUCT_BY_ID } from "@/projects/commerce/pawfit/lib/mock-data";
import type { AccuracyFeedback, FitFeedback } from "@/projects/commerce/pawfit/lib/types";
import type { NavigateFn } from "@/projects/commerce/pawfit/lib/navigation";

const FIT_OPTIONS: FitFeedback[] = ["작아요", "딱 맞아요", "커요"];
const ACCURACY_OPTIONS: AccuracyFeedback[] = ["정확해요", "약간 달라요", "부정확해요"];

type FeedbackItemOption = {
  key: string;
  orderId: string;
  productId: string;
  productName: string;
  color: string;
  size: string;
};

function buildItemOptions(): FeedbackItemOption[] {
  return ORDERS.flatMap((order) =>
    order.items.map((item, index) => ({
      key: `${order.id}-${index}`,
      orderId: order.id,
      productId: item.productId,
      productName: item.productName,
      color: item.color,
      size: item.size,
    })),
  );
}

function PillGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: T[];
  value: T | null;
  onChange: (option: T) => void;
}) {
  return (
    <div className="flex gap-2">
      {options.map((option) => {
        const active = value === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={active}
            className={`flex-1 rounded-full border px-3 py-2.5 text-[13.5px] font-semibold transition-colors active:scale-[0.97] ${
              active
                ? "border-[var(--pf-ink)] bg-[var(--pf-ink)] text-white"
                : "border-[var(--pf-hairline)] bg-[var(--pf-canvas)] text-[var(--pf-muted)]"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export function SizeFeedbackScreen({
  orderId,
  onNavigate,
}: {
  orderId?: string;
  onNavigate: NavigateFn;
}) {
  const itemOptions = buildItemOptions();

  const [selectedKey, setSelectedKey] = useState<string | null>(() => {
    if (!orderId) return null;
    return itemOptions.find((item) => item.orderId === orderId)?.key ?? null;
  });
  const [fit, setFit] = useState<FitFeedback | null>(null);
  const [reviewBody, setReviewBody] = useState("");
  const [photoSelected, setPhotoSelected] = useState(false);
  const [accuracy, setAccuracy] = useState<AccuracyFeedback | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const selectedItem = itemOptions.find((item) => item.key === selectedKey) ?? null;
  const previewPet = PETS[0];
  const canSubmit = Boolean(fit && accuracy && reviewBody.trim().length > 0);

  function handleSubmit() {
    if (!canSubmit) return;
    setSubmitted(true);
  }

  function handleReturnToMypage() {
    onNavigate("mypage");
  }

  return (
    <div className="pawfit flex h-full flex-col bg-[var(--pf-canvas)]">
      <AppBar title="사이즈 피드백" onBack={() => onNavigate("orderHistory")} />

      <div className="flex-1 overflow-y-auto pb-10">
        {submitted ? (
          <div className="flex flex-col items-center gap-4 px-6 pt-16 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--pf-surface-strong)]">
              <SealCheck size={30} weight="fill" className="text-[var(--pf-ink)]" />
            </span>
            <div>
              <p className="text-[18px] font-medium tracking-[-0.02em] text-[var(--pf-ink)]">
                소중한 후기 감사합니다
              </p>
              <p className="mx-auto mt-2 max-w-[280px] text-[13.5px] leading-relaxed text-[var(--pf-muted)]">
                남겨주신 실제 착용 사이즈와 정확도 평가는 지금의 규칙 기반 추천을 다듬고, 앞으로 더 정교한 맞춤
                추천으로 발전시켜 나가는 데 쓰일 예정이에요.
              </p>
            </div>
            <div className="mt-4 w-full max-w-[280px]">
              <PrimaryButton onClick={handleReturnToMypage}>마이페이지로</PrimaryButton>
            </div>
          </div>
        ) : !selectedItem ? (
          <div className="px-5 pt-5">
            <SectionHead title="구매 상품 선택" note="피드백을 남길 상품을 골라주세요" />
            <div className="flex flex-col gap-2">
              {itemOptions.map((item) => {
                const product = PRODUCT_BY_ID[item.productId];
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSelectedKey(item.key)}
                    className="flex items-center gap-3 rounded-[16px] border border-[var(--pf-hairline)] bg-[var(--pf-surface-soft)] p-3 text-left transition-transform active:scale-[0.99]"
                  >
                    {product && (
                      <ProductTile
                        category={product.category}
                        tint={product.brandTint}
                        image={product.image}
                        alt={product.name}
                        size={44}
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-semibold text-[var(--pf-ink)]">{item.productName}</p>
                      <p className="mt-0.5 text-[12.5px] text-[var(--pf-muted)]">
                        {item.color} | {item.size}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="px-5 pt-5">
            <SectionHead title="구매 상품 선택" />
            <div className="flex items-center gap-3 rounded-[16px] border border-[var(--pf-hairline)] bg-[var(--pf-surface-soft)] p-3">
              {PRODUCT_BY_ID[selectedItem.productId] && (
                <ProductTile
                  category={PRODUCT_BY_ID[selectedItem.productId].category}
                  tint={PRODUCT_BY_ID[selectedItem.productId].brandTint}
                  image={PRODUCT_BY_ID[selectedItem.productId].image}
                  alt={PRODUCT_BY_ID[selectedItem.productId].name}
                  size={48}
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14.5px] font-semibold text-[var(--pf-ink)]">
                  {selectedItem.productName}
                </p>
                <p className="mt-0.5 text-[12.5px] text-[var(--pf-muted)]">
                  {selectedItem.color} | {selectedItem.size}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedKey(null);
                  setFit(null);
                  setReviewBody("");
                  setPhotoSelected(false);
                  setAccuracy(null);
                }}
                className="shrink-0 text-[12.5px] font-semibold text-[var(--pf-muted)] underline underline-offset-2"
              >
                변경
              </button>
            </div>

            <div className="mt-5">
              <SectionHead title="실제 구매 사이즈" />
              <div className="flex items-center justify-between rounded-[16px] border border-[var(--pf-hairline)] bg-[var(--pf-surface-card)] px-4 py-3">
                <span className="text-[13px] text-[var(--pf-muted)]">주문하신 사이즈</span>
                <span className="pf-num text-[16px] font-semibold text-[var(--pf-ink)]">{selectedItem.size}</span>
              </div>
            </div>

            <div className="mt-5">
              <SectionHead title="착용 만족도" note="실제로 입혀보니 어땠나요" />
              <PillGroup options={FIT_OPTIONS} value={fit} onChange={setFit} />
            </div>

            <div className="mt-5">
              <SectionHead title="후기 작성" />
              <textarea
                rows={4}
                className={`${inputClass} resize-none`}
                value={reviewBody}
                onChange={(e) => setReviewBody(e.target.value)}
                placeholder="착용해보니 어떠셨나요? 사이즈, 핏, 소재 등 자유롭게 남겨주세요"
              />
            </div>

            <div className="mt-5">
              <SectionHead title="착용 사진 등록" note="선택 사항이에요" />
              {!photoSelected ? (
                <button
                  type="button"
                  onClick={() => setPhotoSelected(true)}
                  className="flex h-32 w-32 flex-col items-center justify-center gap-2 rounded-[16px] border border-dashed border-[var(--pf-hairline)] bg-[var(--pf-surface-soft)] text-[var(--pf-muted)] transition-transform active:scale-[0.97]"
                >
                  <Camera size={22} weight="bold" />
                  <span className="text-[12px] font-semibold">사진 추가</span>
                </button>
              ) : (
                <div className="flex flex-col items-start gap-2">
                  <Image
                    src={previewPet.photo}
                    alt="내가 등록한 사진 미리보기"
                    width={128}
                    height={128}
                    placeholder="blur"
                    className="h-32 w-32 rounded-[16px] object-cover"
                  />
                  <p className="text-[11.5px] text-[var(--pf-muted)]">
                    선택한 사진 (내가 등록한 사진 미리보기, 실제 업로드 아님)
                  </p>
                  <button
                    type="button"
                    onClick={() => setPhotoSelected(false)}
                    className="text-[12.5px] font-semibold text-[var(--pf-muted)] underline underline-offset-2"
                  >
                    다시 선택
                  </button>
                </div>
              )}
            </div>

            <div className="mt-5">
              <SectionHead title="추천 정확도 피드백" note="사이즈 추천이 실제와 얼마나 맞았나요" />
              <PillGroup options={ACCURACY_OPTIONS} value={accuracy} onChange={setAccuracy} />
            </div>
          </div>
        )}
      </div>

      {!submitted && selectedItem && (
        <div className="border-t border-[var(--pf-hairline)] bg-[var(--pf-canvas)] px-5 py-4">
          <PrimaryButton onClick={handleSubmit} disabled={!canSubmit}>
            제출하기
          </PrimaryButton>
        </div>
      )}
    </div>
  );
}
