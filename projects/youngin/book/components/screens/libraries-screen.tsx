"use client";

import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { LIBRARIES, OUTLINKS, photo } from "@/projects/youngin/book/lib/mock-data";
import type { BookNavigate } from "@/projects/youngin/book/lib/navigation";
import {
  Card,
  Chip,
  Divider,
  FilterChips,
  OutlinkRow,
  SectionTitle,
} from "@/projects/youngin/book/components/ui";

type Filter = "all" | "처인구" | "기흥구" | "수지구" | "unvisited";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "전체 8곳" },
  { key: "unvisited", label: "미방문 4곳" },
  { key: "처인구", label: "처인구" },
  { key: "기흥구", label: "기흥구" },
  { key: "수지구", label: "수지구" },
];

export function LibrariesScreen({ onNavigate }: { onNavigate: BookNavigate }) {
  const [filter, setFilter] = useState<Filter>("all");

  const list = useMemo(() => {
    if (filter === "all") return LIBRARIES;
    if (filter === "unvisited") return LIBRARIES.filter((l) => !l.visited);
    return LIBRARIES.filter((l) => l.district === filter);
  }, [filter]);

  const visitedCount = LIBRARIES.filter((l) => l.visited).length;

  return (
    <div className="book-enter min-h-full pb-[104px] pt-[59px]">
      <header className="px-5 pb-4 pt-4">
        <h1 className="text-[22px] font-bold tracking-[-0.02em] text-[var(--bk-ink)]">
          도서관 안내
        </h1>
        <p className="mt-1 text-[13px] text-[var(--bk-muted)]">
          용인시 공공도서관 8곳 중{" "}
          <span className="book-num font-semibold text-[var(--bk-accent)]">{visitedCount}곳</span>{" "}
          방문했습니다
        </p>
      </header>

      {/* 검색 */}
      <div className="px-5">
        <div
          className="flex h-12 items-center gap-2.5 rounded-[10px] border border-[var(--bk-line)] px-3.5"
          style={{ background: "var(--bk-surface)" }}
        >
          <Icon icon="solar:magnifer-linear" width="19" height="19" color="var(--bk-faint)" />
          <span className="text-[14.5px] text-[var(--bk-faint)]">
            도서관 이름, 동네 이름으로 검색
          </span>
        </div>
      </div>

      {/* 지도 */}
      <section className="px-5 pt-4">
        <div className="relative overflow-hidden rounded-[14px] border border-[var(--bk-line)]">
          <div
            className="relative h-[212px] w-full"
            style={{
              background:
                "linear-gradient(160deg, #EDF1EA 0%, #E6ECE3 45%, #E9E7DA 100%)",
            }}
          >
            {/* 용인시 3개 구를 단순화한 도식. 실제 지도 타일 대신 형태만 보여준다. */}
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
              <path
                d="M8 30 L34 14 L52 22 L48 44 L22 52 Z"
                fill="rgba(30,107,78,0.07)"
                stroke="rgba(30,107,78,0.22)"
                strokeWidth="0.6"
              />
              <path
                d="M34 14 L70 10 L82 30 L66 46 L48 44 L52 22 Z"
                fill="rgba(30,107,78,0.05)"
                stroke="rgba(30,107,78,0.2)"
                strokeWidth="0.6"
              />
              <path
                d="M22 52 L48 44 L66 46 L88 58 L74 90 L36 84 Z"
                fill="rgba(30,107,78,0.09)"
                stroke="rgba(30,107,78,0.24)"
                strokeWidth="0.6"
              />
              <path
                d="M4 62 Q30 56 58 66 T98 72"
                fill="none"
                stroke="rgba(44,95,134,0.28)"
                strokeWidth="1.4"
              />
            </svg>

            <span className="absolute left-[11%] top-[44%] text-[10.5px] font-semibold text-[rgba(30,107,78,0.5)]">
              수지구
            </span>
            <span className="absolute left-[52%] top-[13%] text-[10.5px] font-semibold text-[rgba(30,107,78,0.5)]">
              기흥구
            </span>
            <span className="absolute left-[48%] top-[76%] text-[10.5px] font-semibold text-[rgba(30,107,78,0.5)]">
              처인구
            </span>

            {LIBRARIES.map((library) => (
              <button
                key={library.id}
                type="button"
                onClick={() => onNavigate("libraryDetail", library.id)}
                aria-label={`${library.name} 상세보기`}
                className="absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                style={{ left: `${library.map.x}%`, top: `${library.map.y}%` }}
              >
                <span
                  className="flex h-[26px] w-[26px] items-center justify-center rounded-full border-2"
                  style={{
                    background: library.visited ? "var(--bk-accent)" : "var(--bk-surface)",
                    borderColor: library.visited ? "var(--bk-accent)" : "var(--bk-faint)",
                  }}
                >
                  <Icon
                    icon={library.visited ? "solar:verified-check-bold" : "solar:book-linear"}
                    width="14"
                    height="14"
                    color={library.visited ? "var(--bk-on-accent)" : "var(--bk-muted)"}
                  />
                </span>
              </button>
            ))}
          </div>

          <div
            className="flex items-center gap-4 border-t border-[var(--bk-line)] px-3.5 py-2.5"
            style={{ background: "var(--bk-surface)" }}
          >
            <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-[var(--bk-muted)]">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: "var(--bk-accent)" }}
              />
              방문 완료
            </span>
            <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-[var(--bk-muted)]">
              <span
                className="h-2.5 w-2.5 rounded-full border-2"
                style={{ borderColor: "var(--bk-faint)", background: "var(--bk-surface)" }}
              />
              미방문
            </span>
            <span className="ml-auto text-[11.5px] font-medium text-[var(--bk-faint)]">
              핀을 눌러 상세보기
            </span>
          </div>
        </div>
      </section>

      {/* 필터 */}
      <div className="px-5 pt-5">
        <FilterChips options={FILTERS} value={filter} onChange={setFilter} />
      </div>

      {/* 목록 */}
      <section className="px-5 pt-4">
        <div className="grid gap-3">
          {list.map((library, index) => (
            <Card
              key={library.id}
              onClick={() => onNavigate("libraryDetail", library.id)}
              label={`${library.name} 상세보기`}
              className="book-enter"
              style={{ animationDelay: `${Math.min(index, 5) * 40}ms` }}
            >
              <div className="flex gap-3.5 p-3.5">
                <div className="relative h-[86px] w-[86px] shrink-0 overflow-hidden rounded-[10px]">
                  <img
                    src={photo(library.photoId, 200, 200)}
                    alt={library.photoAlt}
                    className="h-full w-full object-cover"
                  />
                  {library.visited && (
                    <span
                      className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full"
                      style={{ background: "var(--bk-accent)" }}
                    >
                      <Icon
                        icon="solar:check-circle-bold"
                        width="14"
                        height="14"
                        color="var(--bk-on-accent)"
                      />
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-2">
                    <h3 className="min-w-0 flex-1 text-[16px] font-semibold leading-[1.3] tracking-[-0.01em] text-[var(--bk-ink)]">
                      {library.name}
                    </h3>
                    {library.newBranch && <Chip tone="event">신규</Chip>}
                  </div>

                  <p className="book-num mt-1 text-[12.5px] text-[var(--bk-muted)]">
                    {library.district} | {library.distanceKm}km
                  </p>

                  <p className="book-num mt-1 flex items-center gap-1 text-[12.5px]">
                    <span
                      className="font-semibold"
                      style={{
                        color: library.isOpenNow ? "var(--bk-accent)" : "var(--bk-event)",
                      }}
                    >
                      {library.isOpenNow ? "운영중" : "오늘 휴관"}
                    </span>
                    <span className="text-[var(--bk-faint)]">|</span>
                    <span className="text-[var(--bk-muted)]">{library.hours.weekday}</span>
                  </p>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {library.visited ? (
                      <Chip tone="visit" icon="solar:verified-check-bold">
                        방문 {library.visitCount}회
                      </Chip>
                    ) : (
                      <Chip tone="neutral">방문 전</Chip>
                    )}
                    {library.facilities.slice(0, 2).map((facility) => (
                      <Chip key={facility}>{facility}</Chip>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 기존 시스템 아웃링크 */}
      <section className="px-5 pt-7">
        <SectionTitle
          title="도서 검색 / 대출 / 예약"
          caption="용인시 도서관 통합 시스템에서 그대로 이용합니다"
        />
        <Card>
          {OUTLINKS.map((link, index) => (
            <div key={link.id}>
              {index > 0 && <Divider />}
              <OutlinkRow title={link.title} detail={link.detail} icon={link.icon} />
            </div>
          ))}
        </Card>
      </section>
    </div>
  );
}
