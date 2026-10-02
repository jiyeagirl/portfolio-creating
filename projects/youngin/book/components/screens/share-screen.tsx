"use client";

import { Icon } from "@iconify/react";
import { FAMILY, LIBRARIES, READ_LOGS, THIS_MONTH, USER } from "@/projects/youngin/book/lib/mock-data";
import type { BookNavigate } from "@/projects/youngin/book/lib/navigation";
import { Stamp } from "@/projects/youngin/book/components/stamp";
import { Card, Chip, Divider, ScreenHeader } from "@/projects/youngin/book/components/ui";

const CHANNELS = [
  { id: "family", label: "가족에게", icon: "solar:users-group-rounded-bold" },
  { id: "message", label: "메시지", icon: "solar:chat-round-line-bold" },
  { id: "image", label: "이미지 저장", icon: "solar:gallery-download-bold" },
  { id: "link", label: "링크 복사", icon: "solar:link-bold" },
];

export function ShareScreen({ onNavigate }: { onNavigate: BookNavigate }) {
  const visited = LIBRARIES.filter((l) => l.visited);

  return (
    <div className="book-enter min-h-full pb-[42px]">
      <ScreenHeader
        title="독서기록 공유"
        subtitle="이번 달 기록을 카드로 만들었습니다"
        onBack={() => onNavigate("record")}
      />

      {/* 공유 카드 미리보기 */}
      <section className="px-5 pt-6">
        <div
          className="overflow-hidden rounded-[20px]"
          style={{
            background: "var(--bk-dark)",
            boxShadow: "0 1px 2px rgba(26,29,25,0.04), 0 12px 28px -12px rgba(26,29,25,0.16)",
          }}
        >
          <div className="px-5 pb-5 pt-6">
            <div className="flex items-center justify-between">
              <p className="text-[11.5px] font-semibold tracking-[0.04em] text-[#6FB891]">
                용인시 공공도서관 독서 챌린지
              </p>
              <Icon icon="solar:book-2-bold" width="18" height="18" color="#6FB891" />
            </div>

            <h2 className="mt-4 text-[24px] font-bold leading-[1.35] tracking-[-0.02em] text-[var(--bk-on-dark)]">
              {USER.name}님의
              <br />
              {THIS_MONTH.label} 독서기록
            </h2>

            <div className="mt-5 flex gap-3">
              {[
                { value: THIS_MONTH.visitedLibraries, unit: "곳", label: "방문" },
                { value: THIS_MONTH.reads, unit: "권", label: "완독" },
                { value: THIS_MONTH.badges, unit: "개", label: "배지" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex-1 rounded-[12px] px-3 py-3"
                  style={{ background: "var(--bk-dark-soft)" }}
                >
                  <p className="book-num text-[24px] font-bold leading-none tracking-[-0.02em] text-[var(--bk-on-dark)]">
                    {stat.value}
                    <span className="ml-0.5 text-[12px] font-semibold text-[var(--bk-on-dark-muted)]">
                      {stat.unit}
                    </span>
                  </p>
                  <p className="mt-1.5 text-[11px] font-medium text-[var(--bk-on-dark-muted)]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-center gap-1">
              {visited.map((library) => (
                <Stamp
                  key={library.id}
                  label={library.short}
                  seed={library.id}
                  size={62}
                  color="#6FB891"
                />
              ))}
            </div>

            <p className="mt-5 text-center text-[12.5px] leading-[1.6] text-[var(--bk-on-dark-muted)]">
              가장 오래 붙잡고 있던 책은
              <br />
              <span className="font-semibold text-[var(--bk-on-dark)]">
                {READ_LOGS[0].title}
              </span>
              이었습니다
            </p>
          </div>

          <div
            className="flex items-center justify-between px-5 py-3.5"
            style={{ background: "rgba(240,238,228,0.06)" }}
          >
            <span className="book-num text-[11px] font-medium text-[var(--bk-on-dark-muted)]">
              누적 스탬프 {USER.totalStamps}개 | {USER.level}
            </span>
            <span className="text-[11px] font-semibold text-[#6FB891]">yongin.go.kr/book</span>
          </div>
        </div>
      </section>

      {/* 공유 채널 */}
      <section className="px-5 pt-6">
        <div className="grid grid-cols-4 gap-2.5">
          {CHANNELS.map((channel) => (
            <button
              key={channel.id}
              type="button"
              className="flex flex-col items-center gap-2 rounded-[14px] border border-[var(--bk-line)] bg-[var(--bk-surface)] py-3.5 transition-transform duration-150 active:scale-[0.96]"
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ background: "var(--bk-accent-soft)" }}
              >
                <Icon icon={channel.icon} width="21" height="21" color="var(--bk-accent)" />
              </span>
              <span className="text-[11.5px] font-semibold text-[var(--bk-body)]">
                {channel.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 연결된 가족, 친구 */}
      <section className="px-5 pt-7">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="text-[17.5px] font-semibold tracking-[-0.01em] text-[var(--bk-ink)]">
              함께 읽는 사람
            </h2>
            <p className="mt-0.5 text-[13px] text-[var(--bk-muted)]">
              연결하면 서로의 이번 달 기록이 보입니다
            </p>
          </div>
        </div>

        <Card>
          {FAMILY.map((member, index) => (
            <div key={member.id}>
              {index > 0 && <Divider />}
              <div className="flex min-h-[64px] items-center gap-3 px-4 py-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[15px] font-bold"
                  style={{ background: "var(--bk-surface-soft)", color: "var(--bk-accent)" }}
                >
                  {member.initial}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14.5px] font-semibold text-[var(--bk-ink)]">
                    {member.name}
                  </p>
                  <p className="book-num mt-0.5 text-[12px] text-[var(--bk-muted)]">
                    {member.relation} | 올해 완독 {member.reads}권
                  </p>
                </div>
                <Chip tone="read">연결됨</Chip>
              </div>
            </div>
          ))}
          <Divider />
          <button
            type="button"
            className="flex min-h-[56px] w-full items-center gap-3 px-4 py-3 text-left transition-colors active:bg-[var(--bk-surface-soft)]"
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-dashed"
              style={{ borderColor: "var(--bk-line)" }}
            >
              <Icon icon="solar:add-circle-linear" width="20" height="20" color="var(--bk-accent)" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14.5px] font-semibold text-[var(--bk-accent)]">
                가족, 친구 초대하기
              </span>
              <span className="mt-0.5 block text-[12px] text-[var(--bk-muted)]">
                초대 코드를 보내면 함께 읽기 배지를 받습니다
              </span>
            </span>
          </button>
        </Card>
      </section>

      <section className="px-5 pt-6">
        <button
          type="button"
          onClick={() => onNavigate("record")}
          className="h-[52px] w-full rounded-[10px] text-[15.5px] font-semibold transition-transform duration-150 active:scale-[0.97]"
          style={{ background: "var(--bk-accent)", color: "var(--bk-on-accent)" }}
        >
          공유 카드 내보내기
        </button>
      </section>
    </div>
  );
}
