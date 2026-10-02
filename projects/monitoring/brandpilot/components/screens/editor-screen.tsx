"use client";

import { useState } from "react";
import {
  ArrowCounterClockwise,
  CheckCircle,
  Image as ImageIcon,
  PaperPlaneTilt,
  Sparkle,
  WarningCircle,
} from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  CardHead,
  ChannelIcon,
  ChannelTag,
  DefList,
  Eyebrow,
  Field,
  InitialAvatar,
  PageHead,
  Preview,
  Segmented,
  Textarea,
  Thumb,
} from "@/projects/monitoring/brandpilot/components/ui";
import { brand, contents, guideRules } from "@/projects/monitoring/brandpilot/lib/mock-data";
import {
  CHANNEL_LABEL,
  STATUS_LABEL,
  STATUS_TONE,
  type Navigate,
} from "@/projects/monitoring/brandpilot/lib/navigation";
import type { Channel } from "@/projects/monitoring/brandpilot/lib/types";

const PREVIEW_CHANNELS: Channel[] = ["instagram", "tiktok", "blog"];

export function EditorScreen({
  contentId,
  onNavigate,
}: {
  contentId: string;
  onNavigate: Navigate;
}) {
  const content = contents.find((c) => c.id === contentId) ?? contents[0];
  const [caption, setCaption] = useState(content.caption);
  const [hashtags, setHashtags] = useState(content.hashtags.join(" "));
  const [previewChannel, setPreviewChannel] = useState<Channel>(
    PREVIEW_CHANNELS.includes(content.channel) ? content.channel : "instagram",
  );

  const bannedWords = ["완벽한", "최고", "1위", "즉각", "완치", "유일"];
  const hits = bannedWords.filter((w) => caption.includes(w));
  const overLength = caption.length > 120;
  const activeRules = guideRules.filter((r) => r.enabled);
  const passing = hits.length === 0 && !overLength;

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow="콘텐츠"
        title="콘텐츠 편집기"
        desc="이미지와 카피를 다듬으면서 채널별 노출 형태와 브랜드 가이드 준수 여부를 동시에 확인합니다."
        actions={
          <>
            <Button size="md" variant="secondary" icon={<ArrowCounterClockwise size={14} />}>
              버전 {content.version}로 되돌리기
            </Button>
            <Button
              size="md"
              onClick={() => onNavigate("approvals")}
              icon={<PaperPlaneTilt size={14} weight="bold" />}
            >
              검토 요청
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-3 rounded-[8px] border border-[var(--bp-hairline)] bg-[var(--bp-soft)] px-4 py-3">
        <Thumb photo={content.photo} alt={content.title} size={36} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-medium text-[var(--bp-ink)]">{content.title}</p>
          <p className="mt-0.5 truncate text-[12px] text-[var(--bp-mute)]">
            {content.campaignName} · {content.productLine}
          </p>
        </div>
        <Badge tone={STATUS_TONE[content.status]}>{STATUS_LABEL[content.status]}</Badge>
        {content.aiGenerated && <Badge tone="accent">AI 생성됨</Badge>}
        <span className="bp-mono text-[12px] text-[var(--bp-mute)]">v{content.version}</span>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_300px]">
        <div className="space-y-5">
          <Card>
            <CardHead
              title="이미지"
              action={
                <Button size="sm" variant="secondary" icon={<Sparkle size={13} weight="fill" />}>
                  AI 재생성
                </Button>
              }
            />
            <Preview photo={content.photo} alt={content.title} ratio="4 / 5" />
            <div className="mt-3 grid grid-cols-4 gap-2">
              {[content.photo, 152, 326, 106].map((p, i) => (
                <button
                  key={`${p}-${i}`}
                  type="button"
                  className={`overflow-hidden rounded-[6px] border transition-colors ${
                    i === 0 ? "border-[var(--bp-accent)]" : "border-[var(--bp-hairline)]"
                  }`}
                >
                  <Thumb photo={p} alt={`대체 이미지 ${i + 1}`} size={64} rounded={0} className="w-full" />
                </button>
              ))}
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-[12px] text-[var(--bp-mute)]">
              <ImageIcon size={13} />
              1080 x 1350 · 이미지 내 텍스트 비중 12%
            </p>
          </Card>

          <Card>
            <CardHead title="카피" desc={`${caption.length}자 · 권장 120자 이내`} />
            <div className="space-y-4">
              <Field label="본문">
                <Textarea value={caption} onChange={setCaption} rows={6} />
              </Field>
              <Field label="해시태그" hint="띄어쓰기로 구분합니다">
                <Textarea value={hashtags} onChange={setHashtags} rows={2} />
              </Field>
            </div>
          </Card>
        </div>

        <Card>
          <CardHead
            title="채널 미리보기"
            action={
              <Segmented
                value={previewChannel}
                onChange={setPreviewChannel}
                items={PREVIEW_CHANNELS.map((c) => ({ key: c, label: CHANNEL_LABEL[c] }))}
              />
            }
          />

          {previewChannel === "instagram" && (
            <div className="mx-auto max-w-[360px] overflow-hidden rounded-[8px] border border-[var(--bp-hairline)]">
              <div className="flex items-center gap-2 px-3 py-2.5">
                <InitialAvatar name={brand.name} size={28} tone="ink" />
                <span className="text-[13px] font-medium text-[var(--bp-ink)]">a_beauty_official</span>
              </div>
              <Preview photo={content.photo} alt={content.title} ratio="4 / 5" rounded={0} />
              <div className="px-3 py-3">
                <p className="text-[13px] leading-6 text-[var(--bp-body)]">
                  <span className="font-medium text-[var(--bp-ink)]">a_beauty_official</span>{" "}
                  {caption}
                </p>
                <p className="bp-mono mt-1.5 text-[12.5px] leading-5 text-[var(--bp-accent-deep)]">
                  {hashtags}
                </p>
              </div>
            </div>
          )}

          {previewChannel === "tiktok" && (
            <div className="mx-auto max-w-[300px] overflow-hidden rounded-[8px] border border-[var(--bp-hairline)] bg-[var(--bp-ink)]">
              <div className="relative">
                <Preview photo={content.photo} alt={content.title} ratio="9 / 16" rounded={0} />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <p className="text-[12.5px] font-medium text-white">@a_beauty_official</p>
                  <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-white/85">{caption}</p>
                  <p className="bp-mono mt-1 line-clamp-1 text-[11.5px] text-white/70">{hashtags}</p>
                </div>
              </div>
            </div>
          )}

          {previewChannel === "blog" && (
            <div className="rounded-[8px] border border-[var(--bp-hairline)] p-5">
              <Eyebrow>A뷰티 공식 블로그</Eyebrow>
              <h3 className="mt-2 text-[19px] font-semibold leading-7 tracking-[-0.03em] text-[var(--bp-ink)]">
                {content.title}
              </h3>
              <div className="mt-3">
                <Preview photo={content.photo} alt={content.title} ratio="16 / 10" />
              </div>
              <p className="mt-3 text-[13.5px] leading-7 text-[var(--bp-body)]">{caption}</p>
              <p className="bp-mono mt-3 text-[12.5px] leading-5 text-[var(--bp-accent-deep)]">
                {hashtags}
              </p>
            </div>
          )}

          <p className="mt-4 flex items-center gap-1.5 border-t border-[var(--bp-hairline)] pt-4 text-[12px] text-[var(--bp-mute)]">
            <ChannelIcon channel={previewChannel} size={13} />
            {CHANNEL_LABEL[previewChannel]} 기준으로 렌더한 미리보기입니다
          </p>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHead title="브랜드 가이드 검사" desc="입력하는 동안 실시간으로 확인합니다" />
            <div
              className={`flex items-center gap-2.5 rounded-[6px] px-3.5 py-3 ${
                passing ? "bg-[var(--bp-success-soft)]" : "bg-[var(--bp-danger-soft)]"
              }`}
            >
              {passing ? (
                <CheckCircle size={16} weight="fill" className="shrink-0 text-[var(--bp-success-deep)]" />
              ) : (
                <WarningCircle size={16} weight="fill" className="shrink-0 text-[var(--bp-danger-deep)]" />
              )}
              <p
                className={`text-[13px] font-medium ${
                  passing ? "text-[var(--bp-success-deep)]" : "text-[var(--bp-danger-deep)]"
                }`}
              >
                {passing
                  ? "모든 규칙을 통과했습니다"
                  : `${hits.length + (overLength ? 1 : 0)}건을 수정해야 합니다`}
              </p>
            </div>

            <ul className="mt-4 space-y-2.5">
              {hits.map((w) => (
                <li key={w} className="flex gap-2 text-[12.5px] leading-5">
                  <WarningCircle
                    size={13}
                    weight="fill"
                    className="mt-0.5 shrink-0 text-[var(--bp-danger-deep)]"
                  />
                  <span className="text-[var(--bp-body)]">
                    금지 표현{" "}
                    <span className="rounded-[4px] bg-[var(--bp-danger-soft)] px-1 font-medium text-[var(--bp-danger-deep)]">
                      {w}
                    </span>{" "}
                    이 포함돼 있습니다
                  </span>
                </li>
              ))}
              {overLength && (
                <li className="flex gap-2 text-[12.5px] leading-5">
                  <WarningCircle
                    size={13}
                    weight="fill"
                    className="mt-0.5 shrink-0 text-[var(--bp-warn-deep)]"
                  />
                  <span className="text-[var(--bp-body)]">
                    본문이 {caption.length}자입니다. 120자 이내를 권장합니다.
                  </span>
                </li>
              )}
              {passing &&
                activeRules.slice(0, 4).map((r) => (
                  <li key={r.id} className="flex gap-2 text-[12.5px] leading-5">
                    <CheckCircle
                      size={13}
                      weight="fill"
                      className="mt-0.5 shrink-0 text-[var(--bp-success-deep)]"
                    />
                    <span className="text-[var(--bp-mute)]">{r.label}</span>
                  </li>
                ))}
            </ul>
          </Card>

          <Card soft>
            <CardHead title="콘텐츠 정보" />
            <DefList
              columns={1}
              items={[
                { label: "캠페인", value: content.campaignName },
                { label: "제품 라인", value: content.productLine },
                { label: "채널", value: <ChannelTag channel={content.channel} label={CHANNEL_LABEL[content.channel]} /> },
                { label: "작성자", value: content.author },
                { label: "생성 방식", value: content.aiGenerated ? "AI 생성" : "직접 작성" },
                { label: "버전", value: `v${content.version}` },
              ]}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
