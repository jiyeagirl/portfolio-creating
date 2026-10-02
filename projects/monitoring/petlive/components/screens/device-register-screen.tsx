"use client";

import { useEffect, useState } from "react";
import {
  QrCode,
  Hash,
  CheckCircle,
  ArrowsClockwise,
  WifiHigh,
  LockSimple,
  CheckFat,
  House,
  ForkKnife,
  Bed,
  DoorOpen,
} from "@phosphor-icons/react";
import { ScreenHeader } from "@/components/shared/screen-header";
import { Badge, Button, Card, Field, Input } from "@/projects/monitoring/petlive/components/ui";
import type { Navigate } from "@/projects/monitoring/petlive/lib/navigation";

const TOTAL_STEPS = 4;

const NEARBY_NETWORKS = [
  { ssid: "HomeNet_5G", signal: 88 },
  { ssid: "HomeNet_2.4G", signal: 72 },
  { ssid: "iptime_A1B2", signal: 41 },
];

const LOCATIONS = [
  { key: "거실", icon: House },
  { key: "주방", icon: ForkKnife },
  { key: "침실", icon: Bed },
  { key: "복도", icon: DoorOpen },
];

function StepDots({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-1.5 px-6 pb-2 pt-4">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            i < step ? "bg-[var(--pl-accent)]" : "bg-[var(--pl-hairline)]"
          }`}
        />
      ))}
    </div>
  );
}

/* 마운트될 때마다 0부터 새로 시작하도록 별도 컴포넌트로 분리 — 부모 useEffect에서
   setState를 직접 초기화 호출하지 않고, setInterval 콜백에서만 상태를 갱신한다. */
function PairingStep({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();
    const durationMs = 1800;
    const interval = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const next = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(next);
      if (next >= 100) {
        clearInterval(interval);
        setTimeout(onDone, 500);
      }
    }, 60);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <div className="flex flex-col items-center pt-12 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--pl-canvas-soft)] text-[var(--pl-accent)]">
        <ArrowsClockwise size={32} weight="bold" className="motion-safe:animate-spin" />
      </span>
      <h1 className="mt-6 text-[19px] font-bold leading-[26px] tracking-[-0.02em] text-[var(--pl-ink)]">
        디바이스와 연결하는 중이에요
      </h1>
      <p className="mt-1.5 text-[14px] leading-[20px] text-[var(--pl-mute)]">
        잠시만 기다려 주세요. 화면을 벗어나지 마세요.
      </p>

      <div className="mt-8 w-full">
        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--pl-canvas-soft)]">
          <div
            className="h-full rounded-full bg-[var(--pl-accent)] transition-[width] duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="pl-mono mt-2 text-right text-[12px] text-[var(--pl-mute)]">{progress}%</p>
      </div>
    </div>
  );
}

export function DeviceRegisterScreen({ onNavigate }: { onNavigate: Navigate }) {
  const [step, setStep] = useState(1);

  const [regTab, setRegTab] = useState<"qr" | "serial">("qr");
  const [serial, setSerial] = useState("PLC-260228-0512");

  const [selectedSsid, setSelectedSsid] = useState<string | null>(null);
  const [wifiPassword, setWifiPassword] = useState("");

  const [deviceName, setDeviceName] = useState("새 펫캠");
  const [location, setLocation] = useState<string | null>(null);

  const STEP_TITLES: Record<number, string> = {
    1: "디바이스 인식",
    2: "Wi-Fi 연결",
    3: "페어링 진행",
    4: "등록 완료",
  };
  const stepTitle = STEP_TITLES[step] ?? "디바이스 인식";

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => s - 1);
    } else {
      onNavigate("deviceManage");
    }
  };

  return (
    <div className="pl-enter flex min-h-full flex-col">
      <ScreenHeader
        title={stepTitle}
        subtitle={`${step} / ${TOTAL_STEPS} 단계`}
        onBack={handleBack}
        className="bg-[var(--pl-canvas)] border-[var(--pl-hairline)]"
        backButtonClassName="text-[var(--pl-ink)] hover:bg-[var(--pl-canvas-soft)]"
        titleClassName="text-[15.5px] font-semibold text-[var(--pl-ink)]"
        subtitleClassName="text-[11px] text-[var(--pl-mute)]"
      />
      <StepDots step={step} />

      <div className="flex-1 px-6 pb-10 pt-4">
        {step === 1 && (
          <div>
            <h1 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[var(--pl-ink)]">
              새 웹캠을 등록해요
            </h1>
            <p className="mt-1.5 text-[14px] leading-[20px] text-[var(--pl-mute)]">
              QR 코드를 스캔하거나 시리얼 번호를 직접 입력하세요.
            </p>

            <div className="mt-6 flex rounded-[14px] bg-[var(--pl-canvas-soft)] p-1">
              <button
                type="button"
                onClick={() => setRegTab("qr")}
                className={`flex-1 rounded-[10px] py-2.5 text-[13px] font-semibold transition-colors ${
                  regTab === "qr"
                    ? "bg-[var(--pl-canvas)] text-[var(--pl-ink)] shadow-[var(--pl-shadow-soft)]"
                    : "text-[var(--pl-mute)]"
                }`}
              >
                QR 코드로 등록
              </button>
              <button
                type="button"
                onClick={() => setRegTab("serial")}
                className={`flex-1 rounded-[10px] py-2.5 text-[13px] font-semibold transition-colors ${
                  regTab === "serial"
                    ? "bg-[var(--pl-canvas)] text-[var(--pl-ink)] shadow-[var(--pl-shadow-soft)]"
                    : "text-[var(--pl-mute)]"
                }`}
              >
                시리얼 번호로 등록
              </button>
            </div>

            {regTab === "qr" ? (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-[24px] border-2 border-dashed border-[var(--pl-hairline-strong)] bg-[var(--pl-canvas-soft)] text-center"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--pl-canvas)] text-[var(--pl-mute)]">
                    <QrCode size={28} weight="light" />
                  </span>
                  <span className="max-w-[22ch] text-[13px] leading-[18px] text-[var(--pl-mute)]">
                    QR 코드를 사각형 안에 맞춰주세요
                  </span>
                </button>
                <div className="mt-5">
                  <Button full size="lg" icon={<CheckCircle size={17} weight="bold" />} onClick={() => setStep(2)}>
                    인식 완료 (시뮬레이션)
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                <Field label="시리얼 번호" hint="디바이스 하단 라벨에서 확인할 수 있어요.">
                  <Input
                    value={serial}
                    onChange={setSerial}
                    placeholder="예: PLC-260228-0512"
                    suffix={<Hash size={17} className="text-[var(--pl-mute)]" />}
                  />
                </Field>
                <Button full size="lg" disabled={serial.trim().length === 0} onClick={() => setStep(2)}>
                  확인
                </Button>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="text-[20px] font-bold leading-[26px] tracking-[-0.02em] text-[var(--pl-ink)]">
              Wi-Fi에 연결해요
            </h1>
            <p className="mt-1.5 text-[14px] leading-[20px] text-[var(--pl-mute)]">
              디바이스를 연결할 네트워크를 선택하세요.
            </p>

            <div className="mt-6 space-y-2.5">
              {NEARBY_NETWORKS.map((net) => {
                const selected = selectedSsid === net.ssid;
                return (
                  <button
                    key={net.ssid}
                    type="button"
                    onClick={() => setSelectedSsid(net.ssid)}
                    className={`flex w-full items-center gap-3 rounded-[14px] border px-4 py-3.5 text-left transition-colors ${
                      selected
                        ? "border-[var(--pl-accent)] bg-[var(--pl-accent-pale)]"
                        : "border-[var(--pl-hairline)] bg-[var(--pl-canvas)]"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        selected ? "bg-[var(--pl-accent)] text-[var(--pl-on-accent)]" : "bg-[var(--pl-canvas-soft)] text-[var(--pl-mute)]"
                      }`}
                    >
                      <WifiHigh size={17} weight="bold" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-semibold text-[var(--pl-ink)]">
                        {net.ssid}
                      </span>
                      <span className="pl-mono block text-[12px] text-[var(--pl-mute)]">신호 {net.signal}%</span>
                    </span>
                    {selected && <CheckCircle size={20} weight="fill" className="shrink-0 text-[var(--pl-accent)]" />}
                  </button>
                );
              })}
            </div>

            {selectedSsid && (
              <div className="mt-6 space-y-5">
                <Field label={`"${selectedSsid}" 비밀번호`}>
                  <Input
                    type="password"
                    value={wifiPassword}
                    onChange={setWifiPassword}
                    placeholder="Wi-Fi 비밀번호를 입력하세요"
                    suffix={<LockSimple size={17} className="text-[var(--pl-mute)]" />}
                  />
                </Field>
                <Button full size="lg" disabled={wifiPassword.trim().length === 0} onClick={() => setStep(3)}>
                  연결하기
                </Button>
              </div>
            )}
          </div>
        )}

        {step === 3 && <PairingStep onDone={() => setStep(4)} />}

        {step === 4 && (
          <div>
            <div className="flex flex-col items-center pt-4 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--pl-positive-soft)] text-[var(--pl-positive-deep)]">
                <CheckFat size={30} weight="fill" />
              </span>
              <h1 className="mt-4 text-[19px] font-bold leading-[26px] tracking-[-0.02em] text-[var(--pl-ink)]">
                등록이 완료됐어요
              </h1>
              <p className="mt-1.5 text-[14px] leading-[20px] text-[var(--pl-mute)]">
                이름과 설치 위치를 설정하고 모니터링을 시작하세요.
              </p>
            </div>

            <div className="mt-7 space-y-5">
              <Field label="디바이스 이름">
                <Input value={deviceName} onChange={setDeviceName} placeholder="예: 거실캠" />
              </Field>

              <div>
                <span className="text-[13px] font-medium text-[var(--pl-ink)]">설치 위치</span>
                <div className="mt-1.5 grid grid-cols-4 gap-2">
                  {LOCATIONS.map(({ key, icon: Icon }) => {
                    const selected = location === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setLocation(key)}
                        className={`flex flex-col items-center justify-center gap-1.5 rounded-[14px] border py-3 transition-colors ${
                          selected
                            ? "border-[var(--pl-accent)] bg-[var(--pl-accent-pale)] text-[var(--pl-accent-active)]"
                            : "border-[var(--pl-hairline)] bg-[var(--pl-canvas)] text-[var(--pl-mute)]"
                        }`}
                      >
                        <Icon size={18} weight={selected ? "fill" : "regular"} />
                        <span className="text-[12px] font-medium">{key}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Card soft className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge tone="warning" dot>
                      펌웨어 업데이트 필요
                    </Badge>
                  </div>
                  <p className="mt-2 text-[13px] leading-[18px] text-[var(--pl-body)]">
                    최신 버전으로 업데이트하면 더 안정적으로 작동해요. 마이페이지에서 언제든 업데이트할 수 있어요.
                  </p>
                </div>
              </Card>
            </div>

            <div className="mt-7">
              <Button
                full
                size="lg"
                disabled={deviceName.trim().length === 0 || !location}
                onClick={() => onNavigate("deviceManage")}
              >
                등록 완료
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
