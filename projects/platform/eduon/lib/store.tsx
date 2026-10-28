"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ME,
  NOW,
  FIRST_MONTH_PRICE,
  PRICE,
  SEED_ADMIN_SUBS,
  SEED_COURSES,
  SEED_EVENTS,
  SEED_MY_SUB,
  SEED_COMPLETED,
  SEED_PROGRESS,
  SEED_WISHLIST,
  STUDIO_DRAFT,
  SUBSCRIBER_COMPLETED,
  SUBSCRIBER_PROGRESS,
  TODAY,
  presetSubscription,
} from "@/projects/platform/eduon/lib/mock-data";
import { THUMBS } from "@/projects/platform/eduon/lib/thumbs";
import type {
  AdminSubscription,
  BillingRecord,
  Channel,
  Course,
  Entitlement,
  MySubscription,
  PaymentEvent,
  Progress,
  ReviewEntry,
} from "@/projects/platform/eduon/lib/types";

/* 사용자, 스튜디오, 관리자는 URL이 달라 브라우저 localStorage 하나로만 데이터를 나눈다. 백엔드는 없다 */
const STORAGE_KEY = "eduon:v1";

interface State {
  courses: Course[];
  mySub: MySubscription;
  progress: Record<string, Progress>;
  completed: Record<string, string>;
  wishlist: string[];
  adminSubs: AdminSubscription[];
  events: PaymentEvent[];
}

function seedState(): State {
  return {
    courses: [...SEED_COURSES, STUDIO_DRAFT],
    mySub: SEED_MY_SUB,
    progress: SEED_PROGRESS,
    completed: SEED_COMPLETED,
    wishlist: SEED_WISHLIST,
    adminSubs: SEED_ADMIN_SUBS,
    events: SEED_EVENTS,
  };
}

function read(): State | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<State>;
    if (!parsed.courses || !parsed.mySub) return null;
    /* 썸네일은 정적 데이터라 저장된 값 대신 항상 현재 표를 쓴다 */
    const courses = parsed.courses.map((c) => (c.id in THUMBS ? { ...c, photo: THUMBS[c.id] } : c));
    return { ...seedState(), ...parsed, courses } as State;
  } catch {
    return null;
  }
}

function write(state: State) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* 저장소를 못 쓰는 환경에서는 화면 안 상태로만 동작한다 */
  }
}

/** "2026. 10. 28" + n개월 */
export function addMonths(date: string, n: number) {
  const [y, m, d] = date.split(".").map((v) => Number(v.trim()));
  const total = y * 12 + (m - 1) + n;
  return `${Math.floor(total / 12)}. ${String((total % 12) + 1).padStart(2, "0")}. ${String(d).padStart(2, "0")}`;
}

let seq = 0;
const nextId = (prefix: string) => `${prefix}-${Date.now().toString(36).slice(-5).toUpperCase()}${(seq++).toString(36)}`;

export type Scenario = "갱신 성공" | "갱신 실패" | "만료" | "환불";
export type SubPreset = "free" | "active" | "cancelled" | "expired";

const ME_SUB_ID = "SUB-41027";

const presetProgress = (preset: SubPreset) => (preset === "free" ? SEED_PROGRESS : SUBSCRIBER_PROGRESS);
const presetCompleted = (preset: SubPreset) => (preset === "free" ? SEED_COMPLETED : SUBSCRIBER_COMPLETED);

function entitlementFor(status: MySubscription["status"]): Entitlement {
  return status === "expired" || status === "refunded" ? "회수 완료" : status === "failed" ? "확인 필요" : "반영 완료";
}

/** 사용자 화면의 내 구독을 관리자 구독 목록 행으로 */
function meRow(sub: MySubscription): AdminSubscription | null {
  if (sub.status === "free" || !sub.channel) return null;
  return {
    id: ME_SUB_ID,
    name: ME.name,
    email: ME.email,
    channel: sub.channel,
    status: sub.status,
    periodStart: sub.startedAt ?? TODAY,
    periodEnd: sub.periodEnd ?? TODAY,
    entitlement: entitlementFor(sub.status),
    history: sub.history,
    entitlementLog: sub.history.map((h) => ({
      at: h.at,
      change:
        h.kind === "최초 결제" || h.kind === "구매 복원"
          ? "구독 권한 부여"
          : h.kind === "정기 갱신"
            ? "구독 권한 기간 연장"
            : h.kind === "갱신 해지"
              ? "자동 갱신 해지, 기간 종료일까지 권한 유지"
              : h.kind === "갱신 실패"
                ? "갱신 실패, 재시도 대기"
                : "구독 권한 회수",
      by: h.channel === "web" ? "카드 결제 알림" : "스토어 알림",
    })),
    isMe: true,
  };
}

interface Store {
  hydrated: boolean;
  courses: Course[];
  mySub: MySubscription;
  progress: Record<string, Progress>;
  completed: Record<string, string>;
  wishlist: string[];
  adminSubs: AdminSubscription[];
  events: PaymentEvent[];

  course: (id: string) => Course | undefined;
  updateCourse: (id: string, patch: Partial<Course>, log?: Omit<ReviewEntry, "at" | "version">) => void;
  submitCourse: (id: string, patch: Partial<Course>) => void;

  subscribe: (channel: Channel, via?: "구매 복원") => void;
  cancelRenewal: () => void;
  setSubPreset: (preset: SubPreset) => void;
  runScenario: (subId: string, scenario: Scenario) => void;
  reprocessEvent: (eventId: string) => void;

  saveProgress: (courseId: string, episode: number, seconds: number) => void;
  toggleWish: (courseId: string) => void;
  resetDemo: () => void;
}

const StoreContext = createContext<Store | null>(null);

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("StoreProvider 밖에서 사용할 수 없습니다");
  return ctx;
}

export function StoreProvider({ children, subPreset }: { children: ReactNode; subPreset?: SubPreset | null }) {
  const [state, setState] = useState<State>(seedState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    /* localStorage는 서버 렌더에 없으므로 마운트 뒤에 한 번 읽는다. ?subscription= 시연 프리셋이 있으면 덮어쓴다 */
    const stored = read() ?? seedState();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(subPreset ? { ...stored, mySub: presetSubscription(subPreset), progress: presetProgress(subPreset), completed: presetCompleted(subPreset) } : stored);
    setHydrated(true);
  }, [subPreset]);

  useEffect(() => {
    if (hydrated) write(state);
  }, [state, hydrated]);

  useEffect(() => {
    /* 다른 탭(스튜디오, 관리자)에서 바뀐 내용을 바로 반영한다 */
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      const next = read();
      if (next) setState(next);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const updateCourse = useCallback<Store["updateCourse"]>((id, patch, log) => {
    setState((s) => ({
      ...s,
      courses: s.courses.map((c) => {
        if (c.id !== id) return c;
        const next = { ...c, ...patch };
        if (log) next.reviewLog = [...c.reviewLog, { ...log, at: NOW, version: next.version }];
        return next;
      }),
    }));
  }, []);

  const submitCourse = useCallback<Store["submitCourse"]>((id, patch) => {
    setState((s) => ({
      ...s,
      courses: s.courses.map((c) => {
        if (c.id !== id) return c;
        const resubmit = c.review === "보완 요청";
        const version = resubmit ? c.version + 1 : c.version;
        return {
          ...c,
          ...patch,
          review: "검수 대기",
          version,
          submittedAt: TODAY,
          reviewLog: [...c.reviewLog, { at: NOW, who: "제작자", action: resubmit ? "재제출" : "검수 제출", version }],
        };
      }),
    }));
  }, []);

  const pushEvent = (s: State, e: Omit<PaymentEvent, "id" | "receivedAt">): PaymentEvent[] => [
    { id: `evt_${e.channel === "web" ? "pay" : e.channel === "ios" ? "ios" : "gpl"}_${Date.now().toString(16).slice(-6)}`, receivedAt: NOW, ...e },
    ...s.events,
  ];

  const subscribe = useCallback<Store["subscribe"]>((channel, via) => {
    setState((s) => {
      const record: BillingRecord = {
        id: nextId(channel === "web" ? "PAY" : channel === "ios" ? "IOS" : "GPL"),
        at: NOW,
        kind: via ?? "최초 결제",
        channel,
        amount: via ? null : FIRST_MONTH_PRICE,
        result: via ? "복원 성공" : "첫 달 할인가 승인",
      };
      return {
        ...s,
        mySub: { status: "active", channel, startedAt: TODAY, periodEnd: addMonths(TODAY, 1), history: [record, ...s.mySub.history] },
        events: pushEvent(s, {
          channel,
          type: via ?? "최초 결제",
          verify: "통과",
          result: "처리 완료",
          subId: ME_SUB_ID,
          detail: via ? "구매 토큰 검증 후 기존 서비스 계정과 연결" : "구독 권한 부여",
        }),
      };
    });
  }, []);

  const cancelRenewal = useCallback(() => {
    setState((s) => {
      if (!s.mySub.channel) return s;
      const record: BillingRecord = { id: nextId("PAY"), at: NOW, kind: "갱신 해지", channel: s.mySub.channel, amount: null, result: "다음 갱신 중지" };
      return {
        ...s,
        mySub: { ...s.mySub, status: "cancelled", history: [record, ...s.mySub.history] },
        events: pushEvent(s, { channel: s.mySub.channel, type: "갱신 해지", verify: "통과", result: "처리 완료", subId: ME_SUB_ID, detail: "자동 갱신 중지, 기간 종료일까지 권한 유지" }),
      };
    });
  }, []);

  const setSubPreset = useCallback((preset: SubPreset) => {
    setState((s) => ({ ...s, mySub: presetSubscription(preset), progress: presetProgress(preset), completed: presetCompleted(preset) }));
  }, []);

  const runScenario = useCallback<Store["runScenario"]>((subId, scenario) => {
    setState((s) => {
      const apply = <T extends { status: AdminSubscription["status"] | MySubscription["status"]; periodEnd: string | null; history: BillingRecord[] }>(
        sub: T,
        channel: Channel,
      ): T => {
        const end = sub.periodEnd ?? TODAY;
        const rec = (kind: BillingRecord["kind"], amount: number | null, result: string): BillingRecord => ({
          id: nextId(channel === "web" ? "PAY" : channel === "ios" ? "IOS" : "GPL"),
          at: NOW,
          kind,
          channel,
          amount,
          result,
        });
        if (scenario === "갱신 성공") return { ...sub, status: "active", periodEnd: addMonths(end, 1), history: [rec("정기 갱신", PRICE, "승인"), ...sub.history] };
        if (scenario === "갱신 실패") return { ...sub, status: "failed", history: [rec("갱신 실패", PRICE, "결제 수단 거절"), ...sub.history] };
        if (scenario === "만료") return { ...sub, status: "expired", periodEnd: TODAY, history: [rec("만료", null, "구독 전용 강의 이용 종료"), ...sub.history] };
        return { ...sub, status: "refunded", periodEnd: TODAY, history: [rec("환불", -PRICE, "환불 승인"), ...sub.history] };
      };
      const type = scenario === "갱신 성공" ? "정기 갱신" : scenario;
      const detail =
        scenario === "갱신 성공" ? "기간 연장" : scenario === "갱신 실패" ? "결제 수단 거절, 재시도 대기" : scenario === "만료" ? "기간 종료, 권한 회수" : "환불 알림 수신, 권한 회수";

      if (subId === ME_SUB_ID && s.mySub.channel) {
        const channel = s.mySub.channel;
        return { ...s, mySub: apply(s.mySub, channel), events: pushEvent(s, { channel, type, verify: "통과", result: "처리 완료", subId, detail }) };
      }
      const target = s.adminSubs.find((a) => a.id === subId);
      if (!target) return s;
      const next = apply(target, target.channel);
      const entitlement: Entitlement = entitlementFor(next.status);
      return {
        ...s,
        adminSubs: s.adminSubs.map((a) =>
          a.id === subId
            ? { ...next, entitlement, entitlementLog: [{ at: NOW, change: `${scenario} 시나리오 반영`, by: "모의 시나리오" }, ...a.entitlementLog] }
            : a,
        ),
        events: pushEvent(s, { channel: target.channel, type, verify: "통과", result: "처리 완료", subId, detail }),
      };
    });
  }, []);

  const reprocessEvent = useCallback((eventId: string) => {
    setState((s) => ({
      ...s,
      events: s.events.map((e) => (e.id === eventId ? { ...e, verify: "통과", result: "재처리 완료", detail: `${e.detail} | ${NOW} 재확인 후 처리` } : e)),
      adminSubs: s.adminSubs.map((a) => {
        const ev = s.events.find((e) => e.id === eventId);
        return ev && a.id === ev.subId && a.entitlement === "확인 필요" && a.status === "active" ? { ...a, entitlement: "반영 완료" } : a;
      }),
    }));
  }, []);

  const saveProgress = useCallback((courseId: string, episode: number, seconds: number) => {
    setState((s) => ({ ...s, progress: { ...s.progress, [courseId]: { episode, seconds, at: NOW } } }));
  }, []);

  const toggleWish = useCallback((courseId: string) => {
    setState((s) => ({
      ...s,
      wishlist: s.wishlist.includes(courseId) ? s.wishlist.filter((id) => id !== courseId) : [...s.wishlist, courseId],
    }));
  }, []);

  const resetDemo = useCallback(() => setState(seedState()), []);

  const value = useMemo<Store>(() => {
    const me = meRow(state.mySub);
    return {
      hydrated,
      ...state,
      adminSubs: me ? [me, ...state.adminSubs] : state.adminSubs,
      course: (id: string) => state.courses.find((c) => c.id === id),
      updateCourse,
      submitCourse,
      subscribe,
      cancelRenewal,
      setSubPreset,
      runScenario,
      reprocessEvent,
      saveProgress,
      toggleWish,
      resetDemo,
    };
  }, [state, hydrated, updateCourse, submitCourse, subscribe, cancelRenewal, setSubPreset, runScenario, reprocessEvent, saveProgress, toggleWish, resetDemo]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
