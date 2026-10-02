"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Camera,
  Crosshair,
  ImageSquare,
  MapPin,
  PaperPlaneTilt,
} from "@phosphor-icons/react";

import { CityMap } from "@/projects/youngin/street/components/city-map";
import {
  BottomBar,
  CheckRow,
  PrimaryButton,
  staggerVar,
} from "@/projects/youngin/street/components/ui";
import { DRAFT, DRAFT_POSITION, HAZARD_TYPES } from "@/projects/youngin/street/lib/mock-data";
import type { HazardType } from "@/projects/youngin/street/lib/types";

/* 미니맵이 보여 주는 구간. city-map.tsx와 같은 viewBox 0 0 393 852 계의 부분 사각형이라
   큰 지도와 핀 위치가 항상 같다. 카드 안 353x150 박스 비율(2.35)에 맞춰 제보 지점
   (196, 470)이 중앙에 오게 잡았다. */
const MINI_BAND: [number, number, number, number] = [66, 415, 260, 110];

/** 사진 히어로 높이. 이 지점을 지나면 상태바 아래가 흰 폼이 되므로 잉크를 뒤집는다. */
const HERO_H = 320;

export function ReportScreen({
  onBack,
  onSubmit,
  onHeroVisibleChange,
}: {
  onBack: () => void;
  onSubmit: () => void;
  onHeroVisibleChange: (visible: boolean) => void;
}) {
  const [heroVisible, setHeroVisible] = useState(true);
  const [type, setType] = useState<HazardType>(DRAFT.type);
  const [detail, setDetail] = useState(DRAFT.detail);
  const [agreePrivacy, setAgreePrivacy] = useState(true);
  const [agreeLocation, setAgreeLocation] = useState(true);
  const [agreePublic, setAgreePublic] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const ready = agreePrivacy && agreeLocation && detail.trim().length > 0;

  const submit = () => {
    if (!ready || submitting) return;
    setSubmitting(true);
    timer.current = setTimeout(onSubmit, 900);
  };

  return (
    <div className="relative h-[852px] w-full overflow-hidden bg-[var(--st-canvas)]">
      {/* 히어로가 상태바 아래를 벗어나면 흰 판으로 덮는다. 밝은 잉크의 상태바가
          흰 폼 위에 그대로 남으면 시각을 읽을 수 없다. */}
      {!heroVisible && (
        <div className="absolute inset-x-0 top-0 z-20 h-[59px] bg-[var(--st-surface)]" />
      )}
      <div
        onScroll={(e) => {
          const next = e.currentTarget.scrollTop < HERO_H - 59;
          if (next !== heroVisible) {
            setHeroVisible(next);
            onHeroVisibleChange(next);
          }
        }}
        className="h-full overflow-y-auto pb-[112px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* 촬영한 사진. 이 화면의 시작점이자 제보의 근거다. */}
        <div className="relative h-[320px] w-full bg-[var(--st-ink-surface)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={DRAFT.photo}
            alt={DRAFT.photoCaption}
            className="h-full w-full object-cover"
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[140px]"
            style={{ background: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0))" }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[120px]"
            style={{ background: "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.55))" }}
          />

          <button
            type="button"
            onClick={onBack}
            aria-label="지도로 돌아가기"
            className="absolute left-4 top-[67px] flex h-11 w-11 items-center justify-center rounded-full bg-[var(--st-ink-surface)] text-[var(--st-on-dark)] transition-transform duration-200 active:scale-95"
          >
            <ArrowLeft size={19} weight="bold" />
          </button>
          <span className="st-num absolute right-4 top-[73px] rounded-[5px] bg-[var(--st-ink-surface)] px-2 py-1 text-[12px] font-semibold text-[var(--st-on-dark)]">
            사진 1 / 3
          </span>

          <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
            <p className="text-[14px] leading-[20px] tracking-[-0.224px] text-[var(--st-on-dark-muted)]">
              오늘 오후 2시 38분 촬영
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-[8px] bg-[var(--st-ink-surface)] px-[15px] py-2 text-[14px] tracking-[-0.224px] text-[var(--st-on-dark)] transition-transform duration-200 active:scale-95"
              >
                <Camera size={16} />
                다시 촬영
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-[8px] bg-[var(--st-ink-surface)] px-[15px] py-2 text-[14px] tracking-[-0.224px] text-[var(--st-on-dark)] transition-transform duration-200 active:scale-95"
              >
                <ImageSquare size={16} />
                사진 추가
              </button>
            </div>
          </div>
        </div>

        <div className="st-enter px-5 pt-7">
          <p className="text-[12px] font-semibold leading-[16px] text-[var(--st-accent)]">
            위험, 불편 제보하기
          </p>
          <h1 className="mt-1 text-[28px] font-semibold leading-[34px] tracking-[-0.4px] text-[var(--st-ink)]">
            사진과 위치는 이미 담았습니다
          </h1>
          <p className="mt-2 text-[15px] leading-[22px] tracking-[-0.3px] text-[var(--st-ink-48)]">
            유형만 확인하고 등록하면 담당 부서로 바로 전달됩니다.
          </p>

          {/* 위치 */}
          <section className="mt-7">
            <div className="mb-2.5 flex items-center justify-between">
              <h2 className="text-[17px] font-semibold leading-[22px] tracking-[-0.374px] text-[var(--st-ink)]">
                제보 위치
              </h2>
              <span className="st-num flex items-center gap-1 text-[12px] font-semibold text-[var(--st-done)]">
                <Crosshair size={13} weight="bold" />
                자동 입력 완료 (오차 {DRAFT.accuracy}m)
              </span>
            </div>

            <div className="overflow-hidden rounded-[18px] border border-[var(--st-hairline)] bg-[var(--st-surface)]">
              <div className="relative h-[150px] w-full">
                <CityMap reports={[]} band={MINI_BAND} mePosition={DRAFT_POSITION} />
                <button
                  type="button"
                  className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[var(--st-surface)] px-3.5 py-2 text-[12px] font-semibold text-[var(--st-accent)] transition-transform duration-200 active:scale-95"
                  style={{ boxShadow: "var(--st-shadow-float)" }}
                >
                  <MapPin size={14} weight="fill" />
                  지도에서 위치 수정
                </button>
              </div>
              <div className="border-t border-[var(--st-hairline)] px-4 py-3">
                <p className="text-[17px] leading-[25px] tracking-[-0.374px] text-[var(--st-ink)]">
                  {DRAFT.address}
                </p>
                <p className="mt-0.5 text-[14px] leading-[20px] tracking-[-0.224px] text-[var(--st-ink-48)]">
                  {DRAFT.landmark}
                </p>
                <p className="st-num mt-1.5 text-[12px] leading-[16px] text-[var(--st-ink-48)]">
                  위도, 경도 {DRAFT.coord} | GPS 자동 확인
                </p>
              </div>
            </div>
          </section>

          {/* 유형 */}
          <section className="mt-7">
            <h2 className="text-[17px] font-semibold leading-[22px] tracking-[-0.374px] text-[var(--st-ink)]">
              위험 유형
            </h2>
            <p className="mt-1 text-[14px] leading-[20px] tracking-[-0.224px] text-[var(--st-ink-48)]">
              {HAZARD_TYPES.find((t) => t.key === type)?.hint}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {HAZARD_TYPES.map((t, i) => {
                const Icon = t.icon;
                const on = t.key === type;
                /* flex-row과 flex-col을 한 문자열에 같이 두면 Tailwind 정의 순서상 항상
                   flex-col이 이긴다. 분기해서 한쪽만 넣는다. */
                const shape =
                  t.key === "etc"
                    ? "col-span-2 flex flex-row items-center gap-2.5"
                    : "flex min-h-[76px] flex-col justify-between";
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setType(t.key)}
                    aria-pressed={on}
                    style={staggerVar(i)}
                    className={`st-stagger rounded-[11px] border p-3 text-left transition-[border-color,background-color,transform] duration-200 active:scale-[0.98] ${shape} ${
                      on
                        ? "border-[var(--st-accent)] bg-[var(--st-accent-soft)]"
                        : "border-[var(--st-hairline)] bg-[var(--st-surface)]"
                    }`}
                  >
                    <Icon
                      size={22}
                      weight={on ? "fill" : "regular"}
                      color={on ? "var(--st-accent)" : "var(--st-ink-48)"}
                    />
                    <span
                      className="text-[14px] font-semibold leading-[19px] tracking-[-0.224px]"
                      style={{ color: on ? "var(--st-accent)" : "var(--st-ink)" }}
                    >
                      {t.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 상세 내용 */}
          <section className="mt-7">
            <div className="mb-2.5 flex items-baseline justify-between">
              <h2 className="text-[17px] font-semibold leading-[22px] tracking-[-0.374px] text-[var(--st-ink)]">
                상세 내용
              </h2>
              <span className="st-num text-[12px] text-[var(--st-ink-48)]">
                {detail.length} / 500
              </span>
            </div>
            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value.slice(0, 500))}
              rows={5}
              aria-label="제보 상세 내용"
              className="w-full resize-none rounded-[11px] border border-[var(--st-hairline)] bg-[var(--st-pearl)] px-4 py-3 text-[15px] leading-[22px] tracking-[-0.3px] text-[var(--st-ink)] outline-none focus:border-[var(--st-accent-focus)]"
            />
            <p className="mt-2 text-[12px] leading-[16px] text-[var(--st-ink-48)]">
              언제부터인지, 누가 지나다니는 길인지 적어 주시면 현장 확인이 빨라집니다.
            </p>
          </section>

          {/* 동의 */}
          <section className="mt-7">
            <h2 className="text-[17px] font-semibold leading-[22px] tracking-[-0.374px] text-[var(--st-ink)]">
              개인정보 및 위치정보 활용 동의
            </h2>
            <div className="mt-1.5 divide-y divide-[var(--st-divider)]">
              <CheckRow
                required
                checked={agreePrivacy}
                onChange={setAgreePrivacy}
                title="개인정보 수집 및 이용 동의"
                detail="처리 결과 안내를 위해 이름과 연락처를 수집하고, 처리 완료 후 1년간 보관합니다."
              />
              <CheckRow
                required
                checked={agreeLocation}
                onChange={setAgreeLocation}
                title="위치정보 활용 동의"
                detail="제보 위치를 담당 부서에 전달하고 보행 위험 지도에 표시합니다."
              />
              <CheckRow
                checked={agreePublic}
                onChange={setAgreePublic}
                title="제보 사진 공개 동의"
                detail="동의하지 않으면 지도에는 위치와 유형만 공개되고 사진은 담당 부서만 봅니다."
              />
            </div>
          </section>

          <div className="mt-6 rounded-[18px] bg-[var(--st-parchment)] px-4 py-3.5">
            <p className="text-[14px] leading-[20px] tracking-[-0.224px] text-[var(--st-ink-80)]">
              담당 부서 검토와 중복 확인을 거쳐 승인된 제보에는 용인시 시티포인트{" "}
              <span className="st-num font-semibold text-[var(--st-ink)]">
                {DRAFT.expectedPoints}P
              </span>
              가 지급됩니다.
            </p>
          </div>
        </div>
      </div>

      <BottomBar>
        {submitting && (
          <div className="mb-3 h-[3px] w-full overflow-hidden rounded-[5px] bg-[var(--st-divider)]">
            <div className="st-submit h-full w-1/3 rounded-[5px] bg-[var(--st-accent)]" />
          </div>
        )}
        <PrimaryButton
          onClick={submit}
          disabled={!ready || submitting}
          icon={submitting ? undefined : <PaperPlaneTilt size={19} weight="fill" />}
        >
          {submitting ? "접수하는 중" : "제보 등록하기"}
        </PrimaryButton>
      </BottomBar>
    </div>
  );
}
