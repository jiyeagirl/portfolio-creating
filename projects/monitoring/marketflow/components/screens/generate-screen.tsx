"use client";

import { useMemo, useState } from "react";
import { ArrowClockwise, CheckCircle, FloppyDisk, Image as ImageIcon, MagicWand, Sparkle, VideoCamera } from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  CardHead,
  Field,
  Input,
  PageHead,
  Segmented,
  Select,
  Textarea,
} from "@/projects/monitoring/marketflow/components/ui";
import { customers } from "@/projects/monitoring/marketflow/lib/mock-data";
import { CONTENT_TYPE_LABEL, type Navigate } from "@/projects/monitoring/marketflow/lib/navigation";
import type { ContentType } from "@/projects/monitoring/marketflow/lib/types";

const TYPE_ITEMS: { key: ContentType; label: string }[] = [
  { key: "blog", label: "블로그" },
  { key: "cardnews", label: "카드뉴스" },
  { key: "short", label: "숏폼" },
];

const ALL_CHANNELS = ["네이버 블로그", "인스타그램", "유튜브", "카카오채널", "페이스북"];

const TOPIC_PRESET: Record<ContentType, string> = {
  blog: "환절기 관리 팁을 소개하는 정보성 블로그",
  cardnews: "9월 신제품 라인업 소개 카드뉴스",
  short: "제품 사용법을 소개하는 15초 숏폼",
};

const GEN_BODY: Record<ContentType, string[]> = {
  blog: [
    "환절기에는 일교차가 커지면서 컨디션 관리가 무엇보다 중요합니다. 이번 글에서는 실천하기 쉬운 관리 팁 세 가지를 소개합니다.",
    "첫째, 아침저녁으로 얇은 겉옷을 준비해 체온 변화에 대응하세요. 둘째, 하루 물 섭취량을 평소보다 200ml 늘려보세요.",
    "마지막으로 실내 습도를 40~60%로 유지하면 호흡기 컨디션 관리에 도움이 됩니다.",
  ],
  cardnews: [
    "1장: 이번 가을, 새로워진 라인업을 소개합니다",
    "2장: 더 가벼워진 무게, 더 오래가는 배터리",
    "3장: 지금 바로 확인해보세요",
  ],
  short: [
    "이 제품, 이렇게 써보셨나요?",
    "전원 버튼을 3초간 눌러 시작하고,",
    "지금 바로 매장에서 확인해보세요.",
  ],
};

export function GenerateScreen({ onNavigate }: { onNavigate: Navigate }) {
  const [type, setType] = useState<ContentType>("blog");
  const [customerId, setCustomerId] = useState(customers[0].id);
  const [topic, setTopic] = useState(TOPIC_PRESET.blog);
  const [keywords, setKeywords] = useState("환절기, 건강관리, 시즌팁");
  const [channels, setChannels] = useState<string[]>(["네이버 블로그"]);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{ title: string; body: string[]; score: number } | null>(null);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const customer = useMemo(() => customers.find((c) => c.id === customerId) ?? customers[0], [customerId]);

  function toggleChannel(ch: string) {
    setChannels((prev) => (prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]));
  }

  function handleGenerate() {
    setGenerating(true);
    setResult(null);
    setSavedMsg(null);
    window.setTimeout(() => {
      setResult({
        title:
          type === "blog"
            ? `${customer.name}, ${topic}`
            : type === "cardnews"
              ? `${customer.name} ${topic}`
              : `${customer.name} 숏폼 - ${topic}`,
        body: GEN_BODY[type],
        score: 82 + Math.round(Math.random() * 12),
      });
      setGenerating(false);
    }, 900);
  }

  function handleSaveDraft() {
    setSavedMsg("임시 저장되었습니다. 콘텐츠 캘린더, 에디터 화면에서 이어서 작업할 수 있습니다.");
  }

  function handleRequestApproval() {
    setSavedMsg("승인 요청을 보냈습니다. 담당 관리자에게 알림이 전송됩니다.");
  }

  return (
    <div className="mf-enter flex flex-col gap-8">
      <PageHead
        eyebrow="AI CONTENT STUDIO"
        title="AI 콘텐츠 생성"
        desc="콘텐츠 유형을 고르고 주제, 키워드, 브랜드 톤을 입력하면 AI가 초안을 생성합니다. 생성 결과는 검수 후 승인 요청할 수 있습니다."
      />

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1fr_1.1fr]">
        <div className="flex flex-col gap-5">
          <Card>
            <CardHead title="1. 콘텐츠 유형" desc="유형에 따라 생성 형식과 소요 시간이 달라집니다" />
            <Segmented value={type} items={TYPE_ITEMS} onChange={(next) => { setType(next); setTopic(TOPIC_PRESET[next]); setResult(null); }} />
            <p className="mt-3 text-[12px] leading-5 text-[var(--mf-mute)]">
              {type === "blog" && "800~1,200자 분량의 정보성 블로그 초안을 생성합니다."}
              {type === "cardnews" && "6~8장 구성의 카드뉴스 카피와 이미지 프롬프트를 함께 생성합니다."}
              {type === "short" && "15초 분량의 숏폼 대본과 아바타 영상 생성을 지원합니다."}
            </p>
          </Card>

          <Card>
            <CardHead title="2. 주제 / 키워드" />
            <div className="flex flex-col gap-4">
              <Field label="브랜드(고객사)">
                <Select value={customerId} options={customers.map((c) => c.name)} onChange={(name) => {
                  const found = customers.find((c) => c.name === name);
                  if (found) setCustomerId(found.id);
                }} />
              </Field>
              <Field label="주제" required>
                <Input value={topic} onChange={setTopic} placeholder="예: 환절기 관리 팁을 소개하는 블로그" />
              </Field>
              <Field label="키워드" hint="쉼표로 구분해 입력하세요">
                <Input value={keywords} onChange={setKeywords} placeholder="키워드1, 키워드2, 키워드3" />
              </Field>
              <Field label="발행 채널">
                <div className="flex flex-wrap gap-2">
                  {ALL_CHANNELS.map((ch) => {
                    const active = channels.includes(ch);
                    return (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => toggleChannel(ch)}
                        aria-pressed={active}
                        className={`rounded-full px-3 py-1.5 text-[12.5px] transition-colors ${
                          active
                            ? "bg-[var(--mf-primary)] text-white"
                            : "border border-[var(--mf-hairline)] text-[var(--mf-body)] hover:bg-[var(--mf-soft)]"
                        }`}
                      >
                        {ch}
                      </button>
                    );
                  })}
                </div>
              </Field>
            </div>
          </Card>

          <Card soft>
            <CardHead title="3. 브랜드 톤앤매너" desc={`${customer.name} 고객사에 설정된 톤을 기본값으로 불러왔습니다`} />
            <Textarea value={customer.brandTone} rows={3} onChange={() => undefined} />
            <p className="mt-2 text-[11.5px] text-[var(--mf-mute)]">
              톤 수정이 필요하면 AI 프롬프트 관리 화면에서 {customer.name} 전용 템플릿을 편집하세요.
            </p>
          </Card>

          <Button size="lg" full icon={<MagicWand size={16} weight="bold" />} onClick={handleGenerate} disabled={generating}>
            {generating ? "AI가 생성하는 중..." : "AI로 생성하기"}
          </Button>
        </div>

        <div className="flex flex-col gap-5 xl:sticky xl:top-[88px]">
          <Card>
            <CardHead
              title="생성 결과 미리보기"
              desc={type === "short" ? "대본과 아바타 영상 생성 상태" : "카피와 대표 이미지 생성 상태"}
              action={
                result && (
                  <button
                    type="button"
                    onClick={handleGenerate}
                    className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[var(--mf-primary)] hover:underline"
                  >
                    <ArrowClockwise size={13} />
                    재생성
                  </button>
                )
              }
            />

            {generating && (
              <div className="flex flex-col items-center justify-center gap-3 rounded-[8px] border border-dashed border-[var(--mf-hairline-strong)] py-16">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--mf-hairline)] border-t-[var(--mf-primary)]" />
                <p className="text-[13px] text-[var(--mf-mute)]">
                  {type === "short" ? "대본과 아바타 영상을 생성하고 있습니다" : "카피와 이미지를 생성하고 있습니다"}
                </p>
              </div>
            )}

            {!generating && !result && (
              <div className="flex flex-col items-center justify-center gap-2 rounded-[8px] border border-dashed border-[var(--mf-hairline-strong)] py-16 text-center">
                <Sparkle size={20} className="text-[var(--mf-mute)]" />
                <p className="text-[13px] text-[var(--mf-mute)]">왼쪽에서 정보를 입력하고 생성 버튼을 눌러주세요</p>
              </div>
            )}

            {!generating && result && (
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[15px] font-semibold leading-6 text-[var(--mf-ink)]">{result.title}</h3>
                  <Badge tone="info">AI 점수 {result.score}</Badge>
                </div>

                {type !== "blog" && (
                  <div className="flex items-center gap-2 rounded-[8px] border border-[var(--mf-hairline)] bg-[var(--mf-soft)] p-3 text-[12.5px] text-[var(--mf-mute)]">
                    {type === "cardnews" ? <ImageIcon size={16} /> : <VideoCamera size={16} />}
                    {type === "cardnews" ? "이미지 생성 모델로 8장 이미지 생성 완료" : "아바타 영상 생성 모델로 15초 분량 생성 완료"}
                  </div>
                )}

                <ul className="flex flex-col gap-2.5 rounded-[8px] border border-[var(--mf-hairline)] p-4">
                  {result.body.map((line, i) => (
                    <li key={i} className="text-[13.5px] leading-6 text-[var(--mf-body)]">
                      {line}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {keywords.split(",").map((k) => k.trim()).filter(Boolean).map((k) => (
                    <Badge key={k}>{k}</Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 border-t border-[var(--mf-hairline)] pt-4">
                  <Button variant="secondary" size="sm" icon={<FloppyDisk size={14} />} onClick={handleSaveDraft}>
                    임시 저장
                  </Button>
                  <Button size="sm" icon={<CheckCircle size={14} weight="bold" />} onClick={handleRequestApproval}>
                    승인 요청
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onNavigate("editor")}>
                    에디터에서 이어 편집
                  </Button>
                </div>

                {savedMsg && (
                  <p className="rounded-[6px] bg-[var(--mf-info-soft)] px-3 py-2 text-[12.5px] text-[var(--mf-info-deep)]">
                    {savedMsg}
                  </p>
                )}
              </div>
            )}
          </Card>

          <Card soft>
            <p className="text-[12.5px] leading-5 text-[var(--mf-mute)]">
              {CONTENT_TYPE_LABEL[type]} 생성은 {customer.name}에 설정된 전용 프롬프트가 있으면 우선 적용됩니다.
              프롬프트 세부 설정은 <span className="font-medium text-[var(--mf-body)]">AI 프롬프트 관리</span> 화면에서 확인할 수 있습니다.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
