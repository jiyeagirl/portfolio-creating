"use client";

import { CaretRight } from "@phosphor-icons/react";
import { Badge, Card, CardHead, PageHead, Row, Cell, Stat, Table } from "@/projects/monitoring/petlive/components/admin/admin-ui";
import { ADMIN_DEVICES, ADMIN_MEMBERS, LOGS } from "@/projects/monitoring/petlive/lib/mock-data";
import { LOG_KIND_LABEL, dateTime, type AdminNavigate } from "@/projects/monitoring/petlive/lib/navigation";

export function DashboardScreen({ onNavigate }: { onNavigate: AdminNavigate }) {
  const online = ADMIN_DEVICES.filter((d) => d.status === "online").length;
  const error = ADMIN_DEVICES.filter((d) => d.status === "error").length;
  const offline = ADMIN_DEVICES.filter((d) => d.status === "offline").length;
  const active = ADMIN_MEMBERS.filter((m) => m.status === "active").length;

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow="관리자 콘솔"
        title="대시보드"
        desc="전체 회원과 디바이스 현황, 이벤트 발생 추이를 한눈에 확인하세요."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="전체 회원 수" value="1,284명" delta="+42" note="이번 달 신규" emphasis />
        <Stat label="등록된 웹캠" value="1,842대" delta="+96" note="이번 달 신규 등록" />
        <Stat label="온라인 디바이스" value="1,701대" note="전체의 92.3%" />
        <Stat label="오늘 이벤트 발생" value="356건" note="움직임 214 | 소리 142" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHead title="디바이스 상태 분포" desc="최근 등록된 디바이스 10대 표본 기준" />
          <ul className="space-y-3">
            {[
              { label: "온라인", count: online, tone: "positive" as const },
              { label: "연결 오류", count: error, tone: "negative" as const },
              { label: "오프라인", count: offline, tone: "neutral" as const },
            ].map((item) => (
              <li key={item.label} className="flex items-center justify-between">
                <Badge tone={item.tone} dot>
                  {item.label}
                </Badge>
                <span className="pl-mono text-[14px] font-semibold text-[var(--pl-ink)]">{item.count}대</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="lg:col-span-2" padded={false}>
          <div className="p-5 pb-0">
            <CardHead
              title="최근 로그"
              desc="이벤트, 로그인, 연결, 장애 로그를 통합해 보여줍니다."
              action={
                <button
                  type="button"
                  onClick={() => onNavigate("logs")}
                  className="flex items-center gap-0.5 text-[13px] font-medium text-[var(--pl-mute)] hover:text-[var(--pl-ink)]"
                >
                  전체보기 <CaretRight size={13} />
                </button>
              }
            />
          </div>
          <div className="px-5 pb-5">
            <Table head={["종류", "메시지", "주체", "시각"]} minWidth={520}>
              {LOGS.slice(0, 5).map((log) => (
                <Row key={log.id} onClick={() => onNavigate("logs")}>
                  <Cell>
                    <Badge tone={log.severity === "critical" ? "negative" : log.severity === "warn" ? "warning" : "info"}>
                      {LOG_KIND_LABEL[log.kind]}
                    </Badge>
                  </Cell>
                  <Cell strong>{log.message}</Cell>
                  <Cell muted>{log.actor}</Cell>
                  <Cell muted mono nowrap>
                    {dateTime(log.at)}
                  </Cell>
                </Row>
              ))}
            </Table>
          </div>
        </Card>
      </div>

      <Card padded={false}>
        <div className="p-5 pb-0">
          <CardHead
            title="최근 가입 회원"
            desc={`활성 회원 ${active}명 | 전체 표본 ${ADMIN_MEMBERS.length}명`}
            action={
              <button
                type="button"
                onClick={() => onNavigate("members")}
                className="flex items-center gap-0.5 text-[13px] font-medium text-[var(--pl-mute)] hover:text-[var(--pl-ink)]"
              >
                전체보기 <CaretRight size={13} />
              </button>
            }
          />
        </div>
        <div className="px-5 pb-5">
          <Table head={["이름", "이메일", "가입일", "상태", "플랜"]} minWidth={560}>
            {ADMIN_MEMBERS.slice(0, 5).map((member) => (
              <Row key={member.id} onClick={() => onNavigate("members", member.id)}>
                <Cell strong>{member.name}</Cell>
                <Cell muted>{member.email}</Cell>
                <Cell muted mono nowrap>
                  {dateTime(member.joinedAt)}
                </Cell>
                <Cell>
                  <Badge tone={member.status === "active" ? "positive" : "neutral"} dot>
                    {member.status === "active" ? "활성" : "비활성"}
                  </Badge>
                </Cell>
                <Cell>{member.plan}</Cell>
              </Row>
            ))}
          </Table>
        </div>
      </Card>
    </div>
  );
}
