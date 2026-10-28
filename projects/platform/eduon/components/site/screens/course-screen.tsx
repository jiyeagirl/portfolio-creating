"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, CaretRight, ClosedCaptioning, Heart, Play } from "@phosphor-icons/react";
import { AccessBadge, LockMark, PreviewChip } from "@/projects/platform/eduon/components/access-badge";
import { courseScope, episodeAccess, isListed, subscriptionActive } from "@/projects/platform/eduon/lib/access";
import { clock, courseLength, won } from "@/projects/platform/eduon/lib/format";
import { FIRST_MONTH_PRICE, PRICE } from "@/projects/platform/eduon/lib/mock-data";
import { useStore } from "@/projects/platform/eduon/lib/store";
import type { Course } from "@/projects/platform/eduon/lib/types";
import { useSite } from "@/projects/platform/eduon/components/site/site-context";
import { CourseCard } from "@/projects/platform/eduon/components/site/course-card";
import { Btn, CourseFill, PlayMark } from "@/projects/platform/eduon/components/site/ui";

/*
 * 강의 상세. 구독은 별도 메뉴가 아니라 이 화면의 구독 카드에서 시작한다 (사용자 지정, 2026-10-28).
 * 데스크톱: 좌 미디어 + 탭(소개, 커리큘럼, 강사, 추천), 우 sticky 구독 카드.
 * 모바일: 미디어, 구독 카드, 탭 순서이고 비구독자에게는 하단 고정 CTA 바(불투명)가 붙는다.
 */

type Section = "intro" | "curriculum" | "instructor" | "related";
const SECTIONS: Array<{ key: Section; label: string }> = [
  { key: "intro", label: "소개" },
  { key: "curriculum", label: "커리큘럼" },
  { key: "instructor", label: "강사" },
  { key: "related", label: "추천" },
];

export function CourseScreen({ courseId }: { courseId: string }) {
  const { course: find, courses, mySub } = useStore();
  const { go } = useSite();
  const course = find(courseId) ?? find("c01")!;
  const scope = courseScope(course);
  const subscribed = subscriptionActive(mySub.status) && course.access.subscription;
  const needsSub = scope === "구독 전용" && !subscribed;
  const pool = courses.filter((c) => isListed(c) && c.id !== course.id && c.access.subscription);
  /* 같은 주제를 먼저, 모자라면 다른 구독 대상 강좌로 세 칸을 채운다 */
  const related = [...pool.filter((c) => c.topic === course.topic), ...pool.filter((c) => c.topic !== course.topic)].slice(0, 3);

  const [active, setActive] = useState<Section>("intro");
  const refs = useRef<Partial<Record<Section, HTMLElement | null>>>({});
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id.replace("sec-", "") as Section);
      },
      { rootMargin: "-120px 0px -60% 0px" },
    );
    Object.values(refs.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  const jump = (key: Section) => refs.current[key]?.scrollIntoView({ behavior: "smooth", block: "start" });

  const firstPreview = course.access.previewEpisodes[0] ?? 1;
  const startSubscribe = (episode = firstPreview + 1) => go("subscription", { returnTo: { courseId: course.id, episode } });

  return (
    <div className={`mx-auto max-w-[1328px] px-4 pt-4 md:px-8 ${needsSub ? "pb-32 lg:pb-24" : "pb-24"}`}>
      <div className="flex h-12 items-center gap-2">
        <button type="button" onClick={() => go("home")} className="flex h-10 items-center gap-1.5 pr-2 text-[14px] font-semibold text-[var(--eo-fg-2)] hover:text-[var(--eo-fg)]">
          <ArrowLeft size={18} />홈
        </button>
        <CaretRight size={14} className="text-[var(--eo-fg-3)]" />
        <span className="text-[14px] font-semibold text-[var(--eo-fg-3)]">{course.topic}</span>
      </div>

      <div className="mt-2 grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="min-w-0 lg:col-span-8">
          <button
            type="button"
            onClick={() => go("watch", { courseId: course.id, episode: firstPreview })}
            aria-label={needsSub ? `${firstPreview}강 무료 미리보기` : `${course.title} 재생`}
            className="group relative block aspect-video w-full overflow-hidden rounded-[24px] bg-[var(--eo-raised-2)]"
          >
            <CourseFill course={course} w={1280} />
            <span className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/20">
              <PlayMark size={64} />
            </span>
          </button>

          {/* 모바일에서는 구독 카드가 미디어 바로 아래 */}
          <div className="mt-6 lg:hidden">
            <SubscribeCard course={course} onSubscribe={() => startSubscribe()} />
          </div>

          <nav className="eo-scroll-x sticky top-16 z-20 mt-10 flex gap-6 overflow-x-auto border-b border-[var(--eo-hair)] bg-[var(--eo-canvas)]" aria-label="강의 정보">
            {SECTIONS.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => jump(s.key)}
                aria-current={active === s.key ? "true" : undefined}
                className={`relative h-12 shrink-0 text-[16px] font-semibold ${active === s.key ? "text-[var(--eo-fg)]" : "text-[var(--eo-fg-3)] hover:text-[var(--eo-fg-2)]"}`}
              >
                {s.label}
                {active === s.key && <span className="absolute inset-x-0 -bottom-px h-[2px] bg-[var(--eo-fg)]" />}
              </button>
            ))}
          </nav>

          <section id="sec-intro" ref={(el) => { refs.current.intro = el; }} className="scroll-mt-32 pt-8">
            <p className="max-w-[68ch] text-[18px] font-light leading-[29px] text-[var(--eo-fg-2)] eo-text-pretty">{course.summary}</p>
            <dl className="mt-8 grid grid-cols-[96px_1fr] gap-x-4 gap-y-3 text-[15px] leading-[24px] sm:grid-cols-[96px_1fr_96px_1fr]">
              <dt className="text-[var(--eo-fg-3)]">난이도</dt>
              <dd>{course.level}</dd>
              <dt className="text-[var(--eo-fg-3)]">강의 구성</dt>
              <dd>
                {course.episodes.length}강 | {courseLength(course)}
              </dd>
              <dt className="text-[var(--eo-fg-3)]">제작사</dt>
              <dd>{course.producer}</dd>
              <dt className="text-[var(--eo-fg-3)]">제작 방식</dt>
              <dd>{course.productionMethod}</dd>
              <dt className="text-[var(--eo-fg-3)]">사용 도구</dt>
              <dd>{course.tools.join(", ") || "없음"}</dd>
              <dt className="text-[var(--eo-fg-3)]">자막</dt>
              <dd className="flex items-center gap-1.5">
                <ClosedCaptioning size={18} className="text-[var(--eo-fg-3)]" />
                {course.subtitles.join(", ")}
              </dd>
            </dl>
          </section>

          <section id="sec-curriculum" ref={(el) => { refs.current.curriculum = el; }} className="scroll-mt-32 pt-14">
            <h2 className="text-[24px] font-semibold leading-[32px]">
              커리큘럼 <span className="ml-1 text-[16px] font-medium text-[var(--eo-fg-3)]">{course.episodes.length}강</span>
            </h2>
            <ol className="mt-4 divide-y divide-[var(--eo-hair)] border-y border-[var(--eo-hair)]">
              {course.episodes.map((ep) => {
                const acc = episodeAccess(course, ep.no, mySub);
                const locked = acc === "locked";
                return (
                  <li key={ep.no}>
                    <button
                      type="button"
                      onClick={() => (locked ? startSubscribe(ep.no) : go("watch", { courseId: course.id, episode: ep.no }))}
                      className="flex min-h-[60px] w-full items-center gap-4 px-2 py-3 text-left transition-colors hover:bg-[var(--eo-raised)]"
                    >
                      <span className="w-6 shrink-0 text-right text-[14px] font-semibold text-[var(--eo-fg-3)]">{ep.no}</span>
                      <span className={`min-w-0 flex-1 line-clamp-2 text-[16px] leading-[24px] ${locked ? "text-[var(--eo-fg-3)]" : ""}`}>{ep.title}</span>
                      {acc === "preview" && <PreviewChip />}
                      {locked && <LockMark />}
                      <span className="w-12 shrink-0 text-right text-[14px] text-[var(--eo-fg-3)]">{clock(ep.seconds)}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>

          <section id="sec-instructor" ref={(el) => { refs.current.instructor = el; }} className="scroll-mt-32 pt-14">
            <h2 className="text-[24px] font-semibold leading-[32px]">강사</h2>
            <InstructorBlock course={course} />
          </section>

          <section id="sec-related" ref={(el) => { refs.current.related = el; }} className="scroll-mt-32 pt-14">
            <h2 className="text-[24px] font-semibold leading-[32px]">구독에 포함된 비슷한 강의</h2>
            <div className="mt-5 grid gap-x-6 gap-y-8 sm:grid-cols-2 md:grid-cols-3">
              {related.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          </section>
        </div>

        <aside className="hidden lg:sticky lg:top-[96px] lg:col-span-4 lg:block">
          <SubscribeCard course={course} onSubscribe={() => startSubscribe()} />
        </aside>
      </div>

      {needsSub && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--eo-hair)] bg-[var(--eo-canvas)] px-4 pb-4 pt-3 lg:hidden">
          <div className="mb-2 text-center text-[13px] text-[var(--eo-fg-2)]">
            첫 달 <span className="font-semibold text-[var(--eo-fg)]">{won(FIRST_MONTH_PRICE)}원</span>, 이후 월 {won(PRICE)}원
          </div>
          <Btn variant="signature" size="lg" className="w-full" onClick={() => startSubscribe()}>
            할인 받고 구독 시작하기
          </Btn>
        </div>
      )}
    </div>
  );
}

function SubscribeCard({ course, onSubscribe }: { course: Course; onSubscribe: () => void }) {
  const { mySub, progress, wishlist, toggleWish } = useStore();
  const { go, toast } = useSite();
  const scope = courseScope(course);
  const subscribed = subscriptionActive(mySub.status) && course.access.subscription;
  const saved = progress[course.id];
  const wished = wishlist.includes(course.id);
  const firstPreview = course.access.previewEpisodes[0] ?? 1;
  const lapsed = mySub.status === "expired" || mySub.status === "refunded";

  return (
    <div className="rounded-[24px] border border-[var(--eo-hair)] bg-[var(--eo-canvas)] p-6 shadow-[var(--eo-float-shadow)]">
      <div className="flex items-center gap-2 text-[14px] font-semibold">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--eo-raised-2)] text-[12px]">{course.instructor.slice(0, 1)}</span>
        {course.instructor}
        <span className="font-medium text-[var(--eo-fg-3)]">| {course.producer}</span>
      </div>
      <h1 className="mt-3 text-[24px] font-bold leading-[32px] tracking-[-0.01em] eo-text-balance">{course.title}</h1>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-[14px] text-[var(--eo-fg-2)]">
        <AccessBadge scope={scope} />
        {course.series} | 수강생 {won(course.learners)}명
      </div>

      {scope === "구독 전용" && (
        <div className="mt-5 rounded-[16px] bg-[var(--eo-mint-band)] px-4 py-4">
          <div className="text-[15px] font-bold">
            Edu<span className="rounded-full bg-[var(--eo-brand)] px-1">On</span> 구독으로 볼 수 있어요
          </div>
          <div className="mt-1 text-[13px] leading-[20px] text-[var(--eo-fg-2)]">
            {subscribed
              ? mySub.status === "cancelled"
                ? `갱신 해지됨, ${mySub.periodEnd}까지 이용 가능`
                : "구독 중이라 전체 회차를 볼 수 있어요"
              : `구독 대상 전체 강의 | 첫 달 ${won(FIRST_MONTH_PRICE)}원, 이후 월 ${won(PRICE)}원`}
          </div>
        </div>
      )}

      <div className="mt-5 space-y-2">
        {scope === "무료 공개" ? (
          <Btn variant="brand" size="lg" className="w-full" icon={<Play size={18} weight="fill" />} onClick={() => go("watch", { courseId: course.id, episode: saved?.episode ?? 1 })}>
            {saved ? `${saved.episode}강 이어보기` : "무료로 시청"}
          </Btn>
        ) : subscribed ? (
          <Btn variant="brand" size="lg" className="w-full" icon={<Play size={18} weight="fill" />} onClick={() => go("watch", { courseId: course.id, episode: saved?.episode ?? 1 })}>
            {saved ? `${saved.episode}강 이어보기` : "시청 시작"}
          </Btn>
        ) : (
          <>
            <Btn variant="outline" size="lg" className="w-full border-black" icon={<Play size={18} />} onClick={() => go("watch", { courseId: course.id, episode: firstPreview })}>
              {firstPreview}강 무료 미리보기
            </Btn>
            <Btn variant="signature" size="lg" className="w-full" onClick={onSubscribe}>
              {lapsed ? "다시 구독하기" : "할인 받고 구독 시작하기"}
            </Btn>
          </>
        )}
        <Btn
          variant="ghost"
          className="w-full"
          aria-pressed={wished}
          icon={<Heart size={18} weight={wished ? "fill" : "regular"} className={wished ? "text-[var(--eo-red)]" : ""} />}
          onClick={() => {
            toggleWish(course.id);
            toast(wished ? "찜 목록에서 뺐어요" : "찜 목록에 담았어요");
          }}
        >
          {wished ? "찜한 강의" : "찜하기"}
        </Btn>
      </div>
    </div>
  );
}

function InstructorBlock({ course }: { course: Course }) {
  const { courses } = useStore();
  const { go } = useSite();
  const others = courses.filter((c) => isListed(c) && c.instructor === course.instructor && c.id !== course.id);
  return (
    <div className="mt-4 flex flex-col gap-5 sm:flex-row">
      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[var(--eo-mint-band)] text-[22px] font-bold">{course.instructor.slice(0, 1)}</span>
      <div className="min-w-0 flex-1">
        <div className="text-[18px] font-semibold">{course.instructor}</div>
        <div className="mt-0.5 text-[14px] text-[var(--eo-fg-3)]">
          {course.producer} | {course.topic} 분야 | EduOn 강좌 {others.length + 1}개
        </div>
        {others.length > 0 && (
          <ul className="mt-4 divide-y divide-[var(--eo-hair)] border-t border-[var(--eo-hair)]">
            {others.map((c) => (
              <li key={c.id}>
                <button type="button" onClick={() => go("course", { courseId: c.id })} className="flex w-full items-center gap-3 py-3 text-left hover:bg-[var(--eo-raised)]">
                  <span className="min-w-0 flex-1 truncate text-[15px] font-semibold">{c.title}</span>
                  <AccessBadge scope={courseScope(c)} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
