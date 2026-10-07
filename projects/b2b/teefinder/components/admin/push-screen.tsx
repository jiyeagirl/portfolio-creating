"use client";

import { useMemo, useState } from "react";
import { PaperPlaneTilt, Golf } from "@phosphor-icons/react";
import { useStore } from "@/projects/b2b/teefinder/lib/store";
import { REGIONS, getCourse } from "@/projects/b2b/teefinder/lib/mock-data";
import type { Region } from "@/projects/b2b/teefinder/lib/types";
import {
  Btn,
  FormField,
  PageHeader,
  SelectInput,
  TableShell,
  Td,
  TextArea,
  TextInput,
  Th,
} from "@/projects/b2b/teefinder/components/admin/admin-ui";

type TargetKind = "all" | "region" | "course";

export function PushScreen() {
  const { members, courses, pushHistory, sendPush } = useStore();
  const [kind, setKind] = useState<TargetKind>("all");
  const [region, setRegion] = useState<Region>("경기");
  const [courseId, setCourseId] = useState("c01");
  const [title, setTitle] = useState("경기권 취소티 알림 개선");
  const [body, setBody] = useState("경기 지역 골프장의 취소티 감지 주기를 단축했어요.");
  const [tried, setTried] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const active = members.filter((m) => m.status === "정상");

  const { count, label } = useMemo(() => {
    if (kind === "all") return { count: active.length, label: "전체" };
    if (kind === "region") {
      const ids = courses.filter((c) => c.region === region).map((c) => c.id);
      return {
        count: active.filter((m) => m.favoriteCourseIds.some((id) => ids.includes(id))).length,
        label: `${region} 즐겨찾기`,
      };
    }
    return {
      count: active.filter((m) => m.favoriteCourseIds.includes(courseId)).length,
      label: `${getCourse(courseId).name} 즐겨찾기`,
    };
  }, [kind, region, courseId, active, courses]);

  const titleError = tried && title.trim() === "" ? "제목을 입력해 주세요" : undefined;
  const bodyError = tried && body.trim() === "" ? "본문을 입력해 주세요" : undefined;

  function send() {
    setTried(true);
    if (title.trim() === "" || body.trim() === "" || count === 0) return;
    sendPush({ target: label, title: title.trim(), body: body.trim(), recipients: count });
    setToast(`${count}명에게 발송했습니다. 회원 앱 알림함에 공지로 표시됩니다.`);
    setTitle("");
    setBody("");
    setTried(false);
    setTimeout(() => setToast(null), 3600);
  }

  return (
    <div>
      <PageHeader title="푸시 발송" />

      {toast && (
        <div
          role="status"
          className="tf-slide mb-4 rounded-[6px] bg-[var(--tf-green-bg)] px-4 py-2.5 text-[13px] font-medium text-[var(--tf-green-fg)]"
        >
          {toast}
        </div>
      )}

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className="rounded-[8px] border border-[var(--tf-line)] bg-[var(--tf-surface)]">
          <div className="flex h-12 items-center border-b border-[var(--tf-line)] px-5">
            <h2 className="text-[14px] font-semibold">발송 내용</h2>
          </div>
          <div className="space-y-4 p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="수신 대상">
                <SelectInput
                  label="수신 대상"
                  value={kind}
                  onChange={(v) => setKind(v as TargetKind)}
                  options={[
                    { value: "all", label: "전체 회원" },
                    { value: "region", label: "지역별 즐겨찾기 회원" },
                    { value: "course", label: "골프장별 즐겨찾기 회원" },
                  ]}
                />
              </FormField>
              {kind === "region" && (
                <FormField label="지역">
                  <SelectInput
                    label="지역"
                    value={region}
                    onChange={(v) => setRegion(v as Region)}
                    options={REGIONS.map((r) => ({ value: r, label: r }))}
                  />
                </FormField>
              )}
              {kind === "course" && (
                <FormField label="골프장">
                  <SelectInput
                    label="골프장"
                    value={courseId}
                    onChange={setCourseId}
                    options={courses.map((c) => ({ value: c.id, label: c.name }))}
                  />
                </FormField>
              )}
            </div>
            <FormField label="제목" required error={titleError}>
              <TextInput value={title} onChange={setTitle} placeholder="알림 제목" />
            </FormField>
            <FormField label="본문" required error={bodyError}>
              <TextArea value={body} onChange={setBody} rows={4} placeholder="알림 본문" />
            </FormField>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-[var(--tf-line)] px-5 py-3">
            <p className="text-[13px] text-[var(--tf-ink-2)]">
              수신 대상{" "}
              <span className="font-semibold tabular-nums text-[var(--tf-ink)]">{count}</span>명
              {count === 0 && <span className="ml-2 text-[var(--tf-red-fg)]">대상 회원이 없습니다</span>}
            </p>
            <Btn kind="primary" onClick={send} disabled={count === 0}>
              <PaperPlaneTilt size={14} weight="fill" />
              발송
            </Btn>
          </div>
        </section>

        <div className="mx-auto w-[260px] rounded-[32px] border border-[var(--tf-line)] bg-[var(--tf-rail)] p-3">
          <div className="rounded-[22px] bg-[var(--tf-surface)] px-3 pb-5 pt-6">
            <p className="text-center text-[34px] font-semibold leading-none tracking-[-0.03em] tabular-nums">10:24</p>
            <p className="mt-1.5 text-center text-[12.5px] text-[var(--tf-ink-3)]">10월 7일 수요일</p>
            <div className="mt-6 rounded-[14px] border border-[var(--tf-line)] bg-[var(--tf-surface)] px-3 py-2.5 shadow-[var(--tf-sheet-shadow)]">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-[var(--tf-brand)] text-white">
                  <Golf size={14} weight="fill" />
                </span>
                <span className="text-[12px] text-[var(--tf-ink-3)]">TeeFinder</span>
                <span className="ml-auto text-[12px] text-[var(--tf-ink-3)]">지금</span>
              </div>
              <p className="mt-1.5 break-words text-[14px] font-semibold leading-5 tracking-[-0.01em]">
                {title.trim() === "" ? "제목 없음" : title}
              </p>
              <p className="mt-0.5 line-clamp-4 break-words text-[13px] leading-[19px] text-[var(--tf-ink-2)]">
                {body.trim() === "" ? "본문 없음" : body}
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-6">
        <h2 className="pb-3 text-[14px] font-semibold">발송 이력</h2>
        <TableShell minWidth={720}>
          <thead>
            <tr>
              <Th width={128}>발송 일시</Th>
              <Th width={190}>대상</Th>
              <Th width={460}>제목</Th>
              <Th align="right">수신 (명)</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--tf-line)]">
            {pushHistory.map((p) => (
              <tr key={p.id}>
                <Td className="whitespace-nowrap tabular-nums text-[var(--tf-ink-2)]">{p.at}</Td>
                <Td className="whitespace-nowrap">{p.target}</Td>
                <Td>
                  <div className="max-w-[420px] truncate font-medium" title={p.title}>
                    {p.title}
                  </div>
                  <div className="mt-0.5 max-w-[420px] truncate text-[12px] text-[var(--tf-ink-3)]" title={p.body}>
                    {p.body}
                  </div>
                </Td>
                <Td align="right">{p.recipients}</Td>
              </tr>
            ))}
          </tbody>
        </TableShell>
      </section>
    </div>
  );
}
