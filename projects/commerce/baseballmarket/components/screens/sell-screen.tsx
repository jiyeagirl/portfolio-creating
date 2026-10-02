"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, CaretLeft, ImageSquare, Plus, X } from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  MonoIndex,
  Chip,
  Eyebrow,
  Field,
  Input,
  SectionTitle,
  Select,
  Textarea,
} from "@/projects/commerce/baseballmarket/components/ui";
import { Toggle } from "@/components/shared/toggle";
import {
  CATEGORY_TONE,
  KRW,
  PRICE_RULES,
  TEAMS,
  photo,
} from "@/projects/commerce/baseballmarket/lib/mock-data";
import type { Category } from "@/projects/commerce/baseballmarket/lib/types";

/* 판매 등록. 카테고리에 따라 야구 특화 입력이 갈린다 —
   유니폼은 구단/시즌/선수/등번호/사이즈/실측, 티켓은 경기/좌석/정가다. */

const PHOTO_SLOTS = [535, 338, 669];

export function SellScreen({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const [cat, setCat] = useState<Category>("유니폼");
  const [teamId, setTeamId] = useState(TEAMS[2].id);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [face, setFace] = useState("");
  const [condition, setCondition] = useState("최상");
  const [season, setSeason] = useState("2024");
  const [kind, setKind] = useState("홈");
  const [player, setPlayer] = useState("");
  const [backNumber, setBackNumber] = useState("");
  const [size, setSize] = useState("105");
  const [chest, setChest] = useState("");
  const [length, setLength] = useState("");
  const [shoulder, setShoulder] = useState("");
  const [zone, setZone] = useState(PRICE_RULES[0].zone);
  const [stadium, setStadium] = useState(PRICE_RULES[0].stadium);
  const [transfer, setTransfer] = useState("모바일 양도");
  const [desc, setDesc] = useState("");
  const [negotiable, setNegotiable] = useState(true);
  const [methods, setMethods] = useState<Set<string>>(new Set(["안전거래"]));

  const rule = PRICE_RULES.find((r) => r.stadium === stadium && r.zone === zone) ?? PRICE_RULES[0];
  const asking = Number(price.replace(/[^0-9]/g, "")) || 0;
  const over = cat === "티켓" && asking > 0 && asking > rule.weekend * 1.1;

  function toggleMethod(m: string) {
    setMethods((prev) => {
      const next = new Set(prev);
      if (next.has(m)) next.delete(m);
      else next.add(m);
      return next;
    });
  }

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-8 lg:px-8 lg:py-12">
      <button
        type="button"
        onClick={onBack}
        className="bm-press mb-6 inline-flex items-center gap-1.5 rounded-[6px] py-1.5 pr-3 text-[14px] font-semibold text-[var(--bm-muted)]"
      >
        <CaretLeft size={15} weight="bold" />
        돌아가기
      </button>

      <Eyebrow>판매 등록</Eyebrow>
      <h1 className="mt-3 text-[32px] font-medium leading-[38px] tracking-[-0.03em] text-[var(--bm-ink)]">
        어떤 것을 파시나요
      </h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="bm-rise space-y-9 lg:col-span-7">
          {/* 1. 카테고리 */}
          <section>
            <StepHead n={1} title="카테고리" />
            <div className="grid grid-cols-3 gap-2.5">
              {(["유니폼", "굿즈", "티켓"] as Category[]).map((c) => {
                const on = cat === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCat(c)}
                    aria-pressed={on}
                    className={`bm-swap rounded-[8px] border px-4 py-4 text-left ${
                      on
                        ? "border-[var(--bm-ink)] bg-[var(--bm-canvas)] bm-card"
                        : "border-[var(--bm-hairline)] bg-[var(--bm-canvas)]"
                    }`}
                  >
                    <MonoIndex n={CATEGORY_TONE[c]} />
                    <span className="mt-2 block text-[16px] font-medium leading-[24px] tracking-[-0.02em] text-[var(--bm-ink)]">
                      {c}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 2. 사진 */}
          <section>
            <StepHead n={2} title="사진" hint="첫 번째 사진이 대표 이미지입니다. 끌어서 순서를 바꿀 수 있습니다." />
            <div className="grid grid-cols-4 gap-2.5">
              {PHOTO_SLOTS.map((id, i) => (
                <div key={id} className="relative">
                  <span className="relative block aspect-square overflow-hidden rounded-[8px] bg-[var(--bm-surface-strong)]">
                    <Image
                      src={photo(id, 240, 240)}
                      alt={`등록 사진 ${i + 1}`}
                      fill
                      sizes="140px"
                      className="object-cover"
                      unoptimized
                    />
                  </span>
                  {i === 0 && (
                    <span className="absolute left-2 top-2">
                      <Badge tone="ink">대표</Badge>
                    </span>
                  )}
                  <button
                    type="button"
                    aria-label={`사진 ${i + 1} 삭제`}
                    className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--bm-canvas)] text-[var(--bm-body)]"
                  >
                    <X size={12} weight="bold" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="bm-press flex aspect-square flex-col items-center justify-center gap-1.5 rounded-[8px] border border-dashed border-[var(--bm-hairline-strong)] text-[var(--bm-muted)]"
              >
                <ImageSquare size={20} />
                <span className="bm-num text-[12px] font-medium">3 / 10</span>
              </button>
            </div>
          </section>

          {/* 3. 기본 정보 */}
          <section className="space-y-4">
            <StepHead n={3} title="기본 정보" />
            <Field label="제목" required>
              <Input
                value={title}
                onChange={setTitle}
                placeholder={
                  cat === "티켓" ? "9/14 코메츠 vs 그라이더스 1루 응원석" : "2024 코메츠 홈 유니폼 27번"
                }
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="구단" required>
                <Select
                  value={teamId}
                  onChange={(v) => setTeamId(v as typeof teamId)}
                  options={TEAMS.map((t) => t.id)}
                />
              </Field>
              <Field label="상태 등급" required>
                <Select
                  value={condition}
                  onChange={setCondition}
                  options={["미착용", "최상", "상", "중"]}
                />
              </Field>
            </div>
          </section>

          {/* 4. 야구 특화 항목 */}
          {cat === "유니폼" && (
            <section className="space-y-4">
              <StepHead n={4} title="유니폼 항목" hint="실측 세 값은 반품 분쟁을 줄이기 위해 필수입니다." />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="시즌" required>
                  <Select value={season} onChange={setSeason} options={["2026", "2025", "2024", "2023", "복각 / 올드"]} />
                </Field>
                <Field label="종류" required>
                  <Select value={kind} onChange={setKind} options={["홈", "원정", "서드", "올드"]} />
                </Field>
                <Field label="선수">
                  <Input value={player} onChange={setPlayer} placeholder="미마킹이면 비워두세요" />
                </Field>
                <Field label="등번호">
                  <Input value={backNumber} onChange={setBackNumber} placeholder="27" />
                </Field>
              </div>
              <Field label="표기 사이즈" required>
                <div className="flex flex-wrap gap-2">
                  {["95", "100", "105", "110", "115"].map((s) => (
                    <Chip key={s} label={s} active={size === s} onClick={() => setSize(s)} />
                  ))}
                </div>
              </Field>
              <Field label="실측 (cm)" required hint="평평하게 놓고 잰 값을 적어주세요.">
                <div className="grid grid-cols-3 gap-2.5">
                  <Input value={chest} onChange={setChest} placeholder="가슴" suffix="cm" />
                  <Input value={length} onChange={setLength} placeholder="총장" suffix="cm" />
                  <Input value={shoulder} onChange={setShoulder} placeholder="어깨" suffix="cm" />
                </div>
              </Field>
            </section>
          )}

          {cat === "티켓" && (
            <section className="space-y-4">
              <StepHead n={4} title="티켓 항목" hint="좌석 정가는 정가 기준표에서 자동으로 채워집니다." />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="구장" required>
                  <Select
                    value={stadium}
                    onChange={setStadium}
                    options={Array.from(new Set(PRICE_RULES.map((r) => r.stadium)))}
                  />
                </Field>
                <Field label="좌석 구역" required>
                  <Select
                    value={zone}
                    onChange={setZone}
                    options={PRICE_RULES.filter((r) => r.stadium === stadium).map((r) => r.zone)}
                  />
                </Field>
                <Field label="경기 일시" required>
                  <Input value="" placeholder="2026-09-14 18:30" />
                </Field>
                <Field label="양도 방식" required>
                  <Select
                    value={transfer}
                    onChange={setTransfer}
                    options={["모바일 양도", "현장 수령", "실물 배송"]}
                  />
                </Field>
              </div>

              <Card tone="soft">
                <p className="text-[13px] font-semibold leading-[18px] text-[var(--bm-body-strong)]">
                  이 좌석의 정가 기준
                </p>
                <div className="bm-num mt-3 flex items-baseline gap-5">
                  <span>
                    <span className="text-[12px] text-[var(--bm-muted)]">평일 </span>
                    <span className="text-[18px] font-semibold text-[var(--bm-ink)]">
                      {KRW(rule.weekday)}
                    </span>
                  </span>
                  <span>
                    <span className="text-[12px] text-[var(--bm-muted)]">주말 </span>
                    <span className="text-[18px] font-semibold text-[var(--bm-ink)]">
                      {KRW(rule.weekend)}
                    </span>
                  </span>
                </div>
                <p className="mt-2 text-[12px] leading-[18px] text-[var(--bm-muted)]">
                  기준표 {rule.version} | 갱신 {rule.updatedAt.replace(/-/g, ".")}
                </p>
              </Card>
            </section>
          )}

          {/* 5. 가격 */}
          <section className="space-y-4">
            <StepHead n={5} title="가격 및 거래 방식" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="판매가" required>
                <Input value={price} onChange={setPrice} placeholder="78000" suffix="원" />
              </Field>
              <Field label={cat === "티켓" ? "좌석 정가" : "구매가 (선택)"}>
                <Input
                  value={cat === "티켓" ? String(rule.weekend) : face}
                  onChange={setFace}
                  placeholder="129000"
                  suffix="원"
                />
              </Field>
            </div>

            {over && (
              <div className="flex items-start gap-2.5 rounded-[8px] bg-[var(--bm-error-soft)] p-4">
                <span className="mt-0.5 text-[var(--bm-error-deep)]">
                  <Plus size={16} weight="bold" />
                </span>
                <p className="text-[13px] leading-[20px] text-[var(--bm-error-deep)]">
                  정가 기준 대비 10퍼센트를 넘습니다. 이대로 등록하면 자동 탐지 목록에 오르고
                  운영팀 검토 후 노출이 중단될 수 있습니다.
                </p>
              </div>
            )}

            <Field label="거래 방식" required>
              <div className="flex flex-wrap gap-2">
                {["안전거래", "직거래", "택배"].map((m) => (
                  <Chip
                    key={m}
                    label={m}
                    active={methods.has(m)}
                    onClick={() => toggleMethod(m)}
                  />
                ))}
              </div>
            </Field>

            <div className="flex items-center justify-between gap-3 rounded-[8px] bg-[var(--bm-surface-card)] px-4 py-3.5">
              <div className="min-w-0">
                <p className="text-[14px] font-semibold leading-[20px] text-[var(--bm-ink)]">
                  가격 제안 받기
                </p>
                <p className="mt-0.5 text-[13px] leading-[19px] text-[var(--bm-muted)]">
                  구매자가 채팅에서 금액을 제안할 수 있습니다
                </p>
              </div>
              <Toggle
                checked={negotiable}
                onChange={setNegotiable}
                label="가격 제안 받기"
                onClassName="bg-[var(--bm-ink)]"
                offClassName="bg-[var(--bm-surface-strong)]"
              />
            </div>
          </section>

          {/* 6. 설명 */}
          <section className="space-y-4">
            <StepHead n={6} title="상세 설명" />
            <Textarea
              value={desc}
              onChange={setDesc}
              rows={6}
              placeholder="착용 횟수, 보관 상태, 하자 여부를 적어주세요. 하자를 미리 밝힌 매물은 분쟁 발생률이 낮습니다."
            />
          </section>

          <div className="flex gap-3">
            <Button variant="secondary" size="lg" onClick={onBack}>
              임시저장
            </Button>
            <Button size="lg" onClick={onDone} trailingIcon={<ArrowRight size={14} weight="bold" />}>
              등록하기
            </Button>
          </div>
        </div>

        {/* 미리보기 */}
        <div className="lg:col-span-5">
          <div className="bm-rise lg:sticky lg:top-24" style={{ animationDelay: "70ms" }}>
            <SectionTitle title="미리보기" sub="구매자에게 이렇게 보입니다" />
            <div className="rounded-[16px] bg-[var(--bm-surface)] p-5">
              <span className="relative block aspect-[4/3] w-full overflow-hidden rounded-[12px] bg-[var(--bm-surface-strong)]">
                <Image
                  src={photo(PHOTO_SLOTS[0], 640, 480)}
                  alt="등록할 매물 대표 사진"
                  fill
                  sizes="480px"
                  className="object-cover"
                  unoptimized
                />
              </span>
              <div className="mt-4">
                <Badge tone="neutral">{cat}</Badge>
                <p className="mt-2.5 text-[17px] font-semibold leading-[24px] text-[var(--bm-ink)]">
                  {title || "제목을 입력하면 여기에 보입니다"}
                </p>
                <p className="bm-num mt-2 text-[22px] font-medium leading-[28px] text-[var(--bm-ink)]">
                  {asking > 0 ? KRW(asking) : "가격 미입력"}
                </p>
                <p className="mt-3 text-[14px] leading-[22px] text-[var(--bm-muted)]">
                  {desc || "상세 설명이 비어 있습니다."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepHead({ n, title, hint }: { n: number; title: string; hint?: string }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2.5">
        <span className="bm-num flex h-6 w-6 items-center justify-center rounded-full bg-[var(--bm-ink)] text-[12px] font-semibold text-[var(--bm-on-ink)]">
          {n}
        </span>
        <h2 className="text-[18px] font-semibold leading-[25px] text-[var(--bm-ink)]">{title}</h2>
      </div>
      {hint && <p className="mt-2 text-[13px] leading-[20px] text-[var(--bm-muted)]">{hint}</p>}
    </div>
  );
}
