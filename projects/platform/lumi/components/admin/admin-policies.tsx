"use client";

import { useState } from "react";
import { Check, Clock, PencilSimple, Plus } from "@phosphor-icons/react";
import {
  EVENTS,
  FAQS,
  NOTICES,
  PASS_PRODUCTS,
  POLICY_FEE,
  POLICY_TIME,
  formatWon,
} from "@/projects/platform/lumi/lib/mock-data";
import type { PassTier } from "@/projects/platform/lumi/lib/types";
import {
  FilterChips,
  PageHead,
  Panel,
  Tag,
} from "@/projects/platform/lumi/components/admin/admin-ui";

type Section = "price" | "rule" | "notice" | "event" | "faq";

const PRICE_HISTORY = [
  {
    date: "2026.05.01",
    target: "Premium 60분",
    before: 78000,
    after: 82000,
    reason: "상담사 수수료 인하분 반영",
    by: "한서진",
  },
  {
    date: "2026.03.14",
    target: "Standard 30분",
    before: 42000,
    after: 44000,
    reason: "심야 운영 확대에 따른 조정",
    by: "노태윤",
  },
  {
    date: "2026.01.02",
    target: "Lite 15분",
    before: 22000,
    after: 24000,
    reason: "신년 시즌 수요 반영",
    by: "한서진",
  },
];

const SECTIONS: { key: Section; label: string }[] = [
  { key: "price", label: "상담권 가격" },
  { key: "rule", label: "상담 시간 · 수수료" },
  { key: "notice", label: "공지사항" },
  { key: "event", label: "이벤트" },
  { key: "faq", label: "FAQ" },
];

export function AdminPolicies() {
  const [section, setSection] = useState<Section>("price");
  const [prices, setPrices] = useState<Record<PassTier, number>>({
    lite: PASS_PRODUCTS[0].price,
    standard: PASS_PRODUCTS[1].price,
    premium: PASS_PRODUCTS[2].price,
  });
  const [saved, setSaved] = useState(false);
  const [exposed, setExposed] = useState<Record<string, boolean>>(
    Object.fromEntries(FAQS.map((f) => [f.id, f.exposed])),
  );

  return (
    <>
      <PageHead
        title="운영 정책 관리"
        description="상담권 가격과 시간 정책, 수수료율, 회원에게 노출되는 공지와 이벤트, FAQ를 관리합니다."
      />

      <div className="mb-4">
        <FilterChips<Section> value={section} onChange={setSection} options={SECTIONS} />
      </div>

      {section === "price" && (
        <Panel
          title="상담권 가격"
          note="저장하면 앱의 구매 화면과 신규 결제에 즉시 반영됩니다. 이미 판매된 상담권은 영향을 받지 않습니다."
          actions={
            <button
              type="button"
              onClick={() => setSaved(true)}
              className="flex items-center gap-1.5 rounded-xl bg-[var(--lm-accent)] px-4 py-2 text-[13px] font-bold text-[var(--lm-accent-fg)] active:translate-y-[1px]"
            >
              <Check size={13} weight="bold" />
              가격 저장
            </button>
          }
        >
          <div className="grid gap-4 p-5 lg:grid-cols-3">
            {PASS_PRODUCTS.map((pass) => {
              const price = prices[pass.tier];
              const perMinute = Math.round(price / pass.minutes);
              return (
                <div
                  key={pass.tier}
                  className="rounded-2xl border border-[var(--lm-border)] p-5"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="lm-num text-[15px] font-bold">
                      {pass.name} {pass.minutes}분
                    </h3>
                    <Tag tone="neutral">{pass.tier.toUpperCase()}</Tag>
                  </div>

                  <label className="mt-4 block">
                    <span className="text-[12.5px] font-semibold text-[var(--lm-muted)]">
                      판매가 (원)
                    </span>
                    <input
                      type="number"
                      value={price}
                      step={1000}
                      onChange={(e) => {
                        setPrices((prev) => ({ ...prev, [pass.tier]: Number(e.target.value) }));
                        setSaved(false);
                      }}
                      className="lm-num mt-1.5 w-full rounded-xl border border-[var(--lm-border)] bg-[var(--lm-canvas)] px-3.5 py-2.5 text-[15px] font-bold outline-none focus:border-[var(--lm-accent)]"
                    />
                  </label>

                  <dl className="lm-num mt-4 space-y-2 border-t border-[var(--lm-border)] pt-4 text-[12.5px]">
                    <div className="flex justify-between">
                      <dt className="text-[var(--lm-muted)]">정가</dt>
                      <dd>{formatWon(pass.listPrice)}원</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[var(--lm-muted)]">분당 단가</dt>
                      <dd className="font-semibold">{formatWon(perMinute)}원</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[var(--lm-muted)]">현재 판매가 대비</dt>
                      <dd
                        className={
                          price === pass.price
                            ? "text-[var(--lm-muted)]"
                            : "font-semibold text-[var(--lm-live)]"
                        }
                      >
                        {price === pass.price
                          ? "변경 없음"
                          : `${price > pass.price ? "+" : ""}${formatWon(price - pass.price)}원`}
                      </dd>
                    </div>
                  </dl>
                </div>
              );
            })}
          </div>
          {saved && (
            <p className="border-t border-[var(--lm-border)] px-5 py-3.5 text-[12.5px] font-semibold text-[var(--lm-success)]">
              가격이 저장되었습니다. 변경 이력은 정책 로그에 기록됩니다.
            </p>
          )}
        </Panel>
      )}

      {section === "price" && (
        <Panel className="mt-4" title="가격 변경 이력" note="최근 6개월">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-[var(--lm-border)] text-[11.5px] text-[var(--lm-muted)]">
                  <th className="px-5 py-3 font-semibold">적용일</th>
                  <th className="px-3 py-3 font-semibold">대상</th>
                  <th className="px-3 py-3 text-right font-semibold">변경 전</th>
                  <th className="px-3 py-3 text-right font-semibold">변경 후</th>
                  <th className="px-3 py-3 font-semibold">사유</th>
                  <th className="px-5 py-3 font-semibold">처리자</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--lm-border)]">
                {PRICE_HISTORY.map((row) => (
                  <tr key={`${row.date}-${row.target}`} className="text-[13px]">
                    <td className="lm-num px-5 py-3.5 font-semibold">{row.date}</td>
                    <td className="px-3 py-3.5">{row.target}</td>
                    <td className="lm-num px-3 py-3.5 text-right text-[var(--lm-muted)]">
                      {formatWon(row.before)}원
                    </td>
                    <td className="lm-num px-3 py-3.5 text-right font-semibold">
                      {formatWon(row.after)}원
                    </td>
                    <td className="px-3 py-3.5 text-[var(--lm-muted)]">{row.reason}</td>
                    <td className="px-5 py-3.5 text-[var(--lm-muted)]">{row.by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {section === "rule" && (
        <div className="grid gap-4 xl:grid-cols-2">
          <Panel title="상담 시간 정책" note="연결, 취소, 노쇼 판정 기준">
            <ul className="divide-y divide-[var(--lm-border)]">
              {POLICY_TIME.map((item) => (
                <li key={item.label} className="flex items-center gap-4 px-5 py-4">
                  <Clock size={15} className="shrink-0 text-[var(--lm-muted)]" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-bold">{item.label}</p>
                    <p className="mt-0.5 text-[12px] text-[var(--lm-muted)]">{item.note}</p>
                  </div>
                  <span className="lm-num text-[15px] font-bold">{item.value}</span>
                  <button
                    type="button"
                    aria-label={`${item.label} 수정`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--lm-muted)] transition-colors hover:bg-[var(--lm-surface)] hover:text-[var(--lm-ink)]"
                  >
                    <PencilSimple size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="수수료 정책" note="등급 조건을 충족하면 다음 정산 회차부터 적용됩니다">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] text-left">
                <thead>
                  <tr className="border-b border-[var(--lm-border)] text-[11.5px] text-[var(--lm-muted)]">
                    <th className="px-5 py-3 font-semibold">등급</th>
                    <th className="px-3 py-3 font-semibold">유지 조건</th>
                    <th className="px-5 py-3 text-right font-semibold">수수료</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--lm-border)]">
                  {POLICY_FEE.map((item) => (
                    <tr key={item.grade} className="text-[13px]">
                      <td className="px-5 py-3.5 font-bold">{item.grade}</td>
                      <td className="px-3 py-3.5 text-[var(--lm-muted)]">{item.condition}</td>
                      <td className="lm-num px-5 py-3.5 text-right text-[15px] font-bold">
                        {item.fee}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      )}

      {section === "notice" && (
        <Panel
          title="공지사항"
          note="앱 공지, 푸시, 상담사 공지를 한 곳에서 관리합니다"
          actions={
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-xl bg-[var(--lm-accent)] px-4 py-2 text-[13px] font-bold text-[var(--lm-accent-fg)]"
            >
              <Plus size={13} weight="bold" />
              공지 작성
            </button>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-[var(--lm-border)] text-[11.5px] text-[var(--lm-muted)]">
                  <th className="px-5 py-3 font-semibold">제목</th>
                  <th className="px-3 py-3 font-semibold">채널</th>
                  <th className="px-3 py-3 font-semibold">게시일</th>
                  <th className="px-3 py-3 text-right font-semibold">조회</th>
                  <th className="px-5 py-3 font-semibold">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--lm-border)]">
                {NOTICES.map((notice) => (
                  <tr key={notice.id} className="text-[13px] hover:bg-[var(--lm-surface)]">
                    <td className="px-5 py-3.5 font-semibold">{notice.title}</td>
                    <td className="px-3 py-3.5 text-[var(--lm-muted)]">{notice.channel}</td>
                    <td className="lm-num px-3 py-3.5 text-[var(--lm-muted)]">
                      {notice.publishedAt}
                    </td>
                    <td className="lm-num px-3 py-3.5 text-right">
                      {notice.views.toLocaleString("ko-KR")}
                    </td>
                    <td className="px-5 py-3.5">
                      <Tag
                        tone={
                          notice.state === "게시중"
                            ? "success"
                            : notice.state === "예약"
                              ? "accent"
                              : "neutral"
                        }
                      >
                        {notice.state}
                      </Tag>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {section === "event" && (
        <div className="grid gap-3 lg:grid-cols-2">
          {EVENTS.map((event) => (
            <article
              key={event.id}
              className="rounded-2xl border border-[var(--lm-border)] bg-[var(--lm-elevated)] p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-[15px] font-bold tracking-tight">{event.title}</h3>
                  <p className="lm-num mt-1 text-[12.5px] text-[var(--lm-muted)]">
                    {event.period}
                  </p>
                </div>
                <Tag
                  tone={
                    event.state === "진행중" ? "live" : event.state === "예정" ? "accent" : "neutral"
                  }
                >
                  {event.state}
                </Tag>
              </div>

              <dl className="lm-num mt-4 grid grid-cols-3 gap-3 border-t border-[var(--lm-border)] pt-4 text-[12.5px]">
                <div>
                  <dt className="text-[var(--lm-muted)]">혜택</dt>
                  <dd className="mt-1 font-semibold">{event.discount}</dd>
                </div>
                <div>
                  <dt className="text-[var(--lm-muted)]">대상</dt>
                  <dd className="mt-1 font-semibold">{event.target}</dd>
                </div>
                <div>
                  <dt className="text-[var(--lm-muted)]">참여</dt>
                  <dd className="mt-1 font-semibold">{event.joined.toLocaleString("ko-KR")}명</dd>
                </div>
              </dl>

              <div className="mt-4">
                <div className="lm-num flex items-center justify-between text-[12px]">
                  <span className="text-[var(--lm-muted)]">예산 소진율</span>
                  <span className="font-bold">{event.budgetUsed}%</span>
                </div>
                <span className="mt-1.5 block h-2 bg-[var(--lm-surface)]">
                  <span
                    className="block h-full rounded-r-[4px] bg-[var(--lm-chart-base)]"
                    style={{ width: `${event.budgetUsed}%` }}
                  />
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

      {section === "faq" && (
        <Panel title="FAQ" note="노출을 끄면 앱 고객센터에서 즉시 사라집니다">
          <ul className="divide-y divide-[var(--lm-border)]">
            {FAQS.map((faq) => (
              <li key={faq.id} className="flex items-start gap-4 px-5 py-4">
                <Tag tone="neutral">{faq.category}</Tag>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-bold">{faq.question}</p>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--lm-muted)]">
                    {faq.answer}
                  </p>
                  <p className="lm-num mt-1.5 text-[11.5px] text-[var(--lm-muted)]">
                    {faq.updatedAt} 수정
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={exposed[faq.id]}
                  aria-label={`${faq.question} 노출`}
                  onClick={() => setExposed((prev) => ({ ...prev, [faq.id]: !prev[faq.id] }))}
                  className={`relative mt-1 h-6 w-11 shrink-0 rounded-full transition-colors ${
                    exposed[faq.id] ? "bg-[var(--lm-accent)]" : "bg-[var(--lm-border)]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                      exposed[faq.id] ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </>
  );
}
