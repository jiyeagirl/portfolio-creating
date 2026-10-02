"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Toggle } from "@/components/shared/toggle";
import { getFilm, picsum } from "@/projects/camera/lumicam/lib/films";
import { shots } from "@/projects/camera/lumicam/lib/shots";
import type { LumicamNavigate } from "@/projects/camera/lumicam/lib/navigation";
import { GradedPhoto } from "@/projects/camera/lumicam/components/graded-photo";

/* iOS 공유 시트를 그대로 흉내낸 바텀 시트 목업 — 시트 자체는 실제 OS 크롬이라
   앱 토큰(--lc-*) 대신 iOS 시스템 색(연회색 패널, 앱별 브랜드 컬러 아이콘, 그린 토글)을
   그대로 쓴다. PermissionAlert(onboarding-screen.tsx)와 같은 예외. 인스타그램은 실제 브랜드
   그라디언트를 그대로 재현(널리 쓰이는 공식 근사 그라디언트 값)해 실물 앱 아이콘처럼
   보이게 한다. 항목 수가 적어 시트 높이는 콘텐츠에 맞춰 자연스럽게 줄어든다(부모의
   justify-end로 하단 고정, 강제 전체 높이 없음). */

const SEND_TARGETS = [
  { id: "airdrop", label: "AirDrop", icon: "solar:radar-linear", bg: "#0A84FF" },
  { id: "message", label: "메시지", icon: "solar:chat-round-linear", bg: "#3AC569" },
  {
    id: "instagram",
    label: "인스타그램",
    icon: "simple-icons:instagram",
    bg: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
  },
] as const;

const QUICK_ACTIONS = [
  { id: "link", label: "링크 복사", icon: "solar:link-linear" },
  { id: "qr", label: "QR 코드", icon: "solar:qr-code-linear" },
  { id: "save", label: "사진 앨범에 저장", icon: "solar:download-minimalistic-linear" },
] as const;

export function ShareScreen({ onNavigate }: { onNavigate: LumicamNavigate }) {
  const shot = shots[shots.length - 1];
  const film = getFilm(shot.filmId)!;
  const [sentId, setSentId] = useState<string | null>(null);
  const [includeExif, setIncludeExif] = useState(true);

  return (
    <div className="relative flex h-full w-full flex-col justify-end overflow-hidden bg-black">
      <div className="absolute inset-0">
        <GradedPhoto
          src={picsum(shot.photoId, 700, 900)}
          alt={film.name}
          grade={film.colorGrade}
          className="h-full w-full opacity-80 blur-[3px]"
          sizes="393px"
        />
      </div>

      <div className="relative z-10 flex max-h-[80%] flex-col overflow-hidden rounded-t-[20px] bg-[#F2F2F7]">
        <div className="flex shrink-0 justify-center pt-2.5">
          <span className="h-[5px] w-9 rounded-full bg-[#3C3C4359]" />
        </div>

        <div className="flex shrink-0 items-center gap-3 px-5 pb-3 pt-3">
          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-[8px]">
            <GradedPhoto
              src={picsum(shot.photoId, 90, 90)}
              alt={film.name}
              grade={film.colorGrade}
              className="h-full w-full"
              sizes="44px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold text-[#1c1c1e]">{film.name} 선택됨</p>
            <p className="mt-0.5 text-[12px] text-[#6e6e73]">
              Frame {shot.frame} | {shot.resolution}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate("result", shot.id)}
            aria-label="닫기"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#6e6e73]"
          >
            <Icon icon="solar:close-circle-bold" width={22} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="relative mb-5 h-40 w-full overflow-hidden rounded-[12px]">
            <GradedPhoto
              src={picsum(shot.photoId, 500, 400)}
              alt={film.name}
              grade={film.colorGrade}
              className="h-full w-full"
              sizes="360px"
            />
          </div>

          <div className="mb-5 flex justify-around">
            {SEND_TARGETS.map((target) => {
              const sent = sentId === target.id;
              return (
                <button
                  key={target.id}
                  type="button"
                  onClick={() => setSentId(target.id)}
                  className="flex flex-col items-center gap-1.5"
                >
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-[16px] text-white"
                    style={{ background: target.bg }}
                  >
                    <Icon icon={target.icon} width={26} />
                  </span>
                  <span className="text-[11.5px] text-[#1c1c1e]">{sent ? "완료" : target.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mb-5 border-t border-[#3C3C4324]" />

          <div className="mb-5 flex justify-around">
            {QUICK_ACTIONS.map((action) => {
              const sent = sentId === action.id;
              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={() => setSentId(action.id)}
                  className="flex flex-col items-center gap-1.5"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E4E4E9] text-[#1c1c1e]">
                    <Icon icon={action.icon} width={22} />
                  </span>
                  <span className="w-16 break-keep text-center text-[11px] leading-[13px] text-[#1c1c1e]">
                    {sent ? "완료" : action.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between overflow-hidden rounded-[12px] bg-white px-4 py-3.5">
            <div className="min-w-0 pr-3">
              <p className="text-[15px] text-[#1c1c1e]">EXIF 정보 포함</p>
              <p className="mt-0.5 text-[12px] leading-[16px] text-[#6e6e73]">
                촬영 일시, 필름 프리셋 등 메타데이터를 함께 공유해요.
              </p>
            </div>
            <Toggle
              checked={includeExif}
              onChange={setIncludeExif}
              label="EXIF 정보 포함"
              onClassName="bg-[#34C759]"
              offClassName="bg-[#E4E4E9]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
