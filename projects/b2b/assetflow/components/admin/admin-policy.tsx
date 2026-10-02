"use client";

import { useState } from "react";
import { Info, Percent, Sliders } from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  CardHead,
  Cell,
  DefList,
  Drawer,
  Field,
  Input,
  Meter,
  PageHead,
  Row,
  Segmented,
  Table,
  Tabs,
} from "@/projects/b2b/assetflow/components/ui";
import {
  depreciationFactors,
  feePolicies,
  policyChangeLog,
  pricingPolicies,
} from "@/projects/b2b/assetflow/lib/admin-data";

type Tab = "pricing" | "depreciation" | "fee";

/** 잔존가치 곡선 미리보기. mock 계수라 실제 산출 로직은 아니다. */
const CURVE_PRESET: Record<string, number[]> = {
  노트북: [100, 78, 54, 32, 22, 16],
  데스크탑: [100, 74, 50, 29, 20, 14],
  서버: [100, 68, 44, 28, 19, 14],
  네트워크: [100, 72, 46, 27, 19, 13],
  주변기기: [100, 66, 42, 24, 15, 10],
};

export function AdminPolicy() {
  const [tab, setTab] = useState<Tab>("pricing");
  const [curve, setCurve] = useState("노트북");
  const [edit, setEdit] = useState<(typeof pricingPolicies)[number] | null>(null);
  const [weights, setWeights] = useState(() =>
    Object.fromEntries(depreciationFactors.map((f) => [f.label, f.weight])),
  );

  const points = CURVE_PRESET[curve];
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow="정책 관리"
        title="시세 | 운영 정책"
        desc="AI 자동 시세의 산출 기준과 감가 계수, 등급별 수수료 정책을 관리합니다. 배포하면 이후 등록되는 자산부터 적용됩니다."
        actions={
          <Button variant="secondary" size="md">
            변경 이력
          </Button>
        }
      />

      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { key: "pricing" as Tab, label: "시세 산출 기준", count: pricingPolicies.length },
          { key: "depreciation" as Tab, label: "감가 기준", count: depreciationFactors.length },
          { key: "fee" as Tab, label: "수수료 정책", count: feePolicies.length },
        ]}
      />

      {tab === "pricing" && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
          <Card>
            <CardHead
              title="카테고리별 기준표"
              desc="배포된 버전만 자동 시세에 반영됩니다. 초안은 검토 후 배포하세요."
            />
            <Table
              head={["카테고리", "버전", "계수", "개정일", "상태", ""]}
              align={["left", "left", "right", "right", "left", "right"]}
            >
              {pricingPolicies.map((policy) => (
                <Row key={`${policy.category}-${policy.version}`}>
                  <Cell>
                    <span className="block text-[13px] font-medium text-[var(--af-ink)]">
                      {policy.category}
                    </span>
                    <span className="block text-[11.5px] text-[var(--af-mute)]">
                      {policy.baseCurve}
                    </span>
                  </Cell>
                  <Cell mono>{policy.version}</Cell>
                  <Cell align="right" mono>
                    {policy.factors}개
                  </Cell>
                  <Cell align="right" mono muted nowrap>
                    {policy.updatedAt}
                  </Cell>
                  <Cell>
                    <Badge tone={policy.active ? "ink" : "warn"}>
                      {policy.active ? "배포됨" : "초안"}
                    </Badge>
                  </Cell>
                  <Cell align="right">
                    <Button variant={policy.active ? "ghost" : "secondary"} size="sm" onClick={() => setEdit(policy)}>
                      {policy.active ? "수정" : "배포"}
                    </Button>
                  </Cell>
                </Row>
              ))}
            </Table>

            <div className="mt-4 flex items-start gap-2 rounded-[6px] bg-[var(--af-warn-soft)] px-3.5 py-3">
              <Info size={14} className="mt-px shrink-0 text-[var(--af-warn-deep)]" />
              <p className="text-[12px] leading-[18px] text-[var(--af-warn-deep)]">
                노트북 v4.3 초안이 검토 대기 중입니다. 배터리 사이클 가중치를 6%에서 9%로 올리는
                안으로, 배포하면 진행 중인 입찰에는 영향이 없고 신규 등록분부터 적용됩니다.
              </p>
            </div>
          </Card>

          <Card>
            <CardHead
              title="잔존가치 곡선"
              desc="구매 후 경과 연차별 신품가 대비 잔존 비율"
              action={
                <Segmented
                  value={curve}
                  onChange={setCurve}
                  items={[
                    { key: "노트북", label: "노트북" },
                    { key: "서버", label: "서버" },
                    { key: "주변기기", label: "주변기기" },
                  ]}
                />
              }
            />
            <div className="flex items-stretch gap-2" style={{ height: 176 }}>
              {points.map((point, index) => (
                <div key={index} className="flex flex-1 flex-col justify-end gap-2">
                  <p className="af-mono text-center text-[11px] leading-4 text-[var(--af-mute)]">
                    {point}%
                  </p>
                  <div
                    className="w-full rounded-t-[4px]"
                    style={{
                      height: `${point}%`,
                      background: index === 0 ? "var(--af-primary)" : "var(--af-chart-rest)",
                    }}
                  />
                  <p className="text-center text-[11px] leading-4 text-[var(--af-mute)]">
                    {index}년
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 border-t border-[var(--af-hairline)] pt-4 text-[12.5px] leading-5 text-[var(--af-body)]">
              {curve}은 3년차 잔존율이 {points[3]}%입니다. 이 곡선에 등급, 부속, 수량, 수요 계수를
              차례로 곱해 최종 자동 시세를 산출합니다.
            </p>
          </Card>
        </div>
      )}

      {tab === "depreciation" && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-start">
          <Card>
            <CardHead
              title="감가 계수 가중치"
              desc="자동 시세에서 각 요인이 차지하는 비중입니다. 합계가 100%가 되도록 조정하세요."
              action={
                <Badge tone={totalWeight === 100 ? "ink" : "danger"}>합계 {totalWeight}%</Badge>
              }
            />
            <ul className="space-y-5">
              {depreciationFactors.map((factor) => (
                <li key={factor.label}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="text-[13.5px] font-medium text-[var(--af-ink)]">
                      {factor.label}
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="af-mono text-[12px] text-[var(--af-mute)]">
                        영향 범위 {factor.range}
                      </span>
                      <span className="af-mono w-11 text-right text-[13px] font-medium text-[var(--af-ink)]">
                        {weights[factor.label]}%
                      </span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={60}
                    value={weights[factor.label]}
                    onChange={(e) =>
                      setWeights((prev) => ({ ...prev, [factor.label]: Number(e.target.value) }))
                    }
                    aria-label={`${factor.label} 가중치`}
                    className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[var(--af-soft-2)] accent-[var(--af-primary)]"
                  />
                  <p className="mt-1.5 text-[12px] leading-4 text-[var(--af-mute)]">{factor.note}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-2 border-t border-[var(--af-hairline)] pt-5">
              <Button
                variant="secondary"
                full
                onClick={() =>
                  setWeights(Object.fromEntries(depreciationFactors.map((f) => [f.label, f.weight])))
                }
              >
                기본값으로 되돌리기
              </Button>
              <Button full disabled={totalWeight !== 100}>
                초안으로 저장
              </Button>
            </div>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHead title="가중치 구성" desc="현재 설정 비율" />
              <ul className="space-y-3">
                {depreciationFactors.map((factor) => (
                  <li key={factor.label}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[13px] text-[var(--af-body)]">{factor.label}</span>
                      <span className="af-mono text-[13px] text-[var(--af-ink)]">
                        {weights[factor.label]}%
                      </span>
                    </div>
                    <div className="mt-1.5">
                      <Meter value={(weights[factor.label] / 60) * 100} />
                    </div>
                  </li>
                ))}
              </ul>
            </Card>

          </div>
        </div>
      )}

      {tab === "fee" && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
          <Card>
            <CardHead
              title="등급별 수수료 정책"
              desc="기업과 리셀러 양측에서 수취하는 비율입니다. 변경 시 기존 계약 건은 소급하지 않습니다."
            />
            <Table
              head={["등급", "기업 수수료", "리셀러 수수료", "검수 비용", "정산 주기", ""]}
              align={["left", "right", "right", "left", "left", "right"]}
            >
              {feePolicies.map((fee) => (
                <Row key={fee.tier}>
                  <Cell>
                    <Badge tone={fee.tier === "Enterprise" ? "ink" : fee.tier === "Business" ? "info" : "neutral"}>
                      {fee.tier}
                    </Badge>
                  </Cell>
                  <Cell align="right" mono strong>
                    {fee.sellerFee}
                  </Cell>
                  <Cell align="right" mono strong>
                    {fee.resellerFee}
                  </Cell>
                  <Cell muted>{fee.inspectionFee}</Cell>
                  <Cell muted>{fee.settlement}</Cell>
                  <Cell align="right">
                    <Button variant="ghost" size="sm">
                      수정
                    </Button>
                  </Cell>
                </Row>
              ))}
            </Table>

            <div className="mt-5 grid grid-cols-1 gap-4 border-t border-[var(--af-hairline)] pt-5 sm:grid-cols-3">
              {[
                { label: "이번 달 수수료 수익", value: "21,840,000원", note: "거래 48건" },
                { label: "평균 실효 수수료", value: "5.6%", note: "양측 합산" },
                { label: "검수 비용 수익", value: "1,960,000원", note: "유료 검수 21건" },
              ].map((item) => (
                <div key={item.label} className="rounded-[6px] border border-[var(--af-hairline)] p-4">
                  <p className="text-[12.5px] text-[var(--af-mute)]">{item.label}</p>
                  <p className="af-mono mt-1.5 text-[17px] font-semibold tracking-[-0.02em] text-[var(--af-ink)]">
                    {item.value}
                  </p>
                  <p className="mt-1 text-[12px] text-[var(--af-body)]">{item.note}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHead title="운영 규칙" desc="플랫폼 전체에 적용되는 기본값" />
            <DefList
              columns={1}
              items={[
                { label: "1차 입찰 기간", value: "72시간" },
                { label: "최종 입찰 기간", value: "48시간" },
                { label: "검수 배정 기한", value: "신청 후 48시간" },
                { label: "회수 기한", value: "확정 후 10일" },
                { label: "입찰 철회 허용", value: "마감 6시간 전까지" },
                { label: "철회 누적 제한", value: "3회 시 30일 이용 제한" },
                { label: "분쟁 접수 기한", value: "회수 후 7일" },
                { label: "최소 입찰 단위", value: "1,000원" },
              ]}
            />
            <div className="mt-5 flex items-start gap-2 rounded-[6px] bg-[var(--af-soft)] px-3.5 py-3">
              <Sliders size={14} className="mt-px shrink-0 text-[var(--af-mute)]" />
              <p className="text-[12px] leading-[18px] text-[var(--af-body)]">
                운영 규칙을 바꾸면 진행 중인 입찰과 거래에는 적용되지 않고, 변경 이후 시작되는
                건부터 반영됩니다.
              </p>
            </div>
            <div className="mt-4">
              <Button variant="secondary" size="md" full icon={<Percent size={14} />}>
                운영 규칙 수정
              </Button>
            </div>
          </Card>
        </div>
      )}

      <Card>
        <CardHead
          title="정책 변경 이력"
          desc="시세 기준표, 감가 계수, 수수료 정책의 배포와 초안 등록 기록입니다."
        />
        <Table head={["일시", "처리자", "작업", "내용"]} align={["left", "left", "left", "left"]}>
          {policyChangeLog.map((log) => (
            <Row key={`${log.at}-${log.what}`}>
              <Cell mono muted nowrap>
                {log.at}
              </Cell>
              <Cell nowrap>{log.who}</Cell>
              <Cell strong>{log.what}</Cell>
              <Cell muted>{log.note}</Cell>
            </Row>
          ))}
        </Table>
      </Card>

      <Drawer
        open={edit !== null}
        title={edit?.active ? "기준표 수정" : "기준표 배포"}
        subtitle={edit ? `${edit.category} | ${edit.version}` : undefined}
        onClose={() => setEdit(null)}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" full onClick={() => setEdit(null)}>
              취소
            </Button>
            <Button full onClick={() => setEdit(null)}>
              {edit?.active ? "초안으로 저장" : "지금 배포"}
            </Button>
          </div>
        }
      >
        {edit && (
          <div className="space-y-5">
            <DefList
              columns={1}
              items={[
                { label: "카테고리", value: edit.category },
                { label: "버전", value: <span className="af-mono">{edit.version}</span> },
                { label: "기준 곡선", value: edit.baseCurve },
                { label: "계수 수", value: `${edit.factors}개` },
                { label: "최종 개정", value: edit.updatedAt },
                { label: "상태", value: edit.active ? "배포됨" : "초안" },
              ]}
            />

            <Field label="3년차 잔존율" hint="기준 곡선의 중간 지점입니다. 다른 연차는 비례해 조정됩니다.">
              <Input value={edit.baseCurve.replace(/[^0-9]/g, "").slice(-2)} suffix="%" />
            </Field>

            <Field label="적용 시점">
              <div className="space-y-2">
                {["즉시 적용 (신규 등록분부터)", "다음 달 1일부터 적용"].map((option, index) => (
                  <label
                    key={option}
                    className="flex cursor-pointer items-center gap-2.5 rounded-[6px] border border-[var(--af-hairline)] px-3.5 py-2.5"
                  >
                    <input
                      type="radio"
                      name="apply-at"
                      defaultChecked={index === 0}
                      className="h-4 w-4 shrink-0 accent-[var(--af-primary)]"
                    />
                    <span className="text-[13px] text-[var(--af-body)]">{option}</span>
                  </label>
                ))}
              </div>
            </Field>

            <div className="flex items-start gap-2 rounded-[6px] bg-[var(--af-warn-soft)] px-3.5 py-3">
              <Info size={14} className="mt-px shrink-0 text-[var(--af-warn-deep)]" />
              <p className="text-[12px] leading-[18px] text-[var(--af-warn-deep)]">
                배포 후에는 진행 중인 입찰과 검수 건의 자동 시세가 재계산되지 않습니다. 이미
                제시된 견적은 그대로 유지됩니다.
              </p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
