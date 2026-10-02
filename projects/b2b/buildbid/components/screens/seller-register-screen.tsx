"use client";

import { useMemo, useState } from "react";
import { Camera, CheckCircle, Sparkle } from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  CardHead,
  CATEGORY_ICON,
  DefList,
  Field,
  Input,
  Meter,
  PageHead,
  Select,
} from "@/projects/b2b/buildbid/components/ui";
import { CATEGORY_LABEL, manwon, type Navigate } from "@/projects/b2b/buildbid/lib/navigation";
import type { EquipmentCategory, Grade } from "@/projects/b2b/buildbid/lib/types";

const CATEGORIES: EquipmentCategory[] = ["excavator", "crane", "loader", "dumpTruck", "forklift", "roller"];
const GRADES: Grade[] = ["A", "B", "C", "D"];
const GRADE_MULTIPLIER: Record<Grade, number> = { A: 1.0, B: 0.88, C: 0.72, D: 0.55 };
const THIS_YEAR = 2024;

export function RegisterScreen({ onNavigate }: { onNavigate: Navigate }) {
  const [category, setCategory] = useState<EquipmentCategory>("excavator");
  const [name, setName] = useState("0.7m³급 굴착기");
  const [maker, setMaker] = useState("");
  const [model, setModel] = useState("");
  const [manufacturedYear, setManufacturedYear] = useState("2020");
  const [usedHours, setUsedHours] = useState("6500");
  const [grade, setGrade] = useState<Grade>("B");
  const [listPrice, setListPrice] = useState("140000000");
  const [region, setRegion] = useState("");
  const [spec, setSpec] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const estimate = useMemo(() => {
    const age = Math.max(0, THIS_YEAR - (Number(manufacturedYear) || THIS_YEAR));
    const hours = Math.max(0, Number(usedHours) || 0);
    const list = Math.max(0, Number(listPrice) || 0);

    const ageFactor = Math.max(0.3, 1 - age * 0.068);
    const hoursFactor = Math.max(0.35, 1 - (hours / 60000) * 0.32);
    const gradeFactor = GRADE_MULTIPLIER[grade];

    const raw = list * ageFactor * hoursFactor * gradeFactor;
    const price = Math.round(raw / 100_000) * 100_000;
    const confidence = Math.round(
      Math.min(94, Math.max(52, 90 - age * 2.2 - (hours / 60000) * 18 + (grade === "A" ? 4 : grade === "D" ? -8 : 0))),
    );
    return { price, confidence, ageFactor, hoursFactor, gradeFactor };
  }, [manufacturedYear, usedHours, grade, listPrice]);

  if (submitted) {
    return (
      <div className="mx-auto max-w-[560px] py-16 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--bb-info-soft)] text-[var(--bb-info-deep)]">
          <CheckCircle size={28} weight="fill" />
        </span>
        <h1 className="mt-5 text-[22px] font-semibold tracking-[-0.02em] text-[var(--bb-ink)]">등록 요청이 접수되었습니다</h1>
        <p className="mt-2 text-[14px] leading-6 text-[var(--bb-body)]">
          관리자 승인 후 1차 입찰이 시작됩니다. 승인 결과는 알림으로 안내됩니다.
        </p>
        <div className="mx-auto mt-8 max-w-[420px] rounded-[18px] border border-[var(--bb-hairline)] bg-[var(--bb-canvas-parchment)] p-5 text-left">
          <DefList
            items={[
              { label: "장비명", value: name || "-" },
              { label: "카테고리", value: CATEGORY_LABEL[category] },
              { label: "AI 예상 거래가", value: manwon(estimate.price) },
              { label: "신뢰도", value: `${estimate.confidence}%` },
            ]}
          />
        </div>
        <div className="mt-8 flex justify-center gap-2">
          <Button variant="secondary" onClick={() => setSubmitted(false)}>다른 장비 등록</Button>
          <Button onClick={() => onNavigate("dashboard")}>대시보드로 이동</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHead eyebrow="장비 등록" title="새 장비 등록" desc="장비 정보와 상태를 입력하면 AI가 예상 거래가를 즉시 산출합니다." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="space-y-6">
          <Card>
            <CardHead title="장비 정보" desc="카테고리와 기본 정보를 입력하세요." />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="카테고리" required>
                <Select value={CATEGORY_LABEL[category]} options={CATEGORIES.map((c) => CATEGORY_LABEL[c])} onChange={(next) => {
                  const found = CATEGORIES.find((c) => CATEGORY_LABEL[c] === next);
                  if (found) setCategory(found);
                }} />
              </Field>
              <Field label="장비명" required>
                <Input value={name} onChange={setName} placeholder="예: 0.7m³급 굴착기" />
              </Field>
              <Field label="제조사">
                <Input value={maker} onChange={setMaker} placeholder="예: S중공업" />
              </Field>
              <Field label="모델명">
                <Input value={model} onChange={setModel} placeholder="예: SX210W" />
              </Field>
              <Field label="연식(제조년도)" required>
                <Input type="number" value={manufacturedYear} onChange={setManufacturedYear} suffix="년" />
              </Field>
              <Field label="누적 가동시간" required hint="계기판 기준 시간(h)">
                <Input type="number" value={usedHours} onChange={setUsedHours} suffix="시간" />
              </Field>
              <Field label="소재지">
                <Input value={region} onChange={setRegion} placeholder="예: 경기 화성" />
              </Field>
              <Field label="신품 참고가" required hint="동일 모델 신품 기준가">
                <Input type="number" value={listPrice} onChange={setListPrice} suffix="원" />
              </Field>
            </div>
          </Card>

          <Card>
            <CardHead title="상태 등급" desc="현재 장비 상태를 가장 가깝게 선택하세요." />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {GRADES.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGrade(g)}
                  className={`rounded-[18px] border p-4 text-left transition-colors ${
                    grade === g ? "border-[var(--bb-primary)] bg-[var(--bb-info-soft)]" : "border-[var(--bb-hairline)] hover:bg-[var(--bb-canvas-parchment)]"
                  }`}
                >
                  <p className="text-[18px] font-semibold text-[var(--bb-ink)]">{g}등급</p>
                  <p className="mt-1 text-[11px] leading-4 text-[var(--bb-mute)]">
                    {g === "A" && "가동 이상 없음"}
                    {g === "B" && "생활 마모 있음"}
                    {g === "C" && "외관 손상"}
                    {g === "D" && "가동 이상"}
                  </p>
                </button>
              ))}
            </div>
            <div className="mt-4">
              <Field label="상세 스펙 및 비고" hint="검수원이 확인할 특이사항을 적어두면 검수가 빨라집니다.">
                <textarea
                  value={spec}
                  onChange={(e) => setSpec(e.target.value)}
                  rows={3}
                  placeholder="예: 버킷 0.7m³, 휠타입, 정기 오일교체 이력 있음"
                  className="w-full rounded-[18px] border border-[var(--bb-hairline)] bg-[var(--bb-canvas)] px-4 py-3 text-[14px] text-[var(--bb-ink)] outline-none transition-colors placeholder:text-[var(--bb-mute)] focus:border-[var(--bb-primary-focus)]"
                />
              </Field>
            </div>
          </Card>

          <Card>
            <CardHead title="장비 사진" desc="현재 상태를 확인할 수 있는 사진을 첨부하세요." />
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              <div className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-[18px] border border-dashed border-[var(--bb-hairline)] text-[var(--bb-mute)] transition-colors hover:border-[var(--bb-primary-focus)] hover:text-[var(--bb-body)]">
                <Camera size={20} />
                <span className="text-[11px]">사진 추가</span>
              </div>
              <CategoryPlaceholderTile category={category} />
            </div>
            <p className="mt-3 text-[12px] leading-4 text-[var(--bb-mute)]">
              아직 업로드된 사진이 없어 선택한 카테고리 아이콘을 임시로 보여줍니다. 등록 승인
              후에는 현장 검수원이 실사진과 함께 상세 검수 리포트를 작성합니다.
            </p>
          </Card>
        </div>

        <div className="lg:sticky lg:top-24">
          <Card className="border-[var(--bb-primary)]">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bb-info-soft)] text-[var(--bb-info-deep)]">
                <Sparkle size={15} weight="fill" />
              </span>
              <p className="text-[13px] font-semibold text-[var(--bb-ink)]">AI 예상 거래가</p>
            </div>
            <p className="mt-4 text-[32px] font-semibold tracking-[-0.03em] text-[var(--bb-ink)]">{manwon(estimate.price)}</p>
            <p className="mt-1 text-[13px] text-[var(--bb-mute)]">신품 참고가 대비 {Math.round((estimate.price / (Number(listPrice) || 1)) * 100)}% 수준</p>

            <div className="mt-4">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-[var(--bb-mute)]">신뢰도</span>
                <span className="font-semibold text-[var(--bb-ink)]">{estimate.confidence}%</span>
              </div>
              <div className="mt-1.5">
                <Meter value={estimate.confidence} tone="info" />
              </div>
            </div>

            <div className="mt-5 border-t border-[var(--bb-hairline)] pt-4">
              <DefList
                columns={1}
                items={[
                  { label: "연식 감가 계수", value: estimate.ageFactor.toFixed(2) },
                  { label: "가동시간 감가 계수", value: estimate.hoursFactor.toFixed(2) },
                  { label: "등급 계수", value: `${grade}등급 | ${estimate.gradeFactor.toFixed(2)}` },
                ]}
              />
            </div>

            <p className="mt-4 text-[11px] leading-4 text-[var(--bb-mute)]">
              실제 AI 시세 산출 엔진 연동 없이 입력값에 반응하는 mock 계수로 계산됩니다.
              최종 거래가는 1차, 최종 입찰과 현장 검수 결과로 확정됩니다.
            </p>

            <Button full className="mt-5" onClick={() => setSubmitted(true)}>등록 요청하기</Button>
          </Card>

          <div className="mt-4 flex items-center gap-2 rounded-[18px] border border-[var(--bb-hairline)] bg-[var(--bb-canvas-parchment)] p-4">
            <Badge tone="neutral">TIP</Badge>
            <p className="text-[12px] leading-4 text-[var(--bb-body)]">정비 이력을 상세히 적을수록 검수 시 감가 폭이 줄어듭니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 신규 등록 폼 전용: 아직 사진이 업로드되지 않은 상태의 임시 미리보기 타일.
 *  이 목업 업로드 플로우에는 실제 촬영된 사진이 없으므로 스톡 사진을 억지로
 *  넣지 않고, 선택된 카테고리 아이콘을 계속 보여준다(design.md 사진 매핑 참고). */
function CategoryPlaceholderTile({ category }: { category: EquipmentCategory }) {
  const Icon = CATEGORY_ICON[category];
  return (
    <span
      className="relative inline-flex aspect-square shrink-0 items-center justify-center overflow-hidden rounded-[18px] border border-[var(--bb-hairline)] bg-[var(--bb-canvas-parchment)] text-[var(--bb-body)]"
      style={{ width: 72, height: 72 }}
    >
      <Icon size={33} weight="bold" />
    </span>
  );
}
