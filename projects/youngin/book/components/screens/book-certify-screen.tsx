"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { Toggle } from "@/components/shared/toggle";
import { LIBRARIES, RECOMMENDED_BOOKS, photo } from "@/projects/youngin/book/lib/mock-data";
import type { BookNavigate } from "@/projects/youngin/book/lib/navigation";
import {
  BottomBar,
  Card,
  Chip,
  Field,
  InfoNote,
  PrimaryButton,
  ScreenHeader,
} from "@/projects/youngin/book/components/ui";

const INPUT =
  "w-full rounded-[10px] border border-[var(--bk-line)] bg-[var(--bk-surface)] px-3.5 py-3 text-[15px] text-[var(--bk-ink)]";

export function BookCertifyScreen({ onNavigate }: { onNavigate: BookNavigate }) {
  const [libraryId, setLibraryId] = useState("guteun");
  const [linkMission, setLinkMission] = useState(true);
  const [note, setNote] = useState(
    "저수지 이야기가 우리 동네 얘기 같아서 한참 덮어 두고 다시 읽었다.",
  );

  const linked = RECOMMENDED_BOOKS[0];

  return (
    <div className="book-enter relative min-h-full pb-[116px]">
      <ScreenHeader
        title="완독 인증"
        subtitle="다 읽은 책을 기록으로 남깁니다"
        onBack={() => onNavigate("certify")}
      />

      {/* 표지 사진 */}
      <section className="px-5 pt-5">
        <Field label="책 사진" hint="표지 또는 마지막 장을 알아볼 수 있게 찍어 주세요">
          <div className="flex gap-3">
            <div className="relative h-[148px] w-[112px] shrink-0 overflow-hidden rounded-[10px]">
              <img
                src={photo(998, 280, 370)}
                alt="끈으로 묶인 낡은 책 묶음과 만년필"
                className="h-full w-full object-cover"
              />
              <span
                className="absolute bottom-1.5 left-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-semibold"
                style={{ background: "rgba(22,33,28,0.72)", color: "#F0EEE4" }}
              >
                선택됨
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-2.5">
              <button
                type="button"
                className="flex h-[69px] flex-1 flex-col items-center justify-center gap-1 rounded-[10px] border border-dashed"
                style={{ borderColor: "var(--bk-line)", background: "var(--bk-surface-soft)" }}
              >
                <Icon icon="solar:camera-linear" width="21" height="21" color="var(--bk-accent)" />
                <span className="text-[12px] font-semibold text-[var(--bk-accent)]">
                  다시 촬영
                </span>
              </button>
              <button
                type="button"
                className="flex h-[69px] flex-1 flex-col items-center justify-center gap-1 rounded-[10px] border border-dashed"
                style={{ borderColor: "var(--bk-line)", background: "var(--bk-surface-soft)" }}
              >
                <Icon
                  icon="solar:gallery-linear"
                  width="21"
                  height="21"
                  color="var(--bk-muted)"
                />
                <span className="text-[12px] font-semibold text-[var(--bk-muted)]">
                  앨범에서 선택
                </span>
              </button>
            </div>
          </div>
        </Field>
      </section>

      {/* 책 정보. 아래 지점 선택 줄은 `-mx-5` 가로 스크롤러라 같은 grid 안에 두면
          그리드 트랙이 화면보다 넓어져 입력칸이 전부 오른쪽으로 삐져나간다. 별도 섹션으로 뺀다. */}
      <section className="grid grid-cols-[minmax(0,1fr)] gap-4 px-5 pt-6">
        <Field label="책 제목">
          <div className="relative">
            <input className={INPUT} defaultValue="물의 기억" aria-label="책 제목" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              <Icon
                icon="solar:check-circle-bold"
                width="20"
                height="20"
                color="var(--bk-accent)"
              />
            </span>
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="지은이">
            <input className={INPUT} defaultValue="정한아름" aria-label="지은이" />
          </Field>
          <Field label="출판사">
            <input className={INPUT} defaultValue="창비" aria-label="출판사" />
          </Field>
        </div>
      </section>

      <section className="px-5 pt-4">
        <Field label="어디에서 읽었나요" hint="지점을 고르면 그 지점 활동으로 함께 집계됩니다">
          <div className="book-scroll-x -mx-5 flex gap-2 overflow-x-auto px-5 pt-1">
            {LIBRARIES.slice(0, 5).map((library) => {
              const active = library.id === libraryId;
              return (
                <button
                  key={library.id}
                  type="button"
                  onClick={() => setLibraryId(library.id)}
                  aria-pressed={active}
                  className="h-11 shrink-0 rounded-full border px-3.5 text-[13px] font-semibold transition-colors duration-150"
                  style={{
                    background: active ? "var(--bk-accent)" : "var(--bk-surface)",
                    color: active ? "var(--bk-on-accent)" : "var(--bk-body)",
                    borderColor: active ? "var(--bk-accent)" : "var(--bk-line)",
                  }}
                >
                  {library.name}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setLibraryId("home")}
              aria-pressed={libraryId === "home"}
              className="h-11 shrink-0 rounded-full border px-3.5 text-[13px] font-semibold"
              style={{
                background: libraryId === "home" ? "var(--bk-accent)" : "var(--bk-surface)",
                color: libraryId === "home" ? "var(--bk-on-accent)" : "var(--bk-body)",
                borderColor: libraryId === "home" ? "var(--bk-accent)" : "var(--bk-line)",
              }}
            >
              집에서 읽음
            </button>
          </div>
        </Field>
      </section>

      <section className="px-5 pt-4">
        <Field label="한 줄 감상" optional hint={`${note.length}/120자`}>
          <textarea
            className={`${INPUT} h-[96px] resize-none leading-[1.55]`}
            value={note}
            maxLength={120}
            onChange={(event) => setNote(event.target.value)}
            aria-label="한 줄 감상"
          />
        </Field>
      </section>

      {/* 미션 연결 */}
      <section className="px-5 pt-6">
        <Card>
          <div className="flex items-center gap-3.5 p-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Chip tone="accent">이달의 추천도서</Chip>
              </div>
              <p className="mt-2 text-[14.5px] font-semibold text-[var(--bk-ink)]">
                {linked.title}
              </p>
              <p className="mt-1 text-[12.5px] leading-[1.5] text-[var(--bk-muted)]">
                8월 미션 도서와 제목이 일치합니다. 연결하면 미션 진행도에 함께 반영됩니다.
              </p>
            </div>
            <Toggle
              checked={linkMission}
              onChange={setLinkMission}
              label="이달의 추천도서 미션에 연결"
              onClassName="bg-[var(--bk-accent)]"
              offClassName="bg-[var(--bk-surface-sunk)]"
            />
          </div>
        </Card>
      </section>

      <section className="px-5 pt-3">
        <InfoNote icon="solar:info-circle-linear">
          같은 책은 한 번만 인증됩니다. 사서가 확인 후 부적합한 인증은 취소될 수 있습니다.
        </InfoNote>
      </section>

      <BottomBar>
        <PrimaryButton icon="solar:verified-check-bold" onClick={() => onNavigate("certifyDone", "read")}>
          완독 인증하고 스탬프 받기
        </PrimaryButton>
      </BottomBar>
    </div>
  );
}
