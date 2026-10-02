"use client";

import { Icon } from "@iconify/react";
import {
  Card,
  Chip,
  GlyphTile,
  MetaRow,
  SectionHead,
  StatusDot,
} from "@/projects/youngin/festival/components/ui";
import {
  CATEGORY_LABEL,
  FACILITY_ICON,
  FESTIVAL,
  LIVE_PROGRAMS,
  BADGES,
  MISSIONS,
  NOTICES,
  PHOTO,
  POPULAR_PROGRAMS,
  SOON_PROGRAMS,
  STATUS_LABEL,
  getFacility,
  minutesUntil,
  photo,
} from "@/projects/youngin/festival/lib/mock-data";
import type { FestivalNavigate } from "@/projects/youngin/festival/lib/navigation";

const SHORTCUTS: { label: string; sub: string; icon: string; screen: "map" | "mission" }[] = [
  { label: "행사장 지도", sub: "시설 19곳", icon: "solar:map-bold", screen: "map" },
  { label: "프로그램 일정", sub: "오늘 7개", icon: "solar:calendar-mark-bold", screen: "map" },
  { label: "부스 안내", sub: "체험 12, 먹거리 18", icon: "solar:shop-2-bold", screen: "map" },
  { label: "편의시설", sub: "화장실, 쉼터", icon: "solar:bath-bold", screen: "map" },
];

export function HomeScreen({
  doneIds,
  onNavigate,
}: {
  doneIds: string[];
  onNavigate: FestivalNavigate;
}) {
  const urgent = NOTICES[0];
  const doneCount = doneIds.length;
  const progress = Math.round((doneCount / MISSIONS.length) * 100);
  const nextBadge = BADGES.find((b) => b.require > doneCount);

  return (
    <div className="fs-screen-in pb-[104px]">
      {/* 히어로. 사진 158: 대형 무대 조명 빔이 쏟아지는 야간 공연, 손 든 관객 실루엣 */}
      <header className="relative h-[336px] w-full overflow-hidden">
        <img
          src={photo(PHOTO.hero, 786, 672)}
          alt="제24회 포은문화제 개막 공연"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(31,28,25,0.82) 0%, rgba(31,28,25,0.34) 38%, rgba(31,28,25,0.88) 100%)",
          }}
        />
        <div className="relative flex h-full flex-col justify-between px-5 pb-6 pt-[70px]">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <span
                className="flex h-[26px] items-center gap-1 rounded-full px-2.5 text-[11.5px] font-bold"
                style={{ background: "var(--fs-accent)", color: "var(--fs-on-accent)" }}
              >
                <Icon icon="solar:qr-code-bold" width="13" height="13" />
                QR 현장 안내
              </span>
              <span
                className="festival-num flex h-[26px] items-center rounded-full px-2.5 text-[11.5px] font-bold"
                style={{ background: "rgba(245,241,233,0.16)", color: "var(--fs-on-dark)" }}
              >
                {FESTIVAL.dayLabel}
              </span>
            </div>
            <span
              className="festival-num flex h-[26px] items-center gap-1 rounded-full px-2.5 text-[11.5px] font-bold"
              style={{ background: "rgba(245,241,233,0.16)", color: "var(--fs-on-dark)" }}
            >
              <Icon icon="solar:clock-circle-bold" width="13" height="13" />
              {FESTIVAL.now}
            </span>
          </div>

          <div>
            <p
              className="text-[13px] font-semibold tracking-[0.02em]"
              style={{ color: "var(--fs-on-dark-muted)" }}
            >
              {FESTIVAL.subtitle}
            </p>
            <h1
              className="mt-1 text-[26px] font-bold leading-[32px]"
              style={{ color: "var(--fs-on-dark)" }}
            >
              {FESTIVAL.name}
            </h1>
            <div
              className="festival-num mt-3 flex flex-col gap-1 text-[12.5px] leading-[17px]"
              style={{ color: "var(--fs-on-dark-muted)" }}
            >
              <span className="flex items-center gap-1.5">
                <Icon icon="solar:calendar-linear" width="14" height="14" />
                {FESTIVAL.period}
              </span>
              <span className="flex items-center gap-1.5">
                <Icon icon="solar:map-point-linear" width="14" height="14" />
                {FESTIVAL.place}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 긴급 안내 */}
      <div className="px-5 pt-4">
        <button
          type="button"
          onClick={() => onNavigate("map", "f-hall")}
          className="flex w-full items-center gap-3 rounded-[14px] px-4 py-3.5 text-left transition-transform duration-150 active:scale-[0.98]"
          style={{ background: "var(--fs-accent-soft)" }}
        >
          <Icon
            icon="solar:danger-triangle-bold"
            width="22"
            height="22"
            style={{ color: "var(--fs-accent)" }}
          />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold" style={{ color: "var(--fs-accent)" }}>
              긴급 안내
            </p>
            <p className="mt-0.5 text-[13.5px] font-semibold leading-[18px] text-[var(--fs-ink)]">
              {urgent.title}
            </p>
          </div>
          <Icon
            icon="solar:alt-arrow-right-linear"
            width="18"
            height="18"
            style={{ color: "var(--fs-accent)" }}
          />
        </button>
      </div>

      {/* 바로가기 */}
      <section className="px-5 pt-5">
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate("mission")}
            className="col-span-2 flex items-center gap-3.5 rounded-[14px] px-4 py-4 text-left transition-transform duration-150 active:scale-[0.98]"
            style={{ background: "var(--fs-dark)" }}
          >
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px]"
              style={{ background: "var(--fs-accent)", color: "var(--fs-on-accent)" }}
            >
              <Icon icon="solar:flag-2-bold" width="22" height="22" />
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="text-[14.5px] font-bold leading-[19px]"
                style={{ color: "var(--fs-on-dark)" }}
              >
                오늘의 미션 {doneCount}/{MISSIONS.length} 완료
              </p>
              <p className="mt-0.5 text-[12px]" style={{ color: "var(--fs-on-dark-muted)" }}>
                {nextBadge
                  ? `${nextBadge.require - doneCount}개 더 하면 ${nextBadge.name} 배지를 받습니다`
                  : "모든 미션을 완료했습니다"}
              </p>
            </div>
            <span
              className="festival-num text-[19px] font-bold"
              style={{ color: "var(--fs-on-accent)" }}
            >
              {progress}%
            </span>
          </button>

          {SHORTCUTS.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => onNavigate(s.screen)}
              className="flex items-center gap-3 rounded-[14px] border px-3.5 py-3 text-left transition-transform duration-150 active:scale-[0.98]"
              style={{ background: "var(--fs-surface)", borderColor: "var(--fs-line)" }}
            >
              <Icon
                icon={s.icon}
                width="21"
                height="21"
                style={{ color: "var(--fs-accent)" }}
                className="shrink-0"
              />
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-bold text-[var(--fs-ink)]">{s.label}</p>
                <p className="truncate text-[11.5px] text-[var(--fs-muted)]">{s.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 지금 진행 중 */}
      <section className="pt-7">
        <SectionHead
          title="지금 진행 중"
          meta={`${FESTIVAL.today} ${FESTIVAL.now} 기준`}
        />
        <div className="flex flex-col gap-2.5 px-5">
          {LIVE_PROGRAMS.map((p) => {
            const facility = getFacility(p.facilityId);
            return (
              <Card key={p.id} onClick={() => onNavigate("map", facility.id)} label={p.title}>
                <div className="flex items-stretch">
                  <img
                    src={photo(p.photoId, 200, 200)}
                    alt=""
                    aria-hidden
                    className="h-[92px] w-[92px] shrink-0 object-cover"
                  />
                  <div className="min-w-0 flex-1 px-3.5 py-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="flex items-center gap-1 rounded-full px-2 py-[3px] text-[10.5px] font-bold"
                        style={{ background: "var(--fs-accent)", color: "var(--fs-on-accent)" }}
                      >
                        <span className="fs-pulse h-[5px] w-[5px] rounded-full bg-white" />
                        진행 중
                      </span>
                      <Chip tone="line">{p.kind}</Chip>
                    </div>
                    <h3 className="mt-1.5 truncate text-[15px] font-bold text-[var(--fs-ink)]">
                      {p.title}
                    </h3>
                    <div className="mt-1">
                      <MetaRow items={[`${p.start}–${p.end}`, facility.name]} />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 곧 시작합니다 */}
      <section className="pt-7">
        <SectionHead title="곧 시작합니다" meta="90분 안에 시작하는 프로그램" />
        <div className="festival-scroll-x flex gap-3 overflow-x-auto px-5 pb-1">
          {SOON_PROGRAMS.map((p) => {
            const facility = getFacility(p.facilityId);
            const left = minutesUntil(p);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onNavigate("map", facility.id)}
                className="w-[212px] shrink-0 overflow-hidden rounded-[14px] border text-left transition-transform duration-150 active:scale-[0.98]"
                style={{ background: "var(--fs-surface)", borderColor: "var(--fs-line)" }}
              >
                <div className="relative h-[112px] w-full">
                  <img
                    src={photo(p.photoId, 424, 224)}
                    alt=""
                    aria-hidden
                    className="h-full w-full object-cover"
                  />
                  <span
                    className="festival-num absolute left-2.5 top-2.5 rounded-full px-2 py-[3px] text-[10.5px] font-bold"
                    style={{ background: "var(--fs-dark)", color: "var(--fs-on-dark)" }}
                  >
                    {left}분 뒤 시작
                  </span>
                </div>
                <div className="px-3.5 py-3">
                  <Chip tone="line">{p.kind}</Chip>
                  <h3 className="mt-1.5 truncate text-[14.5px] font-bold text-[var(--fs-ink)]">
                    {p.title}
                  </h3>
                  <div className="mt-1">
                    <MetaRow items={[`${p.start} 시작`, facility.name]} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 오늘 인기 프로그램 */}
      <section className="pt-7">
        <SectionHead title="오늘 인기 프로그램" meta="QR 조회 수 기준" />
        <div
          className="mx-5 overflow-hidden rounded-[14px] border"
          style={{ background: "var(--fs-surface)", borderColor: "var(--fs-line)" }}
        >
          {POPULAR_PROGRAMS.map((p, i) => {
            const facility = getFacility(p.facilityId);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onNavigate("map", facility.id)}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors"
                style={{ borderTop: i === 0 ? "none" : "1px solid var(--fs-line-soft)" }}
              >
                <span
                  className="festival-num w-5 shrink-0 text-center text-[15px] font-bold"
                  style={{ color: i === 0 ? "var(--fs-accent)" : "var(--fs-faint)" }}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14.5px] font-bold text-[var(--fs-ink)]">{p.title}</p>
                  <div className="mt-0.5">
                    <MetaRow items={[`${p.start}–${p.end}`, facility.name]} />
                  </div>
                </div>
                <span className="festival-num shrink-0 text-[12px] font-semibold text-[var(--fs-muted)]">
                  {p.views.toLocaleString()}회
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 편의, 안전시설 요약 */}
      <section className="pt-7">
        <SectionHead
          title="편의 / 안전시설"
          meta="가까운 순"
          action="지도에서 보기"
          onAction={() => onNavigate("map")}
        />
        <div className="festival-scroll-x flex gap-2.5 overflow-x-auto px-5 pb-1">
          {["f-info", "f-toilet1", "f-medical", "f-rest", "f-nursing"].map((id) => {
            const f = getFacility(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate("map", id)}
                className="w-[152px] shrink-0 rounded-[14px] border px-3.5 py-3.5 text-left transition-transform duration-150 active:scale-[0.98]"
                style={{ background: "var(--fs-surface)", borderColor: "var(--fs-line)" }}
              >
                <GlyphTile
                  icon={FACILITY_ICON[f.kind]}
                  tone={f.category === "safety" ? "safety" : "convenience"}
                  size={38}
                  radius={11}
                />
                <p className="mt-2.5 truncate text-[14px] font-bold text-[var(--fs-ink)]">
                  {f.name}
                </p>
                <p className="festival-num mt-0.5 text-[11.5px] text-[var(--fs-muted)]">
                  {f.zone}구역 | 도보 {f.walkMin}분
                </p>
                <div className="mt-2">
                  <StatusDot status={f.status} label={STATUS_LABEL[f.status]} />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 공지사항 */}
      <section className="pt-7">
        <SectionHead title="공지사항" meta={`${NOTICES.length}건`} />
        <div className="flex flex-col gap-2 px-5">
          {NOTICES.map((n) => (
            <Card key={n.id} className="px-4 py-3.5">
              <div className="flex items-center gap-2">
                <Chip tone={n.kind === "안전" ? "safety" : n.kind === "교통" ? "convenience" : "gold"}>
                  {n.kind}
                </Chip>
                <span className="festival-num text-[11.5px] text-[var(--fs-faint)]">{n.at}</span>
              </div>
              <p className="mt-2 text-[14.5px] font-bold leading-[20px] text-[var(--fs-ink)]">
                {n.title}
              </p>
              <p className="mt-1 text-[13px] leading-[19px] text-[var(--fs-muted)]">{n.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* 운영 정보 */}
      <section className="px-5 pt-7">
        <div className="rounded-[14px] px-4 py-4" style={{ background: "var(--fs-surface-soft)" }}>
          <h2 className="text-[14.5px] font-bold text-[var(--fs-ink)]">운영 안내</h2>
          <dl className="mt-3 flex flex-col gap-2.5">
            {[
              ["운영시간", FESTIVAL.hours],
              ["행사장", `${FESTIVAL.place} (${FESTIVAL.address})`],
              ["주최 / 주관", `${FESTIVAL.host} / ${FESTIVAL.organizer}`],
              ["현장 문의", `종합안내소 ${FESTIVAL.contact}`],
              ["QR 안내판", FESTIVAL.qrEntry],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-3">
                <dt className="w-[68px] shrink-0 text-[12.5px] font-semibold text-[var(--fs-muted)]">
                  {k}
                </dt>
                <dd className="festival-num min-w-0 flex-1 text-[12.5px] leading-[18px] text-[var(--fs-body)]">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-3.5 text-[11.5px] leading-[17px] text-[var(--fs-faint)]">
            이 안내 화면은 행사 기간에만 운영되며, 9월 20일 18시 이후 종료됩니다. 별도 앱 설치
            없이 QR로 접속합니다.
          </p>
        </div>
      </section>

      {/* 분류 범례 */}
      <div className="flex items-center justify-center gap-3 px-5 pt-5">
        {(["program", "convenience", "safety"] as const).map((c) => (
          <span
            key={c}
            className="flex items-center gap-1.5 text-[11.5px] font-semibold text-[var(--fs-muted)]"
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                background:
                  c === "program"
                    ? "var(--fs-cat-program)"
                    : c === "convenience"
                      ? "var(--fs-cat-conv)"
                      : "var(--fs-cat-safety)",
              }}
            />
            {CATEGORY_LABEL[c]}
          </span>
        ))}
      </div>
    </div>
  );
}
