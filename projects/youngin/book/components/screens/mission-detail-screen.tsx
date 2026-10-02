"use client";

import { Icon } from "@iconify/react";
import {
  LIBRARIES,
  RECOMMENDED_BOOKS,
  getMission,
  photo,
} from "@/projects/youngin/book/lib/mock-data";
import type { BookNavigate } from "@/projects/youngin/book/lib/navigation";
import { BookCover } from "@/projects/youngin/book/components/stamp";
import {
  BottomBar,
  Card,
  Chip,
  Divider,
  InfoNote,
  PrimaryButton,
  ProgressBar,
  ScreenHeader,
  SectionTitle,
} from "@/projects/youngin/book/components/ui";

export function MissionDetailScreen({
  missionId,
  onNavigate,
}: {
  missionId?: string;
  onNavigate: BookNavigate;
}) {
  const mission = getMission(missionId);
  const done = mission.progress >= mission.goal;
  const books = mission.books
    ? RECOMMENDED_BOOKS.filter((b) => mission.books?.includes(b.id))
    : [];
  const unvisited = LIBRARIES.filter((l) => !l.visited);

  return (
    <div className="book-enter relative min-h-full pb-[116px]">
      <ScreenHeader title={mission.label} onBack={() => onNavigate("home")} />

      {/* 히어로 */}
      {mission.photoId ? (
        <div className="relative h-[188px] w-full">
          <img
            src={photo(mission.photoId, 786, 376)}
            alt={mission.photoAlt ?? ""}
            className="h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to top, rgba(22,33,28,0.82), rgba(22,33,28,0.05))",
            }}
          />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <h1 className="text-[24px] font-bold leading-[1.32] tracking-[-0.02em] text-[#F0EEE4]">
              {mission.title}
            </h1>
            <p className="book-num mt-1.5 text-[12.5px] text-[rgba(240,238,228,0.76)]">
              {mission.period}
            </p>
          </div>
        </div>
      ) : (
        <div className="px-5 pt-5">
          <h1 className="text-[24px] font-bold leading-[1.32] tracking-[-0.02em] text-[var(--bk-ink)]">
            {mission.title}
          </h1>
          <p className="book-num mt-1.5 text-[12.5px] text-[var(--bk-muted)]">{mission.period}</p>
        </div>
      )}

      {/* 진행 상황 */}
      <section className="px-5 pt-4">
        <Card>
          <div className="p-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[12.5px] font-medium text-[var(--bk-muted)]">진행 상황</p>
                <p className="book-num mt-1 text-[28px] font-bold leading-none tracking-[-0.02em] text-[var(--bk-ink)]">
                  {mission.progress}
                  <span className="text-[16px] font-semibold text-[var(--bk-muted)]">
                    /{mission.goal}
                    {mission.unit}
                  </span>
                </p>
              </div>
              <Chip tone={done ? "read" : "event"}>
                {done ? "달성 완료" : `D-${mission.daysLeft}`}
              </Chip>
            </div>
            <div className="mt-3.5">
              <ProgressBar value={mission.progress} goal={mission.goal} height={9} />
            </div>
            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              <Chip tone="gold" icon="solar:gift-linear">
                {mission.reward}
              </Chip>
              {mission.priority && <Chip tone="visit">{mission.priority}</Chip>}
            </div>
          </div>
        </Card>
      </section>

      {/* 설명 */}
      <section className="px-5 pt-6">
        <p className="text-[14.5px] leading-[1.68] text-[var(--bk-body)]">{mission.description}</p>
      </section>

      {/* 참여 방법 */}
      <section className="px-5 pt-7">
        <SectionTitle title="참여 방법" />
        <Card>
          <ol className="p-4">
            {mission.steps.map((step, index) => (
              <li key={step} className="flex gap-3 py-2">
                <span
                  className="book-num flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold"
                  style={{ background: "var(--bk-accent-soft)", color: "var(--bk-accent)" }}
                >
                  {index + 1}
                </span>
                <p className="text-[13.5px] leading-[1.55] text-[var(--bk-body)]">{step}</p>
              </li>
            ))}
          </ol>
        </Card>
      </section>

      {/* 추천도서 */}
      {books.length > 0 && (
        <section className="pt-7">
          <div className="px-5">
            <SectionTitle title="8월의 책 3권" caption="전 지점 소장, 예약 신청 가능" />
          </div>
          <div className="book-scroll-x flex gap-3 overflow-x-auto px-5">
            {books.map((book) => (
              <div
                key={book.id}
                className="w-[214px] shrink-0 rounded-[14px] border border-[var(--bk-line)] bg-[var(--bk-surface)] p-3.5"
              >
                <div className="flex gap-3">
                  <BookCover
                    title={book.title}
                    author={book.author}
                    category={book.category}
                    width={70}
                  />
                  <div className="min-w-0 flex-1">
                    <Chip>{book.category}</Chip>
                    <p className="mt-2 text-[14px] font-semibold leading-[1.35] text-[var(--bk-ink)]">
                      {book.title}
                    </p>
                    <p className="book-num mt-1 text-[11.5px] text-[var(--bk-muted)]">
                      {book.author} | {book.pages}쪽
                    </p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-3 text-[12.5px] leading-[1.55] text-[var(--bk-muted)]">
                  {book.blurb}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="book-num text-[11.5px] font-semibold text-[var(--bk-accent)]">
                    대출 가능 {book.available}권 / 소장 {book.holdings}권
                  </span>
                  <Icon
                    icon="solar:square-top-down-linear"
                    width="15"
                    height="15"
                    color="var(--bk-faint)"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 지점 순회 미션이면 미방문 지점 */}
      {mission.kind === "branch" && (
        <section className="px-5 pt-7">
          <SectionTitle
            title="아직 안 가 본 지점"
            caption={`${unvisited.length}곳 남았습니다`}
            action="지도 보기"
            onAction={() => onNavigate("libraries")}
          />
          <Card>
            {unvisited.map((library, index) => (
              <div key={library.id}>
                {index > 0 && <Divider />}
                <button
                  type="button"
                  onClick={() => onNavigate("libraryDetail", library.id)}
                  className="flex min-h-[64px] w-full items-center gap-3 px-4 py-3 text-left transition-colors active:bg-[var(--bk-surface-soft)]"
                >
                  <img
                    src={photo(library.photoId, 96, 96)}
                    alt={library.photoAlt}
                    className="h-11 w-11 shrink-0 rounded-[8px] object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14.5px] font-semibold text-[var(--bk-ink)]">
                      {library.name}
                    </p>
                    <p className="book-num mt-0.5 text-[12px] text-[var(--bk-muted)]">
                      {library.district} | {library.distanceKm}km
                    </p>
                  </div>
                  {library.newBranch && <Chip tone="event">2배 적립</Chip>}
                </button>
              </div>
            ))}
          </Card>
        </section>
      )}

      {/* 참여 현황 */}
      <section className="px-5 pt-7">
        <Card>
          <div className="flex items-center gap-3.5 p-4">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px]"
              style={{ background: "var(--bk-surface-soft)" }}
            >
              <Icon
                icon="solar:users-group-rounded-linear"
                width="21"
                height="21"
                color="var(--bk-muted)"
              />
            </span>
            <div className="min-w-0 flex-1">
              <p className="book-num text-[15px] font-semibold text-[var(--bk-ink)]">
                용인시민 {mission.joined.toLocaleString("ko-KR")}명 참여 중
              </p>
              <p className="mt-0.5 text-[12.5px] text-[var(--bk-muted)]">
                집계된 인증은 용인시 독서문화진흥 시행계획 실적으로 쓰입니다
              </p>
            </div>
          </div>
        </Card>
      </section>

      <section className="px-5 pt-3">
        <InfoNote icon="solar:refresh-circle-linear">
          미션은 매달 1일 오전 9시에 새 주제로 바뀝니다. 지난달 미션은 마감 후 기록에만 남습니다.
        </InfoNote>
      </section>

      <BottomBar>
        <PrimaryButton
          icon={mission.kind === "branch" ? "solar:qr-code-bold" : "solar:camera-bold"}
          onClick={() => onNavigate(mission.kind === "branch" ? "scan" : "bookCertify")}
          disabled={done}
        >
          {done ? "이번 달 미션을 달성했습니다" : "미션 인증하기"}
        </PrimaryButton>
      </BottomBar>
    </div>
  );
}
