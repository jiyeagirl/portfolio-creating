"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  CalendarBlank,
  CheckCircle,
  Info,
  MapPin,
  Sparkle,
  TrendUp,
} from "@phosphor-icons/react";
import {
  Accordion,
  AssetThumb,
  Badge,
  Button,
  Card,
  CardHead,
  CategoryTag,
  DefList,
  Drawer,
  Field,
  Input,
  Meter,
  PageHead,
  Select,
} from "@/projects/b2b/assetflow/components/ui";
import { assets, getAsset, inspectionOf } from "@/projects/b2b/assetflow/lib/mock-data";
import {
  CATEGORY_LABEL,
  GRADE_NOTE,
  STATUS_LABEL,
  STATUS_TONE,
  won,
  type Navigate,
} from "@/projects/b2b/assetflow/lib/navigation";

const SITES = [
  "본사 3층 전산실 (서울 강남구 테헤란로 152)",
  "본사 지하 1층 하역장 (서울 강남구 테헤란로 152)",
  "판교 R&D센터 B1 창고 (경기 성남시 분당구)",
  "용인 물류센터 A동 (경기 용인시 처인구)",
];

export function AssetDetailScreen({
  assetId,
  onNavigate,
}: {
  assetId?: string;
  onNavigate: Navigate;
}) {
  const [selected, setSelected] = useState(assetId ?? "a1");
  const [requestOpen, setRequestOpen] = useState(false);
  const [date, setDate] = useState("2026-07-31");
  const [site, setSite] = useState(SITES[0]);
  const [contact, setContact] = useState("윤도현 | 010-2984-1102");
  const [requested, setRequested] = useState<string[]>([]);

  const asset = getAsset(selected);
  const inspection = inspectionOf(asset.id);
  const total = asset.autoPrice * asset.quantity;
  const rate = Math.round((asset.autoPrice / asset.listPrice) * 1000) / 10;
  const alreadyRequested = requested.includes(asset.id) || asset.status === "inspecting";
  const maxImpact = Math.max(...asset.factors.map((f) => Math.abs(f.impact)));

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow={asset.code}
        title="자산 상세 | 자동 견적"
        desc="자동 시세가 어떤 근거로 산출됐는지, 어떤 요인이 값을 깎았는지 확인하고 현장 검수를 신청합니다."
        actions={
          <>
            <Button variant="secondary" size="md" onClick={() => onNavigate("register")}>
              자산 수정
            </Button>
            <Button size="md" onClick={() => onNavigate("bidding", asset.id)}>
              1차 입찰 열기
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[268px_minmax(0,1fr)]">
        {/* master */}
        <Card padded={false} className="h-fit overflow-hidden">
          <p className="border-b border-[var(--af-hairline)] px-4 py-3 text-[13px] font-medium text-[var(--af-ink)]">
            등록 자산 {assets.length}건
          </p>
          <ul className="max-h-[720px] overflow-y-auto">
            {assets.map((item) => {
              const active = item.id === selected;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(item.id)}
                    aria-current={active}
                    className={`flex w-full items-center gap-3 border-b border-[var(--af-hairline)] px-4 py-3 text-left transition-colors ${
                      active
                        ? "bg-[var(--af-soft-2)]"
                        : "hover:bg-[var(--af-soft)]"
                    }`}
                  >
                    <AssetThumb
                      category={item.category}
                      photo={item.photo}
                      name={item.name}
                      size={34}
                    />
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block truncate text-[13px] ${
                          active
                            ? "font-medium text-[var(--af-ink)]"
                            : "text-[var(--af-body)]"
                        }`}
                      >
                        {item.name}
                      </span>
                      <span className="af-mono block text-[11px] text-[var(--af-mute)]">
                        {item.code} | {item.quantity}대
                      </span>
                    </span>
                    {active && <ArrowRight size={12} className="shrink-0 text-[var(--af-ink)]" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>

        {/* detail */}
        <div className="space-y-6">
          <Card>
            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="shrink-0">
                {asset.photo !== undefined ? (
                  <Image
                    src={`https://picsum.photos/id/${asset.photo}/480/360`}
                    alt={`${asset.name} 대표 사진`}
                    width={240}
                    height={180}
                    className="h-[168px] w-full rounded-[8px] border border-[var(--af-hairline)] object-cover sm:w-[224px]"
                  />
                ) : (
                  <div className="flex h-[168px] w-full items-center justify-center rounded-[8px] border border-[var(--af-hairline)] bg-[var(--af-soft)] sm:w-[224px]">
                    <AssetThumb
                      category={asset.category}
                      name={asset.name}
                      size={72}
                      rounded={8}
                    />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={STATUS_TONE[asset.status]} dot={asset.status === "bidding1"}>
                    {STATUS_LABEL[asset.status]}
                  </Badge>
                  <Badge tone="neutral">{CATEGORY_LABEL[asset.category]}</Badge>
                  <span className="af-mono text-[12px] text-[var(--af-mute)]">{asset.code}</span>
                </div>
                <h2 className="mt-2.5 text-[20px] font-semibold tracking-[-0.03em] text-[var(--af-ink)]">
                  {asset.name}
                </h2>
                <p className="af-mono mt-1 text-[13px] text-[var(--af-body)]">
                  {asset.maker} {asset.model}
                </p>
                <p className="mt-3 text-[13.5px] leading-6 text-[var(--af-body)]">{asset.spec}</p>

                <div className="mt-4">
                  <DefList
                    items={[
                      { label: "수량", value: `${asset.quantity}대` },
                      { label: "분류", value: <CategoryTag category={asset.category} /> },
                      { label: "구매 시기", value: asset.purchasedAt },
                      { label: "사용 기간", value: `${asset.usedMonths}개월` },
                      { label: "자가 신고 등급", value: `${asset.grade}, ${GRADE_NOTE[asset.grade]}` },
                      { label: "등록일", value: asset.registeredAt },
                    ]}
                  />
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start">
            <Card>
              <CardHead title="자동 견적" desc="매일 오전 6시 갱신, 참고용 기준가" />
              <div className="rounded-[8px] border border-[var(--af-primary)] bg-[var(--af-primary)] p-5 text-[var(--af-on-primary)]">
                <p className="flex items-center gap-1.5 text-[12.5px] text-white/70">
                  <Sparkle size={12} weight="fill" />
                  예상 매각 총액
                </p>
                <p className="mt-2 text-[30px] font-semibold leading-9 tracking-[-0.04em]">
                  {won(total)}
                </p>
                <p className="af-mono mt-1.5 text-[12.5px] text-white/70">
                  대당 {won(asset.autoPrice)} × {asset.quantity}대
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-[6px] border border-[var(--af-hairline)] px-3.5 py-3">
                  <p className="text-[12px] text-[var(--af-mute)]">신품가 대비</p>
                  <p className="af-mono mt-1 text-[16px] font-semibold text-[var(--af-ink)]">
                    {rate}%
                  </p>
                </div>
                <div className="rounded-[6px] border border-[var(--af-hairline)] px-3.5 py-3">
                  <p className="text-[12px] text-[var(--af-mute)]">신품가 (대당)</p>
                  <p className="af-mono mt-1 text-[16px] font-semibold text-[var(--af-ink)]">
                    {won(asset.listPrice)}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-baseline justify-between">
                  <p className="text-[13px] text-[var(--af-mute)]">시세 신뢰도</p>
                  <p className="af-mono text-[13px] font-medium text-[var(--af-ink)]">
                    {asset.confidence}%
                  </p>
                </div>
                <div className="mt-2">
                  <Meter value={asset.confidence} />
                </div>
              </div>
            </Card>

            <Card>
              <CardHead
                title="감가 요인 분석"
                desc="자동 시세가 신품가에서 어떻게 조정됐는지 항목별로 보여줍니다."
              />
              <ul className="space-y-4">
                {asset.factors.map((factor) => {
                  const positive = factor.impact > 0;
                  return (
                    <li key={factor.label}>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-[13.5px] font-medium text-[var(--af-ink)]">
                          {factor.label}
                        </span>
                        <span
                          className={`af-mono text-[13px] font-medium ${
                            positive
                              ? "text-[var(--af-link-deep)]"
                              : "text-[var(--af-error-deep)]"
                          }`}
                        >
                          {positive ? "+" : ""}
                          {factor.impact}%
                        </span>
                      </div>
                      {/* 0을 가운데 두고 좌우로 뻗는 막대. 부호 자체가 정보라 색을 분리한다. */}
                      <div className="mt-2 flex h-1.5 w-full items-stretch">
                        <div className="flex w-1/2 justify-end overflow-hidden rounded-l-full bg-[var(--af-soft-2)]">
                          {!positive && (
                            <div
                              className="h-full rounded-l-full bg-[var(--af-error)]"
                              style={{ width: `${(Math.abs(factor.impact) / maxImpact) * 100}%` }}
                            />
                          )}
                        </div>
                        <div className="w-px bg-[var(--af-hairline-strong)]" />
                        <div className="flex w-1/2 overflow-hidden rounded-r-full bg-[var(--af-soft-2)]">
                          {positive && (
                            <div
                              className="h-full rounded-r-full bg-[var(--af-link)]"
                              style={{ width: `${(factor.impact / maxImpact) * 100}%` }}
                            />
                          )}
                        </div>
                      </div>
                      <p className="mt-1.5 text-[12px] leading-4 text-[var(--af-mute)]">
                        {factor.note}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>

          <Card>
            <CardHead
              title="시세 산출 근거"
              desc="같은 모델의 실제 거래 데이터와 적용된 기준표입니다."
            />
            <DefList items={asset.basis.map((b) => ({ label: b.label, value: b.value }))} />

            <div className="mt-5 border-t border-[var(--af-hairline)] pt-1">
              <Accordion
                title="감가 기준표 적용 내역"
                meta={<span className="af-mono text-[12px] text-[var(--af-mute)]">6개 계수</span>}
              >
                <ul className="space-y-2.5">
                  {[
                    { k: "기준 잔존율", v: `${CATEGORY_LABEL[asset.category]} 카테고리 기본 곡선` },
                    { k: "사용 기간 계수", v: `${asset.usedMonths}개월 구간 적용` },
                    { k: "외관 등급 계수", v: `${asset.grade}등급` },
                    { k: "부속 완비 계수", v: "신고 내용 기준" },
                    { k: "수량 규모 계수", v: `${asset.quantity}대` },
                    { k: "수요 지수 계수", v: "최근 30일 조회/입찰 참여" },
                  ].map((line) => (
                    <li key={line.k} className="flex items-baseline justify-between gap-4">
                      <span className="text-[13px] text-[var(--af-body)]">{line.k}</span>
                      <span className="text-right text-[13px] text-[var(--af-mute)]">{line.v}</span>
                    </li>
                  ))}
                </ul>
              </Accordion>
            </div>
          </Card>

          <Card soft>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h2 className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.01em] text-[var(--af-ink)]">
                  <TrendUp size={15} weight="bold" />
                  현장 검수 신청
                </h2>
                <p className="mt-1.5 max-w-[60ch] text-[13px] leading-5 text-[var(--af-body)]">
                  {inspection
                    ? `검수 후 평균 ${Math.round(((inspection.priceAfter - inspection.priceBefore) / inspection.priceBefore) * 1000) / 10}% 가격이 조정됐습니다. 검수를 마치면 리셀러가 실물 상태를 확인한 최종 입찰가를 제시합니다.`
                    : "검수를 마치면 리셀러가 실물 상태를 확인한 최종 입찰가를 제시합니다. 검수 완료 건의 63.2%가 자동 시세보다 높은 값을 받았습니다."}
                </p>
              </div>
              {alreadyRequested ? (
                <span className="flex shrink-0 items-center gap-2 rounded-[6px] border border-[var(--af-hairline)] bg-[var(--af-canvas)] px-4 py-2.5">
                  <CheckCircle size={15} weight="fill" className="text-[var(--af-link)]" />
                  <span className="text-[13.5px] font-medium text-[var(--af-ink)]">검수 신청 완료</span>
                </span>
              ) : (
                <Button size="md" onClick={() => setRequestOpen(true)}>
                  검수 신청
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Drawer
        open={requestOpen}
        title="현장 검수 신청"
        subtitle={`${asset.code} | ${asset.name} ${asset.quantity}대`}
        onClose={() => setRequestOpen(false)}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" full onClick={() => setRequestOpen(false)}>
              취소
            </Button>
            <Button
              full
              onClick={() => {
                setRequested((prev) => [...prev, asset.id]);
                setRequestOpen(false);
              }}
            >
              검수 신청하기
            </Button>
          </div>
        }
      >
        <div className="space-y-5">
          <Field label="희망 방문일" required>
            <Input value={date} onChange={setDate} type="date" />
          </Field>
          <Field label="검수 장소" required hint="검수원이 직접 방문해 실물 상태를 확인합니다.">
            <Select value={site} options={SITES} onChange={setSite} />
          </Field>
          <Field label="현장 담당자" required>
            <Input value={contact} onChange={setContact} />
          </Field>

          <div className="rounded-[6px] border border-[var(--af-hairline)] bg-[var(--af-soft)] p-4">
            <p className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--af-ink)]">
              <CalendarBlank size={13} weight="bold" />
              검수 진행 절차
            </p>
            <ol className="mt-2.5 space-y-1.5">
              {[
                "신청 후 1영업일 내 담당 검수원 배정",
                "방문일 확정 안내 (문자/이메일)",
                "현장 검수, 사진 촬영, 등급 판정",
                "검수 리포트 발행 후 최종 입찰 시작",
              ].map((step, index) => (
                <li key={step} className="flex gap-2 text-[12.5px] leading-5 text-[var(--af-body)]">
                  <span className="af-mono shrink-0 text-[var(--af-mute)]">{index + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="flex items-start gap-2 rounded-[6px] bg-[var(--af-warn-soft)] px-3.5 py-3">
            <Info size={14} className="mt-px shrink-0 text-[var(--af-warn-deep)]" />
            <p className="text-[12px] leading-[18px] text-[var(--af-warn-deep)]">
              Enterprise 요금제는 월 8회까지 검수가 무료입니다. 이번 달 3회 사용했습니다.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[12.5px] text-[var(--af-mute)]">
            <MapPin size={13} />
            검수 소요 시간은 100대 기준 약 3시간입니다.
          </div>
        </div>
      </Drawer>
    </div>
  );
}
