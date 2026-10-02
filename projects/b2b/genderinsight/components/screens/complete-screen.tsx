"use client";

import { CheckCircle } from "@phosphor-icons/react";
import { Button } from "@/projects/b2b/genderinsight/components/ui";
import { ParticipantShell } from "@/projects/b2b/genderinsight/components/layout/participant-shell";
import { PARTICIPANT_DEMO } from "@/projects/b2b/genderinsight/lib/mock-data";
import type { ParticipantScreen } from "@/projects/b2b/genderinsight/lib/navigation";

export function CompleteScreen({ onNavigate }: { onNavigate: (next: ParticipantScreen) => void }) {
  return (
    <ParticipantShell>
      <div className="relative">
        <div className="gi-spot" />
        <div className="gi-enter flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--gi-accent-soft)]">
            <CheckCircle size={26} weight="fill" className="text-[var(--gi-accent-deep)]" />
          </span>
          <h1 className="mt-5 text-[22px] font-semibold leading-8 tracking-[-0.03em] text-[var(--gi-ink)]">
            제출이 완료되었습니다
          </h1>
          <p className="mt-2 max-w-[46ch] text-[14px] leading-6 text-[var(--gi-body)]">
            {PARTICIPANT_DEMO.name}님, 진단에 참여해주셔서 감사합니다. 응답은 익명으로 처리되어
            개인 식별 없이 조직 통계에만 반영됩니다.
          </p>

          <div className="mt-8 w-full rounded-[8px] border border-[var(--gi-hairline)] bg-[var(--gi-soft)] p-5 text-left">
            <p className="text-[13px] font-medium text-[var(--gi-ink)]">다음 안내</p>
            <ul className="mt-2 space-y-1.5">
              {[
                "개인 결과와 AI 요약은 지금 바로 확인할 수 있습니다",
                "조직 단위 통계는 최소 응답 인원 기준을 충족한 뒤 관리자에게 공개됩니다",
                "개인 리포트 PDF는 마이페이지에서 다시 내려받을 수 있습니다",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-[12.5px] leading-5 text-[var(--gi-body)]">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--gi-accent)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 w-full space-y-2.5">
            <Button full size="lg" onClick={() => onNavigate("result")}>
              결과 확인하기
            </Button>
            <Button full variant="ghost" onClick={() => onNavigate("login")}>
              로그인 화면으로
            </Button>
          </div>
        </div>
      </div>
    </ParticipantShell>
  );
}
