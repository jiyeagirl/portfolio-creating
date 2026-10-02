"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { PHOTO, getFacility, getMission, photo } from "@/projects/youngin/festival/lib/mock-data";
import type { FestivalNavigate } from "@/projects/youngin/festival/lib/navigation";

/* 기기 프레임 안쪽 규칙 (design.md): 카메라 뷰의 어두운 처리는 backdrop-blur가 아니라
   사진 위에 얹은 단색 오버레이 div로 만든다. 상단, 하단 바도 전부 불투명색이다. */

export function ScanScreen({
  missionId,
  onComplete,
  onNavigate,
}: {
  missionId?: string;
  onComplete: (id: string) => void;
  onNavigate: FestivalNavigate;
}) {
  const mission = getMission(missionId ?? "m-medical");
  const facility = getFacility(mission.facilityId);
  const [detected, setDetected] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDetected(true), 1600);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-full w-full" style={{ background: "var(--fs-dark)" }}>
      {/* 카메라 뷰 시뮬레이션. 사진 342: 붐비는 거리 시장 */}
      <img
        src={photo(PHOTO.marketCrowd, 786, 1704)}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0" style={{ background: "rgba(20,18,16,0.74)" }} />

      {/* 상단 바 */}
      <header
        className="absolute inset-x-0 top-0 z-20 pb-3.5 pt-[63px]"
        style={{ background: "var(--fs-dark)" }}
      >
        <div className="flex items-center gap-2 px-4">
          <button
            type="button"
            aria-label="닫기"
            onClick={() => onNavigate("mission")}
            className="-ml-1 flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-150 active:scale-[0.94]"
            style={{ color: "var(--fs-on-dark)" }}
          >
            <Icon icon="solar:close-circle-linear" width="22" height="22" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-bold" style={{ color: "var(--fs-on-dark)" }}>
              QR 인증
            </p>
            <p className="truncate text-[11.5px]" style={{ color: "var(--fs-on-dark-muted)" }}>
              {mission.title}
            </p>
          </div>
        </div>
      </header>

      {/* 뷰파인더 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
        <p
          className="mb-6 text-center text-[14px] font-semibold leading-[20px]"
          style={{ color: "var(--fs-on-dark)" }}
        >
          {facility.name} 앞 안내판의
          <br />
          QR 코드를 사각형 안에 맞춰 주세요
        </p>

        <div className="relative h-[240px] w-[240px]">
          {[
            "left-0 top-0 border-l-[4px] border-t-[4px] rounded-tl-[14px]",
            "right-0 top-0 border-r-[4px] border-t-[4px] rounded-tr-[14px]",
            "left-0 bottom-0 border-l-[4px] border-b-[4px] rounded-bl-[14px]",
            "right-0 bottom-0 border-r-[4px] border-b-[4px] rounded-br-[14px]",
          ].map((cls) => (
            <span
              key={cls}
              className={`absolute h-[46px] w-[46px] ${cls}`}
              style={{ borderColor: detected ? "var(--fs-gold)" : "var(--fs-accent)" }}
            />
          ))}

          {!detected && (
            <span
              className="fs-scanline absolute inset-x-5 top-9 block h-[2px] rounded-full"
              style={{ background: "var(--fs-accent)", opacity: 0.9 }}
            />
          )}

          {detected && (
            <div className="fs-stamp absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="flex h-[68px] w-[68px] items-center justify-center rounded-full"
                style={{ background: "var(--fs-gold)", color: "#ffffff" }}
              >
                <Icon icon="solar:check-read-bold" width="34" height="34" />
              </span>
              <p
                className="mt-3 text-[15px] font-bold"
                style={{ color: "var(--fs-on-dark)" }}
              >
                QR 인식 완료
              </p>
              <p className="mt-1 text-[12.5px]" style={{ color: "var(--fs-on-dark-muted)" }}>
                {facility.zone}구역 {facility.name}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 h-[50px] w-full max-w-[280px]">
          {detected ? (
            <button
              type="button"
              onClick={() => {
                onComplete(mission.id);
                onNavigate("missionDone", mission.id);
              }}
              className="flex h-full w-full items-center justify-center gap-1.5 rounded-[12px] text-[15px] font-bold transition-transform duration-150 active:scale-[0.98]"
              style={{ background: "var(--fs-accent)", color: "var(--fs-on-accent)" }}
            >
              <Icon icon="solar:flag-2-bold" width="19" height="19" />
              미션 완료하기
            </button>
          ) : (
            <p
              className="festival-num flex h-full items-center justify-center text-[12.5px]"
              style={{ color: "var(--fs-on-dark-muted)" }}
            >
              QR 코드를 찾는 중입니다
            </p>
          )}
        </div>
      </div>

      {/* 하단 바 */}
      <footer
        className="absolute inset-x-0 bottom-0 z-20 px-5 pb-[34px] pt-4"
        style={{ background: "var(--fs-dark)" }}
      >
        <div
          className="flex items-center gap-2.5 rounded-[12px] px-3.5 py-3"
          style={{ background: "var(--fs-dark-soft)" }}
        >
          <Icon
            icon="solar:info-circle-linear"
            width="18"
            height="18"
            style={{ color: "var(--fs-on-dark-muted)" }}
            className="shrink-0"
          />
          <p className="text-[12px] leading-[17px]" style={{ color: "var(--fs-on-dark-muted)" }}>
            QR이 잘 읽히지 않으면 종합안내소에서 스탬프판으로 대신 인증할 수 있습니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
