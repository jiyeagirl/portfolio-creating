"use client";

import { useState } from "react";
import {
  ArrowsOut,
  Bell,
  Camera,
  DeviceMobileCamera,
  Gear,
  Microphone,
} from "@phosphor-icons/react";
import {
  AmbientStatus,
  FilmstripTile,
  LiveFeed,
  OverlayControl,
  TimelineScrubber,
} from "@/projects/monitoring/petlive/components/live-canvas";
import { DEVICES, EVENTS, NOTIFICATIONS, petById } from "@/projects/monitoring/petlive/lib/mock-data";
import { EVENT_KIND_LABEL, timeOnly, type Navigate } from "@/projects/monitoring/petlive/lib/navigation";

/* 아키타입 A5 — 라이브 모니터 캔버스.

   이 앱의 본체는 라이브 영상이다. 이전 구현은 A1(섹션 스택)으로 영상을 64×64 썸네일
   리스트에 눌러 담고 그 위에 요약 카드와 `SectionHead`를 쌓았다 — `studyspot`의 홈과
   스크롤 컨테이너 클래스까지 문자 단위로 같았다. 실제 상용 관제 앱(Ring, Nest, Wyze,
   헤이홈)은 전부 풀블리드 피드 + 오버레이 컨트롤이다.

   - 하단 탭바 없음. 카메라 전환은 하단 가로 필름스트립, 나머지 진입점은 상단 코너 컨트롤.
   - 상태는 카드 행이 아니라 영상 위 앰비언트 표시(LIVE 배지, 온라인 카운트, 타임스탬프).
   - 이력은 세로 리스트가 아니라 가로 타임라인 스크러버.
   - `SectionHead`, `Card`, `StatusPill`을 이 화면에서 쓰지 않는다.
   - 지배적 스크롤 축이 가로다 — 세로 스크롤은 캔버스 아래 한 화면 분량뿐이다. */

/* 목업 기준 시각. 실제 시계로 계산하면 "방금 전" 같은 표현이 데이터와 어긋난다. */
const NOW_LABEL = "18:00";

export function HomeScreen({ onNavigate }: { onNavigate: Navigate }) {
  const [activeId, setActiveId] = useState(DEVICES[0].id);

  const active = DEVICES.find((d) => d.id === activeId) ?? DEVICES[0];
  const activePet = petById(active.petId);
  const onlineCount = DEVICES.filter((d) => d.status === "online").length;
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;

  const timelineItems = EVENTS.slice(0, 8).map((event) => ({
    id: event.id,
    time: timeOnly(event.occurredAt),
    label: EVENT_KIND_LABEL[event.kind],
    thumbnail: event.thumbnail,
    unreviewed: !event.reviewed,
  }));

  return (
    <div className="pl-enter flex h-full flex-col bg-[var(--pl-canvas)]">
      {/* 캔버스. 상단 컨트롤은 영상 위에 얹히고, 상태바 높이(59px)를 비켜 앉는다. */}
      <div className="relative shrink-0">
        <LiveFeed
          key={active.id}
          device={active}
          petName={activePet?.name ?? ""}
          timestamp={NOW_LABEL}
          onExpand={() => onNavigate("monitoring", active.id)}
          overlay={
            <span className="flex items-center gap-2">
              <OverlayControl
                icon={<Microphone size={18} weight="fill" />}
                label="양방향 대화"
                onClick={() => onNavigate("monitoring", active.id)}
              />
              <OverlayControl
                icon={<Camera size={18} weight="fill" />}
                label="스냅샷 저장"
                onClick={() => onNavigate("eventHistory")}
              />
              <OverlayControl
                icon={<ArrowsOut size={18} weight="bold" />}
                label="전체화면"
                tone="accent"
                onClick={() => onNavigate("monitoring", active.id)}
              />
            </span>
          }
        />

        <div className="pointer-events-none absolute inset-x-4 top-[67px] flex items-center justify-between gap-3">
          <AmbientStatus
            onlineCount={onlineCount}
            totalCount={DEVICES.length}
            timestamp={NOW_LABEL}
          />
          <span className="pointer-events-auto flex items-center gap-1.5">
            <CornerControl
              icon={<Bell size={17} weight="fill" />}
              label="알림"
              badge={unread}
              onClick={() => onNavigate("notifications")}
            />
            <CornerControl
              icon={<DeviceMobileCamera size={17} weight="fill" />}
              label="기기 관리"
              onClick={() => onNavigate("deviceManage")}
            />
            <CornerControl
              icon={<Gear size={17} weight="fill" />}
              label="내 정보"
              onClick={() => onNavigate("myPage")}
            />
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* 카메라 필름스트립 — 하단 탭바를 대체하는 전환 장치. */}
        <div className="pl-scrub flex gap-2 overflow-x-auto px-5 pt-4">
          {DEVICES.map((device) => (
            <FilmstripTile
              key={device.id}
              device={device}
              active={device.id === active.id}
              onSelect={() => setActiveId(device.id)}
            />
          ))}
          <button
            type="button"
            onClick={() => onNavigate("deviceRegister")}
            className="flex h-[62px] w-[92px] shrink-0 flex-col items-center justify-center gap-1 rounded-[10px] border border-dashed border-[var(--pl-hairline-strong)] text-[var(--pl-mute)] transition-opacity active:opacity-70"
          >
            <span className="text-[17px] leading-none">+</span>
            <span className="text-[10.5px] font-semibold">카메라 추가</span>
          </button>
        </div>

        {/* 선택된 카메라의 텔레메트리. 카드가 아니라 한 줄 계기판이다. */}
        <div className="mt-5 flex items-center gap-5 px-5">
          <Telemetry label="Wi-Fi" value={`${active.wifiPct}%`} />
          <Telemetry
            label="배터리"
            value={active.batteryPct === null ? "상시 전원" : `${active.batteryPct}%`}
            warn={active.batteryPct !== null && active.batteryPct <= 20}
          />
          <Telemetry label="펌웨어" value={active.firmwareVersion} />
        </div>

        {active.errorNote && (
          <p className="mt-4 px-5 text-[12.5px] leading-[19px] text-[var(--pl-warning-deep)]">
            {active.errorNote}
          </p>
        )}

        <div className="mt-7">
          <div className="mb-2.5 flex items-baseline justify-between gap-3 px-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--pl-mute)]">
              오늘의 타임라인
            </p>
            <button
              type="button"
              onClick={() => onNavigate("eventHistory")}
              className="pl-mono text-[11.5px] text-[var(--pl-mute)] transition-opacity active:opacity-70"
            >
              {EVENTS.length}건
            </button>
          </div>
          <TimelineScrubber items={timelineItems} onOpen={() => onNavigate("eventHistory")} />
        </div>
      </div>
    </div>
  );
}

/* 영상 위 코너 컨트롤. 하단 탭바가 없으므로 캔버스를 떠나는 진입점은 전부 여기 모인다. */
function CornerControl({
  icon,
  label,
  badge,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  badge?: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[var(--pl-overlay-strong)] text-[var(--pl-overlay-ink)] transition-opacity active:opacity-70"
    >
      {icon}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-[var(--pl-accent)] px-1 text-[9.5px] font-bold text-[var(--pl-on-accent)]">
          {badge}
        </span>
      )}
    </button>
  );
}

/* 한 줄 계기판. 값을 카드에 담지 않는다 — 관제 화면에서 숫자는 라벨 옆에 그냥 있다. */
function Telemetry({ label, value, warn = false }: { label: string; value: string; warn?: boolean }) {
  return (
    <span className="min-w-0">
      <span className="block text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[var(--pl-mute)]">
        {label}
      </span>
      <span
        className={`pl-mono mt-1 block truncate text-[15px] font-semibold ${
          warn ? "text-[var(--pl-warning-deep)]" : "text-[var(--pl-ink)]"
        }`}
      >
        {value}
      </span>
    </span>
  );
}
