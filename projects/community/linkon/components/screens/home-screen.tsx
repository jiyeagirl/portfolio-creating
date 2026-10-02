"use client";

import {
  ArrowRight,
  Buildings,
  CalendarCheck,
  ChatCircleDots,
  Handshake,
  Lightning,
  Megaphone,
  Question,
  SealCheck,
  Users,
} from "@phosphor-icons/react";
import {
  BOARD_POSTS,
  COMPANIES,
  CURRENT_USER,
  EVENTS,
  FEED_POSTS,
  MY_COMPANY,
  PROGRAMS_LIST,
  QUESTIONS,
  daysUntil,
  formatDate,
  formatRelativeTime,
} from "@/projects/community/linkon/lib/mock-data";
import type { NavigateFn } from "@/projects/community/linkon/lib/navigation";
import {
  Badge,
  BrandMark,
  MoreLink,
  PrimaryButton,
  ProgressBar,
  Reveal,
  SectionHeader,
  VerifiedBadge,
} from "@/projects/community/linkon/components/layout/ui";

const QUICK_MENU = [
  { view: "companies", label: "기업 찾기", detail: "산업·지역·협업 조건으로 탐색", icon: Buildings },
  { view: "feed", label: "네트워킹 피드", detail: "협업 모집과 창업 후기", icon: Handshake },
  { view: "mentor", label: "멘토 Q&A", detail: "투자·법률·특허 전문가 답변", icon: Question },
  { view: "board", label: "정보게시판", detail: "지원사업 공고와 자료실", icon: Megaphone },
] as const;

export function HomeScreen({
  onNavigate,
  unreadChats,
}: {
  onNavigate: NavigateFn;
  unreadChats: number;
}) {
  const featuredNotice = BOARD_POSTS.find((p) => p.pinned)!;
  const featuredProgram = BOARD_POSTS.find((p) => p.id === "b2")!;
  const featuredEvent = EVENTS[0];
  const recommended = COMPANIES.filter(
    (c) => c.id !== MY_COMPANY.id && c.collabStatus === "협업 가능",
  ).slice(0, 6);
  const recentJoined = [...COMPANIES]
    .sort((a, b) => b.joinedAt.localeCompare(a.joinedAt))
    .filter((c) => c.id !== MY_COMPANY.id)
    .slice(0, 4);
  const popularPosts = [...BOARD_POSTS].sort((a, b) => b.views - a.views).slice(0, 5);
  const recentQuestions = QUESTIONS.slice(0, 3);
  const openCollabs = FEED_POSTS.filter((p) => p.recruiting).slice(0, 2);
  const myEvents = EVENTS.filter((e) => e.myStatus);
  const upcomingPrograms = PROGRAMS_LIST.filter((p) => p.status === "모집중");

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-10 lg:px-10">
      {/* 1. 인사 + 내 기업 인증 상태 */}
      <section className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div>
          <p className="text-[13.5px] font-semibold text-[var(--lk-accent)]">
            {MY_COMPANY.institution} {MY_COMPANY.program}
          </p>
          <h1 className="mt-2 text-[30px] font-bold leading-[1.25] tracking-tight text-[var(--lk-ink)] lg:text-[34px]">
            {CURRENT_USER.name}님, 오늘 확인할 협업 소식이
            <br className="hidden sm:block" /> 3건 있습니다.
          </h1>
          <p className="mt-3 max-w-[52ch] text-[14.5px] leading-relaxed text-[var(--lk-muted)]">
            인증을 마친 선정기업 486곳이 함께 사용하고 있습니다. 관심 분야에 맞는 기업과 모집 중인
            협업을 아래에서 확인하세요.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <PrimaryButton onClick={() => onNavigate("companies")}>
              협업 가능 기업 보기
              <ArrowRight size={16} weight="bold" />
            </PrimaryButton>
            <button
              onClick={() => onNavigate("feedWrite")}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--lk-border)] bg-[var(--lk-elevated)] px-5 py-2.5 text-[14px] font-semibold text-[var(--lk-ink)] transition-colors hover:border-[var(--lk-accent)] hover:text-[var(--lk-accent)]"
            >
              협업 모집 글 쓰기
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-6">
          <div className="flex items-start gap-3">
            <BrandMark logo={MY_COMPANY.logo} size={46} />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-[16px] font-bold text-[var(--lk-ink)]">{MY_COMPANY.name}</p>
                <VerifiedBadge />
              </div>
              <p className="mt-0.5 text-[12.5px] text-[var(--lk-muted)]">
                {formatDate(MY_COMPANY.verifiedAt)} 인증 완료
              </p>
            </div>
          </div>
          <dl className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-xl bg-[var(--lk-border)]">
            {[
              { label: "안 읽은 메시지", value: unreadChats, view: "chat" as const },
              { label: "받은 협업 제안", value: 2, view: "chat" as const },
              { label: "신청한 행사", value: myEvents.length, view: "board" as const },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => onNavigate(item.view)}
                className="bg-[var(--lk-elevated)] px-3 py-4 text-left transition-colors hover:bg-[var(--lk-surface)]"
              >
                <dt className="text-[12px] font-medium text-[var(--lk-muted)]">{item.label}</dt>
                <dd className="lk-num mt-1.5 text-[22px] font-bold leading-none text-[var(--lk-ink)]">
                  {item.value}
                </dd>
              </button>
            ))}
          </dl>
          <p className="mt-4 flex items-center gap-1.5 text-[12.5px] text-[var(--lk-muted)]">
            <SealCheck size={14} weight="fill" className="text-[var(--lk-accent)]" />
            기업 인증 회원만 프로필과 연락처를 볼 수 있습니다.
          </p>
        </div>
      </section>

      {/* 2. 메인 배너 */}
      <Reveal className="mt-14">
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <button
            onClick={() => onNavigate("boardDetail", featuredProgram.id)}
            className="group relative overflow-hidden rounded-2xl bg-[var(--lk-accent)] p-8 text-left text-[var(--lk-accent-fg)]"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--lk-accent-fg)]/15 px-3 py-1 text-[12px] font-semibold">
              진행 중인 지원사업
            </span>
            <h2 className="mt-5 max-w-[22ch] text-[26px] font-bold leading-tight tracking-tight lg:text-[30px]">
              {featuredProgram.title}
            </h2>
            <p className="mt-3 max-w-[46ch] text-[14px] leading-relaxed opacity-85">
              {featuredProgram.summary}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-semibold">
              <span className="lk-num">마감 D-{daysUntil(featuredProgram.deadline!)}</span>
              <span className="opacity-80">{formatDate(featuredProgram.deadline!)}까지</span>
              <span className="ml-auto inline-flex items-center gap-1.5 transition-transform group-hover:translate-x-1">
                공고 자세히 보기
                <ArrowRight size={15} weight="bold" />
              </span>
            </div>
          </button>

          <div className="grid gap-4">
            <button
              onClick={() => onNavigate("board")}
              className="group flex items-center gap-4 overflow-hidden rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-4 text-left"
            >
              <img
                src={featuredEvent.image}
                alt={`${featuredEvent.title} 안내 이미지`}
                className="h-[92px] w-[124px] shrink-0 rounded-xl object-cover"
              />
              <span className="min-w-0">
                <Badge tone="accent">네트워킹 행사</Badge>
                <span className="mt-2 block truncate text-[15px] font-bold text-[var(--lk-ink)]">
                  {featuredEvent.title}
                </span>
                <span className="lk-num mt-1 block text-[12.5px] text-[var(--lk-muted)]">
                  {formatDate(featuredEvent.date)} {featuredEvent.time}
                </span>
                <span className="lk-num mt-1.5 block text-[12.5px] font-semibold text-[var(--lk-accent)]">
                  {featuredEvent.applied}/{featuredEvent.capacity}명 신청
                </span>
              </span>
            </button>

            <button
              onClick={() => onNavigate("boardDetail", featuredNotice.id)}
              className="rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-5 text-left"
            >
              <span className="flex items-center gap-2 text-[12px] font-semibold text-[var(--lk-muted)]">
                <Megaphone size={14} weight="fill" className="text-[var(--lk-accent)]" />
                공지사항
              </span>
              <span className="mt-2 block text-[15px] font-bold leading-snug text-[var(--lk-ink)]">
                {featuredNotice.title}
              </span>
              <span className="mt-1.5 block text-[12.5px] text-[var(--lk-muted)]">
                {featuredNotice.authorOrg} {formatRelativeTime(featuredNotice.createdAt)}
              </span>
            </button>
          </div>
        </div>
      </Reveal>

      {/* 3. 추천 기업 */}
      <Reveal className="mt-16">
        <SectionHeader
          title="관심 분야 기반 추천 기업"
          description={`${CURRENT_USER.interests.slice(0, 3).join(", ")} 키워드와 겹치는 협업 가능 기업입니다.`}
          action={<MoreLink onClick={() => onNavigate("companies")} />}
        />
        <div className="lk-scroll-x mt-6 flex gap-4 overflow-x-auto pb-2">
          {recommended.map((company) => (
            <button
              key={company.id}
              onClick={() => onNavigate("companyDetail", company.id)}
              className="w-[290px] shrink-0 overflow-hidden rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] text-left transition-colors hover:border-[var(--lk-accent)]"
            >
              <img
                src={company.cover}
                alt=""
                className="h-[132px] w-full object-cover"
              />
              <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <BrandMark logo={company.logo} size={44} />
                <Badge tone="success">{company.collabStatus}</Badge>
              </div>
              <p className="mt-4 text-[16px] font-bold text-[var(--lk-ink)]">{company.name}</p>
              <p className="mt-1.5 line-clamp-2 min-h-[40px] text-[13px] leading-relaxed text-[var(--lk-muted)]">
                {company.oneLiner}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {company.keywords.slice(0, 3).map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full bg-[var(--lk-surface)] px-2.5 py-1 text-[11.5px] font-medium text-[var(--lk-muted)]"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] px-5 py-4">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-[13.5px] font-bold text-[var(--lk-ink)]">
              <Users size={16} weight="fill" className="text-[var(--lk-accent)]" />
              최근 가입 기업
            </p>
            <MoreLink onClick={() => onNavigate("companies")} />
          </div>
          <ul className="mt-3 grid gap-x-6 gap-y-1 sm:grid-cols-2 xl:grid-cols-4">
            {recentJoined.map((company) => (
              <li key={company.id}>
                <button
                  onClick={() => onNavigate("companyDetail", company.id)}
                  className="flex w-full items-center gap-2.5 rounded-lg py-2 text-left transition-colors hover:text-[var(--lk-accent)]"
                >
                  <BrandMark logo={company.logo} size={30} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-semibold text-[var(--lk-ink)]">
                      {company.name}
                    </span>
                    <span className="block truncate text-[12px] text-[var(--lk-muted)]">
                      {company.industry}
                    </span>
                  </span>
                  <span className="lk-num shrink-0 text-[11.5px] text-[var(--lk-muted)]">
                    {formatDate(company.joinedAt)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* 4. 최신 커뮤니티 */}
      <Reveal className="mt-16">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <SectionHeader title="인기 게시글" action={<MoreLink onClick={() => onNavigate("board")} />} />
            <ol className="mt-5 divide-y divide-[var(--lk-border)] border-y border-[var(--lk-border)]">
              {popularPosts.map((post, index) => (
                <li key={post.id}>
                  <button
                    onClick={() => onNavigate("boardDetail", post.id)}
                    className="flex w-full items-center gap-4 py-3.5 text-left"
                  >
                    <span className="lk-num w-5 shrink-0 text-[15px] font-bold text-[var(--lk-accent)]">
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14.5px] font-semibold text-[var(--lk-ink)]">
                        {post.title}
                      </span>
                      <span className="mt-1 block truncate text-[12.5px] text-[var(--lk-muted)]">
                        {post.category} {post.authorOrg}
                      </span>
                    </span>
                    <span className="lk-num shrink-0 text-[12.5px] font-medium text-[var(--lk-muted)]">
                      조회 {post.views.toLocaleString()}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-8">
            <div>
              <SectionHeader title="최근 질문" action={<MoreLink onClick={() => onNavigate("mentor")} />} />
              <ul className="mt-5 space-y-3">
                {recentQuestions.map((question) => (
                  <li key={question.id}>
                    <button
                      onClick={() => onNavigate("mentorDetail", question.id)}
                      className="w-full rounded-xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] px-4 py-3.5 text-left transition-colors hover:border-[var(--lk-accent)]"
                    >
                      <span className="flex items-center gap-2">
                        <Badge tone="accent">{question.category}</Badge>
                        {question.answers.some((a) => a.accepted) && (
                          <Badge tone="success">답변 채택</Badge>
                        )}
                      </span>
                      <span className="mt-2 block line-clamp-2 text-[14px] font-semibold leading-snug text-[var(--lk-ink)]">
                        {question.title}
                      </span>
                      <span className="lk-num mt-1.5 block text-[12px] text-[var(--lk-muted)]">
                        {question.askerLabel} {formatRelativeTime(question.createdAt)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SectionHeader title="최신 협업 모집" action={<MoreLink onClick={() => onNavigate("feed")} />} />
              <ul className="mt-5 space-y-3">
                {openCollabs.map((post) => {
                  const company = COMPANIES.find((c) => c.id === post.companyId)!;
                  return (
                    <li key={post.id}>
                      <button
                        onClick={() => onNavigate("feed")}
                        className="flex w-full items-start gap-3 rounded-xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] px-4 py-3.5 text-left transition-colors hover:border-[var(--lk-accent)]"
                      >
                        <BrandMark logo={company.logo} size={34} />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13.5px] font-bold text-[var(--lk-ink)]">
                            {company.name}
                          </span>
                          <span className="mt-1 block line-clamp-2 text-[13px] leading-relaxed text-[var(--lk-muted)]">
                            {post.recruiting!.role} 모집
                          </span>
                          <span className="lk-num mt-1.5 block text-[12px] font-semibold text-[var(--lk-accent)]">
                            마감 D-{daysUntil(post.recruiting!.deadline)}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </Reveal>

      {/* 5. 일정 + 빠른 메뉴 */}
      <Reveal className="mt-16">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <SectionHeader title="내 일정" description="신청한 행사와 예정된 프로그램입니다." />
            <ul className="mt-5 space-y-px">
              {myEvents.map((event) => (
                <li
                  key={event.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-[var(--lk-border)] py-4"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--lk-accent-soft)] text-[var(--lk-accent)]">
                    <CalendarCheck size={19} weight="fill" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14.5px] font-semibold text-[var(--lk-ink)]">
                      {event.title}
                    </span>
                    <span className="lk-num mt-0.5 block text-[12.5px] text-[var(--lk-muted)]">
                      {formatDate(event.date)} {event.time} {event.place}
                    </span>
                  </span>
                  <Badge tone="accent">{event.myStatus}</Badge>
                  <span className="lk-num text-[12.5px] font-semibold text-[var(--lk-muted)]">
                    D-{daysUntil(event.date)}
                  </span>
                </li>
              ))}
              {upcomingPrograms.map((program) => (
                <li
                  key={program.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-[var(--lk-border)] py-4"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--lk-surface)] text-[var(--lk-muted)]">
                    <Lightning size={19} weight="fill" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[14.5px] font-semibold text-[var(--lk-ink)]">
                      {program.title}
                    </span>
                    <span className="lk-num mt-0.5 block text-[12.5px] text-[var(--lk-muted)]">
                      {program.period} {program.target}
                    </span>
                  </span>
                  <span className="w-[120px]">
                    <ProgressBar value={program.applied} max={program.capacity} />
                    <span className="lk-num mt-1.5 block text-[11.5px] text-[var(--lk-muted)]">
                      신청 {program.applied} / 정원 {program.capacity}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SectionHeader title="빠른 메뉴" />
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {QUICK_MENU.map((item) => (
                <button
                  key={item.view}
                  onClick={() => onNavigate(item.view)}
                  className="group rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-5 text-left transition-colors hover:border-[var(--lk-accent)]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--lk-surface)] text-[var(--lk-accent)] transition-colors group-hover:bg-[var(--lk-accent-soft)]">
                    <item.icon size={19} weight="fill" />
                  </span>
                  <span className="mt-4 block text-[15px] font-bold text-[var(--lk-ink)]">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-[12.5px] leading-relaxed text-[var(--lk-muted)]">
                    {item.detail}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => onNavigate("chat")}
              className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] px-5 py-4 text-left transition-colors hover:border-[var(--lk-accent)]"
            >
              <ChatCircleDots size={20} weight="fill" className="text-[var(--lk-accent)]" />
              <span className="flex-1 text-[14px] font-semibold text-[var(--lk-ink)]">
                진행 중인 기업 채팅 확인
              </span>
              <span className="lk-num rounded-full bg-[var(--lk-danger-soft)] px-2.5 py-1 text-[12px] font-bold text-[var(--lk-danger)]">
                {unreadChats}
              </span>
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
