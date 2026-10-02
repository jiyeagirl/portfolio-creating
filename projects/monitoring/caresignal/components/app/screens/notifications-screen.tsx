"use client";

import { useMemo, useState } from "react";
import {
  BellSlash,
  ChartBar,
  Gear,
  PaperPlaneTilt,
  PersonSimpleWalk,
  Siren,
  Warning,
} from "@phosphor-icons/react";
import {
  ScreenHeader,
  SegmentedControl,
} from "@/projects/monitoring/caresignal/components/app/ui";
import { notifications as seed } from "@/projects/monitoring/caresignal/lib/app-data";
import type { AppNotification } from "@/projects/monitoring/caresignal/lib/types";

type Filter = "all" | "fall" | "geofence" | "inactivity" | "sos" | "report";
type Period = "7" | "30";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "fall", label: "낙상" },
  { key: "geofence", label: "생활권" },
  { key: "inactivity", label: "미활동" },
  { key: "sos", label: "긴급" },
  { key: "report", label: "리포트" },
];

const PERIODS: { key: Period; label: string }[] = [
  { key: "7", label: "최근 7일" },
  { key: "30", label: "최근 30일" },
];

const ICON: Record<string, { icon: typeof Warning; wash: string; color: string }> = {
  fall: { icon: Warning, wash: "bg-[#fdecea]", color: "text-[#d70015]" },
  geofence: { icon: PersonSimpleWalk, wash: "bg-[#fdf2e3]", color: "text-[#9a5b00]" },
  inactivity: { icon: BellSlash, wash: "bg-[#fdf2e3]", color: "text-[#9a5b00]" },
  sos: { icon: Siren, wash: "bg-[#fdecea]", color: "text-[#d70015]" },
  report: { icon: ChartBar, wash: "bg-[#eef4fb]", color: "text-[#0066cc]" },
  system: { icon: Gear, wash: "bg-[#f5f5f7]", color: "text-[#333333]" },
};

/** 최근 7일 필터에서 제외되는 항목. mock 데이터라 날짜 라벨로 판별한다. */
const OLDER_THAN_WEEK = new Set(["7월 20일", "7월 21일"]);

export function NotificationsScreen() {
  const [filter, setFilter] = useState<Filter>("all");
  const [period, setPeriod] = useState<Period>("30");
  const [items, setItems] = useState<AppNotification[]>(seed);

  const visible = useMemo(
    () =>
      items.filter((item) => {
        if (filter !== "all" && item.kind !== filter) return false;
        if (period === "7" && OLDER_THAN_WEEK.has(item.dayLabel)) return false;
        return true;
      }),
    [items, filter, period],
  );

  const unread = items.filter((item) => !item.read).length;
  const sentCount = items.filter((item) => item.sentToGuardian).length;

  const groups = useMemo(() => {
    const map = new Map<string, AppNotification[]>();
    for (const item of visible) {
      const list = map.get(item.dayLabel) ?? [];
      list.push(item);
      map.set(item.dayLabel, list);
    }
    return [...map.entries()];
  }, [visible]);

  return (
    <div className="flex min-h-full w-full flex-col px-5 pb-[108px]">
      <ScreenHeader
        title="알림"
        description={`읽지 않은 알림 ${unread}건 · 보호자 발송 ${sentCount}건`}
        right={
          unread > 0 ? (
            <button
              type="button"
              onClick={() => setItems((prev) => prev.map((item) => ({ ...item, read: true })))}
              className="cs-focusable mt-3 shrink-0 text-[14px] font-normal text-[#0066cc]"
            >
              모두 읽음
            </button>
          ) : undefined
        }
      />

      <SegmentedControl className="mt-5" value={period} options={PERIODS} onChange={setPeriod} />

      <div className="cs-no-scrollbar -mx-5 mt-3 flex gap-2 overflow-x-auto px-5">
        {FILTERS.map((option) => {
          const active = option.key === filter;
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => setFilter(option.key)}
              aria-pressed={active}
              className={`cs-press cs-focusable shrink-0 rounded-full px-4 py-2 text-[13.5px] leading-none ${
                active
                  ? "bg-[#1d1d1f] font-semibold text-white"
                  : "bg-[#f5f5f7] font-normal text-[#333333]"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {groups.length === 0 ? (
        <div className="mt-16 flex flex-col items-center px-6 text-center">
          <span className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-[#f5f5f7]">
            <BellSlash size={30} weight="regular" className="text-[#7a7a7a]" />
          </span>
          <p className="mt-5 text-[17px] font-semibold text-[#1d1d1f]">해당하는 알림이 없습니다</p>
          <p className="mt-2 text-[14px] font-normal leading-[1.55] text-[#7a7a7a]">
            선택한 기간과 유형에서는 기록된 알림이 없습니다. 기간을 늘리거나 전체 유형으로 바꿔
            보세요.
          </p>
          <button
            type="button"
            onClick={() => {
              setFilter("all");
              setPeriod("30");
            }}
            className="cs-press cs-focusable mt-5 rounded-full border border-[#0066cc] px-5 py-2.5 text-[15px] font-semibold text-[#0066cc]"
          >
            필터 초기화
          </button>
        </div>
      ) : (
        groups.map(([day, list]) => (
          <div key={day} className="mt-7">
            <p className="text-[15px] font-semibold leading-none text-[#7a7a7a]">{day}</p>
            <ul className="mt-2">
              {list.map((item) => {
                const meta = ICON[item.kind] ?? ICON.system;
                const Icon = meta.icon;
                return (
                  <li key={item.id} className="border-b border-[#f0f0f0] last:border-b-0">
                    <button
                      type="button"
                      onClick={() =>
                        setItems((prev) =>
                          prev.map((n) => (n.id === item.id ? { ...n, read: true } : n)),
                        )
                      }
                      className="cs-focusable flex w-full items-start gap-3 py-4 text-left"
                    >
                      <span
                        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${meta.wash}`}
                      >
                        <Icon size={18} weight="fill" className={meta.color} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start gap-2">
                          <p
                            className={`flex-1 text-[15.5px] leading-[1.4] text-[#1d1d1f] ${
                              item.read ? "font-normal" : "font-semibold"
                            }`}
                          >
                            {item.title}
                          </p>
                          {!item.read && (
                            <span className="mt-1.5 h-[7px] w-[7px] shrink-0 rounded-full bg-[#0066cc]" />
                          )}
                        </div>
                        <p className="mt-1.5 text-[13.5px] font-normal leading-[1.55] text-[#333333]">
                          {item.body}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="text-[12.5px] font-normal text-[#7a7a7a]">
                            {item.timeLabel}
                          </span>
                          {item.sentToGuardian && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f5f5f7] px-2.5 py-1 text-[12px] font-semibold leading-none text-[#333333]">
                              <PaperPlaneTilt size={11} weight="fill" />
                              {item.sentToGuardian} 발송
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
