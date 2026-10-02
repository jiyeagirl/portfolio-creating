"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Check } from "@phosphor-icons/react";
import {
  Button,
  Display,
  Eyebrow,
  Field,
  Input,
  TeamMark,
} from "@/projects/commerce/baseballmarket/components/ui";
import {
  CATEGORY_TILES,
  MY_TEAM,
  TEAMS,
  photo,
  teamLabel,
} from "@/projects/commerce/baseballmarket/lib/mock-data";
import type { TeamId } from "@/projects/commerce/baseballmarket/lib/types";

/* 회원가입 3단계. vercel의 히어로 7-5 그리드를 로그인 화면에 적용했다.
   선택 상태는 색이 아니라 잉크 반전과 테두리로 표시한다.
   좌측이 폼, 우측이 색면 + 사진 카드. */

type Step = "login" | "team" | "interest";

export function AuthScreen({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState<Step>("login");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [team, setTeam] = useState<TeamId>(MY_TEAM);
  const [interests, setInterests] = useState<Set<string>>(new Set(["유니폼", "티켓"]));

  function toggleInterest(key: string) {
    setInterests((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div className="mx-auto grid max-w-[1280px] items-start gap-12 px-5 py-12 lg:grid-cols-12 lg:gap-16 lg:px-8 lg:py-20">
      <div className="bm-rise lg:col-span-7">
        <Eyebrow>
          {step === "login" ? "로그인 / 회원가입" : step === "team" ? "1단계 중 1" : "2단계 중 2"}
        </Eyebrow>

        {step === "login" && (
          <>
            <Display className="mt-4">
              구단이 정해지면
              <br />
              마켓이 달라집니다
            </Display>
            <p className="mt-5 max-w-[460px] text-[16px] leading-[25px] text-[var(--bm-body)]">
              응원 구단을 고르면 홈, 매물 정렬, 커뮤니티가 그 구단 기준으로 맞춰집니다.
              유니폼 실측과 티켓 정가 비교는 가입 없이도 볼 수 있습니다.
            </p>

            <div className="mt-9 max-w-[420px] space-y-4">
              <Field label="이메일">
                <Input value={email} onChange={setEmail} placeholder="name@example.com" type="email" />
              </Field>
              <Field label="비밀번호">
                <Input value={pw} onChange={setPw} placeholder="8자 이상" type="password" />
              </Field>
              <Button full size="lg" onClick={() => setStep("team")} trailingIcon={<ArrowRight size={14} weight="bold" />}>
                이메일로 계속하기
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="secondary" full onClick={() => setStep("team")}>
                  카카오로 시작
                </Button>
                <Button variant="secondary" full onClick={() => setStep("team")}>
                  네이버로 시작
                </Button>
              </div>
              <p className="text-[13px] leading-[20px] text-[var(--bm-muted)]">
                가입하면 이용약관과 개인정보 처리방침에 동의하는 것으로 봅니다.
              </p>
            </div>
          </>
        )}

        {step === "team" && (
          <>
            <Display className="mt-4">응원하는 구단을 고르세요</Display>
            <p className="mt-4 max-w-[460px] text-[16px] leading-[25px] text-[var(--bm-body)]">
              고른 구단만 홈에서 잉크 카드를 갖습니다. 커뮤니티 기본 게시판이 이 구단으로 바뀌고,
              매물 알림도 이 구단부터 옵니다.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
              {TEAMS.map((t) => {
                const on = team === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTeam(t.id)}
                    aria-pressed={on}
                    className={`bm-swap flex items-center gap-2.5 rounded-[8px] px-3 py-3 text-left ${
                      on
                        ? "bg-[var(--bm-team)] text-[var(--bm-team-on)]"
                        : "bg-[var(--bm-surface-card)] text-[var(--bm-body-strong)] bm-press"
                    }`}
                  >
                    <span
                      aria-hidden
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold"
                      style={{
                        background: on ? "rgba(255,255,255,0.2)" : "var(--bm-surface-strong)",
                        color: on ? "#ffffff" : "var(--bm-body-strong)",
                      }}
                    >
                      {t.mark}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-semibold leading-[18px]">
                        {t.name}
                      </span>
                      <span
                        className="block truncate text-[11px] leading-[15px]"
                        style={{ opacity: on ? 0.8 : 0.6 }}
                      >
                        {t.city}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex gap-3">
              <Button variant="secondary" onClick={() => setStep("login")}>
                이전
              </Button>
              <Button onClick={() => setStep("interest")} trailingIcon={<ArrowRight size={14} weight="bold" />}>
                다음
              </Button>
            </div>
          </>
        )}

        {step === "interest" && (
          <>
            <Display className="mt-4">관심 카테고리를 골라주세요</Display>
            <p className="mt-4 max-w-[460px] text-[16px] leading-[25px] text-[var(--bm-body)]">
              홈에 먼저 보일 매물의 종류를 정합니다. 나중에 마이페이지에서 바꿀 수 있습니다.
            </p>

            {/* 선택 상태를 색이 아니라 잉크 반전과 테두리로 표시한다 —
                vercel은 액센트가 잉크 하나뿐이다. */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {CATEGORY_TILES.map((c) => {
                const on = interests.has(c.key);
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => toggleInterest(c.key)}
                    aria-pressed={on}
                    className={`bm-swap flex items-start gap-3 rounded-[8px] border p-4 text-left ${
                      on
                        ? "border-[var(--bm-ink)] bg-[var(--bm-canvas)] bm-card"
                        : "border-[var(--bm-hairline)] bg-[var(--bm-canvas)]"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] ${
                        on ? "bg-[var(--bm-ink)]" : "border border-[var(--bm-hairline-strong)]"
                      }`}
                    >
                      {on && <Check size={10} weight="bold" color="#ffffff" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[14px] font-medium leading-[20px] tracking-[-0.01em] text-[var(--bm-ink)]">
                        {c.label}
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-[18px] text-[var(--bm-muted)]">
                        {c.sub}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex gap-3">
              <Button variant="secondary" onClick={() => setStep("team")}>
                이전
              </Button>
              <Button size="lg" onClick={onDone} trailingIcon={<ArrowRight size={14} weight="bold" />}>
                {teamLabel(team)} 홈으로 가기
              </Button>
            </div>
          </>
        )}
      </div>

      {/* 우측 패널. 색면 대신 사진 + 잉크 반전 카드 + 흰 카드로 밴드를 순환시킨다. */}
      <div className="bm-rise hidden lg:col-span-5 lg:block" style={{ animationDelay: "40ms" }}>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[8px] bg-[var(--bm-surface-card)]">
          <Image
            src={photo(452, 800, 600)}
            alt="야간 경기 관중석 응원 장면"
            fill
            sizes="480px"
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="overflow-hidden rounded-[8px] bg-[var(--bm-ink)] text-[var(--bm-on-ink)]">
            <div className="bm-mesh-rule h-[3px] w-full" aria-hidden />
            <div className="p-4">
              <p className="text-[12px] font-medium leading-[16px] tracking-[0.06em] text-white/50">
                티켓
              </p>
              <p className="bm-num mt-2 text-[24px] font-semibold leading-[32px] tracking-[-0.04em]">
                812건
              </p>
              <p className="mt-1 text-[13px] leading-[18px] text-white/60">
                이번 주 정가 이하 거래
              </p>
            </div>
          </div>
          <div className="bm-card rounded-[8px] bg-[var(--bm-canvas)] p-4">
            <p className="text-[12px] font-medium leading-[16px] tracking-[0.06em] text-[var(--bm-muted-soft)]">
              유니폼
            </p>
            <p className="mt-2 text-[20px] font-semibold leading-[28px] tracking-[-0.03em] text-[var(--bm-ink)]">
              실측 표기
            </p>
            <p className="mt-1 text-[13px] leading-[18px] text-[var(--bm-muted)]">
              가슴, 총장, 어깨 필수 입력
            </p>
          </div>
        </div>

        <div className="bm-card mt-4 flex items-center gap-3 rounded-[8px] bg-[var(--bm-canvas)] p-4">
          <TeamMark id={team} size={36} accent />
          <div className="min-w-0">
            <p className="truncate text-[14px] font-medium leading-[20px] tracking-[-0.01em] text-[var(--bm-ink)]">
              {teamLabel(team)}
            </p>
            <p className="truncate text-[13px] leading-[18px] text-[var(--bm-muted)]">
              지금 이 구단 매물 342건
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
