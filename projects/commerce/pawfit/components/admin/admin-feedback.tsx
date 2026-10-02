"use client";

import { useState } from "react";
import {
  Check,
  ChatCenteredText,
  Eye,
  EyeSlash,
  Star,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import {
  ADMIN_FEEDBACK,
  ADMIN_INQUIRIES,
  ADMIN_REVIEWS,
} from "@/projects/commerce/pawfit/lib/mock-data";
import type {
  AccuracyFeedback,
  AdminFeedbackRow,
  AdminInquiry,
  AdminReview,
} from "@/projects/commerce/pawfit/lib/types";
import {
  Drawer,
  FilterChips,
  PageHead,
  Pagination,
  Panel,
  Tag,
} from "@/projects/commerce/pawfit/components/admin/admin-ui";

type Tab = "feedback" | "review" | "inquiry";
type AccuracyKey = "all" | AccuracyFeedback;
type ExposureKey = "all" | "exposed" | "hidden";
type StatusKey = "all" | AdminInquiry["status"];
type CategoryKey = "all" | AdminInquiry["category"];
type InquiryRow = AdminInquiry & { replyText?: string };

const PER_PAGE = 6;

const TABS: { key: Tab; label: string }[] = [
  { key: "feedback", label: "사이즈 피드백" },
  { key: "review", label: "후기 관리" },
  { key: "inquiry", label: "고객 문의" },
];

const ACCURACY_TONE: Record<AccuracyFeedback, "success" | "warning" | "danger"> = {
  정확해요: "success",
  "약간 달라요": "warning",
  부정확해요: "danger",
};

const STATUS_TONE: Record<AdminInquiry["status"], "warning" | "success" | "neutral"> = {
  대기: "warning",
  답변완료: "success",
  종료: "neutral",
};

const CATEGORIES: AdminInquiry["category"][] = ["사이즈", "배송", "결제", "상품", "기타"];

function RatingRow({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="flex items-center gap-[1px]" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={12}
            weight={i < rating ? "fill" : "regular"}
            className={i < rating ? "text-[var(--pf-ink)]" : "text-[var(--pf-hairline)]"}
          />
        ))}
      </span>
      <span className="pf-num text-[12.5px] font-semibold text-[var(--pf-muted)]">{rating.toFixed(1)}</span>
    </span>
  );
}

export function AdminFeedback() {
  const [tab, setTab] = useState<Tab>("feedback");

  /* 사이즈 피드백 */
  const [feedbackRows] = useState<AdminFeedbackRow[]>(ADMIN_FEEDBACK);
  const [accuracyFilter, setAccuracyFilter] = useState<AccuracyKey>("all");
  const [feedbackPage, setFeedbackPage] = useState(1);
  const [openFeedbackId, setOpenFeedbackId] = useState<string | null>(null);

  /* 후기 관리 */
  const [reviews, setReviews] = useState<AdminReview[]>(ADMIN_REVIEWS);
  const [exposureFilter, setExposureFilter] = useState<ExposureKey>("all");
  const [reviewPage, setReviewPage] = useState(1);
  const [openReviewId, setOpenReviewId] = useState<string | null>(null);

  /* 고객 문의 */
  const [inquiries, setInquiries] = useState<InquiryRow[]>(ADMIN_INQUIRIES);
  const [statusFilter, setStatusFilter] = useState<StatusKey>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryKey>("all");
  const [inquiryPage, setInquiryPage] = useState(1);
  const [openInquiryId, setOpenInquiryId] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState("");

  /* ---------- 사이즈 피드백 ---------- */
  const accuracyOptions: { key: AccuracyKey; label: string; count: number }[] = [
    { key: "all", label: "전체", count: feedbackRows.length },
    { key: "정확해요", label: "정확해요", count: feedbackRows.filter((r) => r.accuracy === "정확해요").length },
    { key: "약간 달라요", label: "약간 달라요", count: feedbackRows.filter((r) => r.accuracy === "약간 달라요").length },
    { key: "부정확해요", label: "부정확해요", count: feedbackRows.filter((r) => r.accuracy === "부정확해요").length },
  ];
  const filteredFeedback = feedbackRows.filter(
    (r) => accuracyFilter === "all" || r.accuracy === accuracyFilter,
  );
  const feedbackStart = (feedbackPage - 1) * PER_PAGE;
  const feedbackPageRows = filteredFeedback.slice(feedbackStart, feedbackStart + PER_PAGE);
  const openFeedback = feedbackRows.find((r) => r.id === openFeedbackId) ?? null;

  /* ---------- 후기 관리 ---------- */
  const exposureOptions: { key: ExposureKey; label: string; count: number }[] = [
    { key: "all", label: "전체", count: reviews.length },
    { key: "exposed", label: "노출", count: reviews.filter((r) => r.exposed).length },
    { key: "hidden", label: "숨김", count: reviews.filter((r) => !r.exposed).length },
  ];
  const filteredReviews = reviews.filter((r) => {
    if (exposureFilter === "exposed") return r.exposed;
    if (exposureFilter === "hidden") return !r.exposed;
    return true;
  });
  const reviewStart = (reviewPage - 1) * PER_PAGE;
  const reviewPageRows = filteredReviews.slice(reviewStart, reviewStart + PER_PAGE);
  const openReview = reviews.find((r) => r.id === openReviewId) ?? null;

  const toggleExposure = (id: string) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, exposed: !r.exposed } : r)));
  };

  /* ---------- 고객 문의 ---------- */
  const statusOptions: { key: StatusKey; label: string; count: number }[] = [
    { key: "all", label: "전체", count: inquiries.length },
    { key: "대기", label: "대기", count: inquiries.filter((i) => i.status === "대기").length },
    { key: "답변완료", label: "답변완료", count: inquiries.filter((i) => i.status === "답변완료").length },
    { key: "종료", label: "종료", count: inquiries.filter((i) => i.status === "종료").length },
  ];
  const categoryOptions: { key: CategoryKey; label: string; count: number }[] = [
    { key: "all", label: "전체", count: inquiries.length },
    ...CATEGORIES.map((c) => ({
      key: c as CategoryKey,
      label: c,
      count: inquiries.filter((i) => i.category === c).length,
    })),
  ];
  const filteredInquiries = inquiries.filter((i) => {
    const matchesStatus = statusFilter === "all" || i.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || i.category === categoryFilter;
    return matchesStatus && matchesCategory;
  });
  const inquiryStart = (inquiryPage - 1) * PER_PAGE;
  const inquiryPageRows = filteredInquiries.slice(inquiryStart, inquiryStart + PER_PAGE);
  const openInquiry = inquiries.find((i) => i.id === openInquiryId) ?? null;

  const submitReply = () => {
    if (!openInquiryId || !replyDraft.trim()) return;
    setInquiries((prev) =>
      prev.map((i) =>
        i.id === openInquiryId ? { ...i, status: "답변완료", replyText: replyDraft.trim() } : i,
      ),
    );
    setReplyDraft("");
  };

  return (
    <>
      <PageHead
        title="피드백 관리"
        description="사이즈 피드백과 추천 실패 사례, 후기, 고객 문의를 한 곳에서 확인합니다."
      />

      <div className="mb-4">
        <FilterChips<Tab> options={TABS} value={tab} onChange={setTab} />
      </div>

      {tab === "feedback" && (
        <Panel
          title="사이즈 피드백"
          note="추천정확도 칩으로 부정확해요만 걸러보면 추천 실패 사례를 바로 확인할 수 있습니다"
        >
          <div className="border-b border-[var(--pf-hairline)] px-5 py-4">
            <FilterChips<AccuracyKey>
              options={accuracyOptions}
              value={accuracyFilter}
              onChange={(key) => {
                setAccuracyFilter(key);
                setFeedbackPage(1);
              }}
            />
          </div>

          <div className="overflow-x-auto pf-scroll-x">
            <table className="w-full min-w-[940px] text-left">
              <thead>
                <tr className="border-b border-[var(--pf-hairline)] text-[11.5px] text-[var(--pf-muted)]">
                  <th className="px-5 py-3 font-semibold">회원</th>
                  <th className="px-3 py-3 font-semibold">반려동물</th>
                  <th className="px-3 py-3 font-semibold">상품</th>
                  <th className="px-3 py-3 font-semibold">착용감</th>
                  <th className="px-3 py-3 font-semibold">추천정확도</th>
                  <th className="px-3 py-3 font-semibold">평점</th>
                  <th className="px-5 py-3 font-semibold">작성일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--pf-hairline)]">
                {feedbackPageRows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => setOpenFeedbackId(row.id)}
                    className="cursor-pointer text-[13px] transition-colors hover:bg-[var(--pf-surface-soft)]"
                  >
                    <td className="px-5 py-3.5 font-semibold">{row.member}</td>
                    <td className="px-3 py-3.5 text-[var(--pf-muted)]">{row.petName}</td>
                    <td className="px-3 py-3.5">{row.product}</td>
                    <td className="px-3 py-3.5">
                      <Tag tone="neutral">{row.fit}</Tag>
                    </td>
                    <td className="px-3 py-3.5">
                      <Tag tone={ACCURACY_TONE[row.accuracy]}>{row.accuracy}</Tag>
                    </td>
                    <td className="px-3 py-3.5">
                      <RatingRow rating={row.rating} />
                    </td>
                    <td className="pf-num px-5 py-3.5 text-[var(--pf-muted)]">{row.createdAt}</td>
                  </tr>
                ))}
                {feedbackPageRows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-[13px] text-[var(--pf-muted)]">
                      조건에 맞는 피드백이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination page={feedbackPage} total={filteredFeedback.length} perPage={PER_PAGE} onChange={setFeedbackPage} />
        </Panel>
      )}

      {tab === "review" && (
        <Panel title="후기 관리" note="행을 눌러 후기 전문을 확인하고 노출 여부를 변경할 수 있습니다">
          <div className="border-b border-[var(--pf-hairline)] px-5 py-4">
            <FilterChips<ExposureKey>
              options={exposureOptions}
              value={exposureFilter}
              onChange={(key) => {
                setExposureFilter(key);
                setReviewPage(1);
              }}
            />
          </div>

          <div className="overflow-x-auto pf-scroll-x">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-[var(--pf-hairline)] text-[11.5px] text-[var(--pf-muted)]">
                  <th className="px-5 py-3 font-semibold">회원</th>
                  <th className="px-3 py-3 font-semibold">상품</th>
                  <th className="px-3 py-3 font-semibold">평점</th>
                  <th className="px-3 py-3 font-semibold">내용</th>
                  <th className="px-3 py-3 font-semibold">작성일</th>
                  <th className="px-5 py-3 font-semibold">노출여부</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--pf-hairline)]">
                {reviewPageRows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => setOpenReviewId(row.id)}
                    className="cursor-pointer text-[13px] transition-colors hover:bg-[var(--pf-surface-soft)]"
                  >
                    <td className="px-5 py-3.5 font-semibold">{row.member}</td>
                    <td className="px-3 py-3.5">{row.product}</td>
                    <td className="px-3 py-3.5">
                      <RatingRow rating={row.rating} />
                    </td>
                    <td className="max-w-[260px] truncate px-3 py-3.5 text-[var(--pf-muted)]">{row.body}</td>
                    <td className="pf-num px-3 py-3.5 text-[var(--pf-muted)]">{row.createdAt}</td>
                    <td className="px-5 py-3.5">
                      <Tag tone={row.exposed ? "success" : "neutral"}>{row.exposed ? "노출" : "숨김"}</Tag>
                    </td>
                  </tr>
                ))}
                {reviewPageRows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-[13px] text-[var(--pf-muted)]">
                      조건에 맞는 후기가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination page={reviewPage} total={filteredReviews.length} perPage={PER_PAGE} onChange={setReviewPage} />
        </Panel>
      )}

      {tab === "inquiry" && (
        <Panel title="고객 문의" note="행을 눌러 문의 내용을 확인하고 답변을 등록할 수 있습니다">
          <div className="space-y-3 border-b border-[var(--pf-hairline)] px-5 py-4">
            <div>
              <p className="mb-1.5 text-[11px] font-semibold text-[var(--pf-muted)]">상태</p>
              <FilterChips<StatusKey>
                options={statusOptions}
                value={statusFilter}
                onChange={(key) => {
                  setStatusFilter(key);
                  setInquiryPage(1);
                }}
              />
            </div>
            <div>
              <p className="mb-1.5 text-[11px] font-semibold text-[var(--pf-muted)]">카테고리</p>
              <FilterChips<CategoryKey>
                options={categoryOptions}
                value={categoryFilter}
                onChange={(key) => {
                  setCategoryFilter(key);
                  setInquiryPage(1);
                }}
              />
            </div>
          </div>

          <div className="overflow-x-auto pf-scroll-x">
            <table className="w-full min-w-[880px] text-left">
              <thead>
                <tr className="border-b border-[var(--pf-hairline)] text-[11.5px] text-[var(--pf-muted)]">
                  <th className="px-5 py-3 font-semibold">회원</th>
                  <th className="px-3 py-3 font-semibold">제목</th>
                  <th className="px-3 py-3 font-semibold">카테고리</th>
                  <th className="px-3 py-3 font-semibold">상태</th>
                  <th className="px-5 py-3 font-semibold">접수일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--pf-hairline)]">
                {inquiryPageRows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => {
                      setOpenInquiryId(row.id);
                      setReplyDraft("");
                    }}
                    className="cursor-pointer text-[13px] transition-colors hover:bg-[var(--pf-surface-soft)]"
                  >
                    <td className="px-5 py-3.5 font-semibold">{row.member}</td>
                    <td className="px-3 py-3.5 text-[var(--pf-muted)]">{row.subject}</td>
                    <td className="px-3 py-3.5">
                      <Tag tone="neutral">{row.category}</Tag>
                    </td>
                    <td className="px-3 py-3.5">
                      <Tag tone={STATUS_TONE[row.status]}>{row.status}</Tag>
                    </td>
                    <td className="pf-num px-5 py-3.5 text-[var(--pf-muted)]">{row.createdAt}</td>
                  </tr>
                ))}
                {inquiryPageRows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-[13px] text-[var(--pf-muted)]">
                      조건에 맞는 문의가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination page={inquiryPage} total={filteredInquiries.length} perPage={PER_PAGE} onChange={setInquiryPage} />
        </Panel>
      )}

      {/* 사이즈 피드백 상세 */}
      {openFeedback && (
        <Drawer onClose={() => setOpenFeedbackId(null)}>
          <div className="flex items-start justify-between">
            <div>
              <p className="pf-num text-[12.5px] text-[var(--pf-muted)]">{openFeedback.id}</p>
              <h2 className="mt-1 text-[19px] font-semibold tracking-tight">피드백 상세</h2>
            </div>
            <button
              type="button"
              onClick={() => setOpenFeedbackId(null)}
              aria-label="닫기"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-[var(--pf-surface-soft)]"
            >
              <X size={16} weight="bold" />
            </button>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-[8px] border border-[var(--pf-hairline)] p-4">
            <span className="ml-0">
              <Tag tone={ACCURACY_TONE[openFeedback.accuracy]}>{openFeedback.accuracy}</Tag>
            </span>
            <span className="ml-auto">
              <RatingRow rating={openFeedback.rating} />
            </span>
          </div>

          <dl className="mt-4 space-y-3 text-[13px]">
            {[
              { label: "회원", value: openFeedback.member },
              { label: "반려동물", value: openFeedback.petName },
              { label: "상품", value: openFeedback.product },
              { label: "착용감", value: openFeedback.fit },
              { label: "작성일", value: openFeedback.createdAt },
            ].map((item) => (
              <div key={item.label} className="flex justify-between gap-6">
                <dt className="shrink-0 text-[var(--pf-muted)]">{item.label}</dt>
                <dd className="text-right font-semibold">{item.value}</dd>
              </div>
            ))}
          </dl>

          {openFeedback.accuracy === "부정확해요" && (
            <p className="mt-5 flex items-start gap-2 rounded-[8px] border border-[var(--pf-error)]/25 bg-[var(--pf-error-soft)] p-4 text-[12.5px] leading-relaxed text-[var(--pf-ink)]">
              <WarningCircle size={16} weight="fill" className="mt-0.5 shrink-0 text-[var(--pf-error)]" />
              이 사례는 추천 실패 분석 대상입니다. 해당 브랜드/체형 구간의 사이즈 규칙 재검토가 필요합니다.
            </p>
          )}
        </Drawer>
      )}

      {/* 후기 상세 */}
      {openReview && (
        <Drawer onClose={() => setOpenReviewId(null)}>
          <div className="flex items-start justify-between">
            <div>
              <p className="pf-num text-[12.5px] text-[var(--pf-muted)]">{openReview.id}</p>
              <h2 className="mt-1 text-[19px] font-semibold tracking-tight">후기 상세</h2>
            </div>
            <button
              type="button"
              onClick={() => setOpenReviewId(null)}
              aria-label="닫기"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-[var(--pf-surface-soft)]"
            >
              <X size={16} weight="bold" />
            </button>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-[8px] border border-[var(--pf-hairline)] p-4">
            <div>
              <p className="text-[14px] font-semibold">{openReview.member}</p>
              <p className="text-[12.5px] text-[var(--pf-muted)]">{openReview.product}</p>
            </div>
            <span className="ml-auto">
              <RatingRow rating={openReview.rating} />
            </span>
          </div>

          <p className="mt-4 rounded-[8px] border border-[var(--pf-hairline)] p-4 text-[13.5px] leading-relaxed">
            {openReview.body}
          </p>

          <p className="pf-num mt-3 text-[12px] text-[var(--pf-muted)]">{openReview.createdAt} 작성</p>

          <button
            type="button"
            onClick={() => toggleExposure(openReview.id)}
            className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-[8px] bg-[var(--pf-ink)] py-2.5 text-[13px] font-semibold text-[var(--pf-on-primary)] transition-transform active:scale-[0.97]"
          >
            {openReview.exposed ? (
              <>
                <EyeSlash size={14} weight="bold" />
                숨기기
              </>
            ) : (
              <>
                <Eye size={14} weight="bold" />
                노출
              </>
            )}
          </button>
        </Drawer>
      )}

      {/* 문의 상세 */}
      {openInquiry && (
        <Drawer onClose={() => setOpenInquiryId(null)}>
          <div className="flex items-start justify-between">
            <div>
              <p className="pf-num text-[12.5px] text-[var(--pf-muted)]">{openInquiry.id}</p>
              <h2 className="mt-1 text-[19px] font-semibold tracking-tight">문의 상세</h2>
            </div>
            <button
              type="button"
              onClick={() => setOpenInquiryId(null)}
              aria-label="닫기"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-[var(--pf-surface-soft)]"
            >
              <X size={16} weight="bold" />
            </button>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-[8px] border border-[var(--pf-hairline)] p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--pf-surface-card)] text-[var(--pf-ink)]">
              <ChatCenteredText size={16} />
            </div>
            <div>
              <p className="text-[14px] font-semibold">{openInquiry.member}</p>
              <p className="pf-num text-[12px] text-[var(--pf-muted)]">{openInquiry.createdAt} 접수</p>
            </div>
            <span className="ml-auto">
              <Tag tone={STATUS_TONE[openInquiry.status]}>{openInquiry.status}</Tag>
            </span>
          </div>

          <dl className="mt-5 space-y-3 text-[13px]">
            {[
              { label: "제목", value: openInquiry.subject },
              { label: "카테고리", value: openInquiry.category },
            ].map((item) => (
              <div key={item.label} className="flex justify-between gap-6">
                <dt className="shrink-0 text-[var(--pf-muted)]">{item.label}</dt>
                <dd className="text-right font-semibold">{item.value}</dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-6 text-[13.5px] font-semibold">답변</h3>

          {openInquiry.status === "대기" ? (
            <div className="mt-3">
              <textarea
                value={replyDraft}
                onChange={(e) => setReplyDraft(e.target.value)}
                placeholder="회원에게 전달할 답변을 입력하세요"
                rows={4}
                className="w-full rounded-[8px] border border-[var(--pf-hairline)] bg-[var(--pf-canvas)] px-3.5 py-2.5 text-[13px] leading-relaxed outline-none focus:border-[var(--pf-ink)]"
              />
              <button
                type="button"
                onClick={submitReply}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-[8px] bg-[var(--pf-ink)] py-2.5 text-[13px] font-semibold text-[var(--pf-on-primary)] transition-transform active:scale-[0.97]"
              >
                <Check size={14} weight="bold" />
                답변 등록
              </button>
            </div>
          ) : openInquiry.replyText ? (
            <p className="mt-3 rounded-[8px] border border-[var(--pf-hairline)] px-4 py-3 text-[12.5px] leading-relaxed">
              {openInquiry.replyText}
            </p>
          ) : (
            <p className="mt-3 rounded-[8px] border border-[var(--pf-hairline)] px-4 py-3 text-[12.5px] font-semibold text-[var(--pf-muted)]">
              {openInquiry.status === "답변완료"
                ? "고객에게 답변이 발송되어 문의가 종결되었습니다."
                : "문의가 종결되어 더 이상 답변을 등록할 수 없습니다."}
            </p>
          )}
        </Drawer>
      )}
    </>
  );
}
