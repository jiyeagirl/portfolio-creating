"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  COURSES,
  DEMO_MEMBER_ID,
  DEMO_PUSH_POOL,
  INITIAL_ACCOUNTS,
  INITIAL_CONDITIONS,
  INITIAL_INBOX,
  INITIAL_MEMBERS,
  INITIAL_PUSH_HISTORY,
  defaultConfig,
} from "@/projects/b2b/teefinder/lib/mock-data";
import type {
  AlertCondition,
  ConfigHistory,
  Course,
  CourseAccount,
  CourseConfig,
  InboxItem,
  Member,
  MemberStatus,
  PushRecord,
} from "@/projects/b2b/teefinder/lib/types";

const NOW = "10-07 09:44";

interface Store {
  members: Member[];
  session: Member | null;
  accounts: CourseAccount[];
  conditions: AlertCondition[];
  inbox: InboxItem[];
  favorites: string[];
  banner: InboxItem | null;
  courses: Course[];
  configs: Record<string, CourseConfig>;
  configHistory: ConfigHistory[];
  pushHistory: PushRecord[];
  demoPushLeft: number;

  loginDemo: () => void;
  signUp: (input: { name: string; phone: string; membershipNo: string }) => void;
  resubmit: () => void;
  logout: () => void;
  withdraw: () => number;
  setMemberStatus: (id: string, status: MemberStatus, reason?: string) => void;
  toggleFavorite: (courseId: string) => void;
  addCondition: (c: Omit<AlertCondition, "id" | "enabled">) => void;
  toggleCondition: (id: string) => void;
  deleteCondition: (id: string) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  triggerDemoPush: () => void;
  dismissBanner: () => void;
  saveAccount: (courseId: string, loginId: string, password: string) => void;
  deleteAccount: (courseId: string) => void;
  saveConfig: (courseId: string, config: CourseConfig) => void;
  addCourse: (config: CourseConfig) => string;
  sendPush: (input: { target: string; title: string; body: string; recipients: number }) => void;
}

const StoreContext = createContext<Store | null>(null);

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("StoreProvider 밖에서 사용할 수 없습니다");
  return ctx;
}

function initialConfigs(): Record<string, CourseConfig> {
  const out: Record<string, CourseConfig> = {};
  for (const c of COURSES) out[c.id] = defaultConfig(c);
  return out;
}

export function StoreProvider({
  children,
  initialSession = DEMO_MEMBER_ID,
  initialStatus,
}: {
  children: ReactNode;
  /* 스크린샷과 시연 진입용: 처음부터 로그인된 회원 id. null이면 로그인 화면. */
  initialSession?: string | null;
  initialStatus?: MemberStatus;
}) {
  const [members, setMembers] = useState<Member[]>(() =>
    initialStatus
      ? INITIAL_MEMBERS.map((m) =>
          m.id === DEMO_MEMBER_ID
            ? {
                ...m,
                status: initialStatus,
                rejectReason:
                  initialStatus === "반려" ? "회원권 번호가 명부와 일치하지 않습니다. 번호를 확인해 다시 신청해 주세요." : undefined,
              }
            : m,
        )
      : INITIAL_MEMBERS,
  );
  const [sessionId, setSessionId] = useState<string | null>(initialSession);
  const [accounts, setAccounts] = useState<CourseAccount[]>(INITIAL_ACCOUNTS);
  const [conditions, setConditions] = useState<AlertCondition[]>(INITIAL_CONDITIONS);
  const [inbox, setInbox] = useState<InboxItem[]>(INITIAL_INBOX);
  const [favorites, setFavorites] = useState<string[]>(
    () => INITIAL_MEMBERS.find((m) => m.id === DEMO_MEMBER_ID)?.favoriteCourseIds ?? [],
  );
  const [banner, setBanner] = useState<InboxItem | null>(null);
  const [courses, setCourses] = useState<Course[]>(COURSES);
  const [configs, setConfigs] = useState<Record<string, CourseConfig>>(initialConfigs);
  const [configHistory, setConfigHistory] = useState<ConfigHistory[]>([
    { at: "10-05 14:22", courseId: "c09", note: "시간 파라미터 이름을 teeTm 으로 변경" },
    { at: "10-03 09:40", courseId: "c12", note: "로그인 선택자를 input[name=usr_id] 로 수정 (개편 대응 시도)" },
    { at: "09-28 16:12", courseId: "c01", note: "예약 페이지 이동 URL 패턴 수정" },
    { at: "10-01 10:08", courseId: "c17", note: "로그인 버튼 선택자를 button.btn-login 으로 수정" },
  ]);
  const [pushHistory, setPushHistory] = useState<PushRecord[]>(INITIAL_PUSH_HISTORY);

  const session = useMemo(() => members.find((m) => m.id === sessionId) ?? null, [members, sessionId]);

  const loginDemo = useCallback(() => {
    setSessionId(DEMO_MEMBER_ID);
    setFavorites(INITIAL_MEMBERS[0].favoriteCourseIds);
  }, []);

  const signUp = useCallback((input: { name: string; phone: string; membershipNo: string }) => {
    const id = `m${Date.now()}`;
    setMembers((prev) => [
      {
        id,
        name: input.name,
        phone: input.phone,
        membershipNo: input.membershipNo,
        membershipLabel: "개인 정회원 1구좌",
        joinedAt: "2026-10-07",
        status: "승인 대기",
        favoriteCourseIds: [],
      },
      ...prev,
    ]);
    setSessionId(id);
    setFavorites([]);
  }, []);

  const resubmit = useCallback(() => {
    setMembers((prev) =>
      prev.map((m) => (m.id === sessionId ? { ...m, status: "승인 대기", rejectReason: undefined } : m)),
    );
  }, [sessionId]);

  const logout = useCallback(() => setSessionId(null), []);

  const withdraw = useCallback(() => {
    const destroyed = accounts.length;
    setAccounts([]);
    return destroyed;
  }, [accounts.length]);

  const setMemberStatus = useCallback((id: string, status: MemberStatus, reason?: string) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        return {
          ...m,
          status,
          rejectReason:
            status === "반려"
              ? (reason ?? "회원권 번호가 명부와 일치하지 않습니다. 번호를 확인해 다시 신청해 주세요.")
              : undefined,
          suspendReason: status === "이용 정지" ? reason : undefined,
        };
      }),
    );
  }, []);

  const toggleFavorite = useCallback((courseId: string) => {
    setFavorites((prev) => (prev.includes(courseId) ? prev.filter((x) => x !== courseId) : [...prev, courseId]));
  }, []);

  const addCondition = useCallback((c: Omit<AlertCondition, "id" | "enabled">) => {
    setConditions((prev) => [{ ...c, id: `a${Date.now()}`, enabled: true }, ...prev]);
  }, []);

  const toggleCondition = useCallback((id: string) => {
    setConditions((prev) => prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c)));
  }, []);

  const deleteCondition = useCallback((id: string) => {
    setConditions((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const markRead = useCallback((id: string) => {
    setInbox((prev) => prev.map((i) => (i.id === id ? { ...i, read: true } : i)));
  }, []);

  const markAllRead = useCallback(() => {
    setInbox((prev) => prev.map((i) => ({ ...i, read: true })));
  }, []);

  /* 같은 자리(slotKey)는 한 번만 들어온다. 이미 알림함에 있으면 건너뛰고 다음 후보를 쓴다. */
  const demoCandidates = useMemo(
    () => DEMO_PUSH_POOL.filter((p) => !inbox.some((i) => i.slotKey === p.slotKey)),
    [inbox],
  );

  const triggerDemoPush = useCallback(() => {
    const next = demoCandidates[0];
    if (!next) return;
    const item: InboxItem = { ...next, id: `i${Date.now()}`, at: NOW, read: false };
    setInbox((prev) => [item, ...prev]);
    setBanner(item);
  }, [demoCandidates]);

  const dismissBanner = useCallback(() => setBanner(null), []);

  const saveAccount = useCallback((courseId: string, loginId: string, password: string) => {
    setAccounts((prev) => {
      const exists = prev.some((a) => a.courseId === courseId);
      const course = COURSES.find((c) => c.id === courseId);
      const status = course?.loginKind === "보안문자" ? "인증 필요" : "정상";
      if (exists) {
        return prev.map((a) => (a.courseId === courseId ? { ...a, loginId, password, status } : a));
      }
      return [...prev, { courseId, loginId, password, status }];
    });
  }, []);

  const deleteAccount = useCallback((courseId: string) => {
    setAccounts((prev) => prev.filter((a) => a.courseId !== courseId));
  }, []);

  const saveConfig = useCallback((courseId: string, config: CourseConfig) => {
    setConfigs((prev) => ({ ...prev, [courseId]: config }));
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? {
              ...c,
              name: config.name,
              region: config.region,
              domain: config.domain,
              loginKind: config.loginKind,
              layouts: config.layouts
                .split(",")
                .map((s) => s.trim())
                .filter((s): s is Course["layouts"][number] => s === "레이크" || s === "힐" || s === "밸리"),
            }
          : c,
      ),
    );
    setConfigHistory((prev) => [{ at: NOW, courseId, note: "설정을 수정해 저장" }, ...prev]);
  }, []);

  const addCourse = useCallback((config: CourseConfig) => {
    const id = `c${100 + courses.length}`;
    const layouts = config.layouts
      .split(",")
      .map((s) => s.trim())
      .filter((s): s is Course["layouts"][number] => s === "레이크" || s === "힐" || s === "밸리");
    const course: Course = {
      id,
      name: config.name,
      region: config.region,
      layouts: layouts.length > 0 ? layouts : ["레이크", "힐"],
      loginKind: config.loginKind,
      status: "점검 필요",
      domain: config.domain,
      successRate: 0,
      lastSuccess: "수집 전",
    };
    setCourses((prev) => [...prev, course]);
    setConfigs((prev) => ({ ...prev, [id]: config }));
    setConfigHistory((prev) => [{ at: NOW, courseId: id, note: "골프장 추가" }, ...prev]);
    return id;
  }, [courses.length]);

  const sendPush = useCallback(
    (input: { target: string; title: string; body: string; recipients: number }) => {
      const id = `p${Date.now()}`;
      setPushHistory((prev) => [{ id, at: NOW, ...input }, ...prev]);
      setInbox((prev) => [
        { id: `i${id}`, kind: "공지", title: input.title, body: input.body, at: NOW, read: false },
        ...prev,
      ]);
    },
    [],
  );

  const value: Store = {
    members,
    session,
    accounts,
    conditions,
    inbox,
    favorites,
    banner,
    courses,
    configs,
    configHistory,
    pushHistory,
    demoPushLeft: demoCandidates.length,
    loginDemo,
    signUp,
    resubmit,
    logout,
    withdraw,
    setMemberStatus,
    toggleFavorite,
    addCondition,
    toggleCondition,
    deleteCondition,
    markRead,
    markAllRead,
    triggerDemoPush,
    dismissBanner,
    saveAccount,
    deleteAccount,
    saveConfig,
    addCourse,
    sendPush,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
