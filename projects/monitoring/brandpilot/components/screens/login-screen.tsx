"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, GoogleLogo, Sparkle } from "@phosphor-icons/react";
import { Button, Eyebrow, Field, Input } from "@/projects/monitoring/brandpilot/components/ui";
import { Mark } from "@/projects/monitoring/brandpilot/components/layout/mark";

export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [findMode, setFindMode] = useState(false);

  return (
    <div className="brandpilot min-h-dvh">
      <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-[minmax(0,1fr)_46%]">
        <div className="flex items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-[380px]">
            <div className="mb-9 flex items-center gap-2">
              <Mark size={26} />
              <span className="text-[18px] font-semibold tracking-[-0.03em] text-[var(--bp-ink)]">
                BrandPilot
              </span>
            </div>

            {!findMode ? (
              <div className="bp-enter">
                <h1 className="text-[24px] font-semibold leading-8 tracking-[-0.04em] text-[var(--bp-ink)]">
                  다시 오셨네요.
                </h1>
                <p className="mt-2 text-[14px] leading-6 tracking-[-0.01em] text-[var(--bp-body)]">
                  레퍼런스 수집부터 AI 생성, 승인, 게시까지 한 곳에서 이어집니다.
                </p>

                <div className="mt-7 space-y-4">
                  <Field label="업무용 이메일">
                    <Input value={email} onChange={setEmail} placeholder="name@abeauty.co.kr" />
                  </Field>
                  <Field label="비밀번호">
                    <Input value={password} onChange={setPassword} placeholder="비밀번호" type="password" />
                  </Field>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-[13px] text-[var(--bp-body)]">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-3.5 w-3.5 accent-[var(--bp-accent)]"
                    />
                    로그인 상태 유지
                  </label>
                  <button
                    type="button"
                    onClick={() => setFindMode(true)}
                    className="text-[13px] text-[var(--bp-accent)]"
                  >
                    비밀번호 찾기
                  </button>
                </div>

                <div className="mt-6">
                  <Button full size="lg" onClick={onLogin} icon={<ArrowRight size={15} weight="bold" />}>
                    콘솔 열기
                  </Button>
                </div>

                <div className="my-5 flex items-center gap-3">
                  <span className="h-px flex-1 bg-[var(--bp-hairline)]" />
                  <span className="text-[12px] text-[var(--bp-mute)]">또는</span>
                  <span className="h-px flex-1 bg-[var(--bp-hairline)]" />
                </div>

                <Button
                  full
                  size="lg"
                  variant="secondary"
                  onClick={onLogin}
                  icon={<GoogleLogo size={16} weight="bold" />}
                >
                  구글 계정으로 계속하기
                </Button>

                <p className="mt-6 text-center text-[12px] leading-5 text-[var(--bp-mute)]">
                  포트폴리오 목업입니다. 아무 값이나 입력해도 콘솔로 진입합니다.
                </p>
              </div>
            ) : (
              <div className="bp-enter">
                <button
                  type="button"
                  onClick={() => setFindMode(false)}
                  className="mb-4 text-[13px] text-[var(--bp-mute)]"
                >
                  로그인으로 돌아가기
                </button>
                <h1 className="text-[24px] font-semibold leading-8 tracking-[-0.04em] text-[var(--bp-ink)]">
                  비밀번호 재설정
                </h1>
                <p className="mt-2 text-[14px] leading-6 tracking-[-0.01em] text-[var(--bp-body)]">
                  가입한 업무용 이메일로 재설정 링크를 보냅니다. 링크는 30분간 유효합니다.
                </p>
                <div className="mt-7">
                  <Field label="업무용 이메일">
                    <Input value={email} onChange={setEmail} placeholder="name@abeauty.co.kr" />
                  </Field>
                </div>
                <div className="mt-6">
                  <Button full size="lg" onClick={() => setFindMode(false)}>
                    재설정 링크 보내기
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="relative hidden overflow-hidden bg-[var(--bp-ink)] lg:block">
          <Image
            src="https://picsum.photos/id/459/1200/1600"
            alt="황금빛 역광의 풀밭"
            fill
            className="object-cover opacity-45"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bp-ink)] via-[var(--bp-ink)]/70 to-transparent" />
          <div className="relative flex h-full flex-col justify-end p-10">
            <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[12px] font-medium text-white">
              <Sparkle size={13} weight="fill" />
              브랜드 가이드 연동 생성
            </span>
            <p className="max-w-[30ch] text-[24px] font-semibold leading-9 tracking-[-0.04em] text-white">
              톤앤매너를 아는 AI가 초안을 씁니다.
            </p>
            <p className="mt-4 max-w-[38ch] text-[14px] leading-6 text-white/70">
              금지 표현과 필수 표기를 미리 학습해 두면, 생성 단계에서 이미 가이드를 지킨 카피가
              나옵니다. 승인까지 걸리는 시간이 줄어듭니다.
            </p>
            <div className="mt-8 flex gap-8 border-t border-white/15 pt-6">
              <div>
                <p className="bp-mono text-[20px] font-semibold text-white">-42%</p>
                <p className="mt-1 text-[12px] text-white/60">승인 소요 시간</p>
              </div>
              <div>
                <p className="bp-mono text-[20px] font-semibold text-white">3.4배</p>
                <p className="mt-1 text-[12px] text-white/60">월 콘텐츠 생산량</p>
              </div>
              <div>
                <Eyebrow>
                  <span className="text-white/50">A뷰티 도입 6개월</span>
                </Eyebrow>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
