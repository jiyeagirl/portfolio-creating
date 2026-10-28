"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Check, FilePdf, ImageSquare, Play, Subtitles, WarningCircle } from "@phosphor-icons/react";
import { useStore } from "@/projects/platform/eduon/lib/store";
import { courseScope } from "@/projects/platform/eduon/lib/access";
import { clock, courseLength } from "@/projects/platform/eduon/lib/format";
import { photoUrl } from "@/projects/platform/eduon/lib/mock-data";
import { LICENSE_CODE_LABEL, LICENSE_FAILURES, ROLE_PERSON, type AdminRole } from "@/projects/platform/eduon/lib/admin-data";
import type { AccessSetting, Course, Quality } from "@/projects/platform/eduon/lib/types";
import { AccessBadge, LockMark, PreviewChip } from "@/projects/platform/eduon/components/access-badge";
import { Button, DetailPanel, Dot, Modal, Progress, Row, StatusBadge, Tabs, Thumb } from "@/projects/platform/eduon/components/console/console-ui";
import { Toggle } from "@/components/shared/toggle";
import {
  PanelSection,
  Pager,
  REVIEW_TONE,
  rowCls,
  Td,
  Th,
  Timeline,
  TRANSCODE_TONE,
} from "@/projects/platform/eduon/components/admin/admin-ui";

type Filter = "all" | "검수 대기" | "보완 요청" | "승인" | "게시 중단";
export type ContentTab = "info" | "access" | "transcode" | "protect";
export const CONTENT_TABS: readonly ContentTab[] = ["info", "access", "transcode", "protect"];

const PAGE = 12;

const QUALITY_SPEC: Record<Quality, string> = {
  "1080p": "1920 x 1080 | 4.8Mbps",
  "720p": "1280 x 720 | 2.6Mbps",
  "480p": "854 x 480 | 1.1Mbps",
};

function match(c: Course, f: Filter) {
  if (f === "all") return true;
  if (f === "게시 중단") return c.publish === "게시 중단";
  /* 탭 합계가 전체와 맞도록 게시 중단은 승인에서 뺀다 */
  if (f === "승인") return c.review === "승인" && c.publish !== "게시 중단";
  return c.review === f;
}

export function ContentScreen({
  query,
  role,
  initialSelected,
  initialTab,
  notify,
}: {
  query: string;
  role: AdminRole;
  initialSelected: string | null;
  initialTab: ContentTab | null;
  notify: (m: string) => void;
}) {
  const { courses, hydrated } = useStore();
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<string | null>(initialSelected);
  const [tab, setTab] = useState<ContentTab>(initialTab ?? "info");

  /* 스튜디오에서 작성 중인 강좌는 제출 전이라 관리자 목록에 없다 */
  const pool = useMemo(
    () => courses.filter((c) => c.review !== "작성 중").sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : a.submittedAt > b.submittedAt ? -1 : 0)),
    [courses],
  );
  const q = query.trim();
  const searched = q ? pool.filter((c) => [c.title, c.instructor, c.producer, c.id].some((v) => v.includes(q))) : pool;
  const rows = searched.filter((c) => match(c, filter));
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE));
  const safePage = Math.min(page, pageCount - 1);
  const visible = rows.slice(safePage * PAGE, safePage * PAGE + PAGE);
  const current = selected ? pool.find((c) => c.id === selected) : undefined;

  const filters: Array<{ key: Filter; label: string; count: number }> = [
    { key: "all", label: "전체", count: searched.length },
    { key: "검수 대기", label: "검수 대기", count: searched.filter((c) => match(c, "검수 대기")).length },
    { key: "보완 요청", label: "보완 요청", count: searched.filter((c) => match(c, "보완 요청")).length },
    { key: "승인", label: "승인", count: searched.filter((c) => match(c, "승인")).length },
    { key: "게시 중단", label: "게시 중단", count: searched.filter((c) => match(c, "게시 중단")).length },
  ];

  const open = (id: string) => {
    if (id !== selected) setTab("info");
    setSelected(id);
  };

  return (
    <>
      <div className="min-w-0 flex-1 px-4 py-6 sm:px-8">
        <Tabs
          tabs={filters}
          value={filter}
          onChange={(k) => {
            setFilter(k);
            setPage(0);
          }}
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-[var(--eo-line)]">
                <Th>콘텐츠</Th>
                <Th className="w-[88px]">검수 상태</Th>
                <Th className="w-[80px]">공개 상태</Th>
                <Th className="w-[96px]">이용 범위</Th>
                {!current && <Th className="w-[56px]">변환</Th>}
              </tr>
            </thead>
            <tbody>
              {visible.map((c) => (
                <tr key={c.id} className={rowCls(c.id === selected)} onClick={() => open(c.id)}>
                  <Td>
                    <div className="flex min-w-0 items-center gap-3">
                      <Thumb photo={c.photo} title={c.title} className="w-16" />
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            open(c.id);
                          }}
                          title={c.title}
                          className="block max-w-full truncate text-left font-medium text-[var(--eo-ink)] hover:underline"
                        >
                          {c.title}
                        </button>
                        <div className="truncate text-[12px] text-[var(--eo-ink-3)]">
                          <span className="whitespace-nowrap">{c.instructor}</span> | <span className="whitespace-nowrap">{c.producer}</span> |{" "}
                          <span className="whitespace-nowrap tabular-nums">{c.submittedAt}</span>
                          {current && c.transcode !== "완료" && <span className="text-[var(--eo-red-fg)]"> | 변환 {c.transcode}</span>}
                        </div>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <StatusBadge tone={REVIEW_TONE[c.review]}>{c.review}</StatusBadge>
                  </Td>
                  {/* 상태 칩은 검수 상태 하나만 쓰고 공개 상태와 변환은 글자로 둔다 (사용자 지정, 2026-10-28) */}
                  <Td>
                    <span
                      className={`whitespace-nowrap ${
                        c.publish === "공개" ? "font-medium text-[var(--eo-ink)]" : c.publish === "게시 중단" ? "font-medium text-[var(--eo-red-fg)]" : "text-[var(--eo-ink-3)]"
                      }`}
                    >
                      {c.publish}
                    </span>
                  </Td>
                  <Td>
                    <AccessBadge scope={courseScope(c)} tone="light" />
                  </Td>
                  {!current && (
                    <Td>
                      <span
                        title={`변환 ${c.transcode}`}
                        className={`block w-6 text-center text-[14px] font-semibold ${
                          c.transcode === "완료" ? "text-[var(--eo-ink)]" : c.transcode === "실패" ? "text-[var(--eo-red-fg)]" : "text-[var(--eo-ink-3)]"
                        }`}
                      >
                        {c.transcode === "완료" ? "O" : "X"}
                      </span>
                    </Td>
                  )}
                </tr>
              ))}
              {hydrated && visible.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[13px] text-[var(--eo-ink-3)]">
                    조건에 맞는 콘텐츠가 없습니다
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pager page={safePage} pageSize={PAGE} total={rows.length} onPage={setPage} />
      </div>

      {current && (
        <CourseDetail key={current.id} course={current} role={role} tab={tab} onTab={setTab} onClose={() => setSelected(null)} notify={notify} />
      )}
    </>
  );
}

type ModalKind = "revision" | "reject" | "stop" | null;

function CourseDetail({
  course: c,
  role,
  tab,
  onTab,
  onClose,
  notify,
}: {
  course: Course;
  role: AdminRole;
  tab: ContentTab;
  onTab: (t: ContentTab) => void;
  onClose: () => void;
  notify: (m: string) => void;
}) {
  const { updateCourse } = useStore();
  const [modal, setModal] = useState<ModalKind>(null);
  const [text, setText] = useState("");
  const who = `${role === "operator" ? "운영자" : "최고관리자"} ${ROLE_PERSON[role]}`;

  const openModal = (k: ModalKind) => {
    setText("");
    setModal(k);
  };

  const confirmModal = () => {
    const note = text.trim();
    if (!note) return;
    if (modal === "revision") {
      updateCourse(c.id, { review: "보완 요청", revisionNote: note }, { who, action: "보완 요청", note });
      notify("보완 요청을 보냈습니다. 스튜디오에 의견이 표시됩니다.");
    } else if (modal === "reject") {
      updateCourse(c.id, { review: "반려" }, { who, action: "반려", note });
      notify("반려했습니다");
    } else if (modal === "stop") {
      updateCourse(c.id, { publish: "게시 중단" }, { who, action: "게시 중단", note });
      notify("게시를 중단했습니다. 사용자 목록과 검색에서 빠집니다.");
    }
    setModal(null);
  };

  const footer = (() => {
    if (tab !== "info") return undefined;
    if (c.review === "검수 대기")
      return (
        <>
          <Button variant="danger" onClick={() => openModal("reject")}>
            반려
          </Button>
          <Button onClick={() => openModal("revision")}>보완 요청</Button>
          <span className="ml-auto flex items-center gap-2">
            {c.transcode !== "완료" && <span className="text-[12px] text-[var(--eo-ink-3)]">변환 완료 후 승인</span>}
            <Button
              variant="primary"
              disabled={c.transcode !== "완료"}
              onClick={() => {
                updateCourse(c.id, { review: "승인" }, { who, action: "승인" });
                notify("승인했습니다. 공개하면 사용자 홈에 노출됩니다.");
              }}
            >
              승인
            </Button>
          </span>
        </>
      );
    if (c.review === "승인") {
      if (c.publish === "공개")
        return (
          <>
            <span className="flex items-center gap-2 text-[12px] text-[var(--eo-ink-2)]">
              <Dot tone="green" />
              사용자 홈, 검색에 노출 중
            </span>
            <Button variant="danger" className="ml-auto" onClick={() => openModal("stop")}>
              게시 중단
            </Button>
          </>
        );
      const again = c.publish === "게시 중단";
      return (
        <>
          <span className="flex items-center gap-2 text-[12px] text-[var(--eo-ink-2)]">
            <Dot tone="gray" />
            {again ? "게시 중단됨" : "승인 완료, 비공개"}
          </span>
          <Button
            variant="primary"
            className="ml-auto"
            onClick={() => {
              updateCourse(c.id, { publish: "공개" }, { who, action: again ? "재게시" : "공개" });
              notify(again ? "재게시했습니다" : "공개했습니다. 사용자 홈에 노출됩니다.");
            }}
          >
            {again ? "재게시" : "공개"}
          </Button>
        </>
      );
    }
    return (
      <span className="flex items-center gap-2 text-[12px] text-[var(--eo-ink-2)]">
        <Dot tone={c.review === "반려" ? "red" : "orange"} />
        {c.review === "반려" ? "반려됨, 제작자 새 제출 대기" : "제작자 재제출 대기"}
      </span>
    );
  })();

  const modalTitle = modal === "revision" ? "보완 요청" : modal === "reject" ? "반려" : "게시 중단";
  const modalLabel = modal === "revision" ? "제작자에게 보낼 의견" : modal === "reject" ? "반려 사유" : "중단 사유";

  return (
    <>
      <DetailPanel
        open
        onClose={onClose}
        title={<span className="block truncate" title={c.title}>{c.title}</span>}
        meta={
          <span className="tabular-nums">
            <span className="eo-mono">{c.id.toUpperCase()}</span> | 제출 버전 v{c.version} | {c.submittedAt} 제출
          </span>
        }
        footer={footer}
      >
        <div className="sticky top-0 z-10 bg-white px-6">
          <Tabs
            value={tab}
            onChange={onTab}
            tabs={[
              { key: "info", label: "정보" },
              { key: "access", label: "이용 설정" },
              { key: "transcode", label: "영상 처리" },
              { key: "protect", label: "재생 보호" },
            ]}
          />
        </div>
        {tab === "info" && <InfoTab c={c} />}
        {tab === "access" && <AccessTab c={c} who={who} notify={notify} />}
        {tab === "transcode" && <TranscodeTab c={c} who={who} notify={notify} />}
        {tab === "protect" && <ProtectTab c={c} />}
      </DetailPanel>

      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={modalTitle}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModal(null)}>
              취소
            </Button>
            <Button variant={modal === "revision" ? "primary" : "danger"} disabled={!text.trim()} onClick={confirmModal}>
              {modalTitle}
            </Button>
          </>
        }
      >
        <label className="block">
          <span className="mb-1.5 block text-[12px] font-medium text-[var(--eo-ink-2)]">
            {modalLabel} <span className="text-[var(--eo-red)]">*</span>
          </span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            autoFocus
            placeholder={modal === "revision" ? "예: 2강 자막 싱크 1.2초 밀림 수정" : ""}
            className="w-full resize-none rounded-[8px] border border-[var(--eo-line-2)] px-3 py-2 text-[13px] leading-[20px] text-[var(--eo-ink)] outline-none placeholder:text-[var(--eo-ink-3)] focus:border-[var(--eo-ink-2)]"
          />
        </label>
        <p className="mt-2 text-[12px] text-[var(--eo-ink-3)]">
          {c.title} | v{c.version}
        </p>
      </Modal>
    </>
  );
}

function InfoTab({ c }: { c: Course }) {
  const reviewTone = (action: string) =>
    action.includes("보완") ? "orange" : action.includes("반려") || action.includes("중단") ? "red" : action.includes("승인") || action.includes("공개") || action.includes("게시") ? "green" : "blue";
  return (
    <>
      <div className="px-6 pt-5">
        <div className="relative aspect-video w-full overflow-hidden rounded-[10px] bg-[var(--eo-side)]">
          {c.photo !== null ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl(c.photo, 880, 495)} alt="" className="h-full w-full object-cover" />
          ) : (
            <div role="img" aria-label="썸네일 없음" className="flex h-full w-full items-center justify-center bg-[var(--eo-soft-2)] text-[var(--eo-ink-3)]">
              <ImageSquare size={40} />
            </div>
          )}
          <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(15,18,22,0.72)] text-white">
            <Play size={20} weight="fill" />
          </span>
          <span className="absolute bottom-2 left-2 rounded-[6px] bg-[rgba(15,18,22,0.78)] px-2 py-0.5 text-[12px] text-white tabular-nums">
            1강 미리보기 | {clock(c.episodes[0]?.seconds ?? 0)}
          </span>
        </div>
      </div>

      {c.review === "보완 요청" && c.revisionNote && (
        <div className="mx-6 mt-4 flex gap-2.5 rounded-[8px] bg-[var(--eo-orange-bg)] px-3.5 py-3 text-[13px] text-[var(--eo-orange-fg)]">
          <WarningCircle size={18} className="mt-px shrink-0" />
          <span>{c.revisionNote}</span>
        </div>
      )}

      <PanelSection title="메타데이터">
        <dl>
          <Row label="강사">
            <span className="whitespace-nowrap">{c.instructor}</span> | <span className="whitespace-nowrap">{c.producer}</span>
          </Row>
          <Row label="주제, 난이도">
            {c.topic} | {c.level}
          </Row>
          <Row label="시리즈">{c.series}</Row>
          <Row label="회차">
            <span className="tabular-nums">
              {c.episodes.length}개 | {courseLength(c)}
            </span>
          </Row>
          <Row label="제작 방식">{c.productionMethod}</Row>
          <Row label="사용 도구">{c.tools.length ? c.tools.join(", ") : "없음"}</Row>
          <Row label="소개">
            <span className="eo-text-pretty text-[var(--eo-ink-2)]">{c.summary}</span>
          </Row>
        </dl>
      </PanelSection>

      <PanelSection title="자막, 권리자료">
        <ul className="space-y-1.5">
          {c.subtitles.map((s) => (
            <li key={s} className="flex items-center gap-2 text-[13px]">
              <Subtitles size={16} className="shrink-0 text-[var(--eo-ink-3)]" />
              <span className="flex-1">{s} 자막</span>
              <span className="text-[12px] text-[var(--eo-ink-3)]">SRT</span>
            </li>
          ))}
          {c.rightsFiles.map((f) => (
            <li key={f} className="flex items-center gap-2 text-[13px]">
              <FilePdf size={16} className="shrink-0 text-[var(--eo-ink-3)]" />
              <span className="min-w-0 flex-1 truncate">{f}</span>
              <span className="text-[12px] text-[var(--eo-ink-3)]">권리자료</span>
            </li>
          ))}
        </ul>
      </PanelSection>

      <PanelSection title={`제출 버전 v${c.version}, 검토 이력`}>
        {c.reviewLog.length ? (
          <Timeline
            items={[...c.reviewLog].reverse().map((r) => ({
              at: r.at,
              title: (
                <>
                  {r.action} <span className="font-normal text-[var(--eo-ink-3)]">| {r.who} | v{r.version}</span>
                </>
              ),
              note: r.note,
              tone: reviewTone(r.action),
            }))}
          />
        ) : (
          <p className="text-[13px] text-[var(--eo-ink-3)]">검토 이력이 없습니다</p>
        )}
      </PanelSection>
    </>
  );
}

function sameAccess(a: AccessSetting, b: AccessSetting) {
  return a.free === b.free && a.subscription === b.subscription && [...a.previewEpisodes].sort().join() === [...b.previewEpisodes].sort().join();
}

function AccessTab({ c, who, notify }: { c: Course; who: string; notify: (m: string) => void }) {
  const { updateCourse } = useStore();
  const [draft, setDraft] = useState<AccessSetting>(c.access);
  const dirty = !sameAccess(draft, c.access);
  const scope = draft.free ? "무료 공개" : "구독 전용";

  const togglePreview = (no: number) =>
    setDraft((d) => ({ ...d, previewEpisodes: d.previewEpisodes.includes(no) ? d.previewEpisodes.filter((n) => n !== no) : [...d.previewEpisodes, no].sort((a, b) => a - b) }));

  const save = () => {
    const note = draft.free
      ? "무료 공개"
      : `구독 전용, 미리보기 ${draft.previewEpisodes.length ? draft.previewEpisodes.map((n) => `${n}강`).join(", ") : "없음"}${draft.subscription ? "" : ", 구독 대상 제외"}`;
    updateCourse(c.id, { access: draft }, { who, action: "이용 설정 변경", note });
    notify("이용 설정을 저장했습니다. 사용자 화면 배지와 잠금에 바로 반영됩니다.");
  };

  return (
    <>
      <PanelSection title="이용 범위" aside={<AccessBadge scope={scope} tone="light" />}>
        <div className="divide-y divide-[var(--eo-line)]">
          <div className="flex items-center gap-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-medium">무료 공개</div>
              <div className="text-[12px] text-[var(--eo-ink-3)]">모든 회차를 무료 회원도 시청</div>
            </div>
            <Toggle
              size="sm"
              label="무료 공개"
              checked={draft.free}
              onChange={(v) => setDraft((d) => ({ ...d, free: v, subscription: v ? false : true, previewEpisodes: v ? [] : d.previewEpisodes.length ? d.previewEpisodes : [1] }))}
              onClassName="bg-[var(--eo-ink-btn)]"
              offClassName="bg-[var(--eo-line-2)]"
            />
          </div>
          <div className={`flex items-center gap-4 py-3 ${draft.free ? "pointer-events-none opacity-45" : ""}`}>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-medium">구독 대상</div>
              <div className="text-[12px] text-[var(--eo-ink-3)]">구독 회원은 전체 회차 시청</div>
            </div>
            <Toggle
              size="sm"
              label="구독 대상"
              checked={draft.subscription}
              onChange={(v) => setDraft((d) => ({ ...d, subscription: v }))}
              onClassName="bg-[var(--eo-ink-btn)]"
              offClassName="bg-[var(--eo-line-2)]"
            />
          </div>
        </div>
      </PanelSection>

      <PanelSection
        title="미리보기 회차"
        aside={!draft.free && <span className="text-[12px] tabular-nums text-[var(--eo-ink-3)]">{draft.previewEpisodes.length}개 선택</span>}
      >
        <ul className={draft.free ? "opacity-60" : ""}>
          {c.episodes.map((e) => {
            const on = !draft.free && draft.previewEpisodes.includes(e.no);
            return (
              <li key={e.no}>
                <button
                  type="button"
                  disabled={draft.free}
                  onClick={() => togglePreview(e.no)}
                  aria-pressed={on}
                  className="flex h-11 w-full items-center gap-3 rounded-[8px] px-2 text-left transition-colors hover:bg-[var(--eo-soft)] active:bg-[var(--eo-soft-2)] disabled:hover:bg-transparent"
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border ${
                      on ? "border-[var(--eo-ink-btn)] bg-[var(--eo-ink-btn)]" : "border-[var(--eo-line-2)] bg-white"
                    }`}
                  >
                    {on && <Check size={11} weight="bold" className="text-white" />}
                  </span>
                  <span className="w-8 shrink-0 text-[12px] tabular-nums text-[var(--eo-ink-3)]">{e.no}강</span>
                  <span className="min-w-0 flex-1 truncate text-[13px]">{e.title}</span>
                  <span className="shrink-0 text-[12px] tabular-nums text-[var(--eo-ink-3)]">{clock(e.seconds)}</span>
                  <span className="flex w-[64px] shrink-0 justify-end">
                    {draft.free ? (
                      <span className="text-[12px] text-[var(--eo-ink-3)]">무료</span>
                    ) : on ? (
                      <PreviewChip />
                    ) : (
                      <LockMark tone="light" size={14} />
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex items-center justify-end gap-2">
          {dirty && (
            <Button variant="ghost" onClick={() => setDraft(c.access)}>
              되돌리기
            </Button>
          )}
          <Button variant="primary" disabled={!dirty} onClick={save}>
            저장
          </Button>
        </div>
      </PanelSection>
    </>
  );
}

function TranscodeTab({ c, who, notify }: { c: Course; who: string; notify: (m: string) => void }) {
  const { updateCourse } = useStore();
  const [progress, setProgress] = useState<number | null>(null);

  useEffect(() => {
    if (progress === null) return;
    if (progress >= 100) {
      updateCourse(
        c.id,
        { transcode: "완료", outputs: { "1080p": "완료", "720p": "완료", "480p": "완료" }, transcodeNote: undefined },
        { who, action: "영상 재처리 완료", note: "1080p, 720p, 480p 출력 완료" },
      );
      notify("재처리를 마쳤습니다");
      return;
    }
    const t = window.setTimeout(() => setProgress((p) => (p === null ? null : Math.min(100, p + 9))), 140);
    return () => window.clearTimeout(t);
  }, [progress, c.id, updateCourse, who, notify]);

  const running = progress !== null && progress < 100;

  return (
    <>
      <PanelSection title="업로드 결과">
        <dl>
          <Row label="원본">
            <span className="tabular-nums">
              회차 {c.episodes.length}개 | {courseLength(c)}
            </span>
          </Row>
          <Row label="변환 상태">
            <StatusBadge tone={running ? "blue" : TRANSCODE_TONE[c.transcode]}>{running ? "변환 중" : c.transcode}</StatusBadge>
          </Row>
        </dl>
      </PanelSection>

      <PanelSection title="출력 화질">
        <ul className="divide-y divide-[var(--eo-line)]">
          {(Object.keys(QUALITY_SPEC) as Quality[]).map((q) => {
            const s = running && c.outputs[q] !== "완료" ? "변환 중" : c.outputs[q];
            return (
              <li key={q} className="flex items-center gap-3 py-2.5">
                <span className="w-12 shrink-0 text-[13px] font-semibold tabular-nums">{q}</span>
                <span className="min-w-0 flex-1 truncate text-[12px] tabular-nums text-[var(--eo-ink-3)]">{QUALITY_SPEC[q]}</span>
                <StatusBadge tone={TRANSCODE_TONE[s]}>{s}</StatusBadge>
              </li>
            );
          })}
        </ul>
        {running && <Progress value={progress ?? 0} tone="blue" className="mt-3" />}
      </PanelSection>

      {c.transcode === "실패" && (
        <PanelSection title="실패 원인">
          <div className="flex gap-2.5 rounded-[8px] bg-[var(--eo-red-bg)] px-3.5 py-3 text-[13px] text-[var(--eo-red-fg)]">
            <WarningCircle size={18} className="mt-px shrink-0" />
            <span>{c.transcodeNote ?? "원인 미기록"}</span>
          </div>
          <div className="mt-4 flex justify-end">
            <Button variant="primary" disabled={running} onClick={() => setProgress(0)}>
              {running ? "재처리 중" : "재처리"}
            </Button>
          </div>
        </PanelSection>
      )}
    </>
  );
}

function ProtectTab({ c }: { c: Course }) {
  const logs = [...c.licenseLog, ...(LICENSE_FAILURES[c.id] ?? [])].sort((a, b) => (a.at < b.at ? 1 : -1));
  const fails = logs.filter((l) => l.result === "실패").length;
  return (
    <>
      <PanelSection title="보호 설정">
        <dl className="divide-y divide-[var(--eo-line)]">
          <ProtectRow label="재생 권한 확인" value="적용" tone="green">
            재생 요청마다 구독 여부를 포함해 이 회원이 볼 수 있는지 확인
          </ProtectRow>
          <ProtectRow label="임시 재생 주소" value="적용" tone="green">
            주소 유효 120초, 세션당 재발급 3회. 주소의 사용 시간만 제한
          </ProtectRow>
          <ProtectRow label="DRM" value={c.drm} tone={c.drm === "적용" ? "green" : "gray"}>
            {c.drm === "적용" ? "암호화 영상의 재생 라이선스 발급을 통제. 화면 녹화, 외부 촬영까지 막지는 않음" : "공개 전 적용 예정"}
          </ProtectRow>
          <ProtectRow label="키, 토큰" value="미표시" tone="gray">
            라이선스 키와 재생 토큰 원문은 이 화면에 표시하지 않음
          </ProtectRow>
        </dl>
      </PanelSection>

      <PanelSection
        title="라이선스 요청 기록"
        aside={logs.length > 0 && <span className="text-[12px] tabular-nums text-[var(--eo-ink-3)]">실패 {fails} / 전체 {logs.length}</span>}
      >
        {logs.length === 0 ? (
          <p className="text-[13px] text-[var(--eo-ink-3)]">라이선스 요청 기록이 없습니다</p>
        ) : (
          <ul className="divide-y divide-[var(--eo-line)]">
            {logs.map((l, i) => (
              <li key={`${l.at}-${i}`} className="flex items-start gap-3 py-2.5">
                <StatusBadge tone={l.result === "성공" ? "green" : "red"}>{l.result}</StatusBadge>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <span className="text-[13px]">{l.env}</span>
                    <span className="whitespace-nowrap text-[12px] tabular-nums text-[var(--eo-ink-3)]">{l.at}</span>
                  </div>
                  {l.code && (
                    <div className="mt-0.5 text-[12px] text-[var(--eo-red-fg)]">
                      <span className="eo-mono">{l.code}</span> | {LICENSE_CODE_LABEL[l.code] ?? "오류"}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </PanelSection>
    </>
  );
}

function ProtectRow({ label, value, tone, children }: { label: string; value: string; tone: "green" | "gray"; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="min-w-0 flex-1">
        <dt className="text-[13px] font-medium text-[var(--eo-ink)]">{label}</dt>
        <dd className="mt-0.5 text-[12px] leading-[18px] text-[var(--eo-ink-2)]">{children}</dd>
      </div>
      <StatusBadge tone={tone}>{value}</StatusBadge>
    </div>
  );
}
