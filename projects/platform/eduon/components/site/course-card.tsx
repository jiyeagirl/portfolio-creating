"use client";

import { AccessBadge } from "@/projects/platform/eduon/components/access-badge";
import { courseScope } from "@/projects/platform/eduon/lib/access";
import { courseLength } from "@/projects/platform/eduon/lib/format";
import type { Course } from "@/projects/platform/eduon/lib/types";
import { useSite } from "@/projects/platform/eduon/components/site/site-context";
import { CourseImage } from "@/projects/platform/eduon/components/site/ui";

/** 결과 그리드와 편집 그리드의 작은 칸이 쓰는 카드. 하단 요소는 mt-auto로 맞춘다 */
export function CourseCard({ course, size = "md" }: { course: Course; size?: "md" | "lg" }) {
  const { openCourse } = useSite();
  return (
    <button type="button" onClick={() => openCourse(course.id)} className="group flex h-full w-full min-w-0 flex-col text-left">
      <CourseImage course={course} w={size === "lg" ? 960 : 560} className="w-full">
        <span className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/15" />
        <span className="absolute bottom-2 right-2 rounded-[6px] bg-[rgba(15,18,22,0.8)] px-1.5 py-0.5 text-[12px] font-semibold leading-[16px] text-white">
          {courseLength(course)}
        </span>
      </CourseImage>
      <div className="mt-3 flex min-w-0 flex-1 flex-col">
        <h3 className={`line-clamp-2 font-semibold text-[var(--eo-fg)] ${size === "lg" ? "text-[20px] leading-[28px]" : "text-[15px] leading-[22px]"}`}>{course.title}</h3>
        <p className="mt-1 truncate text-[13px] leading-[18px] text-[var(--eo-fg-3)]">
          {course.instructor}<span className="hidden md:inline"> | {course.series}</span> | {course.episodes.length}강
        </p>
        <div className="mt-auto pt-3">
          <AccessBadge scope={courseScope(course)} />
        </div>
      </div>
    </button>
  );
}
