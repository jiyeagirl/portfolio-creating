"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, MagnifyingGlass, Play, Plus, WarningCircle, CircleNotch } from "@phosphor-icons/react";
import { useStore } from "@/projects/b2b/teefinder/lib/store";
import { REGIONS, TOTAL_COURSE_COUNT, runConfigTest, type TestResult } from "@/projects/b2b/teefinder/lib/mock-data";
import { Badge, collectTone } from "@/projects/b2b/teefinder/components/ui";
import type { CourseConfig, LoginKind, Region } from "@/projects/b2b/teefinder/lib/types";
import {
  Btn,
  FormField,
  PageHeader,
  SelectInput,
  TextInput,
} from "@/projects/b2b/teefinder/components/admin/admin-ui";

const BLANK: CourseConfig = {
  name: "",
  region: "경기",
  layouts: "",
  domain: "",
  loginKind: "일반",
  selId: "",
  selPw: "",
  selBtn: "",
  apiDate: "",
  apiTime: "",
  apiCourse: "",
  apiFee: "",
  bookingPattern: "",
};

export function CourseConfigScreen({
  selectedId,
  onSelect,
  autoRun = false,
}: {
  selectedId: string | "new";
  onSelect: (id: string | "new") => void;
  autoRun?: boolean;
}) {
  const { courses, configs, configHistory } = useStore();
  const [query, setQuery] = useState("");
  const list = useMemo(() => courses.filter((c) => c.name.includes(query.trim())), [courses, query]);

  return (
    <div>
      <PageHeader
        title="골프장 설정"
        meta={`총 ${TOTAL_COURSE_COUNT}곳 중 연동 ${courses.length}곳`}
        actions={
          <Btn kind="primary" onClick={() => onSelect("new")}>
            <Plus size={14} weight="bold" />
            골프장 추가
          </Btn>
        }
      />
      <div className="grid items-start gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-[8px] border border-[var(--tf-line)] bg-[var(--tf-surface)]">
          <label className="relative block border-b border-[var(--tf-line)] p-3">
            <span className="sr-only">골프장 검색</span>
            <MagnifyingGlass
              size={15}
              className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 text-[var(--tf-ink-3)]"
            />
            <TextInput value={query} onChange={setQuery} placeholder="골프장 이름" className="pl-9" />
          </label>
          <ul className="max-h-[640px] divide-y divide-[var(--tf-line)] overflow-y-auto">
            {list.map((c) => {
              const active = selectedId === c.id;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(c.id)}
                    aria-current={active ? "true" : undefined}
                    className={`flex h-[52px] w-full items-center gap-3 px-4 text-left transition-colors hover:bg-[var(--tf-canvas)] ${
                      active ? "bg-[var(--tf-soft)] hover:bg-[var(--tf-soft)]" : ""
                    }`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-medium">{c.name}</span>
                      <span className="block text-[12px] text-[var(--tf-ink-3)]">{c.region}</span>
                    </span>
                    <Badge tone={collectTone(c.status)} compact>
                      {c.status}
                    </Badge>
                  </button>
                </li>
              );
            })}
            {list.length === 0 && (
              <li className="px-4 py-10 text-center text-[13px] text-[var(--tf-ink-3)]">검색 결과가 없습니다</li>
            )}
          </ul>
        </div>

        <ConfigForm
          key={selectedId}
          courseId={selectedId}
          initial={selectedId === "new" ? BLANK : (configs[selectedId] ?? BLANK)}
          history={configHistory.filter((h) => h.courseId === selectedId)}
          onSaved={onSelect}
          autoRun={autoRun}
        />
      </div>
    </div>
  );
}

function ConfigForm({
  courseId,
  initial,
  history,
  onSaved,
  autoRun,
}: {
  courseId: string | "new";
  initial: CourseConfig;
  history: Array<{ at: string; note: string }>;
  onSaved: (id: string) => void;
  autoRun: boolean;
}) {
  const { courses, saveConfig, addCourse } = useStore();
  const course = courseId === "new" ? null : (courses.find((c) => c.id === courseId) ?? null);
  const [draft, setDraft] = useState<CourseConfig>(initial);
  const [tried, setTried] = useState(false);
  const [saved, setSaved] = useState(false);
  const [running, setRunning] = useState(false);
  /* ?test=run 으로 열면 시험 실행이 끝난 상태로 시작한다(스크린샷용) */
  const preset = autoRun && course ? runConfigTest(course, initial) : null;
  const [visible, setVisible] = useState(preset ? preset.steps.length : 0);
  const [result, setResult] = useState<TestResult | null>(preset);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);

  function set<K extends keyof CourseConfig>(key: K, value: CourseConfig[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
    setSaved(false);
  }

  const selBroken = course?.status === "오류" && draft.selId !== "#userId";
  const nameError = tried && draft.name.trim() === "" ? "이름을 입력해 주세요" : undefined;
  const domainError = tried && draft.domain.trim() === "" ? "도메인 URL을 입력해 주세요" : undefined;

  function runTest() {
    timers.current.forEach(clearTimeout);
    setRunning(true);
    setVisible(0);
    const next = course
      ? runConfigTest(course, draft)
      : runConfigTest(
          {
            id: "new",
            name: draft.name,
            region: draft.region,
            layouts: ["레이크", "힐"],
            loginKind: draft.loginKind,
            status: "점검 필요",
            domain: draft.domain,
            successRate: 0,
            lastSuccess: "수집 전",
          },
          draft,
        );
    setResult(next);
    next.steps.forEach((_, i) => {
      timers.current.push(
        setTimeout(() => {
          setVisible(i + 1);
          if (i === next.steps.length - 1) setRunning(false);
        }, 700 * (i + 1)),
      );
    });
  }

  function save() {
    setTried(true);
    if (draft.name.trim() === "" || draft.domain.trim() === "") return;
    if (course) {
      saveConfig(course.id, draft);
      setSaved(true);
    } else {
      const id = addCourse(draft);
      onSaved(id);
    }
  }

  return (
    <div className="space-y-5">
      <section className="rounded-[8px] border border-[var(--tf-line)] bg-[var(--tf-surface)]">
        <div className="flex h-12 items-center justify-between border-b border-[var(--tf-line)] px-5">
          <h2 className="text-[14px] font-semibold">{course ? course.name : "새 골프장"}</h2>
          {course && (
            <Badge tone={collectTone(course.status)} compact>
              {course.status}
            </Badge>
          )}
        </div>

        <div className="space-y-6 p-5">
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="mb-3 text-[13px] font-semibold">기본 정보</legend>
            <FormField label="골프장 이름" required error={nameError}>
              <TextInput value={draft.name} onChange={(v) => set("name", v)} />
            </FormField>
            <FormField label="지역">
              <SelectInput
                label="지역"
                value={draft.region}
                onChange={(v) => set("region", v as Region)}
                options={REGIONS.map((r) => ({ value: r, label: r }))}
              />
            </FormField>
            <FormField label="코스 구성" className="sm:col-span-2">
              <TextInput value={draft.layouts} onChange={(v) => set("layouts", v)} placeholder="레이크, 힐, 밸리" />
            </FormField>
          </fieldset>

          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="mb-3 text-[13px] font-semibold">접속</legend>
            <FormField label="도메인 URL" required error={domainError}>
              <TextInput value={draft.domain} onChange={(v) => set("domain", v)} mono />
            </FormField>
            <FormField label="로그인 방식">
              <SelectInput
                label="로그인 방식"
                value={draft.loginKind}
                onChange={(v) => set("loginKind", v as LoginKind)}
                options={[
                  { value: "일반", label: "일반" },
                  { value: "보안문자", label: "보안문자" },
                ]}
              />
            </FormField>
          </fieldset>

          <fieldset className="grid gap-4 sm:grid-cols-3">
            <legend className="mb-3 text-[13px] font-semibold">로그인 Form Selector</legend>
            <FormField label="아이디 입력">
              <TextInput value={draft.selId} onChange={(v) => set("selId", v)} mono invalid={selBroken} />
            </FormField>
            <FormField label="비밀번호 입력">
              <TextInput value={draft.selPw} onChange={(v) => set("selPw", v)} mono />
            </FormField>
            <FormField label="로그인 버튼">
              <TextInput value={draft.selBtn} onChange={(v) => set("selBtn", v)} mono invalid={selBroken} />
            </FormField>
          </fieldset>

          <fieldset className="grid gap-4 sm:grid-cols-4">
            <legend className="mb-3 text-[13px] font-semibold">티타임 API 파라미터 매핑</legend>
            <FormField label="날짜">
              <TextInput value={draft.apiDate} onChange={(v) => set("apiDate", v)} mono />
            </FormField>
            <FormField label="시간">
              <TextInput value={draft.apiTime} onChange={(v) => set("apiTime", v)} mono />
            </FormField>
            <FormField label="코스">
              <TextInput value={draft.apiCourse} onChange={(v) => set("apiCourse", v)} mono />
            </FormField>
            <FormField label="그린피">
              <TextInput value={draft.apiFee} onChange={(v) => set("apiFee", v)} mono />
            </FormField>
          </fieldset>

          <FormField label="예약 페이지 이동 URL 패턴">
            <TextInput value={draft.bookingPattern} onChange={(v) => set("bookingPattern", v)} mono />
          </FormField>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[var(--tf-line)] px-5 py-3">
          <span className="text-[12.5px] font-medium text-[var(--tf-green-fg)]">{saved ? "저장했습니다" : ""}</span>
          <div className="flex gap-2">
            <Btn onClick={runTest} disabled={running}>
              <Play size={14} weight="fill" />
              설정 시험 실행
            </Btn>
            <Btn kind="primary" onClick={save}>
              {course ? "저장" : "골프장 추가"}
            </Btn>
          </div>
        </div>
      </section>

      {result && (
        <section className="rounded-[8px] border border-[var(--tf-line)] bg-[var(--tf-surface)]">
          <div className="flex h-12 items-center border-b border-[var(--tf-line)] px-5">
            <h2 className="text-[14px] font-semibold">시험 실행 결과</h2>
          </div>
          <ol className="divide-y divide-[var(--tf-line)]">
            {result.steps.map((s, i) => {
              const shown = i < visible;
              const current = i === visible && running;
              return (
                <li key={s.label} className="flex items-start gap-3 px-5 py-3 text-[13px]">
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                      !shown
                        ? "bg-[var(--tf-soft)] text-[var(--tf-ink-3)]"
                        : s.ok
                          ? "bg-[var(--tf-green-bg)] text-[var(--tf-green-fg)]"
                          : "bg-[var(--tf-red-bg)] text-[var(--tf-red-fg)]"
                    }`}
                  >
                    {!shown ? (
                      current ? <CircleNotch size={12} className="animate-spin" /> : <span className="text-[11px]">{i + 1}</span>
                    ) : s.ok ? (
                      <Check size={12} weight="bold" />
                    ) : (
                      <WarningCircle size={14} weight="fill" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{s.label}</p>
                    {shown && (
                      <p className={`mt-0.5 ${s.ok ? "text-[var(--tf-ink-2)]" : "text-[var(--tf-red-fg)]"}`}>{s.message}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
          {visible >= result.steps.length && result.preview.length > 0 && (
            <div className="border-t border-[var(--tf-line)] px-5 py-4">
              <p className="mb-2 text-[12.5px] font-medium text-[var(--tf-ink-3)]">파싱 미리보기</p>
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-left text-[12px] text-[var(--tf-ink-3)]">
                    <th className="pb-1.5 font-medium">시간</th>
                    <th className="pb-1.5 font-medium">코스</th>
                    <th className="pb-1.5 text-right font-medium">그린피 (원)</th>
                    <th className="pb-1.5 text-right font-medium">상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--tf-line)]">
                  {result.preview.map((p) => (
                    <tr key={p.time}>
                      <td className="py-2 tabular-nums">{p.time}</td>
                      <td className="py-2">{p.layout}</td>
                      <td className="py-2 text-right tabular-nums">{p.fee}</td>
                      <td className="py-2 text-right text-[var(--tf-ink-2)]">{p.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {history.length > 0 && (
        <section className="rounded-[8px] border border-[var(--tf-line)] bg-[var(--tf-surface)]">
          <div className="flex h-12 items-center border-b border-[var(--tf-line)] px-5">
            <h2 className="text-[14px] font-semibold">변경 이력</h2>
          </div>
          <ul className="divide-y divide-[var(--tf-line)]">
            {history.map((h, i) => (
              <li key={`${h.at}-${i}`} className="flex gap-4 px-5 py-2.5 text-[13px]">
                <span className="w-[96px] shrink-0 tabular-nums text-[var(--tf-ink-3)]">{h.at}</span>
                <span className="min-w-0 flex-1">{h.note}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
