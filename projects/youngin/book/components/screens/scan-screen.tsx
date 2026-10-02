"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { getLibrary, photo } from "@/projects/youngin/book/lib/mock-data";
import type { BookNavigate } from "@/projects/youngin/book/lib/navigation";

/* 기기 프레임 안쪽 규칙 (design.md): 카메라 뷰의 어두운 처리는 backdrop-blur가 아니라
   사진 위에 얹은 단색 오버레이 div로 만든다. 상단/하단 바도 전부 불투명색이다. */

export function ScanScreen({
  libraryId,
  onNavigate,
}: {
  libraryId?: string;
  onNavigate: BookNavigate;
}) {
  const library = getLibrary(libraryId ?? "cheoin");
  const [detected, setDetected] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDetected(true), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-full w-full" style={{ background: "var(--bk-dark)" }}>
      {/* 카메라 뷰 시뮬레이션 */}
      <img
        src={photo(library.photoId, 786, 1704)}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0" style={{ background: "rgba(10,16,13,0.72)" }} />

      {/* 상단 바 */}
      <header
        className="absolute inset-x-0 top-0 z-20 pb-3 pt-[63px]"
        style={{ background: "var(--bk-dark)" }}
      >
        <div className="flex items-center gap-2 px-4">
          <button
            type="button"
            onClick={() => onNavigate("certify")}
            aria-label="닫기"
            className="-ml-2 flex h-11 w-11 items-center justify-center rounded-full"
          >
            <Icon icon="solar:close-circle-linear" width="24" height="24" color="#F0EEE4" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[15.5px] font-semibold text-[#F0EEE4]">방문 인증</p>
            <p className="text-[11.5px] text-[var(--bk-on-dark-muted)]">
              도서관 입구 QR을 사각형 안에 맞춰 주세요
            </p>
          </div>
          <button
            type="button"
            aria-label="손전등"
            className="flex h-11 w-11 items-center justify-center rounded-full"
          >
            <Icon icon="solar:flashlight-linear" width="22" height="22" color="#F0EEE4" />
          </button>
        </div>
      </header>

      {/* 스캔 프레임 */}
      <div className="absolute left-1/2 top-[300px] z-10 -translate-x-1/2">
        <div className="relative h-[228px] w-[228px]">
          {[
            "left-0 top-0 border-l-[3px] border-t-[3px] rounded-tl-[16px]",
            "right-0 top-0 border-r-[3px] border-t-[3px] rounded-tr-[16px]",
            "left-0 bottom-0 border-l-[3px] border-b-[3px] rounded-bl-[16px]",
            "right-0 bottom-0 border-r-[3px] border-b-[3px] rounded-br-[16px]",
          ].map((corner) => (
            <span
              key={corner}
              className={`absolute h-9 w-9 ${corner}`}
              style={{ borderColor: detected ? "#5FA47F" : "#F0EEE4" }}
            />
          ))}

          {!detected && (
            <span
              className="book-scanline absolute inset-x-3 top-1/2 h-[2px] rounded-full"
              style={{ background: "linear-gradient(90deg, transparent, #5FA47F, transparent)" }}
            />
          )}

          {detected && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span
                className="book-stamp-in flex h-[72px] w-[72px] items-center justify-center rounded-full"
                style={{ background: "#5FA47F" }}
              >
                <Icon icon="solar:check-circle-bold" width="40" height="40" color="#0F1A15" />
              </span>
            </span>
          )}
        </div>
      </div>

      {/* 인식 상태 */}
      <div className="absolute inset-x-6 top-[560px] z-10 text-center">
        {detected ? (
          <>
            <p className="text-[12.5px] font-semibold text-[#5FA47F]">QR 인식 완료</p>
            <p className="mt-1.5 text-[19px] font-bold tracking-[-0.01em] text-[#F0EEE4]">
              {library.name}
            </p>
            <p className="book-num mt-1 text-[12.5px] text-[var(--bk-on-dark-muted)]">
              {library.district} | {library.qrSpot}
            </p>
          </>
        ) : (
          <p className="book-pulse text-[13.5px] font-medium text-[var(--bk-on-dark-muted)]">
            QR을 찾는 중입니다
          </p>
        )}
      </div>

      {/* 하단 바 */}
      <div
        className="absolute inset-x-0 bottom-0 z-20 px-5 pb-[34px] pt-4"
        style={{ background: "var(--bk-dark)" }}
      >
        <button
          type="button"
          disabled={!detected}
          onClick={() => onNavigate("certifyDone", "visit")}
          className="flex h-[52px] w-full items-center justify-center gap-2 rounded-[10px] text-[15.5px] font-semibold transition-transform duration-150 active:scale-[0.97] disabled:opacity-35"
          style={{ background: "#5FA47F", color: "#0F1A15" }}
        >
          <Icon icon="solar:verified-check-bold" width="20" height="20" />
          {detected ? "방문 스탬프 받기" : "QR을 인식하는 중"}
        </button>
        <button
          type="button"
          onClick={() => onNavigate("libraries")}
          className="mt-2 h-11 w-full text-[13.5px] font-medium text-[var(--bk-on-dark-muted)]"
        >
          QR이 보이지 않으면 지점을 직접 선택하기
        </button>
      </div>
    </div>
  );
}
