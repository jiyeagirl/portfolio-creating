"use client";

import { useEffect, useState } from "react";
import { Bell, Golf, House, UserCircle } from "@phosphor-icons/react";
import { getCourse, getTeeTimes } from "@/projects/b2b/teefinder/lib/mock-data";
import { useStore } from "@/projects/b2b/teefinder/lib/store";
import type { AppScreen } from "@/projects/b2b/teefinder/lib/navigation";
import type { AppTab, AppView, CourseLayout, TeeTime } from "@/projects/b2b/teefinder/lib/types";
import { TODAY } from "@/projects/b2b/teefinder/lib/format";
import { ScrimContext } from "@/projects/b2b/teefinder/components/app/app-ui";
import { LoginScreen, PendingScreen, RejectedScreen, SignupScreen } from "@/projects/b2b/teefinder/components/app/auth-screens";
import { HomeScreen } from "@/projects/b2b/teefinder/components/app/home-screen";
import { CoursesScreen } from "@/projects/b2b/teefinder/components/app/courses-screen";
import { CourseDetailScreen } from "@/projects/b2b/teefinder/components/app/course-detail-screen";
import { WebviewScreen } from "@/projects/b2b/teefinder/components/app/webview-screen";
import { AlertsScreen, type AlertPrefill } from "@/projects/b2b/teefinder/components/app/alerts-screen";
import { ProfileScreen } from "@/projects/b2b/teefinder/components/app/profile-screen";

const TABS: Array<{ tab: AppTab; label: string; Icon: typeof House }> = [
  { tab: "home", label: "홈", Icon: House },
  { tab: "courses", label: "골프장", Icon: Golf },
  { tab: "alerts", label: "알림", Icon: Bell },
  { tab: "profile", label: "내 정보", Icon: UserCircle },
];

interface Initial {
  view: AppView;
  authView: "login" | "signup";
  alertTab: "conditions" | "inbox";
  webviewStage: number;
  withdraw: boolean;
}

export function resolveInitial(screen: AppScreen | null, step: number): Initial {
  const base: Initial = {
    view: { kind: "tab", tab: "home" },
    authView: "login",
    alertTab: "conditions",
    webviewStage: step,
    withdraw: false,
  };
  switch (screen) {
    case "signup":
      return { ...base, authView: "signup" };
    case "courses":
      return { ...base, view: { kind: "tab", tab: "courses" } };
    case "course":
      return { ...base, view: { kind: "course", courseId: "c01" } };
    case "webview":
      return { ...base, view: { kind: "webview", courseId: "c01", date: "2026-10-11", time: "07:36", layout: "힐" } };
    case "webview-captcha":
      return {
        ...base,
        view: { kind: "webview", courseId: "c04", date: "2026-10-10", time: "08:12", layout: "밸리" },
        webviewStage: 1,
      };
    case "alerts":
      return { ...base, view: { kind: "tab", tab: "alerts" } };
    case "inbox":
      return { ...base, view: { kind: "tab", tab: "alerts" }, alertTab: "inbox" };
    case "profile":
      return { ...base, view: { kind: "tab", tab: "profile" } };
    case "withdraw":
      return { ...base, view: { kind: "tab", tab: "profile" }, withdraw: true };
    default:
      return base;
  }
}

export function AppShell({ initial }: { initial: Initial }) {
  const { session, inbox, banner, dismissBanner } = useStore();
  const [authView, setAuthView] = useState(initial.authView);
  const [view, setView] = useState<AppView>(initial.view);
  const [detailDate, setDetailDate] = useState(TODAY);
  const [prefill, setPrefill] = useState<AlertPrefill | null>(null);
  const [alertTab, setAlertTab] = useState(initial.alertTab);
  const [scrim, setScrim] = useState(false);

  /* 푸시 배너는 4초 뒤 자동으로 올라간다 */
  useEffect(() => {
    if (!banner) return;
    const t = setTimeout(dismissBanner, 4200);
    return () => clearTimeout(t);
  }, [banner, dismissBanner]);

  const unread = inbox.filter((i) => !i.read).length;

  function openSlot(s: { courseId: string; date: string; time: string; layout?: CourseLayout }) {
    const found = getTeeTimes(s.courseId, s.date).find((x) => x.time === s.time);
    setView({
      kind: "webview",
      courseId: s.courseId,
      date: s.date,
      time: s.time,
      layout: found?.layout ?? s.layout ?? getCourse(s.courseId).layouts[0],
    });
  }

  function book(slot: TeeTime) {
    setView({ kind: "webview", courseId: slot.courseId, date: slot.date, time: slot.time, layout: slot.layout });
  }

  let body: React.ReactNode;

  if (!session) {
    body =
      authView === "signup" ? (
        <SignupScreen onBack={() => setAuthView("login")} />
      ) : (
        <LoginScreen onSignup={() => setAuthView("signup")} />
      );
    return <div className="relative h-[852px] overflow-hidden">{body}</div>;
  }

  if (session.status === "승인 대기") {
    return (
      <div className="relative h-[852px] overflow-hidden">
        <PendingScreen />
      </div>
    );
  }
  if (session.status === "반려" || session.status === "이용 정지") {
    return (
      <div className="relative h-[852px] overflow-hidden">
        <RejectedScreen />
      </div>
    );
  }

  const currentTab: AppTab | null = view.kind === "tab" ? view.tab : null;

  if (view.kind === "tab") {
    if (view.tab === "home") {
      body = (
        <HomeScreen
          onOpenCourse={(courseId, date) => {
            setDetailDate(date);
            setView({ kind: "course", courseId });
          }}
        />
      );
    } else if (view.tab === "courses") {
      body = (
        <CoursesScreen
          onOpenCourse={(courseId) => {
            setDetailDate(TODAY);
            setView({ kind: "course", courseId });
          }}
        />
      );
    } else if (view.tab === "alerts") {
      body = (
        <AlertsScreen
          initialTab={alertTab}
          prefill={prefill}
          onPrefillConsumed={() => setPrefill(null)}
          onOpenSlot={openSlot}
        />
      );
    } else {
      body = <ProfileScreen initialWithdraw={initial.withdraw} />;
    }
  } else if (view.kind === "course") {
    body = (
      <CourseDetailScreen
        key={view.courseId}
        courseId={view.courseId}
        initialDate={detailDate}
        onBack={() => setView({ kind: "tab", tab: "courses" })}
        onAlert={(slot) => {
          setAlertTab("conditions");
          setPrefill({ courseId: view.courseId, date: slot?.date ?? detailDate });
          setView({ kind: "tab", tab: "alerts" });
        }}
        onBook={book}
      />
    );
  } else {
    const fee = getTeeTimes(view.courseId, view.date).find((s) => s.time === view.time)?.fee;
    body = (
      <WebviewScreen
        key={`${view.courseId}${view.date}${view.time}`}
        courseId={view.courseId}
        date={view.date}
        time={view.time}
        layout={view.layout}
        fee={fee}
        initialStage={initial.webviewStage}
        onClose={() => setView({ kind: "tab", tab: "home" })}
        onOpenProfile={() => setView({ kind: "tab", tab: "profile" })}
      />
    );
  }

  return (
    <div className="relative flex h-[852px] flex-col overflow-hidden">
      {banner && (
        <button
          type="button"
          onClick={() => {
            dismissBanner();
            if (banner.courseId && banner.date && banner.time) {
              openSlot({ courseId: banner.courseId, date: banner.date, time: banner.time });
            }
          }}
          className="tf-drop absolute inset-x-3 top-[64px] z-50 flex items-start gap-3 rounded-[16px] border border-[var(--tf-line)] bg-[var(--tf-surface)] px-4 py-3 text-left shadow-[var(--tf-sheet-shadow)]"
        >
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[var(--tf-brand)] text-white">
            <Golf size={18} weight="fill" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center justify-between text-[13px] text-[var(--tf-ink-3)]">
              <span>TeeFinder</span>
              <span>지금</span>
            </span>
            <span className="mt-0.5 block text-[15px] font-semibold tracking-[-0.01em]">{banner.title}</span>
            <span className="block text-[14px] leading-5 text-[var(--tf-ink-2)]">{banner.body}</span>
          </span>
        </button>
      )}

      <ScrimContext.Provider value={setScrim}>
        <div className="min-h-0 flex-1">{body}</div>
      </ScrimContext.Provider>
      {scrim && currentTab && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-[100px] bg-[rgba(24,35,29,0.4)]" />
      )}

      {currentTab && (
        <nav
          aria-label="하단 탭"
          className="flex border-t border-[var(--tf-line)] bg-[var(--tf-surface)] px-2 pb-[34px] pt-1.5"
        >
          {TABS.map(({ tab, label, Icon }) => {
            const active = currentTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setView({ kind: "tab", tab })}
                aria-current={active ? "page" : undefined}
                className={`tf-press relative flex h-[52px] flex-1 flex-col items-center justify-center gap-0.5 rounded-[10px] ${
                  active ? "text-[var(--tf-brand)]" : "text-[var(--tf-ink-3)]"
                }`}
              >
                <span className="relative">
                  <Icon size={26} weight={active ? "fill" : "regular"} />
                  {tab === "alerts" && unread > 0 && (
                    <span className="absolute -right-2 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--tf-blue)] px-1 text-[11px] font-semibold text-white">
                      {unread}
                    </span>
                  )}
                </span>
                <span className={`text-[11.5px] ${active ? "font-semibold" : "font-medium"}`}>{label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
