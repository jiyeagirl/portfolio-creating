"use client";

import { Icon } from "@iconify/react";
import { OUTLINKS, getLibrary, photo } from "@/projects/youngin/book/lib/mock-data";
import type { BookNavigate } from "@/projects/youngin/book/lib/navigation";
import type { Facility } from "@/projects/youngin/book/lib/types";
import { Stamp } from "@/projects/youngin/book/components/stamp";
import {
  BottomBar,
  Card,
  Chip,
  Divider,
  InfoNote,
  OutlinkRow,
  PrimaryButton,
  SectionTitle,
} from "@/projects/youngin/book/components/ui";

const FACILITY_ICON: Record<Facility, string> = {
  종합자료실: "solar:book-2-linear",
  어린이자료실: "solar:balloon-linear",
  디지털자료실: "solar:monitor-linear",
  스터디룸: "solar:notebook-linear",
  문화프로그램실: "solar:palette-linear",
  북카페: "solar:cup-hot-linear",
  "장애인 편의시설": "solar:accessibility-linear",
  수유실: "solar:heart-linear",
  야외독서마당: "solar:leaf-linear",
  노트북존: "solar:laptop-linear",
};

const STATUS_TONE = {
  모집중: "read",
  대기접수: "gold",
  마감: "neutral",
} as const;

export function LibraryDetailScreen({
  libraryId,
  onNavigate,
}: {
  libraryId?: string;
  onNavigate: BookNavigate;
}) {
  const library = getLibrary(libraryId);

  return (
    <div className="book-enter relative min-h-full pb-[116px]">
      {/* 히어로 */}
      <div className="relative h-[268px] w-full">
        <img
          src={photo(library.photoId, 786, 536)}
          alt={library.photoAlt}
          className="h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            /* 상단 스톱은 상태바(59pt)와 뒤로가기 버튼이 밝은 사진 위에 올라와도
               읽히도록 잡은 값이다. 흐리게 하면 흰 상태바 글자가 묻는다. */
            background:
              "linear-gradient(to bottom, rgba(22,33,28,0.74) 0%, rgba(22,33,28,0.34) 22%, rgba(22,33,28,0) 40%, rgba(22,33,28,0.8) 100%)",
          }}
        />
        <button
          type="button"
          onClick={() => onNavigate("libraries")}
          aria-label="뒤로"
          className="absolute left-3 top-[63px] flex h-11 w-11 items-center justify-center rounded-full"
          style={{ background: "rgba(22,33,28,0.5)" }}
        >
          <Icon icon="solar:alt-arrow-left-linear" width="22" height="22" color="#F0EEE4" />
        </button>

        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="flex items-center gap-2">
            <Chip tone="accent">{library.district}</Chip>
            {library.newBranch && <Chip tone="event">신규 지점 2배 적립</Chip>}
          </div>
          <h1 className="mt-2.5 text-[26px] font-bold tracking-[-0.02em] text-[#F0EEE4]">
            {library.name}
          </h1>
          <p className="book-num mt-1 text-[13px] text-[rgba(240,238,228,0.76)]">
            {library.address}
          </p>
        </div>
      </div>

      {/* 방문 스탬프 상태 */}
      <section className="px-5 pt-4">
        <Card>
          <div className="flex items-center gap-4 p-4">
            {library.visited ? (
              <Stamp label={library.short} date={library.lastVisitedAt} seed={library.id} size={76} />
            ) : (
              <span
                className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-dashed"
                style={{ borderColor: "var(--bk-line)", background: "var(--bk-surface-sunk)" }}
              >
                <Icon icon="solar:qr-code-linear" width="28" height="28" color="var(--bk-faint)" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[16px] font-semibold text-[var(--bk-ink)]">
                {library.visited ? "방문 스탬프를 받았습니다" : "아직 방문 스탬프가 없습니다"}
              </p>
              <p className="book-num mt-1 text-[13px] leading-[1.55] text-[var(--bk-muted)]">
                {library.visited
                  ? `누적 ${library.visitCount}회 방문 | 최근 ${library.lastVisitedAt}`
                  : "지점에 도착해 입구 QR을 스캔하면 바로 적립됩니다"}
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* QR 설치 위치 */}
      <section className="px-5 pt-3">
        <InfoNote icon="solar:qr-code-linear">
          QR 설치 위치: {library.qrSpot}
        </InfoNote>
      </section>

      {/* 운영 정보 */}
      <section className="px-5 pt-7">
        <SectionTitle title="운영시간 및 위치" />
        <Card>
          <dl className="text-[14px]">
            {[
              { term: "평일", desc: library.hours.weekday, icon: "solar:clock-circle-linear" },
              { term: "주말", desc: library.hours.weekend, icon: "solar:calendar-linear" },
              { term: "휴관일", desc: library.hours.closed, icon: "solar:close-circle-linear" },
              { term: "전화", desc: library.tel, icon: "solar:phone-linear" },
              {
                term: "거리",
                desc: `현재 위치에서 ${library.distanceKm}km`,
                icon: "solar:routing-2-linear",
              },
            ].map((row, index) => (
              <div key={row.term}>
                {index > 0 && <Divider />}
                <div className="flex min-h-[52px] items-center gap-3 px-4 py-3">
                  <Icon icon={row.icon} width="18" height="18" color="var(--bk-faint)" />
                  <dt className="w-[54px] shrink-0 text-[13.5px] font-medium text-[var(--bk-muted)]">
                    {row.term}
                  </dt>
                  <dd className="book-num min-w-0 flex-1 text-[14px] font-medium text-[var(--bk-ink)]">
                    {row.desc}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </Card>
      </section>

      {/* 특화시설 */}
      <section className="px-5 pt-7">
        <SectionTitle title="특화시설" caption={`${library.facilities.length}개 시설 운영`} />
        <div className="grid grid-cols-2 gap-2.5">
          {library.facilities.map((facility) => (
            <div
              key={facility}
              className="flex min-h-[52px] items-center gap-2.5 rounded-[10px] border border-[var(--bk-line)] px-3 py-2.5"
              style={{ background: "var(--bk-surface)" }}
            >
              <Icon
                icon={FACILITY_ICON[facility]}
                width="19"
                height="19"
                color="var(--bk-accent)"
              />
              <span className="text-[13.5px] font-medium text-[var(--bk-body)]">{facility}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 문화프로그램 */}
      <section className="px-5 pt-7">
        <SectionTitle title="문화프로그램" caption="접수는 용인시 도서관 시스템에서 진행합니다" />
        <div className="grid gap-2.5">
          {library.programs.map((program) => (
            <Card key={program.id}>
              <div className="p-4">
                <div className="flex items-start gap-2">
                  <h3 className="min-w-0 flex-1 text-[15px] font-semibold leading-[1.35] text-[var(--bk-ink)]">
                    {program.title}
                  </h3>
                  <Chip tone={STATUS_TONE[program.status]}>{program.status}</Chip>
                </div>
                <p className="book-num mt-2 text-[12.5px] text-[var(--bk-muted)]">
                  {program.period}
                </p>
                <p className="book-num mt-1 text-[12.5px] text-[var(--bk-muted)]">
                  {program.target} | {program.slots}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 아웃링크 */}
      <section className="px-5 pt-7">
        <SectionTitle title="이 지점 자료 이용" />
        <Card>
          {OUTLINKS.map((link, index) => (
            <div key={link.id}>
              {index > 0 && <Divider />}
              <OutlinkRow
                title={link.title}
                detail={`${library.name} ${link.detail.replace("용인시 도서관 통합 검색으로 이동", "소장자료 바로 검색")}`}
                icon={link.icon}
              />
            </div>
          ))}
        </Card>
      </section>

      <BottomBar>
        <PrimaryButton icon="solar:qr-code-bold" onClick={() => onNavigate("scan", library.id)}>
          {library.visited ? "오늘 방문 인증하기" : "QR로 방문 인증하기"}
        </PrimaryButton>
      </BottomBar>
    </div>
  );
}
