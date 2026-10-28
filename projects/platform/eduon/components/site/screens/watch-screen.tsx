"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowClockwise,
  ArrowLeft,
  ArrowsOut,
  CaretRight,
  CheckCircle,
  ClosedCaptioning,
  Gauge,
  GearSix,
  Heart,
  Pause,
  Play,
  SkipForward,
  WarningCircle,
  WifiSlash,
} from "@phosphor-icons/react";
import { AccessBadge, LockMark, PreviewChip } from "@/projects/platform/eduon/components/access-badge";
import { courseScope, episodeAccess } from "@/projects/platform/eduon/lib/access";
import { clock, won } from "@/projects/platform/eduon/lib/format";
import { COMMENTS, FIRST_MONTH_PRICE, PRICE, SAMPLE_CLIP, photoUrl } from "@/projects/platform/eduon/lib/mock-data";
import { useStore } from "@/projects/platform/eduon/lib/store";
import type { PlaybackState } from "@/projects/platform/eduon/lib/navigation";
import type { Course } from "@/projects/platform/eduon/lib/types";
import { Toggle } from "@/components/shared/toggle";
import { useSite } from "@/projects/platform/eduon/components/site/site-context";
import { Btn, Meter } from "@/projects/platform/eduon/components/site/ui";

/*
 * 시청 골격: media-led. 플레이어가 화면 대부분, 우측 360px 회차 목록 (design.md 반응형 기준).
 * 실제 DRM, 스트리밍 대신 오류와 복구 흐름만 시뮬레이션한다 (spec 2번). 영상은 샘플 클립을 반복 재생하고
 * 시간 표시는 회차 길이를 기준으로 진행시킨다.
 */

const RATES = [0.75, 1, 1.25, 1.5, 2];
const QUALITIES = ["자동", "1080p", "720p", "480p"] as const;
type QualityPick = (typeof QUALITIES)[number];

const CAPTIONS = [
  "이번 강의에서는 생성형 영상 도구를 목적별로 나눠 볼게요.",
  "텍스트로 시작하는 도구와 이미지로 시작하는 도구는 쓰임이 달라요.",
  "먼저 무료 플랜으로 첫 결과물을 하나 만들어 보겠습니다.",
];

export function WatchScreen({ courseId, episode }: { courseId: string; episode: number }) {
  const { course: find, mySub, progress, saveProgress, wishlist, toggleWish } = useStore();
  const { go, openCourse, playback, setPlayback, toast } = useSite();
  const course = find(courseId) ?? find("c01")!;
  const [epNo, setEpNo] = useState(episode);
  const ep = course.episodes.find((e) => e.no === epNo) ?? course.episodes[0];
  const access = episodeAccess(course, ep.no, mySub);
  const locked = access === "locked";
  const saved = progress[course.id]?.episode === ep.no ? progress[course.id] : undefined;

  const [t, setT] = useState(saved?.seconds ?? 0);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [quality, setQuality] = useState<QualityPick>("자동");
  const [captions, setCaptions] = useState(true);
  const [autoNext, setAutoNext] = useState(true);
  const [menu, setMenu] = useState<null | "rate" | "quality">(null);
  const [resumeNote, setResumeNote] = useState(!!saved && saved.seconds > 30);
  const videoRef = useRef<HTMLVideoElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);

  const overlay: PlaybackState = locked ? "locked" : playback;
  const blocked = overlay !== "normal";

  /* 회차가 바뀌면 저장된 위치에서 시작한다 */
  const switchEpisode = (no: number) => {
    setEpNo(no);
    const p = progress[course.id];
    setT(p && p.episode === no ? p.seconds : 0);
    setResumeNote(!!p && p.episode === no && p.seconds > 30);
    setPlaying(false);
    setPlayback("normal");
  };

  /* 재생 중 시간 진행 (샘플 클립은 짧아서 회차 길이 기준으로 따로 센다) */
  useEffect(() => {
    if (!playing || blocked) return;
    const id = window.setInterval(() => setT((v) => Math.min(ep.seconds, v + rate)), 1000);
    return () => window.clearInterval(id);
  }, [playing, blocked, rate, ep.seconds]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = rate;
    if (playing && !blocked) v.play().catch(() => undefined);
    else v.pause();
  }, [playing, blocked, rate]);

  /* 회차 끝: 다음 회차가 잠겨 있으면 구독 안내, 아니면 자동 재생 */
  useEffect(() => {
    if (t < ep.seconds || !playing) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlaying(false);
    saveProgress(course.id, ep.no, ep.seconds);
    const next = course.episodes.find((e) => e.no === ep.no + 1);
    if (!next) return;
    /* 미리보기가 끝나고 다음 회차가 잠겨 있으면 자동 재생 설정과 무관하게 구독 안내로 넘어간다 */
    const nextLocked = episodeAccess(course, next.no, mySub) === "locked";
    if (!autoNext && !nextLocked) return;
    switchEpisode(next.no);
    if (!nextLocked) setPlaying(true);
  }, [t, ep, playing, autoNext, course, mySub, saveProgress, switchEpisode]);

  const togglePlay = () => {
    if (blocked) return;
    if (playing) saveProgress(course.id, ep.no, t);
    setPlaying((v) => !v);
    setResumeNote(false);
  };

  /* 재생 주소 만료: 새 주소를 받아 같은 위치에서 이어 재생 (연출) */
  const [reissue, setReissue] = useState(0);
  useEffect(() => {
    if (overlay !== "expired-url") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReissue(0);
    const id = window.setInterval(() => setReissue((v) => Math.min(100, v + 4)), 60);
    return () => window.clearInterval(id);
  }, [overlay]);
  useEffect(() => {
    if (overlay === "expired-url" && reissue >= 100) {
      setPlayback("normal");
      toast(`새 재생 주소를 받아 ${clock(t)}부터 이어서 재생해요`);
    }
  }, [reissue, overlay, setPlayback, toast, t]);

  const [retrying, setRetrying] = useState(false);
  const retry = () => {
    setRetrying(true);
    window.setTimeout(() => {
      setRetrying(false);
      setPlayback("normal");
    }, 1200);
  };

  const subscribeFromHere = () => go("subscription", { returnTo: { courseId: course.id, episode: ep.no } });
  const wished = wishlist.includes(course.id);
  const nextEp = course.episodes.find((e) => e.no === ep.no + 1);

  return (
    <div className="mx-auto max-w-[1328px] px-0 pb-24 md:px-8">
      <div className="flex h-14 items-center gap-2 px-4 md:px-0">
        <button type="button" onClick={() => go("home")} className="flex h-10 items-center gap-1.5 rounded-[10px] pr-2 text-[14px] font-medium text-[var(--eo-fg-2)] hover:text-[var(--eo-fg)]">
          <ArrowLeft size={18} />
          홈
        </button>
        <CaretRight size={14} className="text-[var(--eo-fg-3)]" />
        <button type="button" onClick={() => openCourse(course.id)} className="min-w-0 truncate text-[14px] font-medium text-[var(--eo-fg-2)] hover:text-[var(--eo-fg)]">
          {course.title}
        </button>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0">
          {/* 플레이어 */}
          <div ref={shellRef} className="eo-dark relative aspect-video w-full overflow-hidden bg-black md:rounded-[24px]">
            <video
              ref={videoRef}
              src={SAMPLE_CLIP}
              poster={course.photo !== null ? photoUrl(course.photo, 1280, 720) : undefined}
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
            {!playing && !blocked && (
              <button type="button" onClick={togglePlay} aria-label="재생" className="absolute inset-0 flex items-center justify-center bg-black/25">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(15,18,22,0.78)]">
                  <Play size={28} weight="fill" />
                </span>
              </button>
            )}
            {captions && !blocked && (
              <div className="pointer-events-none absolute inset-x-0 bottom-[72px] flex justify-center px-6">
                <span className="rounded-[6px] bg-[rgba(0,0,0,0.72)] px-3 py-1 text-center text-[15px] leading-[22px] text-white md:text-[18px] md:leading-[26px]">
                  {CAPTIONS[Math.floor(t / 7) % CAPTIONS.length]}
                </span>
              </div>
            )}
            {resumeNote && !blocked && saved && (
              <div className="eo-fade absolute left-4 top-4 flex items-center gap-3 rounded-[10px] bg-[rgba(15,18,22,0.86)] py-2 pl-3 pr-2 text-[14px]">
                <span>{clock(saved.seconds)}부터 이어서 재생해요</span>
                <button type="button" onClick={() => { setT(0); setResumeNote(false); }} className="h-8 rounded-[8px] px-2 text-[13px] font-semibold text-[var(--eo-brand-ink)] hover:bg-white/10">
                  처음부터
                </button>
              </div>
            )}

            {/* 컨트롤 바 */}
            <div className={`absolute inset-x-0 bottom-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.78),transparent)] px-3 pb-2 pt-8 md:px-4 ${blocked ? "invisible" : ""}`}>
              <input
                type="range"
                min={0}
                max={ep.seconds}
                value={t}
                disabled={blocked}
                onChange={(e) => setT(Number(e.target.value))}
                aria-label="재생 위치"
                className="h-1 w-full cursor-pointer accent-[var(--eo-brand)]"
              />
              <div className="mt-1 flex items-center gap-1 text-white">
                <CtrlBtn label={playing ? "일시정지" : "재생"} onClick={togglePlay} disabled={blocked}>
                  {playing ? <Pause size={20} weight="fill" /> : <Play size={20} weight="fill" />}
                </CtrlBtn>
                <CtrlBtn label="다음 강의" onClick={() => nextEp && switchEpisode(nextEp.no)} disabled={!nextEp}>
                  <SkipForward size={20} weight="fill" />
                </CtrlBtn>
                <span className="ml-1 whitespace-nowrap text-[13px] tabular-nums text-white/85">
                  {clock(t)} / {clock(ep.seconds)}
                </span>
                <div className="ml-auto flex items-center gap-1">
                  <div className="relative">
                    <CtrlBtn label="배속" onClick={() => setMenu(menu === "rate" ? null : "rate")}>
                      <span className="flex items-center gap-1 text-[13px] font-semibold">
                        <Gauge size={18} />
                        <span className="hidden sm:inline">{rate}x</span>
                      </span>
                    </CtrlBtn>
                    {menu === "rate" && (
                      <Menu>
                        {RATES.map((r) => (
                          <MenuItem key={r} on={r === rate} onClick={() => { setRate(r); setMenu(null); }}>
                            {r}x
                          </MenuItem>
                        ))}
                      </Menu>
                    )}
                  </div>
                  <div className="relative">
                    <CtrlBtn label="화질" onClick={() => setMenu(menu === "quality" ? null : "quality")}>
                      <span className="flex items-center gap-1 text-[13px] font-semibold">
                        <GearSix size={18} />
                        <span className="hidden sm:inline">{quality === "자동" ? "자동 1080p" : quality}</span>
                      </span>
                    </CtrlBtn>
                    {menu === "quality" && (
                      <Menu>
                        {QUALITIES.map((q) => (
                          <MenuItem key={q} on={q === quality} onClick={() => { setQuality(q); setMenu(null); }}>
                            {q}
                          </MenuItem>
                        ))}
                      </Menu>
                    )}
                  </div>
                  <CtrlBtn label={captions ? "자막 끄기" : "자막 켜기"} onClick={() => setCaptions((v) => !v)}>
                    <ClosedCaptioning size={20} weight={captions ? "fill" : "regular"} />
                  </CtrlBtn>
                  <CtrlBtn label="전체 화면" onClick={() => shellRef.current?.requestFullscreen?.().catch(() => undefined)}>
                    <ArrowsOut size={20} />
                  </CtrlBtn>
                </div>
              </div>
            </div>

            {blocked && (
              <Overlay
                state={overlay}
                course={course}
                episodeNo={ep.no}
                retrying={retrying}
                reissue={reissue}
                onRetry={retry}
                onSubscribe={subscribeFromHere}
                onBackToPreview={() => switchEpisode(course.access.previewEpisodes[0] ?? 1)}
                onMySub={() => go("membership")}
              />
            )}
          </div>

          {/* 강의 정보 */}
          <div className="px-4 md:px-0">
            <div className="mt-6 flex flex-wrap items-start gap-x-6 gap-y-4">
              <div className="min-w-0 basis-full md:basis-0 md:flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <AccessBadge scope={courseScope(course)} />
                  {access === "preview" && <PreviewChip />}
                  <span className="text-[14px] text-[var(--eo-fg-3)]">
                    {ep.no}강 / {course.episodes.length}강
                  </span>
                </div>
                <h1 className="mt-2 text-[24px] font-bold leading-[34px] tracking-[-0.01em] md:text-[28px] md:leading-[38px]">{ep.title}</h1>
                <p className="mt-1 text-[15px] text-[var(--eo-fg-2)]">
                  <span className="whitespace-nowrap">{course.title}</span> | <span className="whitespace-nowrap">{course.instructor}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <Btn
                  variant="outline"
                  icon={<Heart size={18} weight={wished ? "fill" : "regular"} className={wished ? "text-[var(--eo-brand-ink)]" : ""} />}
                  onClick={() => {
                    toggleWish(course.id);
                    toast(wished ? "찜 목록에서 뺐어요" : "찜 목록에 담았어요");
                  }}
                >
                  찜
                </Btn>
                <Btn variant="outline" onClick={() => openCourse(course.id)}>
                  강의 상세
                </Btn>
              </div>
            </div>
            <p className="mt-5 max-w-[72ch] text-[16px] leading-[26px] text-[var(--eo-fg-2)] eo-text-pretty">{course.summary}</p>
          </div>

          <div className="lg:hidden">
            <EpisodeList course={course} current={ep.no} t={t} autoNext={autoNext} setAutoNext={setAutoNext} onPick={switchEpisode} />
          </div>

          <Comments course={course} />
        </div>

        <div className="hidden lg:sticky lg:top-[88px] lg:block">
          <EpisodeList course={course} current={ep.no} t={t} autoNext={autoNext} setAutoNext={setAutoNext} onPick={switchEpisode} />
        </div>
      </div>
    </div>
  );
}

function CtrlBtn({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-10 min-w-10 items-center justify-center rounded-[8px] px-2 transition-colors hover:bg-white/15 disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function Menu({ children }: { children: React.ReactNode }) {
  return <div className="eo-fade absolute bottom-12 right-0 z-10 w-[132px] rounded-[10px] bg-[rgba(23,27,33,0.97)] p-1 shadow-[var(--eo-float-shadow)]">{children}</div>;
}

function MenuItem({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={`flex h-9 w-full items-center justify-between rounded-[8px] px-3 text-[14px] hover:bg-white/10 ${on ? "font-semibold text-[var(--eo-brand-ink)]" : "text-white"}`}>
      {children}
      {on && <CheckCircle size={16} weight="fill" />}
    </button>
  );
}

const OVERLAY_COPY: Record<Exclude<PlaybackState, "normal" | "locked" | "expired-url">, { icon: React.ReactNode; title: string; body: string; code?: string }> = {
  "network-error": { icon: <WifiSlash size={28} />, title: "네트워크 연결이 끊겼어요", body: "연결이 돌아오면 보던 위치부터 다시 재생해요.", code: "E-NET-0021" },
  denied: { icon: <WarningCircle size={28} />, title: "이 영상을 재생할 권한이 없어요", body: "로그인한 계정의 이용 권한을 확인하지 못했어요. 내 구독 상태를 확인해 주세요.", code: "E-PLAY-403" },
  "drm-error": { icon: <WarningCircle size={28} />, title: "재생 라이선스를 받지 못했어요", body: "보호된 영상의 재생 라이선스 발급이 실패했어요. 잠시 뒤 다시 시도해 주세요.", code: "DRM-LIC-5012" },
  unsupported: { icon: <WarningCircle size={28} />, title: "이 환경에서는 재생할 수 없어요", body: "보호된 영상은 Chrome, Edge, Safari 최신 버전과 EduOn 앱에서 재생돼요. 화면 녹화 프로그램이 켜져 있으면 재생이 제한될 수 있어요." },
};

function Overlay({
  state,
  course,
  episodeNo,
  retrying,
  reissue,
  onRetry,
  onSubscribe,
  onBackToPreview,
  onMySub,
}: {
  state: PlaybackState;
  course: Course;
  episodeNo: number;
  retrying: boolean;
  reissue: number;
  onRetry: () => void;
  onSubscribe: () => void;
  onBackToPreview: () => void;
  onMySub: () => void;
}) {
  const { mySub } = useStore();
  const base = "eo-fade absolute inset-0 z-10 flex items-center justify-center bg-[rgba(10,12,15,0.9)] p-5 md:p-10";

  if (state === "locked") {
    const expired = mySub.status === "expired" || mySub.status === "refunded";
    return (
      <div className={base}>
        <div className="w-full max-w-[460px] text-center">
          <div className="mx-auto flex w-max items-center gap-1.5 text-[13px] font-semibold text-[var(--eo-brand-ink)] md:text-[14px]">
            <LockMark size={16} />
            {episodeNo}강은 구독 전용이에요
          </div>
          <h2 className="mt-1.5 text-[17px] font-bold leading-[24px] md:mt-3 md:text-[26px] md:leading-[36px]">
            {expired ? "다시 구독하면 이어서 볼 수 있어요" : "구독하고 전체 강의를 이어서 보세요"}
          </h2>
          <p className="mt-2 hidden text-[15px] leading-[24px] text-[var(--eo-fg-2)] sm:block">
            구독 대상 강의 {course.episodes.length}강 전체와 다른 강좌까지 모두 볼 수 있어요. 해지해도 남은 기간은 계속 이용할 수 있어요.
          </p>
          <div className="mt-1.5 text-[14px] md:mt-5 md:text-[15px]">
            <span className="text-[var(--eo-fg-3)]">첫 달 (원)</span> <span className="ml-1 text-[17px] font-bold md:text-[20px]">{won(FIRST_MONTH_PRICE)}</span>
            <span className="ml-2 text-[var(--eo-fg-3)]">이후 월 {won(PRICE)}원</span>
          </div>
          <div className="mt-3 grid grid-cols-[1fr_auto] gap-2 sm:flex sm:justify-center md:mt-6">
            <Btn variant="signature" className="md:h-12 md:px-6 md:text-[16px]" onClick={onSubscribe}>
              할인 받고 구독 시작하기
            </Btn>
            <Btn variant="outline" className="md:h-12 md:px-6 md:text-[16px]" onClick={onBackToPreview}>
              다시 보기
            </Btn>
          </div>
        </div>
      </div>
    );
  }

  if (state === "expired-url") {
    return (
      <div className={base}>
        <div className="w-full max-w-[400px] text-center">
          <ArrowClockwise size={28} className="mx-auto text-[var(--eo-blue-dk)]" />
          <h2 className="mt-3 text-[17px] font-semibold leading-[24px] md:text-[22px] md:leading-[30px]">재생 주소가 만료되어 새 주소를 받고 있어요</h2>
          <div className="mx-auto mt-5 max-w-[280px]">
            <Meter value={reissue} />
          </div>
          <div className="mt-4 flex justify-center">
          </div>
        </div>
      </div>
    );
  }

  const copy = OVERLAY_COPY[state as keyof typeof OVERLAY_COPY];
  return (
    <div className={base}>
      <div className="w-full max-w-[440px] text-center">
        <div className="mx-auto hidden w-max text-[var(--eo-red-dk)] sm:block">{copy.icon}</div>
        <h2 className="mt-2 text-[17px] font-semibold leading-[24px] md:mt-3 md:text-[22px] md:leading-[30px]">{copy.title}</h2>
        <p className="mt-2 hidden text-[15px] leading-[24px] text-[var(--eo-fg-2)] sm:block">{copy.body}</p>
        {copy.code && (
          <p className="mt-1 text-[13px] text-[var(--eo-fg-3)] md:mt-2">
            오류 코드 <span className="eo-mono">{copy.code}</span>
          </p>
        )}
        <div className="mt-3 flex items-center justify-center gap-2 md:mt-5">
          {state === "denied" ? (
            <Btn variant="light" onClick={onMySub}>
              내 구독 확인
            </Btn>
          ) : state === "unsupported" ? null : (
            <Btn variant="light" onClick={onRetry} disabled={retrying} icon={<ArrowClockwise size={18} className={retrying ? "animate-spin" : ""} />}>
              {retrying ? "다시 연결 중" : "다시 시도"}
            </Btn>
          )}
        </div>
      </div>
    </div>
  );
}

function EpisodeList({
  course,
  current,
  t,
  autoNext,
  setAutoNext,
  onPick,
}: {
  course: Course;
  current: number;
  t: number;
  autoNext: boolean;
  setAutoNext: (v: boolean) => void;
  onPick: (no: number) => void;
}) {
  const { mySub, progress } = useStore();
  const saved = progress[course.id];
  return (
    <section className="mt-10 border-y border-[var(--eo-hair)] bg-[var(--eo-raised)] lg:mt-0 lg:rounded-[16px] lg:border" aria-label="회차 목록">
      <div className="px-4 pb-3 pt-5 md:px-5">
        <div className="text-[13px] text-[var(--eo-fg-3)]">{course.series}</div>
        <h2 className="mt-0.5 text-[17px] font-semibold leading-[24px]">{course.title}</h2>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-[14px] text-[var(--eo-fg-2)]">다음 강의 자동 재생</span>
          <Toggle checked={autoNext} onChange={setAutoNext} label="다음 강의 자동 재생" size="sm" onClassName="bg-[var(--eo-brand)]" offClassName="bg-[var(--eo-raised-3)]" />
        </div>
      </div>
      <ol className="border-t border-[var(--eo-hair)] py-1">
        {course.episodes.map((e) => {
          const acc = episodeAccess(course, e.no, mySub);
          const on = e.no === current;
          const done = saved && (saved.episode > e.no || (saved.episode === e.no && saved.seconds >= e.seconds - 5));
          const pctNow = on ? (t / e.seconds) * 100 : saved?.episode === e.no ? (saved.seconds / e.seconds) * 100 : done ? 100 : 0;
          return (
            <li key={e.no}>
              <button
                type="button"
                onClick={() => onPick(e.no)}
                aria-current={on ? "true" : undefined}
                className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors md:px-5 ${on ? "bg-[var(--eo-raised-2)]" : "hover:bg-[var(--eo-raised-2)]"}`}
              >
                <span className={`w-5 shrink-0 pt-0.5 text-[14px] font-semibold ${on ? "text-[var(--eo-brand-ink)]" : "text-[var(--eo-fg-3)]"}`}>{e.no}</span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-[15px] leading-[22px] ${acc === "locked" ? "text-[var(--eo-fg-3)]" : on ? "font-semibold" : ""}`}>{e.title}</span>
                  <span className="mt-1.5 flex items-center gap-2">
                    <span className="text-[13px] text-[var(--eo-fg-3)]">{clock(e.seconds)}</span>
                    {acc === "preview" && <PreviewChip />}
                  </span>
                  {pctNow > 0 && acc !== "locked" && <Meter value={pctNow} className="mt-2" />}
                </span>
                {acc === "locked" && <LockMark />}
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Comments({ course }: { course: Course }) {
  const [list, setList] = useState(course.id === "c01" ? COMMENTS : COMMENTS.slice(0, 2));
  const [draft, setDraft] = useState("");
  return (
    <section className="mt-12 px-4 md:px-0" aria-labelledby="comments-title">
      <h2 id="comments-title" className="text-[24px] font-semibold leading-[32px]">
        댓글 <span className="ml-1 text-[16px] font-medium text-[var(--eo-fg-3)]">{list.length}</span>
      </h2>
      <form
        className="mt-4 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.trim()) return;
          setList([{ id: `n${list.length}`, name: "정다빈", at: "방금", body: draft.trim(), episode: 1 }, ...list]);
          setDraft("");
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="강의에 대한 의견을 남겨 주세요"
          aria-label="댓글 입력"
          className="h-11 min-w-0 flex-1 rounded-[10px] border border-[var(--eo-hair-2)] bg-[var(--eo-raised)] px-3 text-[15px] outline-none placeholder:text-[var(--eo-fg-3)] focus:border-[var(--eo-fg-3)]"
        />
        <Btn variant="light" type="submit" disabled={!draft.trim()}>
          등록
        </Btn>
      </form>
      <ul className="mt-6 divide-y divide-[var(--eo-hair)]">
        {list.map((c) => (
          <li key={c.id} className="flex gap-3 py-5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--eo-raised-3)] text-[13px] font-semibold">{c.name.slice(1, 2)}</span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className={`text-[14px] font-semibold ${c.name.endsWith("강사") ? "text-[var(--eo-brand-ink)]" : ""}`}>{c.name}</span>
                <span className="text-[13px] text-[var(--eo-fg-3)]">{c.at}</span>
              </div>
              <p className="mt-1 text-[15px] leading-[24px] text-[var(--eo-fg-2)]">{c.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
