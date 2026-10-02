"use client";

/* 10 오류 신고 / 콘텐츠 관리 — 강조 화면(spec.md 7절 5순위).
   접수 → 검토 → 반영 → 완료 4단계 워크플로우가 이 화면의 뼈대다. 신고를 열면 이력이
   타임라인으로 쌓이고, 상태를 바꾸면 다음 단계가 이어 붙는 형태로 보여준다. */

import { useMemo, useState } from "react";
import {
  ArrowSquareOut,
  CalendarCheck,
  ClipboardText,
  Flag,
  Image as ImageIcon,
  Megaphone,
  PencilSimpleLine,
  Plus,
} from "@phosphor-icons/react";
import {
  PhotoField,
  type PhotoPick,
} from "@/projects/youngin/real/components/admin/photo-field";
import {
  Badge,
  Button,
  Card,
  CardHead,
  Cell,
  DefList,
  Drawer,
  EmptyState,
  Field,
  Input,
  PageHead,
  REPORT_TONE,
  Row,
  Segmented,
  Select,
  Table,
  Tabs,
  Textarea,
  Timeline,
} from "@/projects/youngin/real/components/admin/ui";
import {
  CONTENT_ITEMS,
  DISTRICTS,
  RECENT_ACTIVITY,
  REPORTS,
  REPORT_COUNTS,
} from "@/projects/youngin/real/lib/mock-data";
import type { Report, ReportStatus } from "@/projects/youngin/real/lib/types";

const FLOW: ReportStatus[] = ["접수", "검토", "반영", "완료"];

type ContentItem = (typeof CONTENT_ITEMS)[number];

const SLOTS = [
  "메인 상단 배너 1",
  "메인 공지 스트립",
  "축제 목록 상단",
  "축제 목록 2",
  "상점가 상세 추천 카드",
  "지난 축제 아카이브",
];

const PLACES = [...DISTRICTS.map((d) => d.name), "OO시 전역"];

const EMPTY_FORM = {
  kind: "축제" as ContentItem["kind"],
  title: "",
  place: DISTRICTS[0].name,
  slot: "축제 목록 상단",
  start: "",
  end: "",
  status: "예약" as ContentItem["status"],
  summary: "",
};

/** "2026-06-25" → "06. 25" (표의 기간 표기 형식) */
function shortDate(value: string) {
  const [, month, day] = value.split("-");
  return month && day ? `${month}. ${day}` : "";
}

const CONTENT_ICON = {
  축제: CalendarCheck,
  배너: Megaphone,
  추천: ImageIcon,
} as const;

const CONTENT_TONE = {
  노출중: "ok",
  예약: "info",
  종료: "neutral",
} as const;

export function ReportsScreen() {
  const [tab, setTab] = useState<"reports" | "content">("reports");
  const [status, setStatus] = useState<ReportStatus | "전체">("전체");
  const [contentKind, setContentKind] = useState<"전체" | "축제" | "배너" | "추천">("전체");
  const [open, setOpen] = useState<Report | null>(null);
  const [draftStatus, setDraftStatus] = useState<ReportStatus>("검토");
  const [memo, setMemo] = useState("");

  /* 콘텐츠 등록 — 등록한 건은 목록 맨 위와 수정 이력에 바로 쌓인다(목업이므로 화면 상태로만). */
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [photo, setPhoto] = useState<PhotoPick | null>(null);
  const [added, setAdded] = useState<ContentItem[]>([]);
  const [addedLogs, setAddedLogs] = useState<
    { title: string; at: string; note: string; by: string }[]
  >([]);

  const filtered = useMemo(
    () => REPORTS.filter((r) => (status === "전체" ? true : r.status === status)),
    [status],
  );

  const allContent = useMemo(() => [...added, ...CONTENT_ITEMS], [added]);

  const contentList = useMemo(
    () => allContent.filter((c) => (contentKind === "전체" ? true : c.kind === contentKind)),
    [allContent, contentKind],
  );

  const activity = useMemo(() => [...addedLogs, ...RECENT_ACTIVITY], [addedLogs]);

  const nextContentId = `CT-${119 + added.length}`;
  /* 축제는 목록과 상세 화면 모두 사진 자리가 비면 미완성으로 보인다. 그래서 사진을 필수로 건다. */
  const canSubmit = form.title.trim() !== "" && (form.kind !== "축제" || photo !== null);

  const submitContent = () => {
    if (!canSubmit) return;
    const period =
      form.start && form.end ? `${shortDate(form.start)} ~ ${shortDate(form.end)}` : "상시";
    setAdded((prev) => [
      {
        id: nextContentId,
        kind: form.kind,
        title: form.title.trim(),
        place: form.place,
        period,
        status: form.status,
        slot: form.slot,
        photo: photo?.url,
      },
      ...prev,
    ]);
    setAddedLogs((prev) => [
      {
        title: `${form.title.trim()} 등록`,
        at: "방금 전",
        note: `${form.slot} 슬롯 / 대표 사진 ${photo ? photo.from : "없음"}`,
        by: "정하윤",
      },
      ...prev,
    ]);
    setCreateOpen(false);
    setForm(EMPTY_FORM);
    setPhoto(null);
  };

  const count = (s: ReportStatus | "전체") =>
    s === "전체" ? REPORTS.length : REPORTS.filter((r) => r.status === s).length;

  /* 표에 올리는 건 최근 접수 8건이고, 누적 집계는 REPORT_COUNTS 를 따로 쓴다.
     둘을 섞으면 대시보드의 "처리 대기 9건"과 숫자가 어긋난다. */
  const totalReports = REPORT_COUNTS.reduce((sum, r) => sum + r.count, 0);

  const openReport = (report: Report) => {
    setOpen(report);
    const next = FLOW[Math.min(FLOW.indexOf(report.status) + 1, FLOW.length - 1)];
    setDraftStatus(next);
    setMemo("");
  };

  return (
    <div className="cp-enter space-y-8">
      <PageHead
        eyebrow="사용자 신고 검수 / 노출 콘텐츠"
        title="오류 신고 / 콘텐츠 관리"
        desc="사용자가 QR 화면과 상세 화면에서 넘긴 오류 신고를 검수하고, 축제와 배너 같은 노출 콘텐츠의 게시 상태를 관리합니다."
        actions={
          <Button variant="secondary" icon={<ClipboardText size={14} weight="bold" />}>
            처리 기준 문서
          </Button>
        }
      />

      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { key: "reports", label: "오류 신고", count: totalReports },
          { key: "content", label: "콘텐츠 관리", count: allContent.length },
        ]}
      />

      {tab === "reports" ? (
        <div className="space-y-8">
          {/* 워크플로우 안내 — 상태 배지 색이 무엇을 뜻하는지 화면 안에서 고정한다.
              여기 숫자는 누적 전체(REPORT_COUNTS) 기준이라 아래 표의 최근 목록과 다르다. */}
          <Card soft>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="text-[13px] font-medium text-[var(--cp-ink)]">
                처리 단계
                <span className="cp-num ml-1.5 text-[12px] text-[var(--cp-mute)]">
                  누적 {totalReports}건
                </span>
              </span>
              {FLOW.map((s, index) => (
                <span key={s} className="flex items-center gap-3">
                  <Badge tone={REPORT_TONE[s]}>
                    {s} {REPORT_COUNTS.find((r) => r.status === s)?.count ?? 0}
                  </Badge>
                  {index < FLOW.length - 1 && (
                    <span className="text-[var(--cp-faint)]">&rarr;</span>
                  )}
                </span>
              ))}
              <span className="ml-auto text-[12.5px] text-[var(--cp-mute)]">
                반영 단계에서 데이터가 바뀌고, 완료 단계에서 신고자에게 회신합니다
              </span>
            </div>
          </Card>

          <Card padded={false}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--cp-hairline)] p-5">
              <Segmented
                value={status}
                onChange={setStatus}
                items={[
                  { key: "전체" as const, label: `전체 ${count("전체")}` },
                  ...FLOW.map((s) => ({ key: s, label: `${s} ${count(s)}` })),
                ]}
              />
              <span className="cp-num text-[12.5px] text-[var(--cp-mute)]">
                최근 접수 8건 / 평균 처리 2.4일
              </span>
            </div>

            <div className="p-5">
              {filtered.length === 0 ? (
                <EmptyState
                  title="해당 상태의 신고가 없습니다"
                  desc="다른 상태 탭에서 처리 중이거나 완료된 신고를 확인할 수 있습니다."
                />
              ) : (
                <Table
                  head={["신고번호", "대상", "유형 / 내용", "접수 경로", "접수일시", "상태"]}
                  align={["left", "left", "left", "left", "left", "right"]}
                  minWidth={940}
                >
                  {filtered.map((report) => (
                    <Row key={report.id} onClick={() => openReport(report)} active={open?.id === report.id}>
                      <Cell num strong nowrap>
                        {report.id}
                      </Cell>
                      <Cell strong>
                        <span className="block">{report.targetName}</span>
                        <span className="mt-0.5 block text-[12px] text-[var(--cp-mute)]">
                          {report.targetType === "Facility"
                            ? "시설"
                            : report.targetType === "Store"
                              ? "매장"
                              : "축제"}
                        </span>
                      </Cell>
                      <Cell>
                        <span className="block font-medium text-[var(--cp-ink)]">{report.kind}</span>
                        <span className="mt-0.5 line-clamp-1 block text-[12px] text-[var(--cp-mute)]">
                          {report.note}
                        </span>
                      </Cell>
                      <Cell nowrap muted>
                        {report.channel}
                      </Cell>
                      <Cell num nowrap muted>
                        {report.reportedAt}
                      </Cell>
                      <Cell align="right" nowrap>
                        <Badge tone={REPORT_TONE[report.status]} dot={report.status === "접수"}>
                          {report.status}
                        </Badge>
                      </Cell>
                    </Row>
                  ))}
                </Table>
              )}
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-8">
          <Card padded={false}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--cp-hairline)] p-5">
              <Segmented
                value={contentKind}
                onChange={setContentKind}
                items={[
                  { key: "전체" as const, label: "전체" },
                  { key: "축제" as const, label: "축제" },
                  { key: "배너" as const, label: "배너" },
                  { key: "추천" as const, label: "추천 카드" },
                ]}
              />
              <Button
                size="sm"
                icon={<PencilSimpleLine size={13} weight="bold" />}
                onClick={() => setCreateOpen(true)}
              >
                콘텐츠 등록
              </Button>
            </div>

            <div className="p-5">
              <Table
                head={["콘텐츠", "구분", "노출 위치", "기간", "상태"]}
                align={["left", "left", "left", "left", "right"]}
                minWidth={880}
              >
                {contentList.map((item) => {
                  const Icon = CONTENT_ICON[item.kind];
                  return (
                    <Row key={item.id}>
                      <Cell strong>
                        <span className="flex items-center gap-3">
                          {/* 축제는 대표 사진, 사진 없이 나가는 배너와 추천 카드는 아이콘 타일 */}
                          {item.photo ? (
                            /* 업로드본은 blob URL 이라 next/image 로 최적화할 수 없다 */
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={item.photo}
                              alt=""
                              className="h-9 w-[54px] shrink-0 rounded-[4px] border border-[var(--cp-hairline)] bg-[var(--cp-soft)] object-cover"
                            />
                          ) : (
                            <span className="flex h-9 w-[54px] shrink-0 items-center justify-center rounded-[4px] border border-[var(--cp-hairline)] bg-[var(--cp-soft)]">
                              <Icon size={15} weight="fill" className="text-[var(--cp-mute)]" />
                            </span>
                          )}
                          <span className="min-w-0">
                            <span className="block">{item.title}</span>
                            <span className="cp-num mt-0.5 block text-[12px] text-[var(--cp-mute)]">
                              {item.id} | {item.place}
                            </span>
                          </span>
                        </span>
                      </Cell>
                      <Cell nowrap>
                        <Badge tone="neutral">{item.kind}</Badge>
                      </Cell>
                      <Cell>{item.slot}</Cell>
                      <Cell num nowrap muted>
                        {item.period}
                      </Cell>
                      <Cell align="right" nowrap>
                        <Badge tone={CONTENT_TONE[item.status]} dot={item.status === "노출중"}>
                          {item.status}
                        </Badge>
                      </Cell>
                    </Row>
                  );
                })}
              </Table>
            </div>
          </Card>

          <Card>
            <CardHead
              title="콘텐츠 수정 이력"
              desc="노출 슬롯과 게시 상태 변경은 전부 기록으로 남습니다"
              action={<Badge tone="neutral">최근 {activity.length}건</Badge>}
            />
            <Timeline
              steps={activity.map((item) => ({
                label: item.title,
                at: item.at,
                done: true,
                note: item.note,
                by: item.by,
              }))}
            />
          </Card>
        </div>
      )}

      {/* 콘텐츠 등록 */}
      <Drawer
        open={createOpen}
        title="콘텐츠 등록"
        subtitle={`${nextContentId} | 등록하면 목록 맨 위에 올라갑니다`}
        onClose={() => setCreateOpen(false)}
        footer={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-[12.5px] text-[var(--cp-mute)]">
              {form.kind === "축제"
                ? "축제는 대표 사진이 있어야 등록됩니다"
                : "배너와 추천 카드는 사진 없이 등록할 수 있습니다"}
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setCreateOpen(false)}>
                취소
              </Button>
              <Button
                icon={<Plus size={14} weight="bold" />}
                disabled={!canSubmit}
                onClick={submitContent}
              >
                등록
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="구분" required>
              <Select
                value={form.kind}
                options={["축제", "배너", "추천"]}
                onChange={(next) =>
                  setForm({ ...form, kind: next as ContentItem["kind"] })
                }
              />
            </Field>
            <Field label="게시 상태" required>
              <Select
                value={form.status}
                options={["예약", "노출중", "종료"]}
                onChange={(next) =>
                  setForm({ ...form, status: next as ContentItem["status"] })
                }
              />
            </Field>
          </div>

          <Field label="제목" required hint="가명 규칙을 따릅니다. 실제 축제명을 쓰지 않습니다">
            <Input
              value={form.title}
              onChange={(next) => setForm({ ...form, title: next })}
              placeholder="예: D 골목상권 가을 오일장"
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="장소" required>
              <Select
                value={form.place}
                options={PLACES}
                onChange={(next) => setForm({ ...form, place: next })}
              />
            </Field>
            <Field label="노출 슬롯" required>
              <Select
                value={form.slot}
                options={SLOTS}
                onChange={(next) => setForm({ ...form, slot: next })}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="노출 시작" hint="두 날짜를 다 비우면 상시 노출로 등록됩니다">
              <Input
                type="date"
                value={form.start}
                onChange={(next) => setForm({ ...form, start: next })}
              />
            </Field>
            <Field label="노출 종료">
              <Input
                type="date"
                value={form.end}
                onChange={(next) => setForm({ ...form, end: next })}
              />
            </Field>
          </div>

          <PhotoField value={photo} onChange={setPhoto} required={form.kind === "축제"} />

          <Field label="요약 설명" hint="축제 목록 카드와 상세 화면 첫 줄에 함께 나갑니다">
            <Textarea
              value={form.summary}
              onChange={(next) => setForm({ ...form, summary: next })}
              rows={3}
              placeholder="예: 상설 점포와 오일장 상인이 함께 여는 가을 장터. 먹거리 부스 열다섯 곳"
            />
          </Field>
        </div>
      </Drawer>

      {/* 신고 상세 / 처리 */}
      <Drawer
        open={open !== null}
        title={open?.targetName ?? ""}
        subtitle={open ? `${open.id} | ${open.kind}` : undefined}
        onClose={() => setOpen(null)}
        footer={
          <div className="flex items-center justify-between gap-3">
            <Button variant="secondary" icon={<ArrowSquareOut size={14} weight="bold" />}>
              시설 정보 수정으로 이동
            </Button>
            <Button icon={<Flag size={14} weight="bold" />}>{draftStatus}로 변경</Button>
          </div>
        }
      >
        {open && (
          <div className="space-y-6">
            <div className="rounded-[6px] border border-[var(--cp-hairline)] bg-[var(--cp-soft)] p-4">
              <p className="text-[13px] leading-[21px] text-[var(--cp-ink)]">{open.note}</p>
              <p className="cp-num mt-2.5 text-[12px] text-[var(--cp-mute)]">
                {open.reporter} | {open.channel} | {open.reportedAt}
              </p>
            </div>

            <div>
              <p className="mb-2.5 text-[13px] font-medium text-[var(--cp-ink)]">신고 대상</p>
              <DefList
                columns={1}
                items={[
                  {
                    label: "구분",
                    value:
                      open.targetType === "Facility"
                        ? "시설"
                        : open.targetType === "Store"
                          ? "매장"
                          : "축제",
                  },
                  { label: "대상명", value: open.targetName },
                  { label: "관리 ID", value: <span className="cp-num">{open.targetId}</span> },
                  { label: "신고 유형", value: open.kind },
                  {
                    label: "현재 상태",
                    value: <Badge tone={REPORT_TONE[open.status]}>{open.status}</Badge>,
                  },
                ]}
              />
            </div>

            <div>
              <p className="mb-3 text-[13px] font-medium text-[var(--cp-ink)]">처리 이력</p>
              <Timeline
                steps={[
                  ...open.history.map((h) => ({
                    label: h.status,
                    at: h.at,
                    done: true,
                    note: h.note,
                    by: h.by,
                  })),
                  ...FLOW.filter((s) => !open.history.some((h) => h.status === s)).map((s) => ({
                    label: s,
                    at: "대기",
                    done: false,
                  })),
                ]}
              />
            </div>

            <div className="rounded-[6px] border border-[var(--cp-hairline)] p-4">
              <p className="mb-3 text-[13px] font-medium text-[var(--cp-ink)]">다음 단계로 넘기기</p>
              <Segmented
                value={draftStatus}
                onChange={setDraftStatus}
                items={FLOW.map((s) => ({ key: s, label: s }))}
              />
              <div className="mt-3">
                <Textarea
                  value={memo}
                  onChange={setMemo}
                  rows={3}
                  placeholder="처리 메모를 남기면 이력에 함께 기록됩니다"
                />
              </div>
              <p className="mt-2 text-[12px] leading-[18px] text-[var(--cp-mute)]">
                반영 단계로 넘기면 시설 / 매장 데이터 수정 화면이 함께 열립니다. 완료 처리 시
                신고자에게 회신 알림이 발송됩니다.
              </p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
