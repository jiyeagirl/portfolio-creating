"use client";

import { useState } from "react";
import { BellRinging, Plus, Trash } from "@phosphor-icons/react";
import { Toggle } from "@/components/shared/toggle";
import { getCourse } from "@/projects/b2b/teefinder/lib/mock-data";
import { addDays, formatFee, formatLongDate, TODAY } from "@/projects/b2b/teefinder/lib/format";
import { useStore } from "@/projects/b2b/teefinder/lib/store";
import {
  EmptyLine,
  Field,
  PrimaryButton,
  Segmented,
  SelectField,
  Sheet,
} from "@/projects/b2b/teefinder/components/app/app-ui";
import { Badge } from "@/projects/b2b/teefinder/components/ui";
import type { AlertCondition, CourseLayout } from "@/projects/b2b/teefinder/lib/types";

export interface AlertPrefill {
  courseId: string;
  date: string;
}

type SubTab = "conditions" | "inbox";

export function AlertsScreen({
  initialTab = "conditions",
  prefill,
  onPrefillConsumed,
  onOpenSlot,
}: {
  initialTab?: SubTab;
  prefill: AlertPrefill | null;
  onPrefillConsumed: () => void;
  onOpenSlot: (s: { courseId: string; date: string; time: string; layout: CourseLayout }) => void;
}) {
  const {
    conditions,
    inbox,
    toggleCondition,
    deleteCondition,
    markRead,
    markAllRead,
    triggerDemoPush,
    demoPushLeft,
  } = useStore();
  const [tab, setTab] = useState<SubTab>(prefill ? "conditions" : initialTab);
  const [formOpen, setFormOpen] = useState(prefill !== null);
  const unread = inbox.filter((i) => !i.read).length;

  return (
    <div className="relative flex h-full flex-col bg-[var(--tf-canvas)]">
      <header className="border-b border-[var(--tf-line)] bg-[var(--tf-surface)] pt-[59px]">
        <div className="flex h-14 items-end justify-between px-5 pb-2">
          <h1 className="text-[24px] font-bold tracking-[-0.02em]">알림</h1>
          {tab === "inbox" && unread > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="tf-press h-11 pb-1 text-[15px] font-medium text-[var(--tf-ink-2)] underline underline-offset-4"
            >
              모두 읽음
            </button>
          )}
        </div>
        <div className="px-5 pb-3 pt-1">
          <Segmented
            value={tab}
            onChange={setTab}
            options={[
              { value: "conditions", label: "내 조건" },
              { value: "inbox", label: unread > 0 ? `알림함 ${unread}` : "알림함" },
            ]}
          />
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {tab === "conditions" && (
          <div className="pb-6">
            {conditions.length === 0 ? (
              <EmptyLine text="등록한 알림 조건이 없어요" action="조건 추가" onAction={() => setFormOpen(true)} />
            ) : (
              <ul className="divide-y divide-[var(--tf-line)] bg-[var(--tf-surface)]">
                {conditions.map((c) => (
                  <ConditionRow
                    key={c.id}
                    cond={c}
                    onToggle={() => toggleCondition(c.id)}
                    onDelete={() => deleteCondition(c.id)}
                  />
                ))}
              </ul>
            )}
            <div className="space-y-3 px-5 pt-5">
              <PrimaryButton onClick={() => setFormOpen(true)}>
                <Plus size={20} weight="bold" />
                조건 추가
              </PrimaryButton>
              <DemoPushButton onClick={triggerDemoPush} disabled={demoPushLeft === 0} />
            </div>
          </div>
        )}

        {tab === "inbox" && (
          <div className="pb-6">
            {inbox.length === 0 ? (
              <EmptyLine text="받은 알림이 없어요" />
            ) : (
              <ul className="divide-y divide-[var(--tf-line)] bg-[var(--tf-surface)]">
                {inbox.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        markRead(item.id);
                        if (item.kind === "취소티" && item.courseId && item.date && item.time) {
                          onOpenSlot({
                            courseId: item.courseId,
                            date: item.date,
                            time: item.time,
                            layout: "레이크",
                          });
                        }
                      }}
                      className="tf-press flex w-full gap-3 px-5 py-4 text-left active:bg-[var(--tf-soft)]"
                    >
                      <span className="flex w-2 shrink-0 pt-2">
                        {!item.read && <span className="h-2 w-2 rounded-full bg-[var(--tf-blue)]" aria-label="읽지 않음" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <Badge tone={item.kind === "취소티" ? "blueSolid" : "gray"} compact>
                            {item.kind}
                          </Badge>
                          <span className="text-[13px] text-[var(--tf-ink-3)]">{item.at}</span>
                        </span>
                        <span
                          className={`mt-1.5 block text-[16px] tracking-[-0.01em] ${
                            item.read ? "font-medium text-[var(--tf-ink-2)]" : "font-semibold"
                          }`}
                        >
                          {item.title}
                        </span>
                        <span className="mt-0.5 block text-[14px] leading-[21px] text-[var(--tf-ink-2)]">
                          {item.body}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="px-5 pt-5">
              <DemoPushButton onClick={triggerDemoPush} disabled={demoPushLeft === 0} />
            </div>
          </div>
        )}
      </div>

      {formOpen && (
        <ConditionSheet
          prefill={prefill}
          onClose={() => {
            setFormOpen(false);
            onPrefillConsumed();
          }}
        />
      )}
    </div>
  );
}

function DemoPushButton({ onClick, disabled }: { onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="tf-press mx-auto flex h-11 items-center gap-2 rounded-[10px] bg-[var(--tf-soft)] px-4 text-[14px] font-medium text-[var(--tf-ink-2)] active:bg-[var(--tf-pressed)] disabled:cursor-not-allowed disabled:text-[var(--tf-ink-3)]"
    >
      <BellRinging size={18} />
      {disabled ? "(시연) 새 취소티가 없어요" : "(시연) 취소티 푸시 도착"}
    </button>
  );
}

function ConditionRow({
  cond,
  onToggle,
  onDelete,
}: {
  cond: AlertCondition;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const course = getCourse(cond.courseId);
  return (
    <li className="flex items-center gap-3 py-3 pl-5 pr-2">
      <div className={`min-w-0 flex-1 ${cond.enabled ? "" : "opacity-60"}`}>
        <p className="truncate text-[16px] font-semibold tracking-[-0.01em]">{course.name}</p>
        <p className="mt-0.5 text-[14px] text-[var(--tf-ink-2)]">
          {formatLongDate(cond.date)} {cond.timeBand}
        </p>
        <p className="text-[14px] text-[var(--tf-ink-3)]">최대 {formatFee(cond.maxFee)}</p>
      </div>
      <div className="flex h-11 items-center">
        <Toggle
          checked={cond.enabled}
          onChange={onToggle}
          label={`${course.name} 알림 ${cond.enabled ? "끄기" : "켜기"}`}
          size="lg"
          onClassName="bg-[var(--tf-brand)]"
          offClassName="bg-[var(--tf-pressed)]"
        />
      </div>
      <button
        type="button"
        onClick={onDelete}
        aria-label={`${course.name} 조건 삭제`}
        className="tf-press flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--tf-ink-3)] active:bg-[var(--tf-soft)]"
      >
        <Trash size={20} />
      </button>
    </li>
  );
}

function ConditionSheet({ prefill, onClose }: { prefill: AlertPrefill | null; onClose: () => void }) {
  const { courses, addCondition } = useStore();
  const [courseId, setCourseId] = useState(prefill?.courseId ?? courses[0].id);
  const [date, setDate] = useState(prefill?.date ?? addDays(TODAY, 1));
  const [band, setBand] = useState<AlertCondition["timeBand"]>("전체");
  const [maxFee, setMaxFee] = useState("250000");
  const fee = Number(maxFee.replace(/\D/g, ""));

  return (
    <Sheet title="알림 조건 추가" onClose={onClose}>
      <div className="space-y-4">
        <SelectField
          label="골프장"
          value={courseId}
          onChange={setCourseId}
          options={courses.map((c) => ({ value: c.id, label: c.name }))}
        />
        <SelectField
          label="날짜"
          value={date}
          onChange={setDate}
          options={Array.from({ length: 14 }, (_, i) => {
            const d = addDays(TODAY, i);
            return { value: d, label: formatLongDate(d) };
          })}
        />
        <div>
          <span className="mb-1.5 block text-[13px] font-medium text-[var(--tf-ink-2)]">시간대</span>
          <Segmented
            value={band}
            onChange={setBand}
            options={[
              { value: "전체", label: "전체" },
              { value: "오전", label: "오전" },
              { value: "오후", label: "오후" },
            ]}
          />
        </div>
        <Field label="최대 그린피 (원)" value={maxFee} onChange={setMaxFee} inputMode="numeric" />
        <PrimaryButton
          disabled={fee < 50000}
          onClick={() => {
            addCondition({ courseId, date, timeBand: band, maxFee: fee });
            onClose();
          }}
        >
          조건 저장
        </PrimaryButton>
      </div>
    </Sheet>
  );
}
