"use client";

import { useState } from "react";
import { PushPin } from "@phosphor-icons/react";
import { Badge, Button, Card, CardHead, Cell, Field, Input, PageHead, Row, Select, Table } from "@/projects/community/waypoint/components/admin/admin-ui";
import { NOTICES, PUSH_LOGS, WAYPOINT_SPOTS } from "@/projects/community/waypoint/lib/mock-data";

const SEGMENTS = ["전체 회원", "듀얼 인증 완료 전체", "가입 7일 이내 신규회원", "판교역 반경 1km 이용자"];

export function OpsScreen() {
  const [pushTitle, setPushTitle] = useState("");
  const [segment, setSegment] = useState(SEGMENTS[0]);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeBody, setNoticeBody] = useState("");
  const [notices, setNotices] = useState(NOTICES);

  function togglePin(id: string) {
    setNotices((prev) => prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));
  }

  return (
    <div className="space-y-8">
      <PageHead eyebrow="Operations" title="운영 관리" desc="푸시 알림 발송, 공지사항 등록, 웨이스팟 운영 현황을 관리합니다." />

      <Card>
        <CardHead title="푸시 알림 발송" desc="세그먼트를 선택해 발송하면 발송 이력에 기록됩니다." />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <Field label="알림 제목">
            <Input value={pushTitle} onChange={setPushTitle} placeholder="예: 내 동선 홈, 지금 확인해보세요" />
          </Field>
          <Field label="발송 대상">
            <Select value={segment} options={SEGMENTS} onChange={setSegment} />
          </Field>
          <Button disabled={!pushTitle.trim()}>발송하기</Button>
        </div>
        <div className="mt-5">
          <Table head={["제목", "발송 대상", "발송일시", "열람률"]} minWidth={640} align={["left", "left", "left", "right"]}>
            {PUSH_LOGS.map((log) => (
              <Row key={log.id}>
                <Cell strong>{log.title}</Cell>
                <Cell muted>{log.segment}</Cell>
                <Cell mono muted nowrap>{log.sentAt}</Cell>
                <Cell mono align="right">{log.openRate}%</Cell>
              </Row>
            ))}
          </Table>
        </div>
      </Card>

      <Card>
        <CardHead title="공지사항 관리" desc="상단 고정 여부를 관리합니다." />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <Field label="공지 제목">
            <Input value={noticeTitle} onChange={setNoticeTitle} placeholder="공지 제목" />
          </Field>
          <Field label="본문 요약">
            <Input value={noticeBody} onChange={setNoticeBody} placeholder="한 줄 요약" />
          </Field>
          <Button disabled={!noticeTitle.trim()}>공지 등록</Button>
        </div>
        <div className="mt-5 divide-y divide-[var(--wp-border)]">
          {notices.map((n) => (
            <div key={n.id} className="flex items-start gap-3 py-3.5">
              <button
                type="button"
                onClick={() => togglePin(n.id)}
                aria-pressed={n.pinned}
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] border transition-colors ${
                  n.pinned ? "border-[var(--wp-accent)] bg-[var(--wp-accent-soft)] text-[var(--wp-accent-ink)]" : "border-[var(--wp-border)] text-[var(--wp-muted)]"
                }`}
              >
                <PushPin size={13} weight={n.pinned ? "fill" : "regular"} />
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-[13.5px] font-medium text-[var(--wp-ink)]">{n.title}</p>
                  {n.pinned && <Badge tone="accent">고정</Badge>}
                </div>
                <p className="mt-1 line-clamp-2 text-[12.5px] leading-5 text-[var(--wp-muted)]">{n.body}</p>
                <p className="mt-1 wp-mono text-[11px] text-[var(--wp-muted)]">{n.publishedAt}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHead title="웨이스팟 관리" desc="자동 제안된 웨이스팟의 안전도와 혼잡도 데이터를 확인합니다." />
        <Table head={["이름", "유형", "주소", "안전도", "혼잡도", "즐겨찾기"]} minWidth={700} align={["left", "left", "left", "right", "center", "center"]}>
          {WAYPOINT_SPOTS.map((s) => (
            <Row key={s.id}>
              <Cell strong>{s.name}</Cell>
              <Cell muted>{s.type}</Cell>
              <Cell muted>{s.address}</Cell>
              <Cell mono align="right">{s.safetyScore}</Cell>
              <Cell align="center">
                <Badge tone={s.crowdLevel === "여유" ? "success" : s.crowdLevel === "보통" ? "accent" : "warn"}>{s.crowdLevel}</Badge>
              </Cell>
              <Cell align="center">{s.favorite ? <Badge tone="accent">즐겨찾기 다수</Badge> : <span className="text-[var(--wp-muted)]">-</span>}</Cell>
            </Row>
          ))}
        </Table>
      </Card>
    </div>
  );
}
