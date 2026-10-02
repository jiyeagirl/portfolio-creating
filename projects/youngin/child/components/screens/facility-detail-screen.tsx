"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  CalendarBlank,
  Camera,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Plus,
  QrCode,
  SealCheck,
  ShareNetwork,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { getMission, SEASON_MISSION, VISITS } from "@/projects/youngin/child/lib/mock-data";
import { BAND_LABEL, CATEGORY_LABEL } from "@/projects/youngin/child/lib/navigation";
import type { ChildNavigate } from "@/projects/youngin/child/lib/navigation";
import type { Child, Facility } from "@/projects/youngin/child/lib/types";
import { Card, Chip, FacilityThumb, InfoRow, Progress, StampSlot } from "@/projects/youngin/child/components/ui";

type QrPhase = "idle" | "scanning" | "done";

export function FacilityDetailScreen({
  facility,
  child,
  autoOpenQr = false,
  onNavigate,
}: {
  facility: Facility;
  child: Child;
  autoOpenQr?: boolean;
  onNavigate: ChildNavigate;
}) {
  const [phase, setPhase] = useState<QrPhase>("idle");
  const [sheetOpen, setSheetOpen] = useState(autoOpenQr);

  // 스캔은 2초 뒤 인증 완료로 넘어간다. 목업이라 실제 카메라는 열지 않고
  // 인증 성공 후 화면이 어떻게 바뀌는지(도장 획득, 시즌 미션 반영)를 보여준다.
  useEffect(() => {
    if (phase !== "scanning") return;
    const timer = setTimeout(() => setPhase("done"), 2000);
    return () => clearTimeout(timer);
  }, [phase]);

  const verified = phase === "done";
  const missions = facility.missionIds.map(getMission).filter((item) => item !== undefined);
  const eligible = facility.bands.includes(child.band);
  const seasonDone = Math.min(SEASON_MISSION.goal, SEASON_MISSION.done + (verified ? 1 : 0));
  const earnedStamps = missions
    .filter((mission) => mission.state !== "locked")
    .reduce((sum, mission) => sum + mission.stamps, 0);
  const visitPhotos = (VISITS[child.id] ?? [])
    .filter((visit) => visit.facilityId === facility.id && visit.photo !== undefined)
    .slice(0, 3);

  function openSheet() {
    setSheetOpen(true);
    setPhase("scanning");
  }

  function closeSheet() {
    setSheetOpen(false);
    if (phase === "scanning") setPhase("idle");
  }

  return (
    <div className="min-h-full bg-[var(--yc-canvas)] pb-[104px]">
      <ScreenHeader
        title={facility.name}
        subtitle={`${CATEGORY_LABEL[facility.category]} | ${facility.district}`}
        onBack={() => onNavigate("home")}
        className="bg-[var(--yc-surface)] border-[var(--yc-hairline)]"
        backButtonClassName="text-[var(--yc-ink)] hover:bg-[var(--yc-surface-soft)]"
        titleClassName="text-[15.5px] font-bold tracking-[-0.02em] text-[var(--yc-ink)]"
        subtitleClassName="text-[11px] text-[var(--yc-mute)]"
        right={
          <button
            type="button"
            aria-label="시설 공유하기"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--yc-body)] transition-colors active:bg-[var(--yc-surface-soft)]"
          >
            <ShareNetwork size={18} weight="bold" />
          </button>
        }
      />

      {/* ── 사진 ── */}
      {facility.gallery ? (
        <div className="yc-rail-scroll flex gap-2 overflow-x-auto px-5 pt-4">
          {facility.gallery.map((photo, index) => (
            <Image
              key={photo}
              src={`https://picsum.photos/id/${photo}/640/440`}
              alt={
                index === 0
                  ? `${facility.name} 전경`
                  : `${facility.name} 숲길`
              }
              width={320}
              height={220}
              className={`h-[176px] shrink-0 rounded-[16px] object-cover ${
                facility.gallery && facility.gallery.length > 1 ? "w-[272px]" : "w-full"
              }`}
            />
          ))}
        </div>
      ) : (
        <div className="px-5 pt-4">
          <FacilityThumb
            category={facility.category}
            name={facility.name}
            width={353}
            height={176}
            radius={16}
            className="w-full"
          />
        </div>
      )}

      {/* ── 요약 ── */}
      <section className="px-5 pt-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <Chip tone="accent">{facility.ageLabel}</Chip>
          <Chip tone="soft">{CATEGORY_LABEL[facility.category]}</Chip>
          {eligible ? (
            <Chip tone="stamp">{BAND_LABEL[child.band]} 추천</Chip>
          ) : (
            <Chip tone="lock">{BAND_LABEL[child.band]}는 아직 대상이 아니에요</Chip>
          )}
        </div>
        <h1 className="mt-2.5 text-[22px] font-bold leading-7 tracking-[-0.03em] text-[var(--yc-ink)]">
          {facility.name}
        </h1>
        <p className="mt-2 text-[13.5px] leading-6 text-[var(--yc-body)]">{facility.intro}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {facility.tags.map((tag) => (
            <Chip key={tag} tone="outline">
              {tag}
            </Chip>
          ))}
        </div>
      </section>

      {/* ── 이용 정보 ── */}
      <section className="mt-6 px-5">
        <Card className="px-4 py-1">
          <ul>
            <InfoRow
              icon={<MapPin size={16} weight="fill" />}
              label="위치"
              value={facility.address}
              note={`현재 위치에서 ${facility.distanceKm}km`}
            />
            <InfoRow
              icon={<Clock size={16} weight="fill" />}
              label="운영시간"
              value={facility.hours}
              note={facility.closedNote}
            />
            <InfoRow
              icon={<Phone size={16} weight="fill" />}
              label="문의"
              value={facility.phone}
            />
          </ul>
        </Card>
      </section>

      {/* ── 현재 가능한 미션 ── */}
      <section className="mt-8 px-5">
        <h2 className="text-[17px] font-bold leading-6 tracking-[-0.02em] text-[var(--yc-ink)]">
          지금 이 시설에서 열린 미션
        </h2>
        <p className="mt-1 text-[12.5px] text-[var(--yc-mute)]">
          QR 인증 한 번으로 아래 미션이 함께 처리됩니다.
        </p>
        <ul className="mt-3 space-y-2">
          {missions.map((mission) => {
            const locked = mission.state === "locked";
            const done = mission.state === "done" || (verified && mission.state === "active");
            return (
              <li key={mission.id}>
                <Card
                  tone={locked ? "dashed" : "surface"}
                  className="flex items-start gap-3 p-3.5"
                >
                  <span
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      done
                        ? "bg-[var(--yc-accent-soft)] text-[var(--yc-accent)]"
                        : locked
                          ? "bg-[var(--yc-lock-soft)] text-[var(--yc-lock)]"
                          : "bg-[var(--yc-stamp-soft)] text-[var(--yc-stamp)]"
                    }`}
                  >
                    {done ? (
                      <CheckCircle size={17} weight="fill" />
                    ) : (
                      <SealCheck size={16} weight="bold" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className={`text-[14.5px] font-bold leading-5 tracking-[-0.02em] ${
                          locked ? "text-[var(--yc-lock)]" : "text-[var(--yc-ink)]"
                        }`}
                      >
                        {mission.title}
                      </h3>
                      <span className="shrink-0 text-[11.5px] font-bold text-[var(--yc-stamp)]">
                        {mission.reward}
                      </span>
                    </div>
                    <p className="mt-1 text-[12.5px] leading-5 text-[var(--yc-body)]">
                      {mission.detail}
                    </p>
                    {mission.progress && !done && (
                      <div className="mt-2.5">
                        <Progress
                          value={(mission.progress.done / mission.progress.goal) * 100}
                          height={5}
                        />
                        <p className="yc-num mt-1.5 text-[11.5px] text-[var(--yc-mute)]">
                          {mission.progress.done} / {mission.progress.goal} 회 완료
                        </p>
                      </div>
                    )}
                    {done && (
                      <p className="mt-1.5 text-[11.5px] font-semibold text-[var(--yc-accent)]">
                        인증 완료
                      </p>
                    )}
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ── 시즌 미션 반영 ── */}
      <section className="mt-8 px-5">
        <Card tone="soft" className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11.5px] font-semibold text-[var(--yc-stamp)]">
                {SEASON_MISSION.season} 시즌 미션
              </p>
              <h3 className="mt-0.5 text-[14.5px] font-bold tracking-[-0.02em] text-[var(--yc-ink)]">
                {SEASON_MISSION.title}
              </h3>
            </div>
            <p className="yc-num shrink-0 text-[14px] font-bold text-[var(--yc-stamp)]">
              {seasonDone} / {SEASON_MISSION.goal}
            </p>
          </div>
          <div className="mt-3">
            <Progress value={(seasonDone / SEASON_MISSION.goal) * 100} tone="stamp" />
          </div>
          <div className="mt-3.5 flex items-center gap-2">
            {Array.from({ length: SEASON_MISSION.goal }, (_, index) => (
              <StampSlot key={index} index={index} filled={index < seasonDone} />
            ))}
          </div>
          {verified && (
            <p className="mt-3 text-[12.5px] font-semibold leading-5 text-[var(--yc-accent)]">
              이번 인증이 시즌 미션에 반영됐어요. {SEASON_MISSION.goal - seasonDone}곳 남았습니다.
            </p>
          )}
        </Card>
      </section>

      {/* ── 방문 사진 ── */}
      <section className="mt-8 px-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-[17px] font-bold leading-6 tracking-[-0.02em] text-[var(--yc-ink)]">
              방문 사진
            </h2>
            <p className="mt-1 text-[12.5px] text-[var(--yc-mute)]">
              인증할 때 올린 사진은 나들이 기록에 그대로 쌓입니다.
            </p>
          </div>
          <span className="yc-num shrink-0 rounded-full bg-[var(--yc-stamp-soft)] px-2.5 py-1 text-[11.5px] font-bold text-[var(--yc-stamp)]">
            도장 {earnedStamps}
          </span>
        </div>
        <div className="mt-3 flex gap-2">
          {visitPhotos.map((visit) => (
            <span key={visit.id} className="relative">
              <Image
                src={`https://picsum.photos/id/${visit.photo}/240/240`}
                alt={`${visit.date} ${facility.name} 방문 사진`}
                width={104}
                height={104}
                className="h-[104px] w-[104px] rounded-[12px] object-cover"
              />
              <span className="yc-num absolute bottom-1.5 left-1.5 rounded-full bg-[rgba(28,32,28,0.62)] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {visit.date.slice(0, 5)}
              </span>
            </span>
          ))}
          <button
            type="button"
            className="flex h-[104px] w-[104px] flex-col items-center justify-center gap-1 rounded-[12px] yc-b-strong border border-dashed text-[var(--yc-mute)] transition-colors active:bg-[var(--yc-surface-soft)]"
          >
            <Camera size={20} weight="duotone" />
            <span className="text-[11px] font-semibold">사진 추가</span>
          </button>
        </div>
      </section>

      {/* ── 안내 ── */}
      <section className="mt-8 px-5">
        <div className="flex items-start gap-2.5 rounded-[12px] bg-[var(--yc-lock-soft)] p-3.5">
          <WarningCircle size={16} weight="fill" className="mt-0.5 shrink-0 text-[var(--yc-lock)]" />
          <p className="text-[12.5px] leading-5 text-[var(--yc-body)]">
            QR은 시설 입구에 설치되어 있습니다. 현장에서만 인증되며, 같은 시설은 하루 한 번
            인증됩니다.
          </p>
        </div>
      </section>

      {/* ── 하단 인증 바 ──
          기기 하단 엣지에 닿는 요소라 backdrop-blur 없이 불투명 표면만 쓴다. */}
      <div className="absolute inset-x-0 bottom-0 z-30 border-t border-[var(--yc-hairline)] bg-[var(--yc-surface)] px-5 pb-8 pt-3">
        {verified ? (
          <button
            type="button"
            onClick={() => onNavigate("record")}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--yc-accent-soft)] text-[15px] font-bold text-[var(--yc-accent-deep)] transition-transform active:scale-[0.99]"
          >
            <CheckCircle size={18} weight="fill" />
            오늘 인증 완료, 기록 보러 가기
          </button>
        ) : (
          <button
            type="button"
            onClick={openSheet}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--yc-accent)] text-[15px] font-bold text-[var(--yc-on-accent)] transition-transform active:scale-[0.99]"
          >
            <QrCode size={18} weight="bold" />
            QR 스캔하고 인증하기
          </button>
        )}
      </div>

      {/* ── QR 시트 ── */}
      {sheetOpen && (
        <div className="absolute inset-0 z-40 flex flex-col justify-end bg-[rgba(28,32,28,0.72)]">
          <button
            type="button"
            aria-label="인증 창 닫기"
            onClick={closeSheet}
            className="absolute inset-0"
          />
          <div className="yc-enter relative rounded-t-[24px] bg-[var(--yc-surface)] px-5 pb-10 pt-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11.5px] font-semibold text-[var(--yc-mute)]">
                  {facility.name}
                </p>
                <h2 className="mt-0.5 text-[18px] font-bold tracking-[-0.02em] text-[var(--yc-ink)]">
                  {phase === "done" ? "인증이 완료됐어요" : "QR을 화면에 맞춰 주세요"}
                </h2>
              </div>
              <button
                type="button"
                aria-label="닫기"
                onClick={closeSheet}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--yc-surface-soft)] text-[var(--yc-body)]"
              >
                <X size={14} weight="bold" />
              </button>
            </div>

            {phase === "done" ? (
              <div className="mt-5">
                <div className="flex items-center gap-3 rounded-[16px] bg-[var(--yc-accent-soft)] p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--yc-accent)] text-white">
                    <CheckCircle size={22} weight="fill" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[14.5px] font-bold text-[var(--yc-accent-deep)]">
                      {facility.reward} 획득
                    </p>
                    <p className="mt-0.5 text-[12.5px] text-[var(--yc-body)]">
                      {child.name}의 도장이 {child.stampCount + 1}개가 됐어요.
                    </p>
                  </div>
                </div>

                <ul className="mt-4 space-y-2">
                  <li className="flex items-center gap-2 text-[13px] text-[var(--yc-body)]">
                    <CheckCircle size={15} weight="fill" className="text-[var(--yc-accent)]" />
                    {facility.openMission} 완료
                  </li>
                  <li className="flex items-center gap-2 text-[13px] text-[var(--yc-body)]">
                    <CheckCircle size={15} weight="fill" className="text-[var(--yc-accent)]" />
                    시즌 미션 {seasonDone} / {SEASON_MISSION.goal} 반영
                  </li>
                  <li className="flex items-center gap-2 text-[13px] text-[var(--yc-body)]">
                    <CalendarBlank size={15} weight="fill" className="text-[var(--yc-accent)]" />
                    나들이 기록에 오늘 날짜로 저장
                  </li>
                </ul>

                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={closeSheet}
                    className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-full border border-[var(--yc-hairline)] text-[14px] font-bold text-[var(--yc-body)] transition-colors active:bg-[var(--yc-surface-soft)]"
                  >
                    <Plus size={15} weight="bold" />
                    사진 올리기
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSheetOpen(false);
                      onNavigate("record");
                    }}
                    className="flex h-12 flex-1 items-center justify-center rounded-full bg-[var(--yc-accent)] text-[14px] font-bold text-[var(--yc-on-accent)] transition-transform active:scale-[0.99]"
                  >
                    기록 보기
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-5">
                <div className="relative mx-auto flex h-[212px] w-[212px] items-center justify-center rounded-[20px] bg-[var(--yc-ink)]">
                  <QrCode size={92} weight="thin" className="text-white/25" />
                  <span className="absolute left-4 top-4 h-8 w-8 rounded-tl-[10px] border-l-[3px] border-t-[3px] yc-b-accent" />
                  <span className="absolute right-4 top-4 h-8 w-8 rounded-tr-[10px] border-r-[3px] border-t-[3px] yc-b-accent" />
                  <span className="absolute bottom-4 left-4 h-8 w-8 rounded-bl-[10px] border-b-[3px] border-l-[3px] yc-b-accent" />
                  <span className="absolute bottom-4 right-4 h-8 w-8 rounded-br-[10px] border-b-[3px] border-r-[3px] yc-b-accent" />
                </div>
                <p className="mt-4 text-center text-[13px] leading-5 text-[var(--yc-body)]">
                  시설 입구에 설치된 QR을 비추면 자동으로 인증됩니다.
                </p>
                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[var(--yc-surface-soft)]">
                  <div className="yc-scan h-full rounded-full bg-[var(--yc-accent)]" />
                </div>
                <p className="mt-2 text-center text-[12px] text-[var(--yc-mute)]">
                  {facility.name} 인증 중
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
