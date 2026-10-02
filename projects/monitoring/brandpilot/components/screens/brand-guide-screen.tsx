"use client";

import { useState } from "react";
import { Prohibit, Sparkle, WarningCircle } from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  CardHead,
  Cell,
  DefList,
  Eyebrow,
  PageHead,
  Row,
  Table,
  Tabs,
  Textarea,
  Thumb,
  Toggle,
} from "@/projects/monitoring/brandpilot/components/ui";
import {
  bannedPhraseHits,
  brandColors,
  guideRules,
  products,
  trainingSources,
} from "@/projects/monitoring/brandpilot/lib/mock-data";

type Tab = "tone" | "visual" | "product" | "training";

export function BrandGuideScreen() {
  const [tab, setTab] = useState<Tab>("tone");
  const [rules, setRules] = useState(guideRules);
  const [toneSample, setToneSample] = useState(
    "성분을 언급할 때는 함량이나 사용 기간처럼 확인 가능한 수치를 함께 씁니다. 문장은 두 줄을 넘기지 않습니다.",
  );

  const enabled = rules.filter((r) => r.enabled).length;

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow="브랜드"
        title="브랜드 가이드 관리"
        desc="여기 등록한 톤앤매너와 금지 표현이 AI 생성, 편집기 검사, 승인 단계에 그대로 적용됩니다. 규칙을 끄면 해당 검사도 함께 꺼집니다."
        actions={
          <Button size="md" variant="secondary" icon={<Sparkle size={14} weight="fill" />}>
            AI 학습 다시 실행
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-[8px] border border-[var(--bp-hairline)] p-5">
          <p className="text-[13px] text-[var(--bp-mute)]">적용 중인 규칙</p>
          <p className="bp-mono mt-2 text-[26px] font-semibold tracking-[-0.03em] text-[var(--bp-ink)]">
            {enabled}
            <span className="text-[16px] text-[var(--bp-mute)]"> / {rules.length}</span>
          </p>
        </div>
        <div className="rounded-[8px] border border-[var(--bp-hairline)] p-5">
          <p className="text-[13px] text-[var(--bp-mute)]">이번 달 가이드 위반 감지</p>
          <p className="bp-mono mt-2 text-[26px] font-semibold tracking-[-0.03em] text-[var(--bp-ink)]">
            {bannedPhraseHits.length}건
          </p>
        </div>
        <div className="rounded-[8px] border border-[var(--bp-hairline)] p-5">
          <p className="text-[13px] text-[var(--bp-mute)]">학습된 제품 정보</p>
          <p className="bp-mono mt-2 text-[26px] font-semibold tracking-[-0.03em] text-[var(--bp-ink)]">
            {products.length}종
          </p>
        </div>
      </div>

      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { key: "tone" as Tab, label: "톤앤매너 / 금지 표현", count: rules.length },
          { key: "visual" as Tab, label: "컬러 / 폰트", count: brandColors.length },
          { key: "product" as Tab, label: "제품 정보", count: products.length },
          { key: "training" as Tab, label: "AI 학습 데이터" },
        ]}
      />

      {tab === "tone" && (
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <Card>
            <CardHead title="규칙 목록" desc="켜져 있는 규칙만 생성과 검사에 반영됩니다" />
            <ul>
              {rules.map((rule) => (
                <li
                  key={rule.id}
                  className="flex items-start justify-between gap-4 border-b border-[var(--bp-hairline)] py-4 last:border-b-0"
                >
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 text-[14px] font-medium text-[var(--bp-ink)]">
                      {rule.label}
                      <Badge tone={rule.category === "금지 표현" ? "danger" : "neutral"}>
                        {rule.category}
                      </Badge>
                    </p>
                    <p className="mt-1.5 text-[13px] leading-5 text-[var(--bp-body)]">{rule.detail}</p>
                  </div>
                  <Toggle
                    on={rule.enabled}
                    label={`${rule.label} 사용 여부`}
                    onChange={() =>
                      setRules((prev) =>
                        prev.map((r) => (r.id === rule.id ? { ...r, enabled: !r.enabled } : r)),
                      )
                    }
                  />
                </li>
              ))}
            </ul>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHead title="톤 샘플 문장" desc="AI가 문체를 흉내 낼 기준 문장입니다" />
              <Textarea value={toneSample} onChange={setToneSample} rows={5} />
              <div className="mt-3 flex justify-end">
                <Button size="sm" variant="secondary">
                  저장
                </Button>
              </div>
            </Card>

            <Card>
              <CardHead
                title="최근 감지된 금지 표현"
                action={<Prohibit size={15} weight="bold" className="text-[var(--bp-danger-deep)]" />}
              />
              <ul className="space-y-3">
                {bannedPhraseHits.map((hit) => (
                  <li key={`${hit.contentTitle}-${hit.phrase}`} className="flex gap-2.5">
                    <WarningCircle
                      size={14}
                      weight="fill"
                      className="mt-0.5 shrink-0 text-[var(--bp-danger-deep)]"
                    />
                    <div className="min-w-0">
                      <p className="text-[13px] text-[var(--bp-ink)]">
                        <span className="rounded-[4px] bg-[var(--bp-danger-soft)] px-1 font-medium text-[var(--bp-danger-deep)]">
                          {hit.phrase}
                        </span>
                      </p>
                      <p className="mt-1 truncate text-[12px] text-[var(--bp-mute)]">
                        {hit.contentTitle}
                      </p>
                      <p className="text-[12px] text-[var(--bp-mute)]">{hit.rule}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      )}

      {tab === "visual" && (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          <Card>
            <CardHead title="브랜드 컬러" desc="콘텐츠 제작 시 사용 가능한 색입니다" />
            <ul className="space-y-3">
              {brandColors.map((c) => (
                <li
                  key={c.hex}
                  className="flex items-center gap-3 border-b border-[var(--bp-hairline)] pb-3 last:border-b-0 last:pb-0"
                >
                  <span
                    className="h-10 w-10 shrink-0 rounded-[6px] border border-[var(--bp-hairline)]"
                    style={{ background: c.hex }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-medium text-[var(--bp-ink)]">{c.name}</p>
                    <p className="text-[12px] text-[var(--bp-mute)]">{c.usage}</p>
                  </div>
                  <span className="bp-mono shrink-0 text-[12.5px] uppercase text-[var(--bp-body)]">
                    {c.hex}
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHead title="타이포그래피" desc="자막과 이미지 텍스트에 적용합니다" />
            <div className="space-y-4">
              <div className="rounded-[6px] border border-[var(--bp-hairline)] p-4">
                <Eyebrow>제목용</Eyebrow>
                <p className="mt-2 text-[22px] font-semibold leading-8 tracking-[-0.04em] text-[var(--bp-ink)]">
                  자는 동안 채우는 밤
                </p>
                <p className="mt-2 text-[12px] text-[var(--bp-mute)]">
                  Pretendard SemiBold · 자간 -4% · 최대 2줄
                </p>
              </div>
              <div className="rounded-[6px] border border-[var(--bp-hairline)] p-4">
                <Eyebrow>본문용</Eyebrow>
                <p className="mt-2 text-[14px] leading-6 text-[var(--bp-body)]">
                  세라마이드 NP를 넣어 자는 동안 피부 장벽을 채웁니다. 아침에 당김이 덜합니다.
                </p>
                <p className="mt-2 text-[12px] text-[var(--bp-mute)]">
                  Pretendard Regular · 행간 1.6 · 한 줄 28자 이내
                </p>
              </div>
              <DefList
                columns={1}
                items={[
                  { label: "숏폼 자막 최대 글자수", value: "화면당 12자" },
                  { label: "이미지 내 텍스트 비중", value: "20% 이하" },
                  { label: "로고 최소 여백", value: "로고 높이의 0.5배" },
                ]}
              />
            </div>
          </Card>
        </div>
      )}

      {tab === "product" && (
        <Card>
          <CardHead title="제품 정보" desc="AI가 성분과 클레임을 인용할 때 참조하는 원본입니다" />
          <Table
            head={["제품", "라인", "핵심 성분", "대표 클레임"]}
            align={["left", "left", "left", "left"]}
            minWidth={640}
          >
            {products.map((p) => (
              <Row key={p.id}>
                <Cell strong>
                  <span className="flex items-center gap-2.5">
                    <Thumb photo={p.photo} alt={p.name} size={32} />
                    {p.name}
                  </span>
                </Cell>
                <Cell nowrap>{p.line}</Cell>
                <Cell>{p.keyIngredient}</Cell>
                <Cell muted>{p.claim}</Cell>
              </Row>
            ))}
          </Table>
        </Card>
      )}

      {tab === "training" && (
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Card>
            <CardHead title="학습 소스" desc="AI가 브랜드 문체를 익히는 데 쓰는 자료입니다" />
            <Table
              head={["소스", "건수", "마지막 학습", "상태"]}
              align={["left", "right", "right", "left"]}
              minWidth={520}
            >
              {trainingSources.map((s) => (
                <Row key={s.name}>
                  <Cell strong>{s.name}</Cell>
                  <Cell align="right" mono>
                    {s.count}
                  </Cell>
                  <Cell align="right" mono muted nowrap>
                    {s.at}
                  </Cell>
                  <Cell>
                    <Badge tone={s.state === "반영됨" ? "success" : "warn"}>{s.state}</Badge>
                  </Cell>
                </Row>
              ))}
            </Table>
          </Card>

          <Card soft>
            <CardHead title="학습 상태" />
            <DefList
              columns={1}
              items={[
                { label: "마지막 학습", value: "2026-04-21 03:00" },
                { label: "학습 주기", value: "매주 월요일 새벽" },
                { label: "문체 일치도", value: "91.4%" },
                { label: "가이드 준수율", value: "97.2%" },
              ]}
            />
            <p className="mt-4 border-t border-[var(--bp-hairline)] pt-4 text-[12.5px] leading-5 text-[var(--bp-body)]">
              북마크한 레퍼런스 4건이 아직 학습에 반영되지 않았습니다. 다음 학습 주기에 포함됩니다.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
