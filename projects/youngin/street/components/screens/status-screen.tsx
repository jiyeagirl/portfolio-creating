"use client";

import { useState } from "react";
import { CaretRight, CheckCircle, Coins, MapTrifold, X } from "@phosphor-icons/react";

import {
  Card,
  GroupList,
  GroupRow,
  SectionTitle,
  StatTile,
  StatusBadge,
  StatusTrack,
  TypeBadge,
  staggerVar,
} from "@/projects/youngin/street/components/ui";
import {
  CITIZEN,
  DRAFT,
  HAZARD_BY_KEY,
  MY_REPORTS,
  REPORTS,
  STATUS_META,
} from "@/projects/youngin/street/lib/mock-data";
import type { Report } from "@/projects/youngin/street/lib/types";

export function StatusScreen({
  justSubmitted,
  onGoMap,
}: {
  /** 제보하기 화면에서 막 넘어왔는지. 접수 완료 안내를 맨 위에 얹는다. */
  justSubmitted: boolean;
  onGoMap: () => void;
}) {
  const [detailId, setDetailId] = useState<string | null>(null);
  const detail = REPORTS.find((r) => r.id === detailId) ?? null;
  const submitted = REPORTS[0];

  return (
    <div className="relative h-[852px] w-full overflow-hidden bg-[var(--st-parchment)]">
      {/* 상태바 뒤를 막는 불투명 판. 스크롤한 콘텐츠가 시각 아래로 지나가면 읽을 수
          없게 되므로 덮는다. backdrop-blur를 쓰지 않는 이유는 design.md 참고. */}
      <div className="absolute inset-x-0 top-0 z-20 h-[59px] bg-[var(--st-parchment)]" />
      <div className="h-full overflow-y-auto pb-[104px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="st-enter px-5 pt-[71px]">
          {justSubmitted ? (
            <>
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--st-accent-soft)]">
                <CheckCircle size={32} weight="fill" color="var(--st-accent)" />
              </span>
              <h1 className="mt-4 text-[28px] font-semibold leading-[34px] tracking-[-0.4px] text-[var(--st-ink)]">
                제보가 접수되었습니다
              </h1>
              <p className="mt-2 text-[15px] leading-[22px] tracking-[-0.3px] text-[var(--st-ink-48)]">
                담당 부서가 현장을 확인한 뒤 처리 결과를 알려 드립니다. 아래에서 진행 상황을
                직접 확인할 수 있습니다.
              </p>
            </>
          ) : (
            <>
              <p className="text-[12px] font-semibold leading-[16px] text-[var(--st-accent)]">
                제보 완료 및 처리 현황
              </p>
              <h1 className="mt-1 text-[28px] font-semibold leading-[34px] tracking-[-0.4px] text-[var(--st-ink)]">
                내 제보
              </h1>
              <p className="mt-2 text-[15px] leading-[22px] tracking-[-0.3px] text-[var(--st-ink-48)]">
                {CITIZEN.name}님이 {CITIZEN.district}에서 올린 제보의 처리 상황입니다.
              </p>
            </>
          )}

          {/* 접수된 제보 카드 */}
          <Card className="mt-6 overflow-hidden">
            <div className="flex gap-3.5 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={submitted.photo}
                alt={DRAFT.photoCaption}
                className="h-[84px] w-[84px] shrink-0 rounded-[11px] object-cover"
              />
              <div className="min-w-0 flex-1">
                <TypeBadge type={submitted.type} />
                <h2 className="mt-2 text-[17px] font-semibold leading-[22px] tracking-[-0.374px] text-[var(--st-ink)]">
                  {submitted.title}
                </h2>
                <p className="mt-1 text-[14px] leading-[20px] tracking-[-0.224px] text-[var(--st-ink-48)]">
                  {submitted.address}
                </p>
              </div>
            </div>

            <div className="border-t border-[var(--st-divider)] px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[14px] leading-[20px] tracking-[-0.224px] text-[var(--st-ink-48)]">
                  접수번호
                </span>
                <span className="st-num text-[17px] font-semibold leading-[25px] tracking-[-0.374px] text-[var(--st-ink)]">
                  {DRAFT.code}
                </span>
              </div>
              <div className="mt-1.5 flex items-center justify-between gap-3">
                <span className="text-[14px] leading-[20px] tracking-[-0.224px] text-[var(--st-ink-48)]">
                  접수일시
                </span>
                <span className="st-num text-[14px] leading-[20px] tracking-[-0.224px] text-[var(--st-ink-80)]">
                  {DRAFT.receivedAt}
                </span>
              </div>
            </div>

            <div className="border-t border-[var(--st-divider)] px-4 pb-4 pt-4">
              <StatusTrack status={submitted.status} />
              <p className="mt-3.5 rounded-[11px] bg-[var(--st-parchment)] px-3.5 py-2.5 text-[13px] leading-[19px] text-[var(--st-ink-80)]">
                {STATUS_META[submitted.status].caption}
              </p>
            </div>
          </Card>

          {/* 담당 부서 검토 안내 */}
          <section className="mt-7">
            <SectionTitle
              title="담당 부서 검토"
              caption="접수된 제보는 유형에 따라 담당 부서로 자동 배정됩니다."
            />
            <GroupList>
              <GroupRow label="담당 부서" value={DRAFT.department} />
              <GroupRow label="문의" value={<span className="st-num">{DRAFT.departmentPhone}</span>} />
              <GroupRow label="현장 확인 예정" value={DRAFT.expectedDays} last />
            </GroupList>
          </section>

          {/* 시티포인트 */}
          <section className="mt-7">
            <SectionTitle title="시티포인트" caption="승인된 제보에만 지급됩니다." />
            <Card className="p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--st-accent-soft)]">
                  <Coins size={20} weight="fill" color="var(--st-accent)" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] leading-[22px] tracking-[-0.3px] text-[var(--st-ink)]">
                    이번 제보는 중복 여부 확인 후 승인되면{" "}
                    <span className="st-num font-semibold">{DRAFT.expectedPoints}P</span>가 지급됩니다.
                  </p>
                  <p className="mt-1 text-[12px] leading-[16px] text-[var(--st-ink-48)]">
                    포인트는 용인시 시티포인트 가맹점과 캠페인 리워드로 사용할 수 있습니다.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-3 border-t border-[var(--st-divider)] pt-3.5">
                <StatTile
                  label="보유 포인트"
                  value={CITIZEN.points.toLocaleString("ko-KR")}
                  unit="P"
                  tone="var(--st-accent)"
                />
                <StatTile label="승인된 제보" value={`${CITIZEN.approved}`} unit="건" />
                <StatTile label="전체 제보" value={`${CITIZEN.totalReports}`} unit="건" />
              </div>
            </Card>
          </section>

          {/* 내 제보 목록 */}
          <section className="mt-7">
            <SectionTitle
              title="내 제보 목록"
              caption={`처리 중 ${MY_REPORTS.filter((r) => r.status !== "done").length}건, 완료 ${
                MY_REPORTS.filter((r) => r.status === "done").length
              }건`}
              right={
                <button
                  type="button"
                  onClick={onGoMap}
                  className="flex shrink-0 items-center gap-1 text-[13px] font-semibold text-[var(--st-accent)] transition-transform duration-200 active:scale-95"
                >
                  <MapTrifold size={15} weight="fill" />
                  지도에서 보기
                </button>
              }
            />
            <div className="flex flex-col gap-2.5">
              {MY_REPORTS.map((report, i) => (
                <ReportRow
                  key={report.id}
                  report={report}
                  index={i}
                  onOpen={() => setDetailId(report.id)}
                />
              ))}
            </div>
          </section>

          <p className="mt-6 text-center text-[12px] leading-[18px] text-[var(--st-ink-48)]">
            제보해 주신 내용은 개인정보를 제외하고 우리 동네 보행 위험 지도에 공개됩니다.
          </p>
        </div>
      </div>

      {detail && <DetailSheet report={detail} onClose={() => setDetailId(null)} />}
    </div>
  );
}

function ReportRow({
  report,
  index,
  onOpen,
}: {
  report: Report;
  index: number;
  onOpen: () => void;
}) {
  return (
    <Card onClick={onOpen} ariaLabel={`${report.title} 처리 이력 보기`} className="st-stagger" style={staggerVar(index)}>
      <div className="flex items-center gap-3.5 p-3.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={report.photo}
          alt={report.title}
          className="h-[64px] w-[64px] shrink-0 rounded-[11px] object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <StatusBadge status={report.status} size="sm" />
            {report.points > 0 && (
              <span className="st-num text-[11px] font-semibold text-[var(--st-done)]">
                +{report.points}P
              </span>
            )}
          </div>
          <p className="mt-1.5 truncate text-[17px] font-semibold leading-[22px] tracking-[-0.374px] text-[var(--st-ink)]">
            {report.title}
          </p>
          <p className="st-num mt-0.5 truncate text-[12px] leading-[16px] text-[var(--st-ink-48)]">
            {report.code} | {HAZARD_BY_KEY[report.type].short} | {report.reportedAgo}
          </p>
        </div>
        <CaretRight size={16} color="var(--st-chip)" />
      </div>
    </Card>
  );
}

/** 제보 상세. 화면 박스 안쪽 오버레이라 fixed를 쓰지 않는다. */
function DetailSheet({ report, onClose }: { report: Report; onClose: () => void }) {
  return (
    <div className="absolute inset-0 z-40">
      <button
        type="button"
        aria-label="상세 닫기"
        onClick={onClose}
        className="absolute inset-0 bg-black/35"
      />
      <div className="st-sheet-in absolute inset-x-0 bottom-0 max-h-[720px] overflow-y-auto rounded-t-[18px] bg-[var(--st-surface)] pb-9 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-[var(--st-surface)] px-5 pb-3 pt-4">
          <span className="absolute left-1/2 top-2 h-[5px] w-9 -translate-x-1/2 rounded-full bg-[var(--st-chip)]" />
          <h2 className="mt-2 text-[21px] font-semibold leading-[25px] tracking-[-0.3px] text-[var(--st-ink)]">
            제보 상세
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="mt-2 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--st-parchment)] text-[var(--st-ink-48)] transition-transform duration-200 active:scale-95"
          >
            <X size={15} weight="bold" />
          </button>
        </div>

        <div className="px-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={report.photo}
            alt={report.title}
            className="h-[190px] w-full rounded-[11px] object-cover"
          />
          <div className="mt-3.5 flex items-center gap-2">
            <StatusBadge status={report.status} />
            <TypeBadge type={report.type} />
          </div>
          <h3 className="mt-2.5 text-[21px] font-semibold leading-[25px] tracking-[-0.3px] text-[var(--st-ink)]">
            {report.title}
          </h3>
          <p className="mt-1.5 text-[15px] leading-[22px] tracking-[-0.3px] text-[var(--st-ink-80)]">
            {report.detail}
          </p>

          <div className="mt-5">
            <StatusTrack status={report.status} />
          </div>

          <GroupList className="mt-5">
            <GroupRow label="접수번호" value={<span className="st-num">{report.code}</span>} />
            <GroupRow label="위치" value={report.address} sub={report.landmark} />
            <GroupRow label="담당 부서" value={report.department} />
            <GroupRow
              label="시티포인트"
              value={
                report.points > 0 ? (
                  <span className="st-num text-[var(--st-done)]">지급 완료 {report.points}P</span>
                ) : (
                  "승인 후 300P 지급 예정"
                )
              }
              last
            />
          </GroupList>

          <h4 className="mt-6 text-[17px] font-semibold leading-[22px] tracking-[-0.374px] text-[var(--st-ink)]">
            처리 이력
          </h4>
          <ol className="mt-3">
            {report.timeline.map((step, i) => {
              const meta = STATUS_META[step.status];
              const reached = step.at !== null;
              const last = i === report.timeline.length - 1;
              return (
                <li key={step.status} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className="mt-[3px] h-[13px] w-[13px] rounded-full"
                      style={{ background: reached ? meta.ink : "var(--st-hairline)" }}
                    />
                    {!last && (
                      <span
                        className="w-[2px] flex-1 rounded-full"
                        style={{ background: reached ? meta.ink : "var(--st-hairline)", opacity: 0.35 }}
                      />
                    )}
                  </div>
                  <div className={`min-w-0 flex-1 ${last ? "pb-1" : "pb-5"}`}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span
                        className="text-[15px] font-semibold leading-[22px] tracking-[-0.3px]"
                        style={{ color: reached ? "var(--st-ink)" : "var(--st-ink-48)" }}
                      >
                        {meta.label}
                      </span>
                      <span className="st-num shrink-0 text-[12px] leading-[16px] text-[var(--st-ink-48)]">
                        {step.at ?? "대기"}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[13px] leading-[19px] text-[var(--st-ink-48)]">
                      {step.note}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          <p className="st-num mt-4 text-[12px] leading-[16px] text-[var(--st-ink-48)]">
            같은 불편을 겪었어요 {report.agrees}명
          </p>
        </div>
      </div>
    </div>
  );
}
