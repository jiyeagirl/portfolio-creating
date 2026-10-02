"use client";

import { useState } from "react";
import { ArrowClockwise, ArrowRight, CheckCircle, Sparkle } from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  CardHead,
  ChannelTag,
  Eyebrow,
  Field,
  Preview,
  Select,
  Textarea,
} from "@/projects/monitoring/brandpilot/components/ui";
import {
  campaigns,
  generatePurposes,
  generatedDrafts,
  products,
} from "@/projects/monitoring/brandpilot/lib/mock-data";
import { CHANNEL_LABEL, type Navigate } from "@/projects/monitoring/brandpilot/lib/navigation";
import type { Channel } from "@/projects/monitoring/brandpilot/lib/types";

type Phase = "form" | "generating" | "result";

const CHANNELS: Channel[] = ["instagram", "tiktok", "youtube", "blog"];

export function GenerateScreen({ onNavigate }: { onNavigate: Navigate }) {
  const [phase, setPhase] = useState<Phase>("form");
  const [campaign, setCampaign] = useState(campaigns[0].name);
  const [product, setProduct] = useState(products[0].name);
  const [purpose, setPurpose] = useState(generatePurposes[0]);
  const [channel, setChannel] = useState<Channel>("instagram");
  const [brief, setBrief] = useState(
    "한낮에 덧바르는 상황을 강조하고 싶습니다. 백탁 없다는 점을 첫 문장에 넣어주세요.",
  );
  const [picked, setPicked] = useState<string | null>(null);

  function run() {
    setPhase("generating");
    setPicked(null);
    window.setTimeout(() => setPhase("result"), 1400);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--bp-hairline)] pb-6">
        <div className="max-w-[70ch]">
          <Eyebrow>콘텐츠</Eyebrow>
          <h1 className="mt-2 text-[24px] font-semibold leading-8 tracking-[-0.04em] text-[var(--bp-ink)]">
            AI 콘텐츠 생성
          </h1>
          <p className="mt-2 text-[14px] leading-6 tracking-[-0.01em] text-[var(--bp-body)]">
            캠페인과 제품을 고르면 브랜드 가이드를 반영한 카피와 이미지, 해시태그를 한 번에
            만듭니다. 생성된 초안은 편집기에서 바로 다듬을 수 있습니다.
          </p>
        </div>
        <span className="flex items-center gap-2 rounded-[6px] border border-[var(--bp-hairline)] px-3 py-2 text-[12.5px] text-[var(--bp-body)]">
          <CheckCircle size={14} weight="fill" className="text-[var(--bp-success-deep)]" />
          브랜드 가이드 6개 규칙 적용 중
        </span>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        <Card>
          <CardHead title="생성 조건" desc="조건이 구체적일수록 초안 품질이 올라갑니다" />
          <div className="space-y-4">
            <Field label="캠페인" required>
              <Select value={campaign} options={campaigns.map((c) => c.name)} onChange={setCampaign} />
            </Field>
            <Field label="제품" required>
              <Select value={product} options={products.map((p) => p.name)} onChange={setProduct} />
            </Field>
            <Field label="생성 목적" required>
              <Select value={purpose} options={generatePurposes} onChange={setPurpose} />
            </Field>
            <Field label="채널" hint="채널에 맞춰 길이와 문장 구조가 달라집니다">
              <div className="flex flex-wrap gap-1.5">
                {CHANNELS.map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setChannel(ch)}
                    aria-pressed={channel === ch}
                    className={`flex items-center gap-1.5 rounded-[6px] border px-2.5 py-1.5 text-[13px] transition-colors ${
                      channel === ch
                        ? "border-[var(--bp-accent)] bg-[var(--bp-accent-soft)] font-medium text-[var(--bp-accent-deep)]"
                        : "border-[var(--bp-hairline)] text-[var(--bp-body)] hover:bg-[var(--bp-soft)]"
                    }`}
                  >
                    <ChannelTag channel={ch} label={CHANNEL_LABEL[ch]} />
                  </button>
                ))}
              </div>
            </Field>
            <Field label="추가 지시" hint="강조하고 싶은 상황이나 피하고 싶은 표현을 적어주세요">
              <Textarea value={brief} onChange={setBrief} rows={4} />
            </Field>
          </div>
          <div className="mt-6">
            <Button
              full
              size="lg"
              onClick={run}
              disabled={phase === "generating"}
              icon={<Sparkle size={15} weight="fill" />}
            >
              {phase === "generating" ? "생성 중" : "초안 3개 생성"}
            </Button>
          </div>
        </Card>

        <div className="space-y-5">
          {phase === "form" && (
            <Card className="flex min-h-[420px] flex-col items-center justify-center text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--bp-accent-soft)]">
                <Sparkle size={20} weight="fill" className="text-[var(--bp-accent)]" />
              </span>
              <p className="mt-4 text-[15px] font-medium text-[var(--bp-ink)]">
                조건을 정하고 생성을 눌러주세요
              </p>
              <p className="mt-1.5 max-w-[42ch] text-[13px] leading-5 text-[var(--bp-mute)]">
                서로 다른 접근의 초안 3개를 만들어 비교할 수 있게 보여드립니다. 마음에 드는 초안을
                고르면 편집기로 넘어갑니다.
              </p>
            </Card>
          )}

          {phase === "generating" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <Card key={i} padded={false} className="bp-shimmer overflow-hidden">
                  <div className="aspect-[4/5] w-full bg-[var(--bp-soft-2)]" />
                  <div className="space-y-2 p-4">
                    <div className="h-3 w-4/5 rounded-full bg-[var(--bp-soft-2)]" />
                    <div className="h-3 w-full rounded-full bg-[var(--bp-soft-2)]" />
                    <div className="h-3 w-2/3 rounded-full bg-[var(--bp-soft-2)]" />
                  </div>
                </Card>
              ))}
            </div>
          )}

          {phase === "result" && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="flex items-center gap-2 text-[13.5px] text-[var(--bp-body)]">
                  <Badge tone="accent">AI 생성됨</Badge>
                  접근이 다른 초안 3개입니다. 하나를 고르세요.
                </p>
                <Button size="sm" variant="secondary" onClick={run} icon={<ArrowClockwise size={13} />}>
                  다시 생성
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {generatedDrafts.map((d) => {
                  const active = picked === d.id;
                  return (
                    <Card
                      key={d.id}
                      padded={false}
                      className={`overflow-hidden transition-colors ${
                        active ? "border-[var(--bp-accent)]" : ""
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setPicked(d.id)}
                        className="block w-full text-left"
                      >
                        <Preview photo={d.photo} alt={d.caption.slice(0, 20)} ratio="4 / 5" rounded={0} />
                        <div className="p-4">
                          <div className="flex items-center justify-between gap-2">
                            <Eyebrow>{d.tone}</Eyebrow>
                            {active && (
                              <CheckCircle
                                size={16}
                                weight="fill"
                                className="shrink-0 text-[var(--bp-accent)]"
                              />
                            )}
                          </div>
                          <p className="mt-2 text-[13.5px] leading-6 text-[var(--bp-body)]">
                            {d.caption}
                          </p>
                          <p className="bp-mono mt-3 text-[12px] leading-5 text-[var(--bp-accent-deep)]">
                            {d.hashtags.join(" ")}
                          </p>
                        </div>
                      </button>
                    </Card>
                  );
                })}
              </div>

              <Card soft>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-medium text-[var(--bp-ink)]">
                      {picked ? "선택한 초안을 편집기로 보냅니다" : "초안을 하나 선택하세요"}
                    </p>
                    <p className="mt-1 text-[12.5px] text-[var(--bp-mute)]">
                      브랜드 가이드 검사를 통과했습니다. 금지 표현 0건, 필수 표기 누락 0건.
                    </p>
                  </div>
                  <Button
                    onClick={() => onNavigate("editor", "ct-1")}
                    disabled={!picked}
                    icon={<ArrowRight size={14} weight="bold" />}
                  >
                    편집기에서 다듬기
                  </Button>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
