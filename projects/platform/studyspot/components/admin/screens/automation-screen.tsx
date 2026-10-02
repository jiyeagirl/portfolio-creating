"use client";

import { useState } from "react";
import { Gear, Lightbulb, Lock, LockOpen, Minus, Plus, Thermometer, Warning } from "@phosphor-icons/react";
import { Toggle } from "@/components/shared/toggle";
import { Badge, Button, Card, PageHead } from "@/projects/platform/studyspot/components/admin/admin-ui";
import { AUTOMATION_RULES } from "@/projects/platform/studyspot/lib/mock-data";
import { DEVICE_KIND_LABEL, type AdminNavigate } from "@/projects/platform/studyspot/lib/navigation";
import type { DeviceKind } from "@/projects/platform/studyspot/lib/types";

function DeviceKindIcon({ kind, size = 18 }: { kind: DeviceKind; size?: number }) {
  switch (kind) {
    case "door":
      return <Lock size={size} />;
    case "hvac":
      return <Thermometer size={size} />;
    case "light":
      return <Lightbulb size={size} />;
    default:
      return <Gear size={size} />;
  }
}

function SectionHead({ title, desc }: { title: string; desc: string }) {
  return (
    <div>
      <h2 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[var(--ss-ink)]">{title}</h2>
      <p className="mt-1 text-[13px] leading-5 text-[var(--ss-mute)]">{desc}</p>
    </div>
  );
}

export function AutomationScreen({}: { onNavigate: AdminNavigate }) {
  const [rulesActive, setRulesActive] = useState<Record<string, boolean>>(() =>
    AUTOMATION_RULES.reduce<Record<string, boolean>>((acc, rule) => {
      acc[rule.id] = rule.active;
      return acc;
    }, {}),
  );
  const [lightsOn, setLightsOn] = useState(true);
  const [coolingTemp, setCoolingTemp] = useState(22);
  const [doorLocked, setDoorLocked] = useState(false);
  const [emergencyLocked, setEmergencyLocked] = useState(false);

  return (
    <div className="space-y-10">
      <PageHead
        eyebrow="점주 관리자 콘솔"
        title="자동화 | 원격제어"
        desc="영업시간에 맞춘 자동 운영 규칙을 관리하고, 필요할 때는 조명, 냉난방, 출입문을 직접 원격으로 제어합니다."
      />

      <section>
        <SectionHead
          title="자동화 규칙"
          desc="설정된 조건에 따라 장비가 자동으로 동작합니다. 규칙을 끄면 해당 자동 제어가 즉시 중단됩니다."
        />
        <div className="mt-4 space-y-3">
          {AUTOMATION_RULES.map((rule) => {
            const active = rulesActive[rule.id];
            return (
              <Card key={rule.id} className={active ? "" : "opacity-60"}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[var(--ss-surface)] text-[var(--ss-ink)]">
                      <DeviceKindIcon kind={rule.kind} />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[15px] font-semibold text-[var(--ss-ink)]">{rule.name}</h3>
                        <Badge tone="neutral">{DEVICE_KIND_LABEL[rule.kind]}</Badge>
                      </div>
                      <p className="mt-1 ss-mono text-[12px] text-[var(--ss-mute)]">{rule.schedule}</p>
                      <p className="mt-1.5 text-[13px] leading-5 text-[var(--ss-body)]">{rule.description}</p>
                    </div>
                  </div>
                  <Toggle
                    checked={active}
                    onChange={(next) => setRulesActive((prev) => ({ ...prev, [rule.id]: next }))}
                    label={`${rule.name} 자동화 ${active ? "끄기" : "켜기"}`}
                    onClassName="bg-[var(--ss-ink)]"
                    offClassName="bg-[var(--ss-hairline-strong)]"
                  />
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <SectionHead title="수동 원격 제어" desc="자동화 규칙과 별개로 지금 이 순간의 장비 상태를 직접 조작합니다." />
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[var(--ss-surface)] text-[var(--ss-ink)]">
                <Lightbulb size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] text-[var(--ss-mute)]">조명</p>
                <p className="text-[15px] font-semibold text-[var(--ss-ink)]">{lightsOn ? "켜짐" : "꺼짐"}</p>
              </div>
            </div>
            <div className="mt-4">
              <Button
                full
                size="sm"
                variant={lightsOn ? "secondary" : "primary"}
                icon={<Lightbulb size={14} />}
                onClick={() => setLightsOn((prev) => !prev)}
              >
                {lightsOn ? "조명 끄기" : "조명 켜기"}
              </Button>
            </div>
          </Card>

          <Card>
            <p className="text-[13px] text-[var(--ss-mute)]">냉방 강도</p>
            <div className="mt-3 flex items-center justify-between">
              <button
                type="button"
                aria-label="냉방 온도 낮추기"
                onClick={() => setCoolingTemp((prev) => Math.max(18, prev - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-[var(--ss-hairline-strong)] text-[var(--ss-body)] transition-colors hover:bg-[var(--ss-canvas-soft)]"
              >
                <Minus size={14} />
              </button>
              <p className="ss-mono text-[20px] font-semibold text-[var(--ss-ink)]">{coolingTemp}도</p>
              <button
                type="button"
                aria-label="냉방 온도 높이기"
                onClick={() => setCoolingTemp((prev) => Math.min(28, prev + 1))}
                className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-[var(--ss-hairline-strong)] text-[var(--ss-body)] transition-colors hover:bg-[var(--ss-canvas-soft)]"
              >
                <Plus size={14} />
              </button>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[var(--ss-surface)] text-[var(--ss-ink)]">
                {doorLocked ? <Lock size={18} /> : <LockOpen size={18} />}
              </span>
              <div className="min-w-0">
                <p className="text-[13px] text-[var(--ss-mute)]">출입문</p>
                <p className="text-[15px] font-semibold text-[var(--ss-ink)]">{doorLocked ? "잠김" : "열림"}</p>
              </div>
            </div>
            <div className="mt-4">
              <Button
                full
                size="sm"
                variant={doorLocked ? "secondary" : "primary"}
                icon={doorLocked ? <LockOpen size={14} /> : <Lock size={14} />}
                onClick={() => setDoorLocked((prev) => !prev)}
              >
                {doorLocked ? "출입문 해제" : "출입문 잠금"}
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <section>
        <SectionHead title="긴급 제어" desc="이상 상황 발생 시 전 출입점을 즉시 통제합니다. 신중하게 사용하세요." />
        <Card className="mt-4 border-[var(--ss-negative)]">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[var(--ss-negative-soft)] text-[var(--ss-negative)]">
              <Warning size={20} weight="fill" />
            </span>
            <div className="min-w-0">
              <h3 className="text-[16px] font-semibold text-[var(--ss-ink)]">긴급 전체 잠금</h3>
              <p className="mt-1.5 text-[13px] leading-5 text-[var(--ss-body)]">
                실행 즉시 지점의 모든 출입문이 잠기며, 정상 이용 중인 회원의 출입도 함께 제한됩니다. 상황이 해소된
                뒤에는 직접 해제해야 합니다.
              </p>
            </div>
          </div>
          <div className="mt-4">
            {emergencyLocked ? (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-[6px] border border-[var(--ss-negative-soft)] bg-[var(--ss-negative-soft)] px-4 py-2.5">
                <p className="text-[13px] font-medium text-[var(--ss-negative)]">모든 출입문이 잠겼습니다</p>
                <button
                  type="button"
                  onClick={() => setEmergencyLocked(false)}
                  className="text-[13px] font-medium text-[var(--ss-negative)] underline underline-offset-2"
                >
                  해제
                </button>
              </div>
            ) : (
              <Button variant="danger" onClick={() => setEmergencyLocked(true)}>
                긴급 잠금 실행
              </Button>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}
