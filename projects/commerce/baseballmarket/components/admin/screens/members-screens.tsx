"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Cell,
  DefList,
  DetailPanel,
  Pagination,
  Row,
  SearchInput,
  Select,
  Stat,
  Table,
  TeamMark,
} from "@/projects/commerce/baseballmarket/components/ui";
import {
  DISPUTES,
  KRW,
  LISTINGS,
  MEMBERS,
  SETTLEMENTS,
  seller,
  teamLabel,
} from "@/projects/commerce/baseballmarket/lib/mock-data";

/* 회원 / 거래 섹션의 4개 뷰. */

export function MemberTableScreen() {
  const [q, setQ] = useState("");
  const [sanction, setSanction] = useState("전체");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);

  const rows = MEMBERS.filter(
    (m) =>
      (sanction === "전체" || m.sanction === sanction) &&
      (!q || m.nickname.includes(q) || m.realName.includes(q)),
  );
  const sel = rows.find((m) => m.id === selected) ?? null;

  return (
    <div className="flex flex-col gap-5 xl:flex-row">
      <div className="min-w-0 flex-1">
        <div className="mb-4 flex flex-wrap items-center gap-2.5">
          <div className="w-full sm:w-[280px]">
            <SearchInput value={q} onChange={setQ} placeholder="닉네임 또는 이름" />
          </div>
          <div className="w-[152px]">
            <Select
              value={sanction}
              onChange={setSanction}
              options={["전체", "없음", "경고", "7일 정지", "영구 정지"]}
            />
          </div>
          <span className="bm-num ml-auto text-[13px] text-[var(--bm-muted)]">{rows.length}명</span>
        </div>

        {/* 디테일 패널과 나란히 서므로 5열 640px 예산 (design.md 표 밀도 절).
            거래 횟수와 매너 점수를 한 셀 2줄로 접었다. */}
        <Table
          head={["회원", "응원 구단", "거래 / 매너", "신고", "제재"]}
          minWidth={640}
        >
          {rows.map((m) => (
            <Row key={m.id} onClick={() => setSelected(m.id)} active={selected === m.id}>
              <Cell strong>
                <span className="block">{m.nickname}</span>
                <span className="block text-[12px] font-normal text-[var(--bm-muted)]">
                  {m.realName}
                </span>
              </Cell>
              <Cell>
                <span className="flex items-center gap-2">
                  <TeamMark id={m.team} size={22} />
                  <span className="truncate text-[13px]">{teamLabel(m.team)}</span>
                </span>
              </Cell>
              <Cell num>
                <span className="block text-[12px] text-[var(--bm-muted)]">{m.trades}회 거래</span>
                <span
                  className="block font-semibold"
                  style={{ color: m.mannerScore < 35 ? "var(--bm-error-deep)" : "var(--bm-ink)" }}
                >
                  {m.mannerScore}
                </span>
              </Cell>
              <Cell num>{m.reports}</Cell>
              <Cell>
                <Badge
                  tone={
                    m.sanction === "없음"
                      ? "success"
                      : m.sanction === "경고"
                        ? "warning"
                        : "danger"
                  }
                >
                  {m.sanction}
                </Badge>
              </Cell>
            </Row>
          ))}
        </Table>
        <Pagination page={page} total={3} onChange={setPage} />
      </div>

      {sel && (
        <DetailPanel
          title={sel.nickname}
          sub={`${sel.realName} | ${teamLabel(sel.team)}`}
          onClose={() => setSelected(null)}
          foot={
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" full size="sm">
                경고 발송
              </Button>
              <Button variant="danger" full size="sm">
                계정 정지
              </Button>
            </div>
          }
        >
          <DefList
            rows={[
              { label: "연락처", value: <span className="bm-num">{sel.phone}</span> },
              { label: "가입일", value: <span className="bm-num">{sel.joinedAt}</span> },
              { label: "거래 횟수", value: <span className="bm-num">{sel.trades}회</span> },
              { label: "매너 점수", value: <span className="bm-num">{sel.mannerScore}</span> },
              { label: "누적 신고", value: <span className="bm-num">{sel.reports}건</span> },
              { label: "현재 제재", value: sel.sanction },
            ]}
          />
          <div>
            <p className="mb-2.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--bm-muted)]">
              제재 이력
            </p>
            {sel.reports === 0 ? (
              <p className="text-[13px] leading-[20px] text-[var(--bm-muted)]">제재 이력이 없습니다.</p>
            ) : (
              <ul className="space-y-2.5">
                <li className="rounded-[6px] bg-[var(--bm-surface)] p-3">
                  <p className="text-[13px] font-medium leading-[19px] text-[var(--bm-body-strong)]">
                    정가 초과 매물 반복 등록
                  </p>
                  <p className="bm-num mt-0.5 text-[12px] leading-[17px] text-[var(--bm-muted)]">
                    2026-08-22 | 경고
                  </p>
                </li>
                <li className="rounded-[6px] bg-[var(--bm-surface)] p-3">
                  <p className="text-[13px] font-medium leading-[19px] text-[var(--bm-body-strong)]">
                    외부 계좌 송금 유도
                  </p>
                  <p className="bm-num mt-0.5 text-[12px] leading-[17px] text-[var(--bm-muted)]">
                    2026-09-02 | 7일 정지
                  </p>
                </li>
              </ul>
            )}
          </div>
        </DetailPanel>
      )}
    </div>
  );
}

export function TradeHistoryScreen() {
  const [q, setQ] = useState("");
  const rows = LISTINGS.filter((l) => !q || l.title.includes(q));

  return (
    <div className="space-y-5">
      <div className="grid gap-2.5 sm:grid-cols-3">
        <Stat label="오늘 성사" value="412" unit="건" delta={3.4} />
        <Stat label="평균 거래액" value="68,400" unit="원" delta={1.2} />
        <Stat label="평균 성사 시간" value="2.4" unit="일" delta={-6.1} />
      </div>

      <div className="w-full sm:w-[280px]">
        <SearchInput value={q} onChange={setQ} placeholder="매물명 검색" />
      </div>

      <Table head={["매물", "카테고리", "거래액", "판매자", "지역", "상태"]}>
        {rows.map((l) => (
          <Row key={l.id}>
            <Cell strong className="max-w-[260px]">
              <span className="block truncate">{l.title}</span>
            </Cell>
            <Cell>{l.category}</Cell>
            <Cell num strong>
              {KRW(l.price)}
            </Cell>
            <Cell>{seller(l.sellerId).nickname}</Cell>
            <Cell>{l.dong}</Cell>
            <Cell>
              <Badge tone={l.status === "거래완료" ? "neutral" : "success"}>{l.status}</Badge>
            </Cell>
          </Row>
        ))}
      </Table>
    </div>
  );
}

export function SettlementsScreen() {
  const [state, setState] = useState("전체");
  const rows = SETTLEMENTS.filter((s) => state === "전체" || s.state === state);
  const pending = SETTLEMENTS.filter((s) => s.state === "정산대기");
  const pendingSum = pending.reduce((acc, s) => acc + s.amount - s.fee, 0);

  return (
    <div className="space-y-5">
      <div className="grid gap-2.5 sm:grid-cols-3">
        <Stat label="정산 대기" value={String(pending.length)} unit="건" />
        <Stat label="정산 대기 금액" value={pendingSum.toLocaleString("ko-KR")} unit="원" />
        <Stat label="이번 달 수수료" value="1,284,600" unit="원" delta={5.8} />
      </div>

      <div className="w-[152px]">
        <Select
          value={state}
          onChange={setState}
          options={["전체", "정산대기", "정산완료", "보류", "환불"]}
        />
      </div>

      <Table head={["매물", "구매자", "판매자", "거래액", "수수료", "상태"]}>
        {rows.map((s) => (
          <Row key={s.id}>
            <Cell strong className="max-w-[240px]">
              <span className="block truncate">{s.listingLabel}</span>
              <span className="bm-num block text-[12px] font-normal text-[var(--bm-muted)]">
                {s.requestedAt}
              </span>
            </Cell>
            <Cell>{s.buyer}</Cell>
            <Cell>{s.seller}</Cell>
            <Cell num strong>
              {KRW(s.amount)}
            </Cell>
            <Cell num>{KRW(s.fee)}</Cell>
            <Cell>
              <Badge
                tone={
                  s.state === "정산완료"
                    ? "success"
                    : s.state === "정산대기"
                      ? "warning"
                      : s.state === "환불"
                        ? "danger"
                        : "neutral"
                }
              >
                {s.state}
              </Badge>
            </Cell>
          </Row>
        ))}
      </Table>

      <Card tone="soft">
        <p className="text-[13px] font-semibold leading-[18px] text-[var(--bm-body-strong)]">
          정산 규칙
        </p>
        <ul className="mt-3 space-y-2 text-[13px] leading-[20px] text-[var(--bm-body)]">
          <li>구매 확정 후 1영업일에 판매자 계좌로 자동 이체합니다.</li>
          <li>수수료는 거래액의 3퍼센트이고 티켓은 정가 이하 거래에 한해 1.5퍼센트를 적용합니다.</li>
          <li>분쟁이 접수된 건은 자동 이체를 보류하고 조정 결과에 따라 처리합니다.</li>
        </ul>
      </Card>
    </div>
  );
}

export function DisputesScreen() {
  const [selected, setSelected] = useState<string | null>(DISPUTES[0].id);
  const sel = DISPUTES.find((d) => d.id === selected) ?? null;

  return (
    <div className="flex flex-col gap-5 xl:flex-row">
      <div className="min-w-0 flex-1 space-y-5">
        {/* 디테일 패널과 나란히 서므로 5열 640px 예산. 신청자와 상대를 한 셀로 접었다. */}
        <Table head={["매물", "신청자 / 상대", "사유", "금액", "상태"]} minWidth={640}>
          {DISPUTES.map((d) => (
            <Row key={d.id} onClick={() => setSelected(d.id)} active={selected === d.id}>
              <Cell strong className="max-w-[200px]">
                <span className="block truncate">{d.listingLabel}</span>
                <span className="bm-num block text-[12px] font-normal text-[var(--bm-muted)]">
                  {d.filedAt}
                </span>
              </Cell>
              <Cell>
                <span className="block truncate text-[13px]">{d.filedBy}</span>
                <span className="block truncate text-[12px] text-[var(--bm-muted)]">
                  {d.against}
                </span>
              </Cell>
              <Cell>{d.reason}</Cell>
              <Cell num strong>
                {KRW(d.amount)}
              </Cell>
              <Cell>
                <Badge
                  tone={
                    d.state === "접수"
                      ? "danger"
                      : d.state === "조정중"
                        ? "warning"
                        : "success"
                  }
                >
                  {d.state}
                </Badge>
              </Cell>
            </Row>
          ))}
        </Table>
      </div>

      {sel && (
        <DetailPanel
          title={sel.reason}
          sub={sel.listingLabel}
          onClose={() => setSelected(null)}
          foot={
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" full size="sm">
                판매자 정산
              </Button>
              <Button variant="danger" full size="sm">
                구매자 환불
              </Button>
            </div>
          }
        >
          <DefList
            rows={[
              { label: "신청자", value: sel.filedBy },
              { label: "상대", value: sel.against },
              { label: "금액", value: <span className="bm-num">{KRW(sel.amount)}</span> },
              { label: "접수일", value: <span className="bm-num">{sel.filedAt}</span> },
              { label: "상태", value: sel.state },
            ]}
          />
          <div className="rounded-[8px] bg-[var(--bm-surface)] p-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--bm-muted)]">
              조정 메모
            </p>
            <p className="mt-2 text-[13px] leading-[20px] text-[var(--bm-body)]">
              양측 사진을 대조한 결과 설명에 없던 흠집이 확인됩니다. 부분 환불 40퍼센트를 제안했고
              구매자 회신을 기다리는 중입니다.
            </p>
          </div>
        </DetailPanel>
      )}
    </div>
  );
}
