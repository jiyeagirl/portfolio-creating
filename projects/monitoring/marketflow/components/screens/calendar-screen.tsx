"use client";

import { useMemo, useState } from "react";
import { CaretLeft, CaretRight, DotsSixVertical } from "@phosphor-icons/react";
import { Badge, Card, ContentThumb, Field, PageHead, SearchInput, Segmented, Select } from "@/projects/monitoring/marketflow/components/ui";
import { contentItems, customers } from "@/projects/monitoring/marketflow/lib/mock-data";
import { CONTENT_TYPE_LABEL, STATUS_LABEL, STATUS_TONE } from "@/projects/monitoring/marketflow/lib/navigation";
import type { ContentItem } from "@/projects/monitoring/marketflow/lib/types";

type ViewMode = "month" | "week" | "day";

const VIEW_ITEMS: { key: ViewMode; label: string }[] = [
  { key: "month", label: "월" },
  { key: "week", label: "주" },
  { key: "day", label: "일" },
];

const ASSIGNEES = ["전체", ...Array.from(new Set(contentItems.map((c) => c.assignee)))];
const STATUS_OPTIONS = ["전체", "초안", "승인대기", "예약", "발행완료", "반려"];

function baseDate(item: ContentItem) {
  return (item.scheduledAt ?? item.publishedAt ?? item.createdAt).slice(0, 10);
}

const MONTH_LABEL = "2025년 9월";
const FIRST_WEEKDAY = 1; // 2025-09-01 은 월요일
const DAYS_IN_MONTH = 30;
const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];

export function CalendarScreen() {
  const [view, setView] = useState<ViewMode>("month");
  const [search, setSearch] = useState("");
  const [assignee, setAssignee] = useState("전체");
  const [status, setStatus] = useState("전체");
  const [focusDay, setFocusDay] = useState(8);
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const dated = useMemo(
    () => contentItems.map((item) => ({ item, date: overrides[item.id] ?? baseDate(item) })),
    [overrides],
  );

  const filtered = useMemo(
    () =>
      dated.filter(({ item }) => {
        if (search && !item.title.includes(search)) return false;
        if (assignee !== "전체" && item.assignee !== assignee) return false;
        if (status !== "전체" && STATUS_LABEL[item.status] !== status) return false;
        return true;
      }),
    [dated, search, assignee, status],
  );

  const byDay = useMemo(() => {
    const map = new Map<number, { item: ContentItem; date: string }[]>();
    filtered.forEach((entry) => {
      if (!entry.date.startsWith("2025-09")) return;
      const day = Number(entry.date.slice(8, 10));
      const list = map.get(day) ?? [];
      list.push(entry);
      map.set(day, list);
    });
    return map;
  }, [filtered]);

  function handleDrop(day: number) {
    if (!draggedId) return;
    const target = filtered.find((e) => e.item.id === draggedId);
    if (!target) return;
    const newDate = `2025-09-${String(day).padStart(2, "0")}`;
    setOverrides((prev) => ({ ...prev, [draggedId]: newDate }));
    setToast(`"${target.item.title}"의 일정을 9월 ${day}일로 변경했습니다.`);
    setDraggedId(null);
    window.setTimeout(() => setToast(null), 2600);
  }

  const cells: (number | null)[] = [
    ...Array.from({ length: FIRST_WEEKDAY - 1 }, () => null),
    ...Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="mf-enter flex flex-col gap-6">
      <PageHead
        eyebrow="CONTENT CALENDAR"
        title="콘텐츠 캘린더"
        desc="예약 발행 일정을 한눈에 확인하고, 카드를 드래그해 발행일을 변경할 수 있습니다."
        actions={<Segmented value={view} items={VIEW_ITEMS} onChange={setView} />}
      />

      <Card padded={false} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:gap-4">
        <div className="flex-1">
          <Field label="검색">
            <SearchInput value={search} onChange={setSearch} placeholder="콘텐츠 제목 검색" />
          </Field>
        </div>
        <div className="w-full sm:w-[180px]">
          <Field label="담당자">
            <Select value={assignee} options={ASSIGNEES} onChange={setAssignee} />
          </Field>
        </div>
        <div className="w-full sm:w-[160px]">
          <Field label="상태">
            <Select value={status} options={STATUS_OPTIONS} onChange={setStatus} />
          </Field>
        </div>
      </Card>

      {toast && (
        <p className="mf-enter rounded-[6px] bg-[var(--mf-info-soft)] px-4 py-2.5 text-[13px] text-[var(--mf-info-deep)]">
          {toast}
        </p>
      )}

      {view === "month" && (
        <Card padded={false} className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--mf-hairline)] px-5 py-4">
            <div className="flex items-center gap-2">
              <button type="button" aria-label="이전 달" className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--mf-hairline)] text-[var(--mf-body)] hover:bg-[var(--mf-soft)]">
                <CaretLeft size={13} />
              </button>
              <p className="text-[15px] font-semibold text-[var(--mf-ink)]">{MONTH_LABEL}</p>
              <button type="button" aria-label="다음 달" className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--mf-hairline)] text-[var(--mf-body)] hover:bg-[var(--mf-soft)]">
                <CaretRight size={13} />
              </button>
            </div>
            <p className="text-[12px] text-[var(--mf-mute)]">카드를 드래그해 날짜 칸에 놓으면 일정이 변경됩니다</p>
          </div>

          <div className="grid grid-cols-7 border-b border-[var(--mf-hairline)] bg-[var(--mf-soft)]">
            {WEEKDAYS.map((w) => (
              <div key={w} className="px-2 py-2 text-center text-[11.5px] font-medium text-[var(--mf-mute)]">
                {w}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {cells.map((day, index) => {
              const entries = day ? (byDay.get(day) ?? []) : [];
              const isToday = day === 8;
              return (
                <div
                  key={index}
                  onDragOver={(e) => day && e.preventDefault()}
                  onDrop={() => day && handleDrop(day)}
                  className={`min-h-[104px] border-b border-r border-[var(--mf-hairline)] p-1.5 [&:nth-child(7n)]:border-r-0 ${
                    day ? "bg-[var(--mf-canvas)]" : "bg-[var(--mf-soft)]"
                  }`}
                >
                  {day && (
                    <>
                      <p
                        className={`mf-mono mb-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${
                          isToday ? "bg-[var(--mf-primary)] font-medium text-white" : "text-[var(--mf-mute)]"
                        }`}
                      >
                        {day}
                      </p>
                      <div className="flex flex-col gap-1">
                        {entries.slice(0, 3).map(({ item }) => (
                          <div
                            key={item.id}
                            draggable={item.status !== "published" && item.status !== "rejected"}
                            onDragStart={() => setDraggedId(item.id)}
                            className={`group flex items-center gap-1 truncate rounded-[4px] border border-[var(--mf-hairline)] bg-[var(--mf-soft)] px-1.5 py-1 text-[10.5px] leading-3 text-[var(--mf-body)] ${
                              item.status !== "published" && item.status !== "rejected" ? "cursor-grab active:cursor-grabbing" : ""
                            }`}
                            title={item.title}
                          >
                            {item.status !== "published" && item.status !== "rejected" && (
                              <DotsSixVertical size={10} className="shrink-0 text-[var(--mf-mute)] opacity-0 group-hover:opacity-100" />
                            )}
                            <span
                              className="h-1.5 w-1.5 shrink-0 rounded-full"
                              style={{
                                background:
                                  item.status === "published"
                                    ? "var(--mf-primary)"
                                    : item.status === "scheduled"
                                      ? "var(--mf-info)"
                                      : item.status === "pending"
                                        ? "var(--mf-warn)"
                                        : item.status === "rejected"
                                          ? "var(--mf-danger)"
                                          : "var(--mf-mute)",
                              }}
                            />
                            <span className="truncate">{item.title}</span>
                          </div>
                        ))}
                        {entries.length > 3 && (
                          <p className="px-1 text-[10px] text-[var(--mf-mute)]">+{entries.length - 3}건 더보기</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {view !== "month" && (
        <Card padded={false}>
          <div className="flex items-center justify-between border-b border-[var(--mf-hairline)] px-5 py-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="이전"
                onClick={() => setFocusDay((d) => Math.max(1, d - (view === "week" ? 7 : 1)))}
                className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--mf-hairline)] text-[var(--mf-body)] hover:bg-[var(--mf-soft)]"
              >
                <CaretLeft size={13} />
              </button>
              <p className="text-[15px] font-semibold text-[var(--mf-ink)]">
                {view === "week" ? `9월 ${Math.max(1, focusDay - 3)}일 ~ ${Math.min(30, focusDay + 3)}일` : `9월 ${focusDay}일`}
              </p>
              <button
                type="button"
                aria-label="다음"
                onClick={() => setFocusDay((d) => Math.min(30, d + (view === "week" ? 7 : 1)))}
                className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[var(--mf-hairline)] text-[var(--mf-body)] hover:bg-[var(--mf-soft)]"
              >
                <CaretRight size={13} />
              </button>
            </div>
          </div>

          <div className="divide-y divide-[var(--mf-hairline)]">
            {(() => {
              const range =
                view === "week"
                  ? Array.from({ length: 7 }, (_, i) => Math.max(1, focusDay - 3) + i).filter((d) => d <= 30)
                  : [focusDay];
              return range.map((day) => {
                const entries = byDay.get(day) ?? [];
                return (
                  <div key={day} className="flex flex-col gap-2 p-5">
                    <p className="text-[13px] font-medium text-[var(--mf-ink)]">9월 {day}일</p>
                    {entries.length === 0 ? (
                      <p className="text-[12.5px] text-[var(--mf-mute)]">예정된 콘텐츠가 없습니다</p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {entries.map(({ item }) => {
                          const customer = customers.find((c) => c.id === item.customerId);
                          return (
                            <div key={item.id} className="flex items-center gap-3 rounded-[6px] border border-[var(--mf-hairline)] p-3">
                              <ContentThumb photo={item.thumbnail} title={item.title} size={36} />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-[13px] font-medium text-[var(--mf-ink)]">{item.title}</p>
                                <p className="mt-0.5 text-[12px] text-[var(--mf-mute)]">
                                  {customer?.name} | {CONTENT_TYPE_LABEL[item.type]} | {item.channels.join(", ")} | {item.assignee}
                                </p>
                              </div>
                              <Badge tone={STATUS_TONE[item.status]}>{STATUS_LABEL[item.status]}</Badge>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        </Card>
      )}
    </div>
  );
}
