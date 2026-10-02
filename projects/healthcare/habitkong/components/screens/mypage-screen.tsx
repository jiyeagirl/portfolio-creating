"use client";

import { useState } from "react";
import { CaretRight, Check, Crown, PencilSimple, Target } from "@phosphor-icons/react";
import { Mascot } from "@/projects/healthcare/habitkong/components/mascot";
import { INTEGRATION_LOGO } from "@/projects/healthcare/habitkong/components/brand-logos";
import {
  dataMenu,
  integrations,
  notificationSettings,
  profile,
  routineTime,
  subscription,
  supportMenu,
} from "@/projects/healthcare/habitkong/lib/profile";
import type { HabitkongNavigate } from "@/projects/healthcare/habitkong/lib/navigation";
import {
  Card,
  ListRow,
  SectionTitle,
  Tag,
  Toggle,
} from "@/projects/healthcare/habitkong/components/ui";

export function MypageScreen({ onNavigate }: { onNavigate: HabitkongNavigate }) {
  const [links, setLinks] = useState(() =>
    Object.fromEntries(integrations.map((i) => [i.id, i.connected])),
  );
  const [notifications, setNotifications] = useState(() =>
    Object.fromEntries(notificationSettings.map((n) => [n.id, n.on])),
  );
  const [time, setTime] = useState(routineTime.value);

  return (
    <div className="h-full w-full px-5 pb-[108px] pt-[76px]">
      <h1 className="text-[22px] font-bold tracking-tight text-[#17140F]">마이페이지</h1>

      <Card className="mt-4 flex items-center gap-4 p-4">
        <Mascot size={58} mood="good" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-[15.5px] font-semibold text-[#17140F]">{profile.name}</p>
            <Tag tone="yellow">{profile.levelLabel}</Tag>
          </div>
          <p className="mt-1 text-[11.5px] tabular-nums text-[#8A8377]">
            {profile.gender} · {profile.age}세 · {profile.heightCm}cm · {profile.weightKg}kg
          </p>
          <p className="mt-0.5 text-[11px] text-[#B5AEA4]">{profile.joinedAt} 가입</p>
        </div>
        <button
          type="button"
          aria-label="프로필 수정"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#B5AEA4] transition-colors hover:bg-[#F7F6F3] hover:text-[#17140F]"
        >
          <PencilSimple size={15} />
        </button>
      </Card>

      <section className="mt-5">
        <SectionTitle title="건강 데이터 연동" />
        <div className="mt-2.5 overflow-hidden rounded-[12px] border border-[#EAEAEA] bg-white">
          {integrations.map((item, index) => {
            const Logo = INTEGRATION_LOGO[item.id];
            return (
            <div
              key={item.id}
              className={`flex items-center gap-3 px-4 py-3.5 ${
                index > 0 ? "border-t border-[#EAEAEA]" : ""
              }`}
            >
              {/* The provider tiles are white app icons, so they need their own
                  hairline to separate from the white row behind them. */}
              <span className="shrink-0 rounded-[8px] ring-1 ring-inset ring-[#EAEAEA]">
                <Logo size={36} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-medium text-[#17140F]">{item.label}</p>
                <p className="mt-0.5 text-[11px] text-[#8A8377]">
                  {links[item.id] ? item.syncedAt : item.detail}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLinks((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                className={`shrink-0 rounded-[6px] border px-3 py-1.5 text-[11.5px] font-semibold transition-colors ${
                  links[item.id]
                    ? "border-[#EAEAEA] bg-white text-[#8A8377]"
                    : "border-[#17140F] bg-[#17140F] text-white"
                }`}
              >
                {links[item.id] ? "연동 해제" : "연동하기"}
              </button>
            </div>
            );
          })}
        </div>
      </section>

      <section className="mt-5">
        <SectionTitle title="알림" />
        <div className="mt-2.5 overflow-hidden rounded-[12px] border border-[#EAEAEA] bg-white">
          {notificationSettings.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 px-4 py-3.5 ${
                index > 0 ? "border-t border-[#EAEAEA]" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-medium text-[#17140F]">{item.label}</p>
                <p className="mt-0.5 text-[11px] text-[#8A8377]">{item.detail}</p>
              </div>
              <Toggle
                on={notifications[item.id]}
                label={item.label}
                onChange={() =>
                  setNotifications((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                }
              />
            </div>
          ))}

          <div className="border-t border-[#EAEAEA] px-4 py-3.5">
            <p className="text-[13.5px] font-medium text-[#17140F]">{routineTime.label}</p>
            <div className="mt-2.5 flex gap-1.5">
              {routineTime.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setTime(option)}
                  aria-pressed={time === option}
                  className={`flex-1 rounded-[6px] border py-1.5 text-[11.5px] font-semibold tabular-nums transition-colors ${
                    time === option
                      ? "border-[#17140F] bg-[#17140F] text-white"
                      : "border-[#EAEAEA] bg-white text-[#8A8377]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5">
        <SectionTitle title="구독" />
        <div className="mt-2.5 rounded-[12px] border border-[#EAEAEA] bg-[#F7F6F3] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5">
                <Crown size={15} weight="fill" className="text-[#956400]" />
                <p className="text-[14px] font-semibold text-[#17140F]">{subscription.premiumName}</p>
              </div>
              <p className="mt-1 text-[11.5px] text-[#8A8377]">
                현재 {subscription.plan} · {subscription.renewNote}
              </p>
            </div>
            <p className="shrink-0 text-[13px] font-semibold tabular-nums text-[#17140F]">
              {subscription.price}
            </p>
          </div>

          <ul className="mt-3 space-y-1.5 border-t border-[#EAEAEA] pt-3">
            {subscription.benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-2 text-[12px] text-[#4A443C]">
                <Check size={12} weight="bold" className="shrink-0 text-[#346538]" />
                {benefit}
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="mt-3.5 w-full rounded-[6px] bg-[#17140F] py-2.5 text-[13px] font-semibold text-white transition-transform active:scale-[0.98]"
          >
            프리미엄 시작하기
          </button>
        </div>
      </section>

      <section className="mt-5">
        <SectionTitle title="목표와 기록" />
        <div className="mt-2.5 overflow-hidden rounded-[12px] border border-[#EAEAEA] bg-white">
          <ListRow
            label="목표 관리"
            detail="주간, 월간 목표와 배지"
            onClick={() => onNavigate("goals")}
            right={<Target size={15} className="shrink-0 text-[#B5AEA4]" />}
          />
          <div className="border-t border-[#EAEAEA]">
            <ListRow
              label="콩이 다이어리"
              detail="월별 기록과 메모"
              onClick={() => onNavigate("diary")}
              right={<CaretRight size={14} className="shrink-0 text-[#B5AEA4]" />}
            />
          </div>
        </div>
      </section>

      <section className="mt-5">
        <SectionTitle title="데이터" />
        <div className="mt-2.5 overflow-hidden rounded-[12px] border border-[#EAEAEA] bg-white">
          {dataMenu.map((item, index) => (
            <div key={item.id} className={index > 0 ? "border-t border-[#EAEAEA]" : ""}>
              <ListRow
                label={item.label}
                detail={item.detail || undefined}
                right={<CaretRight size={14} className="shrink-0 text-[#B5AEA4]" />}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5">
        <SectionTitle title="고객센터" />
        <div className="mt-2.5 overflow-hidden rounded-[12px] border border-[#EAEAEA] bg-white">
          {supportMenu.map((item, index) => (
            <div key={item.id} className={index > 0 ? "border-t border-[#EAEAEA]" : ""}>
              <ListRow
                label={item.label}
                detail={item.id === "version" ? undefined : item.detail || undefined}
                right={
                  item.id === "version" ? (
                    <span className="shrink-0 text-[11.5px] tabular-nums text-[#B5AEA4]">
                      {item.detail}
                    </span>
                  ) : (
                    <CaretRight size={14} className="shrink-0 text-[#B5AEA4]" />
                  )
                }
              />
            </div>
          ))}
        </div>
      </section>

      <button
        type="button"
        className="mt-5 w-full py-2 text-center text-[12.5px] font-medium text-[#B5AEA4]"
      >
        로그아웃
      </button>
    </div>
  );
}
