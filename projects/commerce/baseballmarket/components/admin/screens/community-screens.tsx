"use client";

import { useState } from "react";
import { Warning } from "@phosphor-icons/react";
import {
  Badge,
  BarChart,
  Button,
  Card,
  Cell,
  Chip,
  DefList,
  DetailPanel,
  Input,
  Row,
  SearchInput,
  Select,
  Stat,
  Table,
  Textarea,
} from "@/projects/commerce/baseballmarket/components/ui";
import {
  BANNED_KEYWORDS,
  BOARDS,
  MEMBERS,
  POSTS,
  RECENT_INQUIRIES,
  REPORTS,
} from "@/projects/commerce/baseballmarket/lib/mock-data";

/* 커뮤니티 / 신고 섹션의 5개 뷰. */

export function ReportQueueScreen() {
  const [reason, setReason] = useState("전체");
  const [state, setState] = useState("전체");
  const [selected, setSelected] = useState<string | null>(REPORTS[0].id);

  const rows = REPORTS.filter(
    (r) => (reason === "전체" || r.reason === reason) && (state === "전체" || r.state === state),
  );
  const sel = rows.find((r) => r.id === selected) ?? null;

  return (
    <div className="flex flex-col gap-5 xl:flex-row">
      <div className="min-w-0 flex-1 space-y-5">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="w-[168px]">
            <Select
              value={reason}
              onChange={setReason}
              options={["전체", "정가 초과", "허위 매물", "사기 의심", "금지 품목", "욕설 / 비방", "도배"]}
            />
          </div>
          <div className="w-[136px]">
            <Select
              value={state}
              onChange={setState}
              options={["전체", "미처리", "검토중", "처리완료", "반려"]}
            />
          </div>
          <span className="bm-num ml-auto text-[13px] text-[var(--bm-muted)]">{rows.length}건</span>
        </div>

        {/* 디테일 패널과 나란히 서므로 5열 640px 예산. 유형은 대상 셀 2번째 줄로 내렸다. */}
        <Table head={["신고 대상 / 유형", "사유", "신고자", "접수", "상태"]} minWidth={640}>
          {rows.map((r) => (
            <Row key={r.id} onClick={() => setSelected(r.id)} active={selected === r.id}>
              <Cell strong className="max-w-[200px]">
                <span className="block truncate">{r.targetLabel}</span>
                <span className="block text-[12px] font-normal text-[var(--bm-muted)]">
                  {r.target}
                </span>
              </Cell>
              <Cell>
                <Badge tone={r.reason === "사기 의심" ? "danger" : "neutral"}>{r.reason}</Badge>
              </Cell>
              <Cell>{r.reporter}</Cell>
              <Cell num>{r.createdAt.slice(5)}</Cell>
              <Cell>
                <Badge
                  tone={
                    r.state === "미처리"
                      ? "danger"
                      : r.state === "검토중"
                        ? "warning"
                        : r.state === "처리완료"
                          ? "success"
                          : "neutral"
                  }
                >
                  {r.state}
                </Badge>
              </Cell>
            </Row>
          ))}
        </Table>
      </div>

      {sel && (
        <DetailPanel
          title={sel.targetLabel}
          sub={`${sel.target} | ${sel.reason}`}
          onClose={() => setSelected(null)}
          foot={
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" full size="sm">
                반려
              </Button>
              <Button variant="danger" full size="sm">
                블라인드 처리
              </Button>
            </div>
          }
        >
          <DefList
            rows={[
              { label: "신고자", value: sel.reporter },
              { label: "접수 시각", value: <span className="bm-num">{sel.createdAt}</span> },
              { label: "처리 상태", value: sel.state },
            ]}
          />
          {sel.memo && (
            <div className="flex items-start gap-2.5 rounded-[8px] bg-[var(--bm-warning-soft)] p-3.5">
              <Warning size={15} weight="fill" className="mt-0.5 shrink-0 text-[var(--bm-warning-deep)]" />
              <p className="text-[13px] leading-[20px] text-[var(--bm-warning-deep)]">{sel.memo}</p>
            </div>
          )}
          <div>
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--bm-muted)]">
              처리 메모 작성
            </p>
            <Textarea value="" rows={4} placeholder="처리 근거를 남기면 이의 신청 시 참고합니다." />
          </div>
        </DetailPanel>
      )}
    </div>
  );
}

export function PostTableScreen() {
  const [q, setQ] = useState("");
  const [board, setBoard] = useState("전체");
  const rows = POSTS.filter(
    (p) =>
      (board === "전체" || BOARDS.find((b) => b.key === p.board)?.label === board) &&
      (!q || p.title.includes(q)),
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="w-full sm:w-[280px]">
          <SearchInput value={q} onChange={setQ} placeholder="제목 검색" />
        </div>
        <div className="w-[152px]">
          <Select
            value={board}
            onChange={setBoard}
            options={["전체", ...BOARDS.map((b) => b.label)]}
          />
        </div>
      </div>

      <Table head={["제목", "게시판", "작성자", "좋아요", "댓글", "작성"]}>
        {rows.map((p) => (
          <Row key={p.id}>
            <Cell strong className="max-w-[300px]">
              <span className="block truncate">{p.title}</span>
            </Cell>
            <Cell>{BOARDS.find((b) => b.key === p.board)?.label}</Cell>
            <Cell>{p.author}</Cell>
            <Cell num>{p.likes}</Cell>
            <Cell num>{p.comments}</Cell>
            <Cell>{p.createdAt}</Cell>
          </Row>
        ))}
      </Table>
    </div>
  );
}

export function FraudPatternScreen() {
  const suspects = MEMBERS.filter((m) => m.reports > 0).sort((a, b) => b.reports - a.reports);

  return (
    <div className="space-y-5">
      <div className="grid gap-2.5 sm:grid-cols-3">
        <Stat label="탐지된 의심 계정" value={String(suspects.length)} unit="명" />
        <Stat label="이번 주 신규 패턴" value="2" unit="건" />
        <Stat label="자동 정지 처리" value="1" unit="건" />
      </div>

      <div className="grid items-start gap-2.5 xl:grid-cols-2">
        <Card tone="canvas">
          <h3 className="text-[16px] font-semibold leading-[22px] text-[var(--bm-ink)]">
            신고 누적 상위 계정
          </h3>
          <p className="mt-1 mb-5 text-[13px] leading-[19px] text-[var(--bm-muted)]">
            누적 신고 건수 기준
          </p>
          <BarChart data={suspects.map((m) => ({ label: m.nickname, value: m.reports }))} unit="건" />
        </Card>

        <Card tone="canvas">
          <h3 className="text-[16px] font-semibold leading-[22px] text-[var(--bm-ink)]">
            탐지된 패턴
          </h3>
          <ul className="mt-4 space-y-3">
            {[
              { t: "동일 계좌 다중 계정", d: "서로 다른 3개 계정이 같은 정산 계좌를 등록했습니다.", tone: "danger" as const },
              { t: "가입 직후 고액 티켓 등록", d: "가입 24시간 내 정가 대비 80퍼센트 이상 높은 티켓을 등록했습니다.", tone: "danger" as const },
              { t: "외부 송금 유도 문구", d: "채팅에서 금칙어가 3회 이상 탐지됐습니다.", tone: "warning" as const },
              { t: "단기 반복 취소", d: "일주일 내 예약 후 취소를 4회 반복했습니다.", tone: "warning" as const },
            ].map((p) => (
              <li key={p.t} className="rounded-[8px] bg-[var(--bm-surface)] p-4">
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-semibold leading-[20px] text-[var(--bm-ink)]">
                    {p.t}
                  </p>
                  <span className="ml-auto">
                    <Badge tone={p.tone}>{p.tone === "danger" ? "높음" : "보통"}</Badge>
                  </span>
                </div>
                <p className="mt-1.5 text-[13px] leading-[20px] text-[var(--bm-body)]">{p.d}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Table head={["계정", "가입일", "거래", "매너 점수", "누적 신고", "현재 제재"]}>
        {suspects.map((m) => (
          <Row key={m.id}>
            <Cell strong>{m.nickname}</Cell>
            <Cell num>{m.joinedAt}</Cell>
            <Cell num>{m.trades}회</Cell>
            <Cell num>{m.mannerScore}</Cell>
            <Cell num>
              <span className="font-semibold text-[var(--bm-error-deep)]">{m.reports}</span>
            </Cell>
            <Cell>
              <Badge tone={m.sanction === "없음" ? "neutral" : "danger"}>{m.sanction}</Badge>
            </Cell>
          </Row>
        ))}
      </Table>
    </div>
  );
}

export function BannedWordsScreen() {
  const [word, setWord] = useState("");
  const [scope, setScope] = useState("전체");
  const rows = BANNED_KEYWORDS;

  return (
    <div className="space-y-5">
      <Card tone="card">
        <p className="text-[15px] font-semibold leading-[21px] text-[var(--bm-ink)]">금칙어 추가</p>
        <p className="mt-1 text-[13px] leading-[20px] text-[var(--bm-muted)]">
          채팅과 게시글에서 탐지되면 작성자에게 경고하고 운영팀 검토 목록에 올립니다.
        </p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          <div className="min-w-[200px] flex-1">
            <Input value={word} onChange={setWord} placeholder="금칙어" />
          </div>
          <div className="w-[136px]">
            <Select value={scope} onChange={setScope} options={["전체", "매물", "게시글"]} />
          </div>
          <Button>추가</Button>
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        {rows.map((k) => (
          <Chip key={k.id} label={`${k.word} ${k.hits}`} />
        ))}
      </div>

      <Table head={["금칙어", "적용 범위", "탐지 건수", "등록일", "등록자"]}>
        {rows.map((k) => (
          <Row key={k.id}>
            <Cell strong>{k.word}</Cell>
            <Cell>
              <Badge tone="neutral">{k.scope}</Badge>
            </Cell>
            <Cell num>{k.hits}</Cell>
            <Cell num>{k.addedAt}</Cell>
            <Cell>{k.addedBy}</Cell>
          </Row>
        ))}
      </Table>
    </div>
  );
}

export function InquiriesScreen() {
  const [tab, setTab] = useState<"inquiry" | "notice">("inquiry");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <Chip label="1:1 문의" active={tab === "inquiry"} onClick={() => setTab("inquiry")} />
        <Chip label="공지사항 등록" active={tab === "notice"} onClick={() => setTab("notice")} />
      </div>

      {tab === "inquiry" ? (
        <Table head={["제목", "작성자", "접수", "상태"]} minWidth={720}>
          {RECENT_INQUIRIES.map((q) => (
            <Row key={q.id}>
              <Cell strong className="max-w-[360px]">
                <span className="block truncate">{q.subject}</span>
              </Cell>
              <Cell>{q.user}</Cell>
              <Cell num>{q.at}</Cell>
              <Cell>
                <Badge tone={q.state === "미답변" ? "warning" : "success"}>{q.state}</Badge>
              </Cell>
            </Row>
          ))}
        </Table>
      ) : (
        <Card tone="canvas">
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-[13px] font-semibold leading-[18px] text-[var(--bm-body-strong)]">
                제목
              </p>
              <Input value={title} onChange={setTitle} placeholder="티켓 정가 기준표 v4.3 적용 안내" />
            </div>
            <div>
              <p className="mb-2 text-[13px] font-semibold leading-[18px] text-[var(--bm-body-strong)]">
                내용
              </p>
              <Textarea
                value={body}
                onChange={setBody}
                rows={7}
                placeholder="공지 내용을 입력하세요. 기준표 버전이 바뀌면 기존 매물이 재검사된다는 점을 함께 안내합니다."
              />
            </div>
            <div className="flex gap-2.5">
              <Button variant="secondary">임시저장</Button>
              <Button>공지 등록</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
