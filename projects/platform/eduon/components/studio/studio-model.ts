import { UPLOAD_FILE } from "@/projects/platform/eduon/lib/mock-data";
import type { StudioState } from "@/projects/platform/eduon/lib/navigation";
import type { Course, Episode, Level, Quality, ReviewEntry, ReviewStatus, Topic, TranscodeStatus } from "@/projects/platform/eduon/lib/types";
import type { Tone } from "@/projects/platform/eduon/components/console/console-ui";

/*
 * 스튜디오 화면의 로컬 상태 모델. 업로드와 변환은 실제 전송 없이 타이머로만 움직인다 (spec 6번).
 * 검수 상태는 store의 강좌가 기준이고, ?state=review|revision 시연일 때만 화면 안 덮어쓰기(override)를 쓴다.
 */

export const QUALITIES: Quality[] = ["1080p", "720p", "480p"];
export const TOPICS: Topic[] = ["AI", "디자인", "개발"];
export const LEVELS: Level[] = ["입문", "중급", "실무"];
export const METHODS = ["스튜디오 촬영 + 화면 녹화", "화면 녹화", "생성형 AI 제작 + 내레이션"];

export type UploadStatus = "idle" | "uploading" | "paused" | "done";
export interface UploadState {
  status: UploadStatus;
  pct: number;
  fileName: string;
  sizeMb: number;
}

export interface TranscodeState {
  outputs: Record<Quality, TranscodeStatus>;
  pct: Record<Quality, number>;
  error: string | null;
  retries: number;
}

export interface Draft {
  title: string;
  summary: string;
  topic: Topic;
  level: Level;
  episodes: Episode[];
  productionMethod: string;
  tools: string[];
  subtitleFile: string | null;
  rightsFiles: string[];
}

/** 화면 시작 상태. stored는 store에 저장된 강좌 상태를 그대로 보여 준다 */
export type Mode = StudioState | "idle" | "stored";

export const SUBTITLE_FILE = "ai_video_intro_01_ko.srt";
export const SUBTITLE_FIXED = "ai_video_intro_01_ko_v2.srt";
export const CONSENT_FILE = "출연자 초상권 동의서.pdf";
export const CONSENT_FIXED = "출연자 초상권 동의서_서명본.pdf";
export const REVISION_NOTE = "2강 자막 싱크 0.8초 밀림, 권리자료 중 출연자 동의서 서명 페이지 누락";
export const FAIL_CODE = "TC-GOP-207";
export const FAIL_REASON = "원본 키프레임 간격 불규칙 (1080p 인코딩 중단)";

/* 파일 크기 표기. 목업 고정값 */
export const FILE_SIZE: Record<string, string> = {
  [SUBTITLE_FILE]: "46 KB",
  [SUBTITLE_FIXED]: "47 KB",
  "사용 음원 라이선스.pdf": "318 KB",
  [CONSENT_FILE]: "1.4 MB",
  [CONSENT_FIXED]: "2.1 MB",
  "저작권 확인서.pdf": "264 KB",
};

const ALL = (s: TranscodeStatus): Record<Quality, TranscodeStatus> => ({ "1080p": s, "720p": s, "480p": s });
const PCT = (n: number): Record<Quality, number> => ({ "1080p": n, "720p": n, "480p": n });

export function transcodeOverall(t: TranscodeState): TranscodeStatus {
  const v = QUALITIES.map((q) => t.outputs[q]);
  if (v.includes("실패")) return "실패";
  if (v.every((s) => s === "완료")) return "완료";
  if (v.includes("변환 중")) return "변환 중";
  return "대기";
}

export const REVIEW_TONE: Record<ReviewStatus, Tone> = {
  "작성 중": "gray",
  "검수 대기": "gray",
  "보완 요청": "orange",
  승인: "green",
  반려: "red",
};
export const PUBLISH_TONE = { 비공개: "gray", 공개: "green", "게시 중단": "red" } as const satisfies Record<Course["publish"], Tone>;
export const TRANSCODE_TONE: Record<TranscodeStatus, Tone> = { 대기: "gray", "변환 중": "blue", 완료: "green", 실패: "red" };

export function draftFrom(course: Course): Draft {
  return {
    title: course.title,
    summary: course.summary,
    topic: course.topic,
    level: course.level,
    episodes: course.episodes,
    productionMethod: course.productionMethod,
    tools: course.tools,
    subtitleFile: course.subtitles.length ? (course.id === "c13" ? SUBTITLE_FILE : `${course.id}_ko.srt`) : null,
    rightsFiles: course.rightsFiles,
  };
}

interface Init {
  upload: UploadState;
  transcode: TranscodeState;
  override: Partial<Course> | null;
}

const file = { fileName: UPLOAD_FILE.name, sizeMb: UPLOAD_FILE.sizeMb };
const doneUpload: UploadState = { status: "done", pct: 100, ...file };
const doneTranscode: TranscodeState = { outputs: ALL("완료"), pct: PCT(100), error: null, retries: 0 };

const SUBMIT_V1: ReviewEntry = { at: "2026. 10. 27 16:42", who: "제작자", action: "검수 제출", version: 1 };

export function initialFor(mode: Mode, course: Course): Init {
  switch (mode) {
    case "idle":
      return { upload: { status: "idle", pct: 0, ...file }, transcode: { outputs: ALL("대기"), pct: PCT(0), error: null, retries: 0 }, override: null };
    case "uploading":
      return { upload: { status: "uploading", pct: 46, ...file }, transcode: { outputs: ALL("대기"), pct: PCT(0), error: null, retries: 0 }, override: null };
    case "paused":
      return { upload: { status: "paused", pct: 63, ...file }, transcode: { outputs: ALL("대기"), pct: PCT(0), error: null, retries: 0 }, override: null };
    case "transcoding":
      return {
        upload: doneUpload,
        transcode: { outputs: { "1080p": "변환 중", "720p": "대기", "480p": "대기" }, pct: { "1080p": 38, "720p": 0, "480p": 0 }, error: null, retries: 0 },
        override: null,
      };
    case "failed":
      return {
        upload: doneUpload,
        transcode: { outputs: { "1080p": "실패", "720p": "완료", "480p": "완료" }, pct: { "1080p": 71, "720p": 100, "480p": 100 }, error: FAIL_CODE, retries: 0 },
        override: null,
      };
    case "review":
      return {
        upload: doneUpload,
        transcode: doneTranscode,
        override:
          course.review === "검수 대기"
            ? null
            : {
                review: "검수 대기",
                version: 1,
                submittedAt: "2026. 10. 28",
                transcode: "완료",
                outputs: ALL("완료"),
                reviewLog: [{ at: "2026. 10. 28 19:58", who: "제작자", action: "검수 제출", version: 1 }],
              },
      };
    case "revision":
      return {
        upload: doneUpload,
        transcode: doneTranscode,
        override:
          course.review === "보완 요청"
            ? null
            : {
                review: "보완 요청",
                version: 1,
                submittedAt: "2026. 10. 27",
                transcode: "완료",
                outputs: ALL("완료"),
                revisionNote: REVISION_NOTE,
                reviewLog: [SUBMIT_V1, { at: "2026. 10. 28 11:05", who: "운영자 남궁현", action: "보완 요청", note: REVISION_NOTE, version: 1 }],
              },
      };
    case "stored":
    default: {
      const started = course.transcode !== "대기" || course.review !== "작성 중";
      return {
        upload: started ? doneUpload : { status: "idle", pct: 0, ...file },
        transcode: {
          outputs: course.outputs,
          pct: {
            "1080p": course.outputs["1080p"] === "완료" ? 100 : 0,
            "720p": course.outputs["720p"] === "완료" ? 100 : 0,
            "480p": course.outputs["480p"] === "완료" ? 100 : 0,
          },
          error: course.transcode === "실패" ? FAIL_CODE : null,
          retries: 0,
        },
        override: null,
      };
    }
  }
}

export interface Check {
  key: string;
  label: string;
  ok: boolean;
}

export function checklist(d: Draft, upload: UploadState, t: TranscodeState, review: ReviewStatus): Check[] {
  const list: Check[] = [
    { key: "title", label: "강좌 제목", ok: d.title.trim().length >= 2 },
    { key: "summary", label: "소개 20자 이상", ok: d.summary.trim().length >= 20 },
    { key: "episodes", label: "회차 제목", ok: d.episodes.length > 0 && d.episodes.every((e) => e.title.trim().length > 0) },
    { key: "poster", label: "포스터", ok: true },
    { key: "upload", label: "1강 영상 업로드", ok: upload.status === "done" },
    { key: "transcode", label: "화질 변환 3종", ok: transcodeOverall(t) === "완료" },
    { key: "subtitle", label: "한국어 자막", ok: d.subtitleFile !== null },
    { key: "rights", label: "권리자료", ok: d.rightsFiles.length > 0 },
  ];
  if (review === "보완 요청") {
    list.push(
      { key: "fix-sub", label: "보완 반영: 2강 자막 싱크", ok: d.subtitleFile === SUBTITLE_FIXED },
      { key: "fix-consent", label: "보완 반영: 출연자 동의서", ok: d.rightsFiles.includes(CONSENT_FIXED) },
    );
  }
  return list;
}

/** 1228.8MB 기준 전송량 */
export function transferredMb(u: UploadState) {
  return (u.sizeMb * u.pct) / 100;
}

export const mb = (n: number) => n.toLocaleString("ko-KR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
