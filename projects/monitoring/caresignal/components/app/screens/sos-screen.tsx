"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CaretLeft, CheckCircle, MapPin, Phone, Siren, SpinnerGap } from "@phosphor-icons/react";
import { MiniMap } from "@/projects/monitoring/caresignal/components/mini-map";
import {
  Card,
  ListRow,
  Monogram,
  SectionTitle,
  StatusBadge,
} from "@/projects/monitoring/caresignal/components/app/ui";
import { location, sosContacts, sosHistory, user } from "@/projects/monitoring/caresignal/lib/app-data";
import type { AppNavigate } from "@/projects/monitoring/caresignal/lib/navigation";

const HOLD_MS = 2400;
const TICK_MS = 60;

const SENT_TIMELINE = [
  { at: "방금", label: "긴급 요청 접수", done: true },
  { at: "1초 후", label: "현재 위치 전송 완료", done: true },
  { at: "3초 후", label: "보호자 2명, 복지기관에 알림 발송", done: true },
  { at: "진행 중", label: "담당자 응답 대기", done: false },
];

export function SosScreen({ onNavigate }: { onNavigate: AppNavigate }) {
  const [progress, setProgress] = useState(0);
  const [sent, setSent] = useState(false);
  const timer = useRef<number | null>(null);

  const stopHold = useCallback(() => {
    if (timer.current !== null) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
    setProgress((value) => (value >= 100 ? value : 0));
  }, []);

  const startHold = useCallback(() => {
    if (sent || timer.current !== null) return;
    timer.current = window.setInterval(() => {
      setProgress((value) => {
        const next = value + (TICK_MS / HOLD_MS) * 100;
        if (next >= 100) {
          if (timer.current !== null) {
            window.clearInterval(timer.current);
            timer.current = null;
          }
          setSent(true);
          return 100;
        }
        return next;
      });
    }, TICK_MS);
  }, [sent]);

  useEffect(
    () => () => {
      if (timer.current !== null) window.clearInterval(timer.current);
    },
    [],
  );

  if (sent) {
    return (
      <div className="flex min-h-full w-full flex-col px-5 pb-10 pt-[76px]">
        <div className="flex items-center justify-between">
          <StatusBadge status="danger">요청 전송됨</StatusBadge>
          <span className="text-[13px] font-normal text-[#7a7a7a]">오후 2시 41분</span>
        </div>

        <h1 className="mt-4 text-[28px] font-bold leading-[1.25] tracking-[-0.03em] text-[#1d1d1f]">
          도움 요청을 보냈습니다
        </h1>
        <p className="mt-2.5 text-[15px] font-normal leading-[1.55] text-[#333333]">
          현재 위치와 함께 보호자 두 분, {user.agency}에 알림이 전달되었습니다. 자리를 옮기지 말고
          기다려 주세요.
        </p>

        <MiniMap
          className="cs-image-shadow mt-5 h-[152px] w-full"
          markers={[
            { id: "me", x: 58, y: 58, kind: "event", status: "danger", pulse: true, label: "전송된 위치" },
          ]}
          showLabels={false}
        />
        <p className="mt-3 flex items-center gap-2 text-[14px] font-normal text-[#333333]">
          <MapPin size={16} weight="fill" className="text-[#d70015]" />
          {location.place} · 오차 8m
        </p>

        <SectionTitle className="mt-7">진행 상태</SectionTitle>
        <ol className="mt-4">
          {SENT_TIMELINE.map((step, index) => (
            <li key={step.label} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={`mt-[3px] flex h-[18px] w-[18px] items-center justify-center rounded-full ${
                    step.done ? "bg-[#248a3d]" : "bg-[#eef4fb]"
                  }`}
                >
                  {step.done ? (
                    <CheckCircle size={12} weight="fill" className="text-white" />
                  ) : (
                    <SpinnerGap size={12} weight="bold" className="text-[#0066cc]" />
                  )}
                </span>
                {index < SENT_TIMELINE.length - 1 && <span className="h-full w-[2px] bg-[#f0f0f0]" />}
              </div>
              <div className="pb-4">
                <p
                  className={`text-[15px] leading-[1.35] ${
                    step.done ? "font-normal text-[#333333]" : "font-semibold text-[#0066cc]"
                  }`}
                >
                  {step.label}
                </p>
                <p className="mt-0.5 text-[12.5px] font-normal text-[#7a7a7a]">{step.at}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-auto space-y-2.5 pt-4">
          <button
            type="button"
            className="cs-press cs-focusable flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full bg-[#0066cc] text-[17px] font-semibold text-white"
          >
            <Phone size={20} weight="fill" />
            119에 바로 연결하기
          </button>
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setProgress(0);
            }}
            className="cs-press cs-focusable min-h-[52px] w-full rounded-full border border-[#0066cc] text-[16px] font-semibold text-[#0066cc]"
          >
            요청 취소하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full w-full flex-col px-5 pb-10 pt-[68px]">
      <button
        type="button"
        onClick={() => onNavigate("home")}
        className="cs-press cs-focusable -ml-1 flex h-9 w-9 items-center justify-center rounded-full text-[#0066cc]"
        aria-label="홈으로"
      >
        <CaretLeft size={22} weight="bold" />
      </button>

      <h1 className="mt-2 text-[30px] font-bold leading-[1.15] tracking-[-0.03em] text-[#1d1d1f]">
        긴급 도움 요청
      </h1>
      <p className="mt-2 text-[15px] font-normal leading-[1.55] text-[#333333]">
        버튼을 3초간 누르면 현재 위치와 함께 보호자, 복지기관에 즉시 알림이 갑니다.
      </p>

      <div className="mt-9 flex flex-col items-center">
        <div className="relative flex h-[212px] w-[212px] items-center justify-center">
          <span className="cs-pulse absolute h-[164px] w-[164px] rounded-full bg-[#ff3b30]" />
          <svg viewBox="0 0 212 212" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="106" cy="106" r="98" fill="none" stroke="#f5f5f7" strokeWidth="8" />
            <circle
              cx="106"
              cy="106"
              r="98"
              fill="none"
              stroke="#d70015"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 98}
              strokeDashoffset={2 * Math.PI * 98 * (1 - progress / 100)}
            />
          </svg>
          <button
            type="button"
            onPointerDown={startHold}
            onPointerUp={stopHold}
            onPointerLeave={stopHold}
            onPointerCancel={stopHold}
            className="cs-focusable relative flex h-[164px] w-[164px] flex-col items-center justify-center gap-1.5 rounded-full bg-[#d70015] text-white transition-transform duration-150 active:scale-95"
          >
            <Siren size={40} weight="fill" />
            <span className="text-[26px] font-bold leading-none tracking-[0.02em]">SOS</span>
          </button>
        </div>
        <p className="mt-5 text-[14px] font-normal text-[#7a7a7a]">
          {progress > 0 ? "손을 떼지 마세요" : "3초간 길게 누르세요"}
        </p>
      </div>

      <SectionTitle className="mt-9">알림이 가는 곳</SectionTitle>
      <div className="mt-2">
        {sosContacts.map((contact, index) => (
          <div
            key={contact.id}
            className={`py-3 ${index < sosContacts.length - 1 ? "border-b border-[#f0f0f0]" : ""}`}
          >
            <ListRow
              leading={<Monogram name={contact.name} size={36} />}
              title={contact.name}
              subtitle={`${contact.relation} · ${contact.phone}`}
              trailing={
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef4fb] text-[#0066cc]">
                  <Phone size={17} weight="fill" />
                </span>
              }
            />
          </div>
        ))}
      </div>

      <SectionTitle className="mt-8">요청 이력</SectionTitle>
      <div className="mt-3 space-y-2">
        {sosHistory.map((item) => (
          <Card key={item.id} tone="parchment" className="p-4">
            <div className="flex items-baseline justify-between">
              <p className="text-[15px] font-semibold text-[#1d1d1f]">{item.place}</p>
              <p className="text-[12.5px] font-normal text-[#7a7a7a]">{item.dayLabel}</p>
            </div>
            <p className="mt-2 text-[13.5px] font-normal leading-[1.5] text-[#333333]">
              {item.timeLabel} · {item.result}
            </p>
            <p className="mt-1.5 text-[12.5px] font-normal text-[#248a3d]">{item.elapsed}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
