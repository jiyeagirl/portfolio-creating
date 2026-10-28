"use client";

import { useState } from "react";
import { CheckCircle, Heart, LockSimple, Play } from "@phosphor-icons/react";
import { AccessBadge } from "@/projects/platform/eduon/components/access-badge";
import { canPlay, courseScope } from "@/projects/platform/eduon/lib/access";
import { clock, courseLength } from "@/projects/platform/eduon/lib/format";
import { useStore } from "@/projects/platform/eduon/lib/store";
import type { Course, Progress } from "@/projects/platform/eduon/lib/types";
import { useSite } from "@/projects/platform/eduon/components/site/site-context";
import { CourseCard } from "@/projects/platform/eduon/components/site/course-card";
import { Btn, CourseImage, Meter } from "@/projects/platform/eduon/components/site/ui";

/*
 * 내 학습 골격: list-first. 탭 3개(이어보기 / 학습 완료 / 찜한 강의).
 * 구독 상태와 결제 내역은 여기 두지 않고 구독 관리 화면(membership)으로 뺐다 (사용자 지정, 2026-10-28).
 */

export type MyTab = "continue" | "done" | "wish";

export function MypageScreen({ initialTab = "continue" }: { initialTab?: MyTab }) {
  const [tab, setTab] = useState<MyTab>(initialTab);
  const { progress, completed, wishlist } = useStore();
  const tabs: Array<[MyTab, string, number]> = [
    ["continue", "이어보기", Object.keys(progress).filter((id) => !completed[id]).length],
    ["done", "학습 완료", Object.keys(completed).length],
    ["wish", "찜한 강의", wishlist.length],
  ];

  return (
    <div className="mx-auto max-w-[1328px] px-4 pb-24 pt-8 md:px-8 md:pt-12">
      <h1 className="text-[32px] font-bold leading-[40px] tracking-[-0.01em]">내 학습</h1>
      <div role="tablist" className="eo-scroll-x mt-6 flex gap-6 overflow-x-auto border-b border-[var(--eo-hair)]">
        {tabs.map(([key, label, n]) => (
          <button
            key={key}
            role="tab"
            type="button"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`relative flex h-12 shrink-0 items-center gap-1.5 text-[16px] ${
              tab === key ? "font-semibold text-[var(--eo-fg)]" : "font-medium text-[var(--eo-fg-3)] hover:text-[var(--eo-fg-2)]"
            }`}
          >
            {label}
            <span className="text-[14px] font-medium text-[var(--eo-fg-3)]">{n}</span>
            {tab === key && <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[var(--eo-fg)]" />}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "continue" && (
          <div className="max-w-[880px]">
            <ContinueList />
          </div>
        )}
        {tab === "done" && <DoneList />}
        {tab === "wish" && <WishList />}
      </div>
    </div>
  );
}

function DoneList() {
  const { completed, course: find } = useStore();
  const { go, openCourse } = useSite();
  const rows = Object.entries(completed)
    .map(([id, at]) => ({ course: find(id), at }))
    .filter((r): r is { course: Course; at: string } => !!r.course)
    .sort((a, b) => (a.at < b.at ? 1 : -1));
  if (rows.length === 0)
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-[16px] text-[var(--eo-fg-2)]">아직 끝까지 들은 강의가 없어요.</p>
        <Btn variant="outline" onClick={() => go("home", { anchor: "explore" })}>
          강의 둘러보기
        </Btn>
      </div>
    );
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-6 lg:grid-cols-4">
      {rows.map(({ course, at }) => (
        <div key={course.id} className="flex flex-col">
          <button type="button" onClick={() => openCourse(course.id)} className="group block text-left">
            <CourseImage course={course} w={560}>
              <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
            </CourseImage>
          </button>
          <span className="mt-3 flex items-center gap-1.5 text-[13px] font-semibold text-[var(--eo-brand-ink)]">
            <CheckCircle size={16} weight="fill" />
            {at.slice(6)} 완료
          </span>
          <span className="mt-1 line-clamp-2 text-[15px] font-semibold leading-[22px]">{course.title}</span>
          <span className="mt-1 truncate text-[13px] text-[var(--eo-fg-3)]">
            {course.instructor} | {course.episodes.length}강 | {courseLength(course)}
          </span>
          <Btn variant="outline" size="sm" className="mt-3 self-start" onClick={() => go("watch", { courseId: course.id, episode: 1 })}>
            다시 보기
          </Btn>
        </div>
      ))}
    </div>
  );
}

function WishList() {
  const { wishlist, course: find } = useStore();
  const { go } = useSite();
  const list = wishlist.map((id) => find(id)).filter((c): c is Course => !!c);
  if (list.length === 0)
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="flex items-center gap-2 text-[16px] text-[var(--eo-fg-2)]">
          <Heart size={18} />
          찜한 강의가 없어요.
        </p>
        <Btn variant="outline" onClick={() => go("home", { anchor: "explore" })}>
          강의 둘러보기
        </Btn>
      </div>
    );
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-6 lg:grid-cols-4">
      {list.map((c) => (
        <CourseCard key={c.id} course={c} />
      ))}
    </div>
  );
}

function ContinueList() {
  const { progress, completed, course: find, mySub } = useStore();
  const { go, openCourse } = useSite();
  const rows = Object.entries(progress)
    .map(([id, p]) => ({ course: find(id), p }))
    .filter((r): r is { course: Course; p: Progress } => !!r.course && !completed[r.course.id])
    .sort((a, b) => (a.p.at < b.p.at ? 1 : -1));
  const lapsed = mySub.status === "expired" || mySub.status === "refunded" || mySub.status === "failed";

  if (rows.length === 0)
    return (
      <div className="flex flex-col items-start gap-4">
        <p className="text-[16px] text-[var(--eo-fg-2)]">아직 시청한 강의가 없어요.</p>
        <Btn variant="outline" onClick={() => go("home", { anchor: "explore" })}>
          강의 둘러보기
        </Btn>
      </div>
    );

  return (
    <>
      {lapsed && rows.some((r) => !canPlay(r.course, r.p.episode, mySub)) && (
        <div className="mb-6 flex flex-col gap-3 rounded-[16px] bg-[var(--eo-mint-band)] px-5 py-4 sm:flex-row sm:items-center">
          <LockSimple size={20} weight="bold" className="shrink-0 text-[var(--eo-brand-ink)]" />
          <p className="min-w-0 flex-1 text-[15px] leading-[24px] text-[var(--eo-fg-2)]">
            구독이 {mySub.status === "failed" ? "갱신되지 않아" : "만료되어"} 구독 전용 강의가 잠겼어요. 무료 공개 강의와 미리보기 회차는 계속 볼 수 있어요.
          </p>
          <Btn variant="brand" size="sm" onClick={() => go("subscription")}>
            다시 구독
          </Btn>
        </div>
      )}
      <ul className="divide-y divide-[var(--eo-hair)] border-y border-[var(--eo-hair)]">
        {rows.map(({ course, p }) => {
          const ep = course.episodes.find((e) => e.no === p.episode) ?? course.episodes[0];
          const ok = canPlay(course, ep.no, mySub);
          return (
            <li key={course.id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center">
              <button type="button" onClick={() => openCourse(course.id)} className="w-full shrink-0 sm:w-[200px]">
                <CourseImage course={course} w={400}>
                  {!ok && (
                    <span className="absolute inset-0 flex items-center justify-center bg-[rgba(15,18,22,0.66)] text-white">
                      <LockSimple size={22} weight="bold" />
                    </span>
                  )}
                </CourseImage>
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <AccessBadge scope={courseScope(course)} />
                  <span className="text-[13px] text-[var(--eo-fg-3)]">{p.at.slice(6)} 시청</span>
                </div>
                <div className="mt-2 truncate text-[17px] font-semibold leading-[24px]">{course.title}</div>
                <div className="mt-0.5 truncate text-[14px] text-[var(--eo-fg-2)]">
                  {ep.no}강 {ep.title}
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <Meter value={(p.seconds / ep.seconds) * 100} className="max-w-[240px]" />
                  <span className="whitespace-nowrap text-[13px] text-[var(--eo-fg-3)]">
                    {clock(p.seconds)} / {clock(ep.seconds)}
                  </span>
                </div>
              </div>
              {ok ? (
                <Btn variant="light" size="sm" icon={<Play size={16} weight="fill" />} onClick={() => go("watch", { courseId: course.id, episode: ep.no })}>
                  이어서 시청
                </Btn>
              ) : (
                <Btn variant="outline" size="sm" icon={<LockSimple size={16} />} onClick={() => go("subscription", { returnTo: { courseId: course.id, episode: ep.no } })}>
                  재구독 후 시청
                </Btn>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}

