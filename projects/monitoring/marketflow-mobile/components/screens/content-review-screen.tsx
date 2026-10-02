"use client";

import { useState } from "react";
import {
  CalendarBlank,
  CheckCircle,
  PencilSimple,
  PlayCircle,
  User,
  XCircle,
} from "@phosphor-icons/react";
import { Button, Card, ChannelTag, ScreenHeader, SectionTitle, StatusBadge } from "@/projects/monitoring/marketflow-mobile/components/ui";
import { formatDateTime } from "@/projects/monitoring/marketflow-mobile/lib/format";
import { picsumUrl } from "@/projects/monitoring/marketflow-mobile/lib/image";
import { getAssigneeById, getBrandById } from "@/projects/monitoring/marketflow-mobile/lib/mock-data";
import {
  CHANNEL_LABEL,
  CONTENT_TYPE_LABEL,
  type ApprovalStatus,
  type ContentItem,
  type ReviewComment,
} from "@/projects/monitoring/marketflow-mobile/lib/types";

type Stage = "preview" | "comment" | "done";

const COMMENT_COPY: Record<"rejected" | "changes-requested", { label: string; placeholder: string }> = {
  rejected: { label: "반려 사유", placeholder: "반려하는 이유를 구체적으로 적어주세요. 담당자에게 그대로 전달됩니다." },
  "changes-requested": {
    label: "수정 요청 내용",
    placeholder: "수정이 필요한 부분을 구체적으로 적어주세요. 담당자에게 그대로 전달됩니다.",
  },
};

export function ContentReviewScreen({
  content,
  status,
  extraComments,
  onDecision,
  onBack,
}: {
  content: ContentItem;
  status: ApprovalStatus;
  extraComments: ReviewComment[];
  onDecision: (id: string, decision: ApprovalStatus, comment?: string) => void;
  onBack: () => void;
}) {
  const [stage, setStage] = useState<Stage>("preview");
  const [pendingDecision, setPendingDecision] = useState<"rejected" | "changes-requested" | null>(null);
  const [commentText, setCommentText] = useState("");
  const [activeChannelIdx, setActiveChannelIdx] = useState(0);

  const brand = getBrandById(content.brandId);
  const assignee = getAssigneeById(content.assigneeId);
  const isActionable = status === "pending" || status === "changes-requested";
  const allComments = [...content.comments, ...extraComments].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  const activeChannelPreview = content.channelPreviews[activeChannelIdx] ?? content.channelPreviews[0];

  function submitApprove() {
    onDecision(content.id, "approved");
    setStage("done");
  }

  function startComment(decision: "rejected" | "changes-requested") {
    setPendingDecision(decision);
    setStage("comment");
  }

  function submitComment() {
    if (!pendingDecision || !commentText.trim()) return;
    onDecision(content.id, pendingDecision, commentText.trim());
    setStage("done");
  }

  return (
    <div className="flex min-h-full flex-col">
      <ScreenHeader
        title={content.title}
        subtitle={`${brand?.name ?? ""} | ${CONTENT_TYPE_LABEL[content.type]}`}
        onBack={onBack}
      />

      {stage === "done" ? (
        <DoneSummary content={content} status={status} comment={commentText} onBack={onBack} />
      ) : (
        <>
          <div className="flex flex-col gap-7 px-4 pb-40 pt-5">
            <MediaPreview content={content} />

            {content.channelPreviews.length > 0 && (
              <div className="flex flex-col gap-3">
                <SectionTitle title="채널별 발행 미리보기" />
                {content.channelPreviews.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {content.channelPreviews.map((preview, idx) => (
                      <button
                        key={preview.channel}
                        type="button"
                        onClick={() => setActiveChannelIdx(idx)}
                        className={`shrink-0 rounded-full border px-3.5 py-2 text-[12.5px] font-medium transition-colors ${
                          idx === activeChannelIdx
                            ? "border-[var(--mfm-ink)] bg-[var(--mfm-ink)] text-[var(--mfm-on-dark)]"
                            : "border-[var(--mfm-hairline)] bg-[var(--mfm-surface)] text-[var(--mfm-body)]"
                        }`}
                      >
                        {CHANNEL_LABEL[preview.channel]}
                      </button>
                    ))}
                  </div>
                )}
                {activeChannelPreview && (
                  <Card className="flex flex-col gap-2.5 px-4 py-4">
                    <ChannelTag channel={activeChannelPreview.channel} />
                    <p className="whitespace-pre-wrap text-[13.5px] leading-[1.55] text-[var(--mfm-body)]">
                      {activeChannelPreview.caption}
                    </p>
                    <p className="text-[12px] text-[var(--mfm-primary)]">
                      {activeChannelPreview.hashtags.map((tag) => `#${tag}`).join("  ")}
                    </p>
                  </Card>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <SectionTitle title="콘텐츠 정보" />
              <Card className="flex flex-col divide-y divide-[var(--mfm-hairline-soft)] px-4">
                <InfoRow icon={<User size={15} />} label="담당자" value={assignee?.name ?? "-"} />
                <InfoRow icon={<CalendarBlank size={15} />} label="발행 예정" value={formatDateTime(content.scheduledAt)} />
                <InfoRow
                  icon={<CalendarBlank size={15} />}
                  label="채널"
                  value={content.channelIds.map((c) => CHANNEL_LABEL[c]).join(", ")}
                />
              </Card>
            </div>

            {allComments.length > 0 && (
              <div className="flex flex-col gap-3">
                <SectionTitle title="검수 코멘트" />
                <div className="flex flex-col gap-2.5">
                  {allComments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`rounded-[10px] border-l-[3px] bg-[var(--mfm-surface-soft)] py-2.5 pl-3.5 pr-3 ${
                        comment.kind === "rejection" ? "border-[var(--mfm-error)]" : "border-[var(--mfm-accent-amber)]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[12.5px] font-semibold text-[var(--mfm-ink)]">{comment.author}</p>
                        <p className="mfm-tabular text-[10.5px] text-[var(--mfm-muted-soft)]">
                          {formatDateTime(comment.createdAt)}
                        </p>
                      </div>
                      <p className="mt-1 text-[12.5px] leading-[1.5] text-[var(--mfm-body)]">{comment.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="absolute inset-x-0 bottom-0 border-t border-[var(--mfm-hairline)] bg-[var(--mfm-surface)] px-4 pb-8 pt-3.5">
            {!isActionable && (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <StatusBadge status={status} />
                  <p className="text-[12px] text-[var(--mfm-muted)]">이미 처리된 콘텐츠입니다</p>
                </div>
                <Button variant="secondary" size="sm" onClick={onBack}>
                  목록으로
                </Button>
              </div>
            )}

            {isActionable && stage === "preview" && (
              <div className="flex gap-2">
                <Button variant="danger" className="flex-1" onClick={() => startComment("rejected")}>
                  <XCircle size={16} weight="bold" />
                  반려
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1 !border-[var(--mfm-accent-amber)] !text-[#9a5a17]"
                  onClick={() => startComment("changes-requested")}
                >
                  <PencilSimple size={16} weight="bold" />
                  수정요청
                </Button>
                <Button variant="primary" className="flex-1" onClick={submitApprove}>
                  <CheckCircle size={16} weight="bold" />
                  승인
                </Button>
              </div>
            )}

            {isActionable && stage === "comment" && pendingDecision && (
              <div className="flex flex-col gap-2.5">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[12.5px] font-semibold text-[var(--mfm-ink)]">
                    {COMMENT_COPY[pendingDecision].label}
                  </span>
                  <textarea
                    value={commentText}
                    onChange={(event) => setCommentText(event.target.value)}
                    placeholder={COMMENT_COPY[pendingDecision].placeholder}
                    rows={3}
                    className="w-full resize-none rounded-[8px] border border-[var(--mfm-hairline)] bg-[var(--mfm-surface)] px-3.5 py-2.5 text-[13.5px] text-[var(--mfm-ink)] outline-none placeholder:text-[var(--mfm-muted-soft)] focus:border-[var(--mfm-primary)]"
                  />
                </label>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      setStage("preview");
                      setPendingDecision(null);
                      setCommentText("");
                    }}
                  >
                    취소
                  </Button>
                  <Button
                    variant={pendingDecision === "rejected" ? "danger" : "primary"}
                    className="flex-1"
                    disabled={!commentText.trim()}
                    onClick={submitComment}
                  >
                    코멘트와 함께 제출
                  </Button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 py-3">
      <span className="text-[var(--mfm-muted-soft)]">{icon}</span>
      <span className="w-16 shrink-0 text-[12px] text-[var(--mfm-muted)]">{label}</span>
      <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-[var(--mfm-ink)]">{value}</span>
    </div>
  );
}

function MediaPreview({ content }: { content: ContentItem }) {
  if (content.type === "blog") {
    return (
      <div className="flex flex-col gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={picsumUrl(content.heroImageId, 700, 500)}
          alt=""
          className="aspect-[4/3] w-full rounded-[14px] object-cover"
        />
        <p className="text-[13.5px] leading-[1.6] text-[var(--mfm-body)]">{content.copy}</p>
      </div>
    );
  }

  if (content.type === "short-form") {
    return (
      <div className="flex flex-col gap-3">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[14px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={picsumUrl(content.heroImageId, 700, 500)} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/25">
            <PlayCircle size={48} weight="fill" className="text-white/90" />
          </div>
          {content.shortFormDurationSec && (
            <span className="mfm-tabular absolute bottom-2.5 right-2.5 rounded-[6px] bg-black/70 px-2 py-1 text-[11px] font-semibold text-white">
              0:{String(content.shortFormDurationSec).padStart(2, "0")}
            </span>
          )}
        </div>
        <p className="text-[13.5px] leading-[1.6] text-[var(--mfm-body)]">{content.copy}</p>
      </div>
    );
  }

  const slides = content.cardNewsSlides ?? [];
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[13.5px] leading-[1.6] text-[var(--mfm-body)]">{content.copy}</p>
      <div className="flex flex-col gap-3">
        {slides.map((slide, idx) => (
          <Card key={slide.id} className="overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={picsumUrl(slide.imageId, 700, 480)} alt="" className="aspect-[4/3] w-full object-cover" />
            <div className="px-4 py-3">
              <p className="mfm-tabular text-[10.5px] font-semibold text-[var(--mfm-muted-soft)]">
                슬라이드 {idx + 1}/{slides.length}
              </p>
              <p className="mt-1 text-[14px] font-bold text-[var(--mfm-ink)]">{slide.heading}</p>
              <p className="mt-0.5 text-[12.5px] text-[var(--mfm-muted)]">{slide.body}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function DoneSummary({
  content,
  status,
  comment,
  onBack,
}: {
  content: ContentItem;
  status: ApprovalStatus;
  comment: string;
  onBack: () => void;
}) {
  const tone =
    status === "approved"
      ? { icon: <CheckCircle size={40} weight="fill" />, color: "text-[var(--mfm-success)]", message: "승인 처리를 완료했습니다" }
      : status === "rejected"
        ? { icon: <XCircle size={40} weight="fill" />, color: "text-[var(--mfm-error)]", message: "반려 처리를 완료했습니다" }
        : {
            icon: <PencilSimple size={40} weight="fill" />,
            color: "text-[var(--mfm-accent-amber)]",
            message: "수정 요청을 전달했습니다",
          };

  return (
    <div className="flex flex-1 flex-col items-center gap-6 px-6 pb-28 pt-14 text-center">
      <span className={tone.color}>{tone.icon}</span>
      <div>
        <p className="text-[17px] font-bold text-[var(--mfm-ink)]">{tone.message}</p>
        <p className="mt-1.5 text-[13px] text-[var(--mfm-muted)]">{content.title}</p>
      </div>
      <Card className="w-full px-4 py-4 text-left">
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-[var(--mfm-muted)]">처리 상태</span>
          <StatusBadge status={status} />
        </div>
        {comment && (
          <div className="mt-3 border-t border-[var(--mfm-hairline-soft)] pt-3">
            <p className="text-[11.5px] font-semibold text-[var(--mfm-muted)]">
              {status === "rejected" ? "반려 사유" : "수정 요청 내용"}
            </p>
            <p className="mt-1 text-[13px] leading-[1.5] text-[var(--mfm-body)]">{comment}</p>
          </div>
        )}
      </Card>
      <Button variant="primary" className="w-full" onClick={onBack}>
        승인함으로 돌아가기
      </Button>
    </div>
  );
}
