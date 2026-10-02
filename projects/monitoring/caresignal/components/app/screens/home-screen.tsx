"use client";

import {
  ArrowUpRight,
  BatteryHigh,
  CaretRight,
  CheckCircle,
  CrosshairSimple,
  DeviceMobileCamera,
  FirstAid,
  Path,
  Sneaker,
} from "@phosphor-icons/react";
import { MiniMap } from "@/projects/monitoring/caresignal/components/mini-map";
import {
  Card,
  ListRow,
  Monogram,
  ProgressBar,
  SectionTitle,
  StatTile,
  StatusBadge,
  Tag,
} from "@/projects/monitoring/caresignal/components/app/ui";
import {
  TODAY_LABEL,
  guardians,
  location,
  notifications,
  riskEvents,
  safety,
  sensors,
  todayActivity,
  user,
} from "@/projects/monitoring/caresignal/lib/app-data";
import type { AppNavigate } from "@/projects/monitoring/caresignal/lib/navigation";

const SENSOR_ICON = {
  accel: CrosshairSimple,
  gyro: Path,
  gps: DeviceMobileCamera,
  battery: BatteryHigh,
} as const;

export function HomeScreen({ onNavigate }: { onNavigate: AppNavigate }) {
  const goalRatio = Math.round((todayActivity.steps / todayActivity.stepGoal) * 100);
  const recent = notifications.slice(0, 2);
  const primaryGuardian = guardians[0];

  return (
    <div className="flex min-h-full w-full flex-col px-5 pb-[108px] pt-[68px]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[12.5px] font-normal leading-none text-[#7a7a7a]">{TODAY_LABEL}</p>
          <h1 className="mt-2 text-[20px] font-bold leading-none tracking-[-0.02em] text-[#1d1d1f]">
            {user.name} 님
          </h1>
        </div>
        <Monogram name={user.name} size={44} tone="primary" />
      </div>

      {/* 안전 상태. 화면에서 가장 큰 요소여야 하고, 색과 문장이 같은 정보를 두 번 말한다. */}
      <Card className="mt-5 p-5">
        <div className="flex items-center justify-between">
          <StatusBadge status={safety.status}>안전</StatusBadge>
          <span className="text-[12.5px] font-normal text-[#7a7a7a]">{safety.lastSignal} 감지</span>
        </div>
        <p className="mt-3.5 text-[21px] font-bold leading-[1.25] tracking-[-0.02em] text-[#1d1d1f]">
          {safety.headline}
        </p>
        <p className="mt-2 text-[14.5px] font-normal leading-[1.55] text-[#333333]">
          {safety.detail}
        </p>
        <div className="mt-4 flex items-center gap-2 border-t border-[#f0f0f0] pt-3.5">
          <CheckCircle size={16} weight="fill" className="text-[#248a3d]" />
          <span className="text-[13px] font-normal text-[#7a7a7a]">{safety.since}</span>
        </div>
      </Card>

      <button
        type="button"
        onClick={() => onNavigate("sos")}
        className="cs-press cs-focusable mt-3 flex min-h-[60px] w-full items-center justify-between rounded-full bg-[#d70015] px-6 text-white"
      >
        <span className="flex items-center gap-2.5">
          <FirstAid size={24} weight="fill" />
          <span className="text-[18px] font-semibold leading-none">긴급 도움 요청</span>
        </span>
        <span className="text-[13px] font-normal opacity-80">누르면 위치가 전송됩니다</span>
      </button>

      <SectionTitle
        className="mt-8"
        action={
          <button
            type="button"
            onClick={() => onNavigate("activity")}
            className="cs-focusable text-[14px] font-normal text-[#0066cc]"
          >
            자세히
          </button>
        }
      >
        오늘의 활동
      </SectionTitle>

      <Card className="mt-3 p-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[12.5px] font-normal leading-none text-[#7a7a7a]">걸음 수</p>
            <p className="mt-2 flex items-baseline gap-1.5">
              <span className="text-[34px] font-bold leading-none tracking-[-0.03em] tabular-nums text-[#1d1d1f]">
                {todayActivity.steps.toLocaleString()}
              </span>
              <span className="text-[15px] font-normal text-[#333333]">보</span>
            </p>
          </div>
          <Tag tone="primary">목표의 {goalRatio}%</Tag>
        </div>
        <ProgressBar ratio={goalRatio} className="mt-3.5" />
        <p className="mt-2 text-[12.5px] font-normal text-[#7a7a7a]">
          목표 {todayActivity.stepGoal.toLocaleString()}보까지{" "}
          {(todayActivity.stepGoal - todayActivity.steps).toLocaleString()}보 남았습니다
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <StatTile
            label="이동 거리"
            value={todayActivity.distanceKm.toFixed(1)}
            unit="km"
            sub="어제 2.8km"
          />
          <StatTile
            label="활동 시간"
            value={`${Math.floor(todayActivity.activeMinutes / 60)}시간 ${todayActivity.activeMinutes % 60}분`}
            sub="휴식 6시간 26분"
          />
        </div>
      </Card>

      <SectionTitle
        className="mt-8"
        action={
          <button
            type="button"
            onClick={() => onNavigate("location")}
            className="cs-focusable text-[14px] font-normal text-[#0066cc]"
          >
            지도 보기
          </button>
        }
      >
        마지막 위치
      </SectionTitle>

      <button
        type="button"
        onClick={() => onNavigate("location")}
        className="cs-press mt-3 block w-full text-left"
      >
        <MiniMap
          className="cs-image-shadow h-[164px] w-full"
          markers={[
            {
              id: "me",
              x: 62,
              y: 62,
              kind: "user",
              status: "safe",
              pulse: true,
              label: "현재 위치",
            },
            { id: "home", x: 44, y: 50, kind: "home" },
          ]}
          safeZone={{ x: 50, y: 54, size: 78 }}
          showLabels={false}
        />
        <div className="mt-3 flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[16px] font-semibold leading-none text-[#1d1d1f]">
              {location.place}
            </p>
            <p className="mt-1.5 text-[13px] font-normal text-[#7a7a7a]">
              {location.detail} · {location.updated} 확인 · 생활권 안
            </p>
          </div>
          <CaretRight size={18} weight="bold" className="text-[#c7c7cc]" />
        </div>
      </button>

      <SectionTitle className="mt-8">감지 상태</SectionTitle>
      <div className="mt-3 grid grid-cols-2 gap-x-4">
        {sensors.map((sensor, index) => {
          const Icon = SENSOR_ICON[sensor.key as keyof typeof SENSOR_ICON];
          return (
            <div
              key={sensor.key}
              className={`flex items-center gap-2.5 py-3 ${
                index < 2 ? "border-b border-[#f0f0f0]" : ""
              }`}
            >
              <Icon size={19} weight="regular" className="text-[#7a7a7a]" />
              <span className="flex-1 text-[14px] font-normal text-[#333333]">{sensor.label}</span>
              <span className="text-[13px] font-semibold tabular-nums text-[#248a3d]">
                {sensor.state}
              </span>
            </div>
          );
        })}
      </div>

      <SectionTitle
        className="mt-8"
        action={
          <button
            type="button"
            onClick={() => onNavigate("notifications")}
            className="cs-focusable text-[14px] font-normal text-[#0066cc]"
          >
            전체 보기
          </button>
        }
      >
        이번 주 위험 이벤트
      </SectionTitle>

      <Card tone="parchment" className="mt-3 p-4">
        <div className="flex items-baseline gap-2">
          <span className="text-[26px] font-bold leading-none tabular-nums text-[#1d1d1f]">
            {riskEvents.length}
          </span>
          <span className="text-[14px] font-normal text-[#333333]">건 감지 · 모두 종료됨</span>
        </div>
        <ul className="mt-3.5 space-y-2.5">
          {riskEvents.slice(0, 2).map((event) => (
            <li key={event.id} className="flex items-center gap-2.5">
              <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-[#ff9500]" />
              <span className="flex-1 truncate text-[14px] font-normal text-[#333333]">
                {event.dayLabel} · {event.place}
              </span>
              <span className="text-[12.5px] font-normal text-[#7a7a7a]">{event.timeLabel}</span>
            </li>
          ))}
        </ul>
      </Card>

      <SectionTitle className="mt-8">최근 알림</SectionTitle>
      <div className="mt-1">
        {recent.map((item) => (
          <div key={item.id} className="border-b border-[#f0f0f0] py-3.5 last:border-b-0">
            <ListRow
              title={item.title}
              subtitle={`${item.dayLabel} ${item.timeLabel}`}
              trailing={<CaretRight size={16} weight="bold" className="text-[#c7c7cc]" />}
              onClick={() => onNavigate("notifications")}
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-[18px] bg-[#f5f5f7] p-4">
        <Monogram name={primaryGuardian.name} size={38} />
        <div className="flex-1">
          <p className="text-[14px] font-semibold text-[#1d1d1f]">
            {primaryGuardian.name} · {primaryGuardian.relation}
          </p>
          <p className="mt-0.5 text-[12.5px] font-normal text-[#7a7a7a]">
            1차 보호자 · 위치와 활동을 함께 보고 있습니다
          </p>
        </div>
        <ArrowUpRight size={18} weight="bold" className="text-[#7a7a7a]" />
      </div>

      <p className="mt-5 flex items-center justify-center gap-1.5 text-[12px] font-normal text-[#7a7a7a]">
        <Sneaker size={14} weight="regular" />
        {user.agency} {user.manager}가 함께 확인합니다
      </p>
    </div>
  );
}
