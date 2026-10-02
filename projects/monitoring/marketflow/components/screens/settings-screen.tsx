"use client";

import { useMemo, useState } from "react";
import { ArrowClockwise, Key, Plus, Prohibit } from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  CardHead,
  Cell,
  DefList,
  Field,
  Input,
  Modal,
  PageHead,
  Row,
  SearchInput,
  Table,
  Tabs,
  Toggle,
} from "@/projects/monitoring/marketflow/components/ui";
import {
  activityLog,
  apiKeys as initialKeys,
  channelIntegrations as initialChannels,
  customers,
  teamUsers as initialUsers,
} from "@/projects/monitoring/marketflow/lib/mock-data";
import { CUSTOMER_TIER_TONE } from "@/projects/monitoring/marketflow/lib/navigation";

type Tab = "users" | "org" | "channels" | "keys" | "notify" | "logs";

const TABS: { key: Tab; label: string }[] = [
  { key: "users", label: "사용자 / 권한" },
  { key: "org", label: "조직 / 브랜드" },
  { key: "channels", label: "SNS 채널 연동" },
  { key: "keys", label: "API Key" },
  { key: "notify", label: "알림 설정" },
  { key: "logs", label: "로그 관리" },
];

const ROLE_TONE = {
  슈퍼관리자: "ink",
  운영관리자: "info",
  에디터: "neutral",
  뷰어: "neutral",
} as const;

export function SettingsScreen() {
  const [tab, setTab] = useState<Tab>("users");
  const [users, setUsers] = useState(initialUsers);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  const [channels, setChannels] = useState(initialChannels);
  const [keys, setKeys] = useState(initialKeys);
  const [logSearch, setLogSearch] = useState("");

  const [notifSettings, setNotifSettings] = useState({
    approval: true,
    workflowError: true,
    published: false,
    weeklyReport: true,
    newCustomer: true,
  });

  const filteredLogs = useMemo(
    () => activityLog.filter((l) => !logSearch || l.actor.includes(logSearch) || l.action.includes(logSearch) || l.target.includes(logSearch)),
    [logSearch],
  );

  function toggleUser(id: string) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: u.status === "disabled" ? "active" : "disabled" } : u)));
  }

  function toggleChannel(id: string) {
    setChannels((prev) =>
      prev.map((c) => (c.id === id ? { ...c, connected: !c.connected, status: !c.connected ? "정상" : "연동 안 됨" } : c)),
    );
  }

  function reauth(id: string) {
    setChannels((prev) => prev.map((c) => (c.id === id ? { ...c, status: "정상", lastSyncAt: "2025-09-08T09:32:00" } : c)));
  }

  function revokeKey(id: string) {
    setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, status: "revoked" } : k)));
  }

  function issueKey() {
    setKeys((prev) => [
      {
        id: `ak-new-${Date.now()}`,
        service: "신규 발급 API",
        keyMasked: `mf_new_${Math.random().toString(16).slice(2, 6)}••••••••`,
        createdAt: "2025-09-08",
        lastUsedAt: "-",
        status: "active",
      },
      ...prev,
    ]);
  }

  function sendInvite() {
    if (!inviteEmail.trim()) return;
    setUsers((prev) => [
      { id: `u-new-${Date.now()}`, name: inviteEmail.split("@")[0], email: inviteEmail, role: "뷰어", status: "invited", lastActiveAt: "-" },
      ...prev,
    ]);
    setInviteEmail("");
    setInviteOpen(false);
  }

  return (
    <div className="mf-enter flex flex-col gap-6">
      <PageHead
        eyebrow="SYSTEM SETTINGS"
        title="시스템 설정"
        desc="팀 계정과 권한, 조직 정보, 채널 연동, API Key, 알림, 운영 로그를 관리합니다."
      />

      <Tabs value={tab} items={TABS} onChange={setTab} />

      {tab === "users" && (
        <Card padded={false}>
          <div className="flex items-center justify-between p-5 pb-0">
            <CardHead title="팀 계정" desc={`총 ${users.length}명`} />
            <Button size="sm" icon={<Plus size={13} weight="bold" />} onClick={() => setInviteOpen(true)}>
              팀원 초대
            </Button>
          </div>
          <div className="p-5 pt-0">
            <Table head={["이름", "이메일", "역할", "상태", "최근 접속"]} align={["left", "left", "left", "left", "right"]} minWidth={640}>
              {users.map((u) => (
                <Row key={u.id}>
                  <Cell strong>{u.name}</Cell>
                  <Cell muted>{u.email}</Cell>
                  <Cell>
                    <Badge tone={ROLE_TONE[u.role]}>{u.role}</Badge>
                  </Cell>
                  <Cell>
                    <button
                      type="button"
                      onClick={() => toggleUser(u.id)}
                      className="inline-flex"
                      aria-label={u.status === "disabled" ? "계정 활성화" : "계정 비활성화"}
                    >
                      <Badge tone={u.status === "active" ? "ink" : u.status === "invited" ? "info" : "danger"}>
                        {u.status === "active" ? "활성" : u.status === "invited" ? "초대됨" : "비활성"}
                      </Badge>
                    </button>
                  </Cell>
                  <Cell align="right" mono muted>
                    {u.lastActiveAt === "-" ? "-" : u.lastActiveAt.slice(0, 16).replace("T", " ")}
                  </Cell>
                </Row>
              ))}
            </Table>
          </div>
        </Card>
      )}

      {tab === "org" && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_1fr]">
          <Card>
            <CardHead title="조직 정보" />
            <div className="flex flex-col gap-4">
              <Field label="조직명">
                <Input value="MarketFlow 운영팀" onChange={() => undefined} />
              </Field>
              <Field label="사업자 등록번호">
                <Input value="214-88-02371" onChange={() => undefined} />
              </Field>
              <Field label="대표 이메일">
                <Input value="ops@marketflow.example" onChange={() => undefined} />
              </Field>
              <Field label="대표 연락처">
                <Input value="02-6215-0830" onChange={() => undefined} />
              </Field>
            </div>
          </Card>
          <Card padded={false}>
            <div className="p-5 pb-0">
              <CardHead title="관리 중인 브랜드" desc={`총 ${customers.length}개사`} />
            </div>
            <ul className="max-h-[420px] divide-y divide-[var(--mf-hairline)] overflow-y-auto px-5 pb-3">
              {customers.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-[var(--mf-ink)]">{c.name}</p>
                    <p className="mt-0.5 truncate text-[11.5px] text-[var(--mf-mute)]">{c.industry}</p>
                  </div>
                  <Badge tone={CUSTOMER_TIER_TONE[c.tier]}>{c.tier}</Badge>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {tab === "channels" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {channels.map((c) => (
            <Card key={c.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[14px] font-medium text-[var(--mf-ink)]">{c.platform}</p>
                  <p className="mt-0.5 text-[12.5px] text-[var(--mf-mute)]">{c.accountName}</p>
                </div>
                <Badge tone={c.status === "정상" ? "ink" : c.status === "재인증 필요" ? "warn" : "neutral"}>{c.status}</Badge>
              </div>
              <DefList
                columns={1}
                items={[
                  { label: "팔로워", value: c.followers ? `${c.followers.toLocaleString("ko-KR")}명` : "-" },
                  { label: "마지막 동기화", value: c.lastSyncAt ? c.lastSyncAt.slice(0, 16).replace("T", " ") : "-" },
                ]}
              />
              <div className="mt-4 flex items-center justify-between border-t border-[var(--mf-hairline)] pt-4">
                <Toggle on={c.connected} onChange={() => toggleChannel(c.id)} label={`${c.platform} 연동`} />
                {c.status === "재인증 필요" && (
                  <Button size="sm" variant="secondary" icon={<ArrowClockwise size={13} />} onClick={() => reauth(c.id)}>
                    재인증
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "keys" && (
        <Card padded={false}>
          <div className="flex items-center justify-between p-5 pb-0">
            <CardHead title="API Key" desc="외부 서비스 연동에 사용되는 키를 관리합니다" />
            <Button size="sm" icon={<Key size={13} weight="bold" />} onClick={issueKey}>
              새 키 발급
            </Button>
          </div>
          <div className="p-5 pt-0">
            <Table head={["서비스", "키", "발급일", "마지막 사용", "상태", ""]} align={["left", "left", "left", "left", "left", "right"]} minWidth={680}>
              {keys.map((k) => (
                <Row key={k.id}>
                  <Cell strong>{k.service}</Cell>
                  <Cell mono muted>{k.keyMasked}</Cell>
                  <Cell muted mono>{k.createdAt}</Cell>
                  <Cell muted mono>{k.lastUsedAt === "-" ? "-" : k.lastUsedAt.slice(0, 16).replace("T", " ")}</Cell>
                  <Cell>
                    <Badge tone={k.status === "active" ? "ink" : "danger"}>{k.status === "active" ? "사용중" : "폐기됨"}</Badge>
                  </Cell>
                  <Cell align="right">
                    {k.status === "active" && (
                      <button
                        type="button"
                        onClick={() => revokeKey(k.id)}
                        className="inline-flex items-center gap-1 text-[12.5px] font-medium text-[var(--mf-danger-deep)] hover:underline"
                      >
                        <Prohibit size={13} />
                        폐기
                      </button>
                    )}
                  </Cell>
                </Row>
              ))}
            </Table>
          </div>
        </Card>
      )}

      {tab === "notify" && (
        <Card>
          <CardHead title="알림 설정" desc="이메일과 슬랙으로 전송되는 알림을 관리합니다" />
          <ul className="flex flex-col divide-y divide-[var(--mf-hairline)]">
            {[
              { key: "approval" as const, label: "승인 대기 콘텐츠 알림", desc: "새로운 콘텐츠가 승인 대기 상태가 되면 알림" },
              { key: "workflowError" as const, label: "워크플로우 오류 알림", desc: "자동화 실행이 실패하면 즉시 알림" },
              { key: "published" as const, label: "발행 완료 알림", desc: "콘텐츠가 채널에 발행되면 알림" },
              { key: "weeklyReport" as const, label: "주간 리포트 이메일", desc: "매주 월요일 오전 콘텐츠 성과 요약 발송" },
              { key: "newCustomer" as const, label: "신규 고객 등록 알림", desc: "신규 고객사가 등록되면 운영팀에 알림" },
            ].map((item) => (
              <li key={item.key} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-[13.5px] font-medium text-[var(--mf-ink)]">{item.label}</p>
                  <p className="mt-0.5 text-[12px] text-[var(--mf-mute)]">{item.desc}</p>
                </div>
                <Toggle
                  on={notifSettings[item.key]}
                  onChange={() => setNotifSettings((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                  label={item.label}
                />
              </li>
            ))}
          </ul>
        </Card>
      )}

      {tab === "logs" && (
        <Card padded={false}>
          <div className="flex flex-col gap-3 p-5 pb-0 sm:flex-row sm:items-end sm:justify-between">
            <CardHead title="운영 로그" desc={`최근 ${filteredLogs.length}건`} />
            <div className="w-full sm:w-[280px]">
              <SearchInput value={logSearch} onChange={setLogSearch} placeholder="담당자, 액션, 대상 검색" />
            </div>
          </div>
          <div className="p-5 pt-3">
            <Table head={["일시", "담당", "액션", "대상"]} align={["left", "left", "left", "left"]} minWidth={640}>
              {filteredLogs.map((l) => (
                <Row key={l.id}>
                  <Cell mono muted nowrap>
                    {l.at.slice(0, 16).replace("T", " ")}
                  </Cell>
                  <Cell strong>{l.actor}</Cell>
                  <Cell muted>{l.action}</Cell>
                  <Cell muted>{l.target}</Cell>
                </Row>
              ))}
            </Table>
          </div>
        </Card>
      )}

      <Modal
        open={inviteOpen}
        title="팀원 초대"
        onClose={() => setInviteOpen(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setInviteOpen(false)}>취소</Button>
            <Button onClick={sendInvite}>초대 보내기</Button>
          </div>
        }
      >
        <Field label="이메일" required>
          <Input value={inviteEmail} onChange={setInviteEmail} placeholder="teammate@marketflow.example" />
        </Field>
      </Modal>
    </div>
  );
}
