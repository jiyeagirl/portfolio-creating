"use client";

import { Thumb } from "@/projects/platform/eduon/components/console/console-ui";
import type { Course } from "@/projects/platform/eduon/lib/types";

/*
 * 스튜디오의 내비 면 = 내 콘텐츠 목록 (design.md 셸 레이아웃). lg 이상은 272px 짙은 세로 목록,
 * 미만은 같은 면이 가로 스크롤 띠가 된다. 상태 글자색은 다크 면 위 -dk 토큰.
 */

const DK = {
  gray: "text-[var(--eo-gray-dk)]",
  orange: "text-[var(--eo-orange-dk)]",
  green: "text-[var(--eo-green-dk)]",
  red: "text-[var(--eo-red-dk)]",
  blue: "text-[var(--eo-blue-dk)]",
};

function statusLine(c: Course): { text: string; cls: string } {
  if (c.publish === "게시 중단") return { text: "게시 중단", cls: DK.red };
  if (c.review === "보완 요청") return { text: "보완 요청", cls: DK.orange };
  if (c.review === "검수 대기") return { text: "검수 대기", cls: DK.gray };
  if (c.review === "작성 중")
    return {
      text: c.transcode === "변환 중" ? "작성 중 | 변환 중" : "작성 중",
      cls: DK.gray,
    };
  if (c.publish === "공개") return { text: "승인 | 공개", cls: DK.green };
  return { text: "승인 | 비공개", cls: DK.green };
}

export interface ListGroup {
  label: string;
  courses: Course[];
}

export function ContentList({
  groups,
  selected,
  onSelect,
}: {
  groups: ListGroup[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  const total = groups.reduce((n, g) => n + g.courses.length, 0);
  return (
    <div className="eo-dark bg-[var(--eo-side)] lg:w-[272px] lg:shrink-0">
      <nav
        aria-label="내 콘텐츠"
        className="text-[var(--eo-side-fg)] lg:sticky lg:top-14 lg:h-[calc(100dvh-56px)] lg:overflow-y-auto"
      >
        <div className="hidden items-baseline gap-2 px-5 pb-2 pt-5 lg:flex">
          <span className="text-[14px] font-semibold">내 콘텐츠</span>
          <span className="text-[12px] tabular-nums text-[var(--eo-side-fg-2)]">
            {total}
          </span>
        </div>

        {/* lg 미만: 가로 스크롤 띠 */}
        <div className="eo-scroll-x flex gap-2 overflow-x-auto px-4 py-3 lg:hidden">
          {groups
            .flatMap((g) => g.courses)
            .map((c) => {
              const on = c.id === selected;
              const st = statusLine(c);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onSelect(c.id)}
                  aria-current={on ? "true" : undefined}
                  className={`flex w-[216px] shrink-0 items-center gap-2.5 rounded-[8px] px-2 py-2 text-left transition-colors ${on ? "bg-[var(--eo-side-3)]" : "hover:bg-[var(--eo-side-2)] active:bg-[var(--eo-side-3)]"}`}
                >
                  <Thumb
                    photo={c.photo}
                    title={c.title}
                    className="w-14 rounded-[4px]"
                  />
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block truncate text-[13px] ${on ? "font-semibold text-white" : "font-medium"}`}
                    >
                      {c.title}
                    </span>
                    <span className={`block truncate text-[12px] ${st.cls}`}>
                      {st.text}
                    </span>
                  </span>
                </button>
              );
            })}
        </div>

        {/* lg 이상: 세로 목록 */}
        <div className="hidden pb-6 lg:block">
          {groups.map((g) => (
            <div key={g.label} className="mt-3">
              <div className="px-5 py-1.5 text-[12px] font-medium text-[var(--eo-side-fg-2)]">
                {g.label}
              </div>
              <ul className="px-3">
                {g.courses.map((c) => {
                  const on = c.id === selected;
                  const st = statusLine(c);
                  return (
                    <li key={c.id}>
                      <button
                        type="button"
                        onClick={() => onSelect(c.id)}
                        aria-current={on ? "true" : undefined}
                        className={`flex w-full items-center gap-3 rounded-[8px] px-2 py-2 text-left transition-colors ${on ? "bg-[var(--eo-side-3)]" : "hover:bg-[var(--eo-side-2)] active:bg-[var(--eo-side-3)]"}`}
                      >
                        <Thumb
                          photo={c.photo}
                          title={c.title}
                          className="w-16 rounded-[4px]"
                        />
                        <span className="min-w-0 flex-1">
                          <span
                            className={`block truncate text-[13px] leading-[18px] ${on ? "font-semibold text-white" : "font-medium"}`}
                            title={c.title}
                          >
                            {c.title}
                          </span>
                          <span className="mt-0.5 block truncate text-[12px] text-[var(--eo-side-fg-2)]">
                            {c.instructor} | {c.episodes.length}강
                          </span>
                          <span
                            className={`block truncate text-[12px] font-medium ${st.cls}`}
                          >
                            {st.text}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}
