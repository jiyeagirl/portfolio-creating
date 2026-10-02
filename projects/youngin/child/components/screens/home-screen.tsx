"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Bell,
  CaretRight,
  ImagesSquare,
  LockSimple,
  MapPin,
  Plus,
  QrCode,
  Tree,
} from "@phosphor-icons/react";
import {
  BANNERS,
  CHILDREN,
  FACILITIES,
  MISSIONS,
  SEASON_MISSION,
  VISITS,
} from "@/projects/youngin/child/lib/mock-data";
import {
  BAND_LABEL,
  BAND_RANGE,
  BAND_SPAN,
  formatAge,
  formatDuration,
  withCompanion,
  withTopic,
} from "@/projects/youngin/child/lib/navigation";
import type { ChildNavigate } from "@/projects/youngin/child/lib/navigation";
import type { Child } from "@/projects/youngin/child/lib/types";
import { Card, Chip, FacilityThumb, Progress, SectionHead, StampSlot } from "@/projects/youngin/child/components/ui";

/* 히어로 아래로 걸치는 빠른 메뉴 한 칸. 가운데 칸만 좌우 구분선을 갖는다. */
function QuickAction({
  icon,
  label,
  hint,
  divided = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  divided?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 flex-col items-center gap-1 rounded-[12px] py-2.5 transition-colors active:bg-[var(--yc-surface-soft)] ${
        divided ? "border-x border-[var(--yc-hairline)]" : ""
      }`}
    >
      <span className="text-[var(--yc-accent)]">{icon}</span>
      <span className="text-[12.5px] font-bold text-[var(--yc-ink)]">{label}</span>
      <span className="text-[10.5px] leading-3 text-[var(--yc-mute)]">{hint}</span>
    </button>
  );
}

export function HomeScreen({
  child,
  onSelectChild,
  onNavigate,
}: {
  child: Child;
  onSelectChild: (id: string) => void;
  onNavigate: ChildNavigate;
}) {
  const [bannerIndex, setBannerIndex] = useState(0);
  const facilitySection = useRef<HTMLElement>(null);

  // 연령 프로필 하나로 시설, 미션, 배너가 동시에 갈린다. 검색이 아니라 이 매칭이 IA다.
  const facilities = FACILITIES.filter((item) => item.bands.includes(child.band));
  const banners = BANNERS.filter(
    (item) => item.bands.includes(child.band) && item.status === "노출 중",
  );
  const lockedMission =
    child.nextBand !== null
      ? MISSIONS.find((item) => item.state === "locked" && item.unlockBand === child.nextBand)
      : undefined;
  const visits = VISITS[child.id] ?? [];
  const recentVisits = visits.slice(0, 3);

  const bandSpan = BAND_SPAN[child.band];
  const bandProgress = ((bandSpan - child.monthsToNextBand) / bandSpan) * 100;
  const banner = banners[Math.min(bannerIndex, banners.length - 1)];
  // 빠른 메뉴의 QR 스캔은 지금 이용 가능한 시설 중 가장 가까운 곳을 열고 인증 시트를 띄운다.
  const nearest = [...facilities].sort((a, b) => a.distanceKm - b.distanceKm)[0];

  return (
    <div className="min-h-full bg-[var(--yc-canvas)] pb-[104px]">
      {/* 상태바 뒤에 깔리는 불투명 액센트 스트립. 스크롤한 뒤에도 흰 상태바 글자가
          밝은 캔버스 위에 얹혀 사라지지 않게 한다. 기기 라운드 코너 클립을 뚫는
          backdrop-blur 는 쓰지 않고 불투명 면으로만 처리한다(CLAUDE.md 엣지 규칙). */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[59px] bg-[var(--yc-accent)]" />

      {/* ── 히어로 ── */}
      <header className="rounded-b-[28px] bg-[var(--yc-accent)] px-5 pb-11 pt-[59px] text-[var(--yc-on-accent)]">
        <div className="flex h-[52px] items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Tree size={18} weight="fill" />
            <span className="text-[14px] font-bold tracking-[-0.02em]">용인 아이놀이터</span>
          </span>
          <button
            type="button"
            aria-label="알림 3건"
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/12 transition-colors active:bg-white/20"
          >
            <Bell size={17} weight="bold" />
            <span className="absolute right-[9px] top-[9px] h-[6px] w-[6px] rounded-full bg-[#F3C46B]" />
          </button>
        </div>

        <div className="mt-1 flex items-center gap-1.5">
          {CHILDREN.map((item) => {
            const active = item.id === child.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectChild(item.id)}
                aria-pressed={active}
                className={`flex items-baseline gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                  active ? "bg-white text-[var(--yc-accent-deep)]" : "bg-white/12 text-white/75"
                }`}
              >
                {item.name}
                <span
                  className={`yc-num text-[11px] font-medium ${
                    active ? "text-[var(--yc-mute)]" : "text-white/55"
                  }`}
                >
                  {formatAge(item.months)}
                </span>
              </button>
            );
          })}
          <button
            type="button"
            aria-label="아이 추가하기"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/12 text-white/75 transition-colors active:bg-white/20"
          >
            <Plus size={14} weight="bold" />
          </button>
        </div>

        <h1 className="mt-5 text-[27px] font-bold leading-8 tracking-[-0.03em]">
          {withTopic(child.name)} 지금
          <br />
          {BAND_LABEL[child.band]}예요
        </h1>
        <p className="yc-num mt-2 text-[13px] text-white/75">
          {BAND_RANGE[child.band]} 구간 | {child.joinedAt}부터 이용
        </p>

        <div className="mt-5 rounded-[16px] bg-[var(--yc-accent-deep)] p-4">
          {child.nextBand ? (
            <>
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-[13px] font-semibold">
                  다음 단계 {BAND_LABEL[child.nextBand]}까지
                </p>
                <p className="yc-num text-[13px] font-bold text-[#F3C46B]">
                  {formatDuration(child.monthsToNextBand)}
                </p>
              </div>
              <div className="mt-2.5">
                <Progress value={bandProgress} tone="onAccent" />
              </div>
              <p className="mt-2.5 text-[12px] leading-4 text-white/70">
                단계가 바뀌면 이용할 수 있는 시설과 미션이 새로 열립니다.
              </p>
            </>
          ) : (
            <p className="text-[13px] font-semibold">마지막 연령대예요. 모든 미션이 열려 있습니다.</p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/12 pt-4">
            <div>
              <p className="text-[11.5px] text-white/60">방문한 시설</p>
              <p className="yc-num mt-0.5 text-[20px] font-bold leading-6">
                {child.visitedCount}
                <span className="ml-0.5 text-[13px] font-semibold">곳</span>
              </p>
            </div>
            <div className="border-l border-white/12 pl-3">
              <p className="text-[11.5px] text-white/60">모은 도장</p>
              <p className="yc-num mt-0.5 text-[20px] font-bold leading-6">
                {child.stampCount}
                <span className="ml-0.5 text-[13px] font-semibold">개</span>
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ── 빠른 메뉴 (히어로 아래로 걸치는 카드) ── */}
      <div className="-mt-7 px-5">
        <div
          className="flex items-stretch rounded-[16px] border border-[var(--yc-hairline)] bg-[var(--yc-surface)] p-1.5"
          style={{ boxShadow: "var(--yc-shadow)" }}
        >
          <QuickAction
            icon={<QrCode size={20} weight="duotone" />}
            label="QR 스캔"
            hint="현장 인증"
            onClick={() => onNavigate("facility", { facilityId: nearest?.id, openQr: true })}
          />
          <QuickAction
            icon={<MapPin size={20} weight="duotone" />}
            label="시설 찾기"
            hint={`${facilities.length}곳 이용 가능`}
            divided
            onClick={() =>
              facilitySection.current?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          />
          <QuickAction
            icon={<ImagesSquare size={20} weight="duotone" />}
            label="나들이 기록"
            hint={`${visits.length}건 기록`}
            onClick={() => onNavigate("record")}
          />
        </div>
      </div>

      {/* ── 시즌 미션 ── */}
      <section className="mt-8">
        <SectionHead
          title={`${SEASON_MISSION.season} 시즌 미션`}
          desc={`${SEASON_MISSION.endsOn}까지 진행됩니다`}
          trailing={<Chip tone="stamp">{SEASON_MISSION.reward}</Chip>}
        />
        <div className="px-5">
          <button
            type="button"
            onClick={() => onNavigate("mission")}
            className="w-full overflow-hidden rounded-[16px] border border-[var(--yc-hairline)] bg-[var(--yc-surface)] text-left transition-transform active:scale-[0.995]"
          >
            <div className="relative h-[132px] w-full">
              <Image
                src={`https://picsum.photos/id/${SEASON_MISSION.photo}/720/300`}
                alt="맑은 여름 호수와 물가 나무 데크"
                width={360}
                height={150}
                className="h-full w-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(28,32,28,0) 32%, rgba(28,32,28,0.72) 100%)",
                }}
              />
              <p className="absolute bottom-3 left-4 right-4 text-[16px] font-bold leading-5 tracking-[-0.02em] text-white">
                {SEASON_MISSION.title}
              </p>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="yc-num text-[13px] font-bold text-[var(--yc-ink)]">
                  {SEASON_MISSION.done} / {SEASON_MISSION.goal} 곳 인증
                </p>
                <p className="text-[12px] text-[var(--yc-mute)]">
                  {SEASON_MISSION.goal - SEASON_MISSION.done}곳 남았어요
                </p>
              </div>
              <div className="mt-2.5">
                <Progress
                  value={(SEASON_MISSION.done / SEASON_MISSION.goal) * 100}
                  tone="stamp"
                />
              </div>
              <div className="mt-4 flex items-center gap-2.5">
                {Array.from({ length: SEASON_MISSION.goal }, (_, index) => (
                  <StampSlot key={index} index={index} filled={index < SEASON_MISSION.done} />
                ))}
              </div>
              <p className="mt-4 border-t border-[var(--yc-hairline)] pt-3 text-[12.5px] leading-5 text-[var(--yc-body)]">
                {SEASON_MISSION.detail}
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* ── 연령별 추천 시설 ── */}
      <section ref={facilitySection} className="mt-9 scroll-mt-4">
        <SectionHead
          title={`${child.name}에게 열린 시설`}
          desc={`${BAND_LABEL[child.band]} 기준으로 자동 추천됩니다`}
          trailing={<Chip tone="soft">{facilities.length}곳</Chip>}
        />
        <div className="yc-rail-scroll flex gap-3 overflow-x-auto px-5 pb-1">
          {facilities.map((facility) => (
            <button
              key={facility.id}
              type="button"
              onClick={() => onNavigate("facility", { facilityId: facility.id })}
              className="w-[228px] shrink-0 overflow-hidden rounded-[16px] border border-[var(--yc-hairline)] bg-[var(--yc-surface)] text-left transition-transform active:scale-[0.99]"
            >
              <FacilityThumb
                category={facility.category}
                photo={facility.photo}
                name={facility.name}
                width={228}
                height={112}
                radius={0}
              />
              <div className="p-3.5">
                <div className="flex items-center gap-1.5">
                  <Chip tone="accent">{facility.ageLabel}</Chip>
                  {facility.visited && <Chip tone="soft">방문함</Chip>}
                </div>
                <h3 className="mt-2 text-[15px] font-bold leading-5 tracking-[-0.02em] text-[var(--yc-ink)]">
                  {facility.name}
                </h3>
                <p className="yc-num mt-1 text-[12px] text-[var(--yc-mute)]">
                  {facility.district} | {facility.distanceKm}km | {facility.hours}
                </p>
                <div className="mt-3 rounded-[12px] bg-[var(--yc-surface-soft)] p-2.5">
                  <p className="text-[12.5px] font-semibold leading-4 text-[var(--yc-ink)]">
                    {facility.openMission}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-[11.5px] font-semibold text-[var(--yc-stamp)]">
                    <ArrowRight size={11} weight="bold" />
                    {facility.reward}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── 복지 배너 ── */}
      <section className="mt-9">
        <SectionHead
          title="지금 받을 수 있는 혜택"
          desc={`${BAND_LABEL[child.band]} 가정에 노출되는 안내입니다`}
        />
        <div className="px-5">
          <article className="overflow-hidden rounded-[16px] border border-[var(--yc-hairline)] bg-[var(--yc-surface)]">
            {banner.photo !== undefined && (
              <Image
                src={`https://picsum.photos/id/${banner.photo}/720/280`}
                alt="여름 숲 프로그램이 열리는 강가 침엽수림"
                width={360}
                height={140}
                className="h-[112px] w-full object-cover"
              />
            )}
            <div className="p-4">
              <div className="flex items-center gap-1.5">
                <Chip tone="accent">{banner.kind}</Chip>
                <span className="text-[11.5px] text-[var(--yc-mute)]">{banner.department}</span>
              </div>
              <h3 className="mt-2.5 text-[16px] font-bold leading-5 tracking-[-0.02em] text-[var(--yc-ink)]">
                {banner.title}
              </h3>
              <p className="mt-1.5 text-[13px] leading-5 text-[var(--yc-body)]">{banner.body}</p>
              <div className="mt-3.5 flex items-center justify-between gap-3">
                <button
                  type="button"
                  className="flex h-9 items-center gap-1 rounded-full bg-[var(--yc-accent)] px-4 text-[13px] font-bold text-[var(--yc-on-accent)] transition-transform active:scale-[0.98]"
                >
                  {banner.cta}
                  <CaretRight size={12} weight="bold" />
                </button>
                <p className="yc-num text-[11.5px] text-[var(--yc-mute)]">{banner.period}</p>
              </div>
            </div>
          </article>

          <div className="mt-3 flex items-center justify-center gap-1.5">
            {banners.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setBannerIndex(index)}
                aria-label={`${index + 1}번째 안내 보기`}
                aria-current={index === bannerIndex}
                className={`h-[6px] rounded-full transition-all ${
                  index === bannerIndex
                    ? "w-5 bg-[var(--yc-accent)]"
                    : "w-[6px] bg-[var(--yc-hairline-strong)]"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 다음 단계에 열리는 미션 ── */}
      {lockedMission && child.nextBand && (
        <section className="mt-9 px-5">
          <button
            type="button"
            onClick={() => onNavigate("mission")}
            className="w-full text-left"
          >
            <Card tone="dashed" className="p-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--yc-lock-soft)] text-[var(--yc-lock)]">
                  <LockSimple size={16} weight="bold" />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Chip tone="lock">{formatDuration(child.monthsToNextBand)} 뒤 열림</Chip>
                    <Chip tone="lock">{BAND_LABEL[child.nextBand]} 미션</Chip>
                  </div>
                  <h3 className="mt-2 text-[15px] font-bold leading-5 tracking-[-0.02em] text-[var(--yc-body)]">
                    {lockedMission.title}
                  </h3>
                  <p className="mt-1 text-[12.5px] leading-5 text-[var(--yc-mute)]">
                    {lockedMission.detail}
                  </p>
                </div>
              </div>
            </Card>
          </button>
        </section>
      )}

      {/* ── 최근 나들이 기록 ── */}
      <section className="mt-9">
        <SectionHead
          title="최근 나들이"
          desc={`${withCompanion(child.name)} 다녀온 기록이 쌓이고 있어요`}
          trailing={
            <button
              type="button"
              onClick={() => onNavigate("record")}
              className="flex items-center gap-0.5 text-[12.5px] font-semibold text-[var(--yc-accent)]"
            >
              타임라인
              <CaretRight size={12} weight="bold" />
            </button>
          }
        />
        <ul className="space-y-2 px-5">
          {recentVisits.map((visit) => (
            <li key={visit.id}>
              <button
                type="button"
                onClick={() => onNavigate("facility", { facilityId: visit.facilityId })}
                className="flex w-full items-center gap-3 rounded-[16px] border border-[var(--yc-hairline)] bg-[var(--yc-surface)] p-2.5 text-left transition-colors active:bg-[var(--yc-surface-soft)]"
              >
                <FacilityThumb
                  category={visit.category}
                  photo={visit.photo}
                  name={visit.facilityName}
                  width={52}
                  height={52}
                />
                <div className="min-w-0 flex-1">
                  <p className="yc-num text-[11.5px] font-semibold text-[var(--yc-mute)]">
                    {visit.date}
                  </p>
                  <p className="mt-0.5 truncate text-[14px] font-bold tracking-[-0.02em] text-[var(--yc-ink)]">
                    {visit.facilityName}
                  </p>
                  <p className="truncate text-[12px] text-[var(--yc-body)]">{visit.note}</p>
                </div>
                <span className="yc-num shrink-0 rounded-full bg-[var(--yc-stamp-soft)] px-2 py-1 text-[11.5px] font-bold text-[var(--yc-stamp)]">
                  도장 {visit.stamps}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-10 px-5">
        <p className="text-[11.5px] leading-4 text-[var(--yc-mute)]">
          용인시 아동청소년과 운영 | 문의 031-324-2914
        </p>
        <p className="yc-num mt-1 text-[11.5px] leading-4 text-[var(--yc-mute)]">
          시설 정보 최종 갱신 2026.08.07 08:20
        </p>
      </footer>
    </div>
  );
}
