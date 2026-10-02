"use client";

import { useState } from "react";
import {
  ArrowLeft,
  BookmarkSimple,
  Buildings,
  ChatCircleDots,
  CheckCircle,
  Envelope,
  Handshake,
  MapPin,
  Phone,
  ShareNetwork,
  UsersThree,
} from "@phosphor-icons/react";
import { COMPANIES, MY_COMPANY, daysUntil, formatDate } from "@/projects/community/linkon/lib/mock-data";
import type { NavigateFn } from "@/projects/community/linkon/lib/navigation";
import {
  Badge,
  BrandMark,
  EmptyState,
  PrimaryButton,
  Reveal,
  SecondaryButton,
  VerifiedBadge,
} from "@/projects/community/linkon/components/layout/ui";

export function CompanyDetailScreen({
  companyId,
  onNavigate,
}: {
  companyId: string;
  onNavigate: NavigateFn;
}) {
  const company = COMPANIES.find((c) => c.id === companyId);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  if (!company) {
    return (
      <div className="mx-auto max-w-[720px] px-6 py-24">
        <EmptyState
          icon={<Buildings size={22} />}
          title="기업 정보를 찾을 수 없습니다"
          description="삭제되었거나 인증이 해제된 기업일 수 있습니다."
          action={<SecondaryButton onClick={() => onNavigate("companies")}>기업 목록으로</SecondaryButton>}
        />
      </div>
    );
  }

  const isMine = company.id === MY_COMPANY.id;
  const related = [...COMPANIES]
    .filter((c) => c.id !== company.id)
    .map((c) => {
      const sameIndustry = c.industry === company.industry ? 3 : 0;
      const sameRegion = c.region.split(" ")[0] === company.region.split(" ")[0] ? 2 : 0;
      const keywordOverlap = c.keywords.filter((k) => company.keywords.includes(k)).length;
      const openCollab = c.collabStatus === "협업 가능" ? 1 : 0;
      return { company: c, score: sameIndustry + sameRegion + keywordOverlap + openCollab };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.company);

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-8 lg:px-10">
      <button
        onClick={() => onNavigate("companies")}
        className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[var(--lk-muted)] transition-colors hover:text-[var(--lk-ink)]"
      >
        <ArrowLeft size={15} weight="bold" />
        기업 찾기
      </button>

      <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--lk-border)]">
        <img
          src={company.cover}
          alt={`${company.name} 소개 이미지`}
          className="h-[220px] w-full object-cover lg:h-[280px]"
        />
      </div>

      <header className="relative z-10 -mt-12 flex flex-col gap-6 rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-7 shadow-[var(--lk-shadow)] lg:mx-8 lg:flex-row lg:items-start">
        <BrandMark logo={company.logo} size={72} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-[26px] font-bold tracking-tight text-[var(--lk-ink)]">{company.name}</h1>
            <span className="text-[15px] font-medium text-[var(--lk-muted)]">{company.enName}</span>
            <VerifiedBadge />
          </div>
          <p className="mt-2.5 max-w-[62ch] text-[15px] leading-relaxed text-[var(--lk-muted)]">
            {company.oneLiner}
          </p>
          <div className="lk-num mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-[var(--lk-muted)]">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--lk-ink)]">
              {company.industry}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={14} />
              {company.region}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <UsersThree size={14} />
              {company.employees}명
            </span>
            <span>{company.foundedYear}년 설립</span>
            <span>{company.stage}</span>
            {company.invested && <span>{company.investment}</span>}
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {company.keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full bg-[var(--lk-surface)] px-2.5 py-1 text-[12px] font-medium text-[var(--lk-muted)]"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-2.5 lg:w-[200px]">
          <Badge
            tone={
              company.collabStatus === "협업 가능"
                ? "success"
                : company.collabStatus === "협업 진행중"
                  ? "warning"
                  : "neutral"
            }
            className="justify-center py-1.5"
          >
            {company.collabStatus}
          </Badge>
          {isMine ? (
            <p className="rounded-lg bg-[var(--lk-surface)] px-4 py-3 text-center text-[13px] font-medium text-[var(--lk-muted)]">
              내 기업 프로필입니다
            </p>
          ) : (
            <PrimaryButton full onClick={() => onNavigate("chat", company.id)}>
              <ChatCircleDots size={16} weight="fill" />
              채팅하기
            </PrimaryButton>
          )}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSaved((v) => !v)}
              className={`inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-[13px] font-semibold transition-colors ${
                saved
                  ? "border-[var(--lk-accent)] bg-[var(--lk-accent-soft)] text-[var(--lk-accent)]"
                  : "border-[var(--lk-border)] text-[var(--lk-ink)] hover:border-[var(--lk-accent)]"
              }`}
            >
              <BookmarkSimple size={15} weight={saved ? "fill" : "regular"} />
              {saved ? "관심 등록됨" : "관심 기업"}
            </button>
            <button
              onClick={() => setShared(true)}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[var(--lk-border)] px-3 py-2 text-[13px] font-semibold text-[var(--lk-ink)] transition-colors hover:border-[var(--lk-accent)]"
            >
              <ShareNetwork size={15} />
              공유
            </button>
          </div>
          {shared && (
            <p className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--lk-success-soft)] px-3 py-2 text-[12.5px] font-semibold text-[var(--lk-success)]">
              <CheckCircle size={14} weight="fill" />
              프로필 링크를 복사했습니다
            </p>
          )}
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-12">
          <Reveal>
            <section>
              <h2 className="text-[19px] font-bold tracking-tight text-[var(--lk-ink)]">기업 소개</h2>
              <p className="mt-3 max-w-[70ch] text-[15px] leading-[1.85] text-[var(--lk-ink)]">
                {company.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {company.services.map((service) => (
                  <span
                    key={service}
                    className="rounded-full border border-[var(--lk-border)] px-3.5 py-1.5 text-[13px] font-semibold text-[var(--lk-ink)]"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section>
              <h2 className="text-[19px] font-bold tracking-tight text-[var(--lk-ink)]">보유 기술</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {company.tech.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-5"
                  >
                    <p className="text-[15px] font-bold text-[var(--lk-ink)]">{item.label}</p>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--lk-muted)]">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section>
              <h2 className="text-[19px] font-bold tracking-tight text-[var(--lk-ink)]">진행 프로젝트</h2>
              <ul className="mt-4 divide-y divide-[var(--lk-border)] border-y border-[var(--lk-border)]">
                {company.projects.map((project) => (
                  <li key={project.title} className="flex flex-wrap items-start gap-x-6 gap-y-2 py-4">
                    <div className="min-w-[200px] flex-1">
                      <p className="text-[15px] font-semibold text-[var(--lk-ink)]">{project.title}</p>
                      <p className="lk-num mt-1 text-[12.5px] text-[var(--lk-muted)]">
                        {project.period} 협업사 {project.partner}
                      </p>
                    </div>
                    <p className="text-[13.5px] font-semibold text-[var(--lk-accent)]">{project.result}</p>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>

          <Reveal>
            <section>
              <h2 className="text-[19px] font-bold tracking-tight text-[var(--lk-ink)]">모집 중인 협업</h2>
              {company.openCollabs.length === 0 ? (
                <div className="mt-4">
                  <EmptyState
                    icon={<Handshake size={22} />}
                    title="현재 모집 중인 협업이 없습니다"
                    description="관심 기업으로 등록해 두면 새 협업이 열릴 때 알림을 받을 수 있습니다."
                  />
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {company.openCollabs.map((collab) => (
                    <div
                      key={collab.title}
                      className="flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-5"
                    >
                      <div className="min-w-[220px] flex-1">
                        <p className="text-[15px] font-bold text-[var(--lk-ink)]">{collab.title}</p>
                        <p className="mt-1.5 text-[13px] text-[var(--lk-muted)]">
                          필요 조건 {collab.need}
                        </p>
                      </div>
                      <div className="lk-num text-[12.5px] text-[var(--lk-muted)]">
                        <p className="font-semibold text-[var(--lk-accent)]">
                          마감 D-{daysUntil(collab.deadline)}
                        </p>
                        <p className="mt-1">지원 {collab.applicants}곳</p>
                      </div>
                      {!isMine && (
                        <SecondaryButton size="sm" onClick={() => onNavigate("chat", company.id)}>
                          제안 보내기
                        </SecondaryButton>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </Reveal>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-5">
            <p className="text-[14px] font-bold text-[var(--lk-ink)]">인증 정보</p>
            <dl className="mt-4 space-y-3 text-[13px]">
              <Row label="소속 기관" value={company.institution} />
              <Row label="선정 사업" value={company.program} />
              <Row label="인증일" value={formatDate(company.verifiedAt)} />
              <Row label="대표자" value={company.ceo} />
            </dl>
          </div>

          <div className="rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-5">
            <p className="text-[14px] font-bold text-[var(--lk-ink)]">담당자</p>
            <p className="mt-3 text-[15px] font-semibold text-[var(--lk-ink)]">
              {company.manager.name}
              <span className="ml-2 text-[13px] font-medium text-[var(--lk-muted)]">
                {company.manager.role}
              </span>
            </p>
            <div className="mt-3 space-y-2 text-[13px] text-[var(--lk-muted)]">
              <p className="flex items-center gap-2">
                <Envelope size={15} />
                {company.manager.email}
              </p>
              <p className="lk-num flex items-center gap-2">
                <Phone size={15} />
                {company.manager.phone}
              </p>
            </div>
            <p className="mt-4 text-[12px] leading-relaxed text-[var(--lk-muted)]">
              연락처는 인증 회원에게만 공개되며 영업 목적의 무단 사용은 이용 제한 사유가 됩니다.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--lk-border)] bg-[var(--lk-elevated)] p-5">
            <p className="text-[14px] font-bold text-[var(--lk-ink)]">비슷한 기업</p>
            <ul className="mt-3 space-y-1">
              {related.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate("companyDetail", item.id)}
                    className="flex w-full items-center gap-3 rounded-lg py-2 text-left transition-colors hover:text-[var(--lk-accent)]"
                  >
                    <BrandMark logo={item.logo} size={32} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-semibold text-[var(--lk-ink)]">
                        {item.name}
                      </span>
                      <span className="block truncate text-[12px] text-[var(--lk-muted)]">
                        {item.industry} {item.region}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="shrink-0 text-[var(--lk-muted)]">{label}</dt>
      <dd className="text-right font-semibold text-[var(--lk-ink)]">{value}</dd>
    </div>
  );
}
