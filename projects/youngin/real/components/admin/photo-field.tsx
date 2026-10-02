"use client";

/* 콘텐츠 등록 폼의 대표 사진 입력.
   파일 업로드(클릭 + 끌어다 놓기)와 보관함에서 고르기를 한 컨트롤 안에 둔다.
   업로드한 파일은 브라우저 안에서 objectURL 로만 미리보기하고 어디로도 보내지 않는다.

   ui.tsx 의 `Field` 로 감싸지 않는다. `Field` 는 <label> 이라 그 안에 숨은
   <input type="file"> 을 두면 라벨 아무 데나 클릭해도 파일 선택창이 열린다.
   그래서 제목과 힌트를 이 컴포넌트가 직접 그린다. */

import { useRef, useState } from "react";
import { ImageSquare, Trash, UploadSimple } from "@phosphor-icons/react";

export type PhotoPick = {
  url: string;
  name: string;
  meta: string;
  from: "업로드" | "보관함";
};

/* 보관함은 design.md 사진 매핑 표에서 이미 눈으로 확인한 사진만 올린다.
   무작위 seed 를 쓰면 캡션과 어긋난다(CLAUDE.md Images 규칙). */
export const PHOTO_LIBRARY = [
  { id: 452, label: "야외 무대 공연" },
  { id: 351, label: "밤 골목 조명" },
  { id: 674, label: "제철 과일" },
  { id: 225, label: "찻집 거리" },
  { id: 431, label: "커피 한 잔" },
  { id: 195, label: "골목 상점가" },
] as const;

export function libraryUrl(id: number, w = 480, h = 320) {
  return `https://picsum.photos/id/${id}/${w}/${h}`;
}

export function PhotoField({
  value,
  onChange,
  required = false,
}: {
  value: PhotoPick | null;
  onChange: (next: PhotoPick | null) => void;
  required?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  /* 이전 값이 업로드본이면 objectURL 을 반납하고 바꾼다. */
  const replace = (next: PhotoPick | null) => {
    if (value?.from === "업로드") URL.revokeObjectURL(value.url);
    onChange(next);
  };

  const takeFile = (file: File | undefined | null) => {
    if (!file || !file.type.startsWith("image/")) return;
    replace({
      url: URL.createObjectURL(file),
      name: file.name,
      meta: `${Math.max(1, Math.round(file.size / 1024)).toLocaleString()}KB`,
      from: "업로드",
    });
  };

  return (
    <div className="block">
      <span className="flex items-center gap-1 text-[13px] font-medium text-[var(--cp-ink)]">
        대표 사진
        {required && <span className="text-[var(--cp-danger)]">*</span>}
      </span>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          takeFile(e.target.files?.[0]);
          /* 같은 파일을 다시 골라도 change 가 뜨도록 값을 비운다 */
          e.target.value = "";
        }}
      />

      {value ? (
        <div className="mt-1.5 flex items-center gap-4 rounded-[6px] border border-[var(--cp-hairline)] p-3">
          {/* 업로드본은 blob URL 이라 next/image 로 최적화할 수 없다 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value.url}
            alt="선택한 대표 사진 미리보기"
            className="h-[76px] w-[114px] shrink-0 rounded-[4px] border border-[var(--cp-hairline)] bg-[var(--cp-soft)] object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-[var(--cp-ink)]">{value.name}</p>
            <p className="cp-num mt-1 text-[12px] text-[var(--cp-mute)]">
              {value.from} | {value.meta}
            </p>
            <div className="mt-2.5 flex gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="h-8 rounded-[6px] border border-[var(--cp-hairline)] px-3 text-[12.5px] font-medium text-[var(--cp-ink)] transition-colors hover:bg-[var(--cp-soft)]"
              >
                파일 교체
              </button>
              <button
                type="button"
                onClick={() => replace(null)}
                className="flex h-8 items-center gap-1.5 rounded-[6px] border border-[var(--cp-danger-soft)] px-3 text-[12.5px] font-medium text-[var(--cp-danger)] transition-colors hover:bg-[var(--cp-danger-soft)]"
              >
                <Trash size={13} weight="bold" />
                삭제
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            takeFile(e.dataTransfer.files?.[0]);
          }}
          className={`mt-1.5 flex w-full flex-col items-center gap-2 rounded-[6px] border border-dashed px-4 py-7 text-center transition-colors ${
            dragging
              ? "border-[var(--cp-accent)] bg-[var(--cp-accent-soft)]"
              : "border-[var(--cp-hairline-strong)] bg-[var(--cp-soft)] hover:border-[var(--cp-accent)]"
          }`}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--cp-surface)] text-[var(--cp-mute)]">
            <UploadSimple size={16} weight="bold" />
          </span>
          <span className="text-[13px] font-medium text-[var(--cp-ink)]">
            이미지를 끌어다 놓거나 클릭해서 선택
          </span>
          <span className="cp-num text-[12px] text-[var(--cp-mute)]">
            JPG, PNG, WEBP / 5MB 이하 / 권장 1200x700
          </span>
        </button>
      )}

      <div className="mt-3">
        <p className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--cp-mute)]">
          <ImageSquare size={13} weight="fill" />
          보관함에서 고르기
        </p>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {PHOTO_LIBRARY.map((photo) => {
            const url = libraryUrl(photo.id);
            const active = value?.url === url;
            return (
              <button
                key={photo.id}
                type="button"
                onClick={() =>
                  replace({ url, name: photo.label, meta: `보관함 ID ${photo.id}`, from: "보관함" })
                }
                aria-pressed={active}
                title={photo.label}
                className={`shrink-0 overflow-hidden rounded-[4px] border transition-colors ${
                  active
                    ? "border-[var(--cp-accent)] ring-2 ring-[var(--cp-accent-soft)]"
                    : "border-[var(--cp-hairline)] hover:border-[var(--cp-accent)]"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={photo.label}
                  className="h-11 w-[66px] bg-[var(--cp-soft)] object-cover"
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
