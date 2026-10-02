"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Clock, LockKey } from "@phosphor-icons/react";
import { Badge, Button, Field, Input } from "@/projects/b2b/genderinsight/components/ui";
import { ParticipantShell } from "@/projects/b2b/genderinsight/components/layout/participant-shell";
import { ASSESSMENTS, PARTICIPANT_DEMO } from "@/projects/b2b/genderinsight/lib/mock-data";
import type { ParticipantScreen } from "@/projects/b2b/genderinsight/lib/navigation";

const activeAssessment = ASSESSMENTS.find((a) => a.id === "a2")!;

export function LoginScreen({ onNavigate }: { onNavigate: (next: ParticipantScreen) => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [identified, setIdentified] = useState(false);

  const submit = () => {
    if (!/^\d{6}$/.test(pin)) {
      setError("초대 이메일로 받은 6자리 숫자 PIN을 입력해주세요.");
      return;
    }
    setError("");
    setIdentified(true);
  };

  return (
    <ParticipantShell>
      <div className="relative">
        <div className="gi-spot" />
        <div className="gi-enter">
          <p className="gi-mono text-[12px] uppercase tracking-[0.08em] text-[var(--gi-mute)]">참여자 로그인</p>
          <h1 className="mt-2 text-[26px] font-semibold leading-9 tracking-[-0.03em] text-[var(--gi-ink)]">
            성인지감수성 진단 참여
          </h1>
          <p className="mt-2 text-[14px] leading-6 text-[var(--gi-body)]">
            발급받은 PIN 번호로 진단에 참여할 수 있습니다.
          </p>

          {!identified ? (
            <div className="mt-8 rounded-[8px] border border-[var(--gi-hairline)] bg-[var(--gi-canvas)] p-6">
              <Field label="참여 PIN" hint="초대 이메일로 받은 6자리 숫자를 입력하세요" required>
                <Input
                  value={pin}
                  onChange={(v) => setPin(v.replace(/\D/g, "").slice(0, 6))}
                  placeholder="예: 716284"
                  type="text"
                />
              </Field>
              {error && <p className="mt-2 text-[12.5px] text-[var(--gi-danger-deep)]">{error}</p>}
              <div className="mt-5">
                <Button full size="lg" icon={<LockKey size={15} weight="bold" />} onClick={submit}>
                  확인
                </Button>
              </div>
            </div>
          ) : (
            <div className="gi-enter mt-8 space-y-4">
              <div className="rounded-[8px] border border-[var(--gi-hairline)] bg-[var(--gi-canvas)] p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[12.5px] text-[var(--gi-mute)]">
                      {PARTICIPANT_DEMO.name}, {PARTICIPANT_DEMO.department} / {PARTICIPANT_DEMO.rank}
                    </p>
                    <p className="mt-1 text-[16px] font-semibold tracking-[-0.02em] text-[var(--gi-ink)]">
                      {activeAssessment.name}
                    </p>
                  </div>
                  <Badge tone="info">참여 가능</Badge>
                </div>
                <p className="mt-3 text-[13px] leading-5 text-[var(--gi-body)]">{activeAssessment.description}</p>
                <div className="mt-4 flex flex-wrap gap-4 border-t border-[var(--gi-hairline)] pt-4 text-[12.5px] text-[var(--gi-body)]">
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} className="text-[var(--gi-mute)]" />
                    <span className="gi-mono">{activeAssessment.startDate} ~ {activeAssessment.endDate}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle size={13} className="text-[var(--gi-mute)]" />
                    약 5분 소요, 10문항
                  </span>
                </div>
                <div className="mt-5">
                  <Button full size="lg" icon={<ArrowRight size={15} weight="bold" />} onClick={() => onNavigate("survey")}>
                    진단 참여하기
                  </Button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigate("result")}
                className="mx-auto flex w-fit items-center gap-1 text-[13px] font-medium text-[var(--gi-accent-deep)] underline underline-offset-2"
              >
                지난 진단 결과 보기
              </button>
            </div>
          )}
        </div>
      </div>
    </ParticipantShell>
  );
}
