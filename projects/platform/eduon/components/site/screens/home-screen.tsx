"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowCounterClockwise, CaretDown, CaretLeft, CaretRight, Check, Code, LockSimple, MagnifyingGlass, PaintBrush, Play, Robot, SquaresFour } from "@phosphor-icons/react";
import { AccessBadge } from "@/projects/platform/eduon/components/access-badge";
import { canPlay, courseScope, isListed } from "@/projects/platform/eduon/lib/access";
import { clock, courseLength } from "@/projects/platform/eduon/lib/format";
import { INTERESTS } from "@/projects/platform/eduon/lib/mock-data";
import { useStore } from "@/projects/platform/eduon/lib/store";
import type { Course, Level, Topic } from "@/projects/platform/eduon/lib/types";
import { useSite } from "@/projects/platform/eduon/components/site/site-context";
import { CourseCard } from "@/projects/platform/eduon/components/site/course-card";
import { Btn, CourseFill, CourseImage, Meter, Reveal } from "@/projects/platform/eduon/components/site/ui";

/*
 * 홈 골격 (design.md 아키타입): 풀블리드 미디어 히어로 → 이어보기 가로 레일(페이지에서 한 번) →
 * 관심 주제 추천 편집 그리드 + 신규 강의 목록 → 검색과 필터 칩 + 결과 그리드.
 */

const FEATURED_ID = "c01";
type ScopeFilter = "전체" | "무료 공개" | "구독 전용";

export function HomeScreen({ anchor }: { anchor?: "explore" }) {
  const { courses } = useStore();
  const listed = useMemo(() => courses.filter(isListed), [courses]);
  const featured = listed.find((c) => c.id === FEATURED_ID) ?? listed[0];

  useEffect(() => {
    if (anchor === "explore") document.getElementById("explore")?.scrollIntoView({ block: "start" });
  }, [anchor]);

  return (
    <div className="pb-24">
      {featured && <Hero course={featured} />}
      <div className="mx-auto max-w-[1328px] px-4 md:px-8">
        <ContinueRail />
        <RecommendSplit listed={listed} featuredId={featured?.id} />
        <Explore listed={listed} featuredId={featured?.id} />
      </div>
    </div>
  );
}

function Hero({ course }: { course: Course }) {
  const { openCourse, go } = useSite();
  const { mySub } = useStore();
  const playable = canPlay(course, 1, mySub);
  return (
    /* 디자인시스템 hero: 민트 밴드 풀블리드, 좌 카피 + 우 비대칭 라운드(좌상단 직각) 미디어 카드, 블랙 필 CTA */
    <section className="bg-[var(--eo-mint-band)]">
      <div className="mx-auto grid max-w-[1328px] items-center gap-10 px-4 py-12 md:px-8 md:py-24 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <div className="eo-rise flex items-center gap-2" style={{ animationDelay: "0ms" }}>
            <AccessBadge scope={courseScope(course)} />
            <span className="text-[14px] font-semibold">운영자 추천 | 1강 미리보기</span>
          </div>
          <h1 className="eo-rise mt-5 text-[32px] font-bold leading-[40px] tracking-[-0.01em] md:text-[48px] md:leading-[56px] eo-text-balance" style={{ animationDelay: "40ms" }}>
            {course.title}
          </h1>
          <div className="eo-rise" style={{ animationDelay: "80ms" }}>
            <p className="mt-3 text-[15px] font-semibold text-[var(--eo-fg-2)]">
              {course.instructor} | {course.series} | {course.episodes.length}강 | {courseLength(course)}
            </p>
            <p className="mt-5 line-clamp-3 text-[18px] font-light leading-[29px] text-[var(--eo-fg-2)] eo-text-pretty">{course.summary}</p>
            <div className="mt-8 flex flex-col gap-2 sm:flex-row">
              <Btn variant="brand" size="lg" icon={<Play size={18} weight="fill" />} onClick={() => go("watch", { courseId: course.id, episode: 1 })}>
                {playable && course.access.previewEpisodes.includes(1) && mySub.status !== "active" && mySub.status !== "cancelled" ? "1강 미리보기" : "시청 시작"}
              </Btn>
              <Btn variant="outline" size="lg" className="border-black bg-white" onClick={() => openCourse(course.id)}>
                강의 상세
              </Btn>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => go("watch", { courseId: course.id, episode: 1 })}
          aria-label={`${course.title} 1강 재생`}
          className="eo-card-shape group relative block aspect-video w-full overflow-hidden border border-black bg-white shadow-[var(--eo-float-shadow)] lg:col-span-7"
        >
          <CourseFill course={course} w={1280} />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--eo-brand)] text-black ring-1 ring-black transition-transform">
              <Play size={26} weight="fill" />
            </span>
          </span>
        </button>
      </div>
    </section>
  );
}

function ContinueRail() {
  const { progress, course: find, mySub } = useStore();
  const { go, openCourse } = useSite();
  const items = Object.entries(progress)
    .map(([id, p]) => ({ course: find(id), p }))
    .filter((x): x is { course: Course; p: (typeof progress)[string] } => !!x.course && isListed(x.course))
    .sort((a, b) => (a.p.at < b.p.at ? 1 : -1));
  const [scroller, setScroller] = useState<HTMLDivElement | null>(null);
  if (items.length === 0) return null;

  const nudge = (dir: number) => scroller?.scrollBy({ left: dir * scroller.clientWidth * 0.8, behavior: "smooth" });

  return (
    <Reveal className="mt-12 md:mt-16">
      <section aria-labelledby="continue-title">
        <div className="flex items-end justify-between">
          <h2 id="continue-title" className="text-[24px] font-semibold leading-[32px]">
            이어보기
          </h2>
          <div className="hidden gap-1 md:flex">
            <button type="button" aria-label="이전" onClick={() => nudge(-1)} className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--eo-hair-2)] text-[var(--eo-fg-2)] hover:bg-[var(--eo-raised-2)]">
              <CaretLeft size={16} />
            </button>
            <button type="button" aria-label="다음" onClick={() => nudge(1)} className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--eo-hair-2)] text-[var(--eo-fg-2)] hover:bg-[var(--eo-raised-2)]">
              <CaretRight size={16} />
            </button>
          </div>
        </div>
        <div ref={setScroller} className="eo-scroll-x -mx-4 mt-4 flex snap-x scroll-px-4 gap-4 overflow-x-auto px-4 md:-mx-8 md:scroll-px-8 md:px-8">
          {items.map(({ course, p }) => {
            const ep = course.episodes.find((e) => e.no === p.episode) ?? course.episodes[0];
            const ok = canPlay(course, ep.no, mySub);
            const pctDone = (p.seconds / ep.seconds) * 100;
            return (
              <div key={course.id} className="w-[72%] shrink-0 snap-start sm:w-[44%] lg:w-[calc((100%-48px)/4.3)]">
                <button
                  type="button"
                  onClick={() => (ok ? go("watch", { courseId: course.id, episode: ep.no }) : openCourse(course.id))}
                  className="group block w-full text-left"
                >
                  <CourseImage course={course} w={560}>
                    {ok ? (
                      <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(15,18,22,0.72)] text-white">
                          <Play size={20} weight="fill" />
                        </span>
                      </span>
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center bg-[rgba(15,18,22,0.62)]">
                        <span className="flex items-center gap-1.5 rounded-full bg-[rgba(15,18,22,0.85)] px-3 py-1.5 text-[13px] font-semibold text-white">
                          <LockSimple size={14} weight="bold" />
                          재구독 후 시청
                        </span>
                      </span>
                    )}
                    <div className="absolute inset-x-0 bottom-0 px-3 pb-3">
                      <Meter value={pctDone} />
                    </div>
                  </CourseImage>
                  <div className="mt-3 truncate text-[15px] font-semibold leading-[22px]">{course.title}</div>
                  <div className="mt-0.5 truncate text-[13px] leading-[18px] text-[var(--eo-fg-3)]">
                    {ep.no}강 {ep.title} | {clock(ep.seconds - p.seconds)} 남음
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </Reveal>
  );
}

function RecommendSplit({ listed, featuredId }: { listed: Course[]; featuredId?: string }) {
  const { progress } = useStore();
  const { openCourse } = useSite();
  const watching = new Set(Object.keys(progress));

  /* 관심 주제 기반 추천. 관심 주제가 없는 신규 회원이면 운영자 추천 순서로 채운다 */
  const recommended = listed
    .filter((c) => c.id !== featuredId && !watching.has(c.id) && INTERESTS.includes(c.topic))
    .sort((a, b) => b.learners - a.learners)
    .slice(0, 4);
  const used = new Set([...recommended.map((c) => c.id), featuredId]);
  /* 신규 강의는 위에서 이미 보인 강좌를 빼고 최근 공개 순 4개 */
  const fresh = [...listed].filter((c) => !used.has(c.id)).sort((a, b) => (a.addedAt < b.addedAt ? 1 : -1)).slice(0, 4);
  const [lead, ...rest] = recommended;

  return (
    <>
      {lead && (
        <Reveal className="mt-16">
          <section aria-labelledby="rec-title">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 id="rec-title" className="text-[24px] font-semibold leading-[32px]">
                관심 주제 추천
              </h2>
              <span className="text-[14px] text-[var(--eo-fg-3)]">{INTERESTS.join(", ")}</span>
            </div>
            <div className="mt-5 grid items-start gap-8 lg:grid-cols-12 lg:gap-8">
              <button type="button" onClick={() => openCourse(lead.id)} className="group block text-left lg:col-span-7">
                <CourseImage course={lead} w={1280}>
                  <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                </CourseImage>
                <div className="mt-4 flex items-center gap-2">
                  <AccessBadge scope={courseScope(lead)} />
                  <span className="text-[14px] text-[var(--eo-fg-3)]">
                    {lead.instructor} | {lead.episodes.length}강 | {courseLength(lead)}
                  </span>
                </div>
                <h3 className="mt-2 text-[22px] font-semibold leading-[30px]">{lead.title}</h3>
                <p className="mt-2 line-clamp-2 max-w-[60ch] text-[15px] leading-[24px] text-[var(--eo-fg-2)]">{lead.summary}</p>
              </button>
              <ul className="flex flex-col gap-5 lg:col-span-5">
                {rest.map((c) => (
                  <li key={c.id}>
                    <button type="button" onClick={() => openCourse(c.id)} className="group flex w-full items-start gap-4 text-left">
                      <CourseImage course={c} w={480} className="w-[44%] shrink-0">
                        <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
                      </CourseImage>
                      <span className="min-w-0 flex-1 pt-1">
                        <span className="line-clamp-2 text-[16px] font-semibold leading-[24px]">{c.title}</span>
                        <span className="mt-1 block truncate text-[13px] leading-[18px] text-[var(--eo-fg-3)]">
                          {c.instructor} | {c.episodes.length}강 | {courseLength(c)}
                        </span>
                        <span className="mt-2.5 block">
                          <AccessBadge scope={courseScope(c)} />
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </Reveal>
      )}

      <Reveal className="mt-16">
        <section aria-labelledby="new-title">
          <h2 id="new-title" className="text-[24px] font-semibold leading-[32px]">
            신규 강의
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-6 lg:grid-cols-4">
            {fresh.map((c) => (
              <div key={c.id} className="flex flex-col">
                <span className="mb-2 text-[13px] font-semibold text-[var(--eo-brand-ink)]">{c.addedAt.slice(6)} 공개</span>
                <CourseCard course={c} />
              </div>
            ))}
          </div>
        </section>
      </Reveal>
    </>
  );
}

type Sort = "최신순" | "인기순";

const TOPIC_TABS: Array<{ key: Topic | "전체"; label: string; Icon: typeof SquaresFour }> = [
  { key: "전체", label: "전체", Icon: SquaresFour },
  { key: "AI", label: "AI", Icon: Robot },
  { key: "디자인", label: "디자인", Icon: PaintBrush },
  { key: "개발", label: "개발", Icon: Code },
];
const LEVELS: Array<Level | "전체"> = ["전체", "입문", "중급", "실무"];
const SCOPES: ScopeFilter[] = ["전체", "무료 공개", "구독 전용"];

/*
 * 탐색 블록 (사용자 지정, 2026-10-28): 가운데 큰 검색바, 드롭다운 필터 칩, 주제 아이콘 탭, 결과 제목과 정렬, 그리드 순서.
 * 항목이 적은 필터는 칩 줄 대신 드롭다운으로 접는다. 같은 기능의 검색창이 두 개가 되지 않게 헤더는 아이콘만 둔다.
 */
function Explore({ listed, featuredId }: { listed: Course[]; featuredId?: string }) {
  const { query, setQuery } = useSite();
  const [topic, setTopic] = useState<Topic | "전체">("전체");
  const [level, setLevel] = useState<Level | "전체">("전체");
  const [instructor, setInstructor] = useState("전체");
  const [scope, setScope] = useState<ScopeFilter>("전체");
  const [sort, setSort] = useState<Sort>("최신순");

  const instructors = useMemo(() => ["전체", ...Array.from(new Set(listed.map((c) => c.instructor)))], [listed]);
  const q = query.trim();
  const filtering = !!q || topic !== "전체" || level !== "전체" || instructor !== "전체" || scope !== "전체";
  /* 조건 없이 볼 때는 바로 위 히어로 강좌를 빼서 한 화면에 같은 사진이 두 번 나오지 않게 한다 */
  const results = listed
    .filter((c) => filtering || c.id !== featuredId)
    .filter((c) => (topic === "전체" || c.topic === topic) && (level === "전체" || c.level === level))
    .filter((c) => (instructor === "전체" || c.instructor === instructor) && (scope === "전체" || courseScope(c) === scope))
    .filter((c) => !q || c.title.includes(q) || c.instructor.includes(q) || c.tools.some((t) => t.toLowerCase().includes(q.toLowerCase())))
    .sort((a, b) => (sort === "인기순" ? b.learners - a.learners : a.addedAt < b.addedAt ? 1 : -1));
  const clear = () => {
    setTopic("전체");
    setLevel("전체");
    setInstructor("전체");
    setScope("전체");
    setQuery("");
  };

  return (
    <section id="explore" className="mt-12 scroll-mt-20 lg:mt-20" aria-label="강의 탐색">
      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className="mx-auto flex h-14 max-w-[640px] items-center gap-3 rounded-full border border-[var(--eo-hair-2)] bg-[var(--eo-canvas)] pl-6 pr-2 shadow-[var(--eo-float-shadow)] focus-within:border-black"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="강의, 강사, 도구 검색"
          aria-label="강의 검색"
          className="min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-[var(--eo-fg-3)]"
        />
        <button
          type="submit"
          aria-label="검색"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--eo-brand)] text-black ring-1 ring-black hover:bg-[var(--eo-brand-hover)]"
        >
          <MagnifyingGlass size={20} weight="bold" />
        </button>
      </form>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <Dropdown label="난이도" value={level} options={LEVELS} onChange={(v) => setLevel(v as Level | "전체")} />
        <Dropdown label="이용 범위" value={scope} options={SCOPES} onChange={(v) => setScope(v as ScopeFilter)} />
        <Dropdown label="강사" value={instructor} options={instructors} onChange={setInstructor} />
        {filtering && (
          <button type="button" onClick={clear} className="flex h-10 items-center gap-1 rounded-full px-3 text-[14px] font-semibold text-[var(--eo-fg-2)] hover:bg-[var(--eo-raised)]">
            <ArrowCounterClockwise size={16} />
            초기화
          </button>
        )}
      </div>

      <div role="tablist" aria-label="주제" className="eo-scroll-x mt-10 flex gap-2 overflow-x-auto border-b border-[var(--eo-hair)] md:justify-center md:gap-6">
        {TOPIC_TABS.map(({ key, label, Icon }) => {
          const on = topic === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setTopic(key)}
              className={`relative flex min-w-[72px] shrink-0 flex-col items-center gap-1.5 px-2 pb-3 pt-1 text-[13px] font-semibold ${
                on ? "text-[var(--eo-fg)]" : "text-[var(--eo-fg-3)] hover:text-[var(--eo-fg-2)]"
              }`}
            >
              <Icon size={24} weight={on ? "fill" : "regular"} />
              {label}
              {on && <span className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-[var(--eo-fg)]" />}
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-end justify-between gap-4">
        <h2 className="text-[24px] font-semibold leading-[32px]">
          {topic === "전체" ? "전체 강의" : `${topic} 강의`} <span className="ml-1 text-[16px] font-medium text-[var(--eo-fg-3)]">{results.length}</span>
        </h2>
        <div className="flex shrink-0 items-center gap-1 text-[14px]" role="radiogroup" aria-label="정렬">
          {(["최신순", "인기순"] as const).map((k) => (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={sort === k}
              onClick={() => setSort(k)}
              className={`h-9 rounded-full px-3 last:pr-0 ${sort === k ? "font-semibold text-[var(--eo-fg)]" : "font-medium text-[var(--eo-fg-3)] hover:text-[var(--eo-fg-2)]"}`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {results.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-start gap-4 border-t border-[var(--eo-hair)] pt-10">
          <p className="text-[16px] text-[var(--eo-fg-2)]">조건에 맞는 강의가 없어요.</p>
          <Btn variant="outline" onClick={clear}>
            필터 초기화
          </Btn>
        </div>
      )}
    </section>
  );
}

function Dropdown({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [open]);
  const active = value !== "전체";
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex h-10 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 text-[14px] font-semibold transition-colors ${
          active ? "border-black bg-black text-white" : "border-[var(--eo-hair-2)] bg-[var(--eo-canvas)] text-[var(--eo-fg)] hover:bg-[var(--eo-raised)]"
        }`}
      >
        {active ? value : label}
        <CaretDown size={14} weight="bold" className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className="eo-fade absolute left-0 top-12 z-30 max-h-[280px] min-w-[160px] overflow-y-auto rounded-[16px] border border-[var(--eo-hair)] bg-[var(--eo-canvas)] p-1.5 shadow-[var(--eo-float-shadow)]"
        >
          {options.map((o) => (
            <li key={o}>
              <button
                type="button"
                role="option"
                aria-selected={o === value}
                onClick={() => {
                  onChange(o);
                  setOpen(false);
                }}
                className={`flex h-10 w-full items-center justify-between gap-4 whitespace-nowrap rounded-[10px] px-3 text-left text-[14px] hover:bg-[var(--eo-raised)] ${
                  o === value ? "font-semibold" : "font-medium text-[var(--eo-fg-2)]"
                }`}
              >
                {o === "전체" ? `${label} 전체` : o}
                {o === value && <Check size={16} weight="bold" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
