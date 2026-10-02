"use client";

import { useState } from "react";
import {
  Buildings,
  CheckCircle,
  DotsThree,
  PencilSimple,
  Plus,
  WarningCircle,
} from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  CardHead,
  Cell,
  DefList,
  Drawer,
  Field,
  Input,
  PageHead,
  Row,
  Select,
  Table,
  Tabs,
  Toggle,
} from "@/projects/b2b/assetflow/components/ui";
import {
  certifications,
  company,
  members,
  notificationPrefs,
} from "@/projects/b2b/assetflow/lib/mock-data";
import { won, type Navigate } from "@/projects/b2b/assetflow/lib/navigation";

type Tab = "company" | "members" | "certification" | "notification";

const PERMISSIONS = ["관리자", "자산 등록", "거래 승인", "정산 조회", "조회 전용"];

export function AccountScreen({ onNavigate }: { onNavigate: Navigate }) {
  const [tab, setTab] = useState<Tab>("company");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePermission, setInvitePermission] = useState(PERMISSIONS[1]);
  const [prefs, setPrefs] = useState(() =>
    Object.fromEntries(notificationPrefs.map((p) => [p.id, { email: p.email, sms: p.sms }])),
  );

  const needsRenewal = certifications.filter((c) => c.status !== "인증 완료").length;

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow="기업 정보"
        title="마이페이지"
        desc="기업 정보와 담당자 권한, 인증 서류, 알림 수신 설정을 관리합니다."
        actions={
          <Button variant="secondary" size="md" onClick={() => onNavigate("reports")}>
            거래 리포트
          </Button>
        }
      />

      <Card padded={false}>
        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[8px] bg-[var(--af-primary)] text-[var(--af-on-primary)]">
            <Buildings size={26} weight="bold" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[20px] font-semibold tracking-[-0.03em] text-[var(--af-ink)]">
                {company.name}
              </h2>
              <Badge tone="ink">{company.tier}</Badge>
              {needsRenewal > 0 && <Badge tone="warn">인증 갱신 {needsRenewal}건</Badge>}
            </div>
            <p className="af-mono mt-1.5 text-[13px] text-[var(--af-body)]">
              사업자등록번호 {company.bizNumber} | {company.joinedAt} 가입
            </p>
            <p className="mt-1 text-[13px] text-[var(--af-mute)]">{company.address}</p>
          </div>
          <Button variant="secondary" size="md" icon={<PencilSimple size={14} />}>
            정보 수정
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-px border-t border-[var(--af-hairline)] bg-[var(--af-hairline)] lg:grid-cols-4">
          {[
            { label: "누적 거래", value: "34건" },
            { label: "누적 매각액", value: won(151400000) },
            { label: "이번 달 검수", value: "3 / 8회" },
            { label: "적용 수수료", value: "2.4%" },
          ].map((item) => (
            <div key={item.label} className="bg-[var(--af-canvas)] px-6 py-4">
              <p className="text-[12.5px] text-[var(--af-mute)]">{item.label}</p>
              <p className="af-mono mt-1 text-[17px] font-semibold tracking-[-0.02em] text-[var(--af-ink)]">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { key: "company" as Tab, label: "기업 정보" },
          { key: "members" as Tab, label: "담당자 관리", count: members.length },
          { key: "certification" as Tab, label: "인증 정보", count: certifications.length },
          { key: "notification" as Tab, label: "알림 설정" },
        ]}
      />

      {tab === "company" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHead title="기본 정보" desc="사업자등록증 기준 정보입니다. 변경 시 재인증이 필요합니다." />
            <DefList
              columns={1}
              items={[
                { label: "기업명", value: company.name },
                { label: "사업자등록번호", value: <span className="af-mono">{company.bizNumber}</span> },
                { label: "대표자", value: company.ceo },
                { label: "업종", value: company.industry },
                { label: "임직원 수", value: company.employees },
                { label: "본사 주소", value: company.address },
                { label: "가입일", value: company.joinedAt },
                { label: "요금제", value: `${company.tier}, 수수료 2.4%` },
              ]}
            />
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHead title="자산관리 대표 담당자" desc="거래 확정과 계약 서명 권한을 가집니다." />
              <div className="flex items-center gap-3.5 rounded-[6px] border border-[var(--af-hairline)] bg-[var(--af-soft)] p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--af-primary)] text-[14px] font-medium text-[var(--af-on-primary)]">
                  {company.manager.name.slice(1)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-medium text-[var(--af-ink)]">
                    {company.manager.name}
                  </p>
                  <p className="text-[12.5px] text-[var(--af-mute)]">{company.manager.role}</p>
                </div>
                <Badge tone="ink">관리자</Badge>
              </div>
              <div className="mt-4">
                <DefList
                  columns={1}
                  items={[
                    { label: "이메일", value: <span className="af-mono">{company.manager.email}</span> },
                    { label: "연락처", value: <span className="af-mono">{company.manager.phone}</span> },
                  ]}
                />
              </div>
            </Card>

            <Card>
              <CardHead title="정산 계좌" desc="거래 완료 후 이 계좌로 정산됩니다." />
              <DefList
                columns={1}
                items={[
                  { label: "은행", value: "기업은행" },
                  { label: "계좌번호", value: <span className="af-mono">03X-XXXXXX-01-018</span> },
                  { label: "예금주", value: company.name },
                  {
                    label: "상태",
                    value: (
                      <span className="flex items-center justify-end gap-1.5 text-[var(--af-link-deep)]">
                        <CheckCircle size={13} weight="fill" />
                        인증 완료
                      </span>
                    ),
                  },
                ]}
              />
              <div className="mt-4">
                <Button variant="secondary" size="md" full>
                  정산 계좌 변경
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {tab === "members" && (
        <Card>
          <CardHead
            title="담당자 관리"
            desc="권한에 따라 접근할 수 있는 화면이 달라집니다. 관리자만 거래를 확정할 수 있습니다."
            action={
              <Button size="sm" icon={<Plus size={13} weight="bold" />} onClick={() => setInviteOpen(true)}>
                담당자 초대
              </Button>
            }
          />
          <Table
            head={["이름", "소속", "이메일", "권한", "최근 접속", "상태", ""]}
            align={["left", "left", "left", "left", "right", "left", "right"]}
          >
            {members.map((member) => (
              <Row key={member.id}>
                <Cell>
                  <span className="flex items-center gap-2.5">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11.5px] font-medium ${
                        member.active
                          ? "bg-[var(--af-primary)] text-[var(--af-on-primary)]"
                          : "bg-[var(--af-soft-2)] text-[var(--af-mute)]"
                      }`}
                    >
                      {member.name.slice(1)}
                    </span>
                    <span>
                      <span className="block text-[13px] font-medium text-[var(--af-ink)]">
                        {member.name}
                      </span>
                      <span className="block text-[11.5px] text-[var(--af-mute)]">{member.role}</span>
                    </span>
                  </span>
                </Cell>
                <Cell>{member.dept}</Cell>
                <Cell mono muted>
                  {member.email}
                </Cell>
                <Cell>
                  <Badge tone={member.permission === "관리자" ? "ink" : "neutral"}>
                    {member.permission}
                  </Badge>
                </Cell>
                <Cell align="right" mono muted nowrap>
                  {member.lastLogin}
                </Cell>
                <Cell>
                  <Badge tone={member.active ? "info" : "neutral"}>
                    {member.active ? "활성" : "비활성"}
                  </Badge>
                </Cell>
                <Cell align="right">
                  <button
                    type="button"
                    aria-label={`${member.name} 설정`}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] text-[var(--af-mute)] transition-colors hover:bg-[var(--af-soft-2)] hover:text-[var(--af-ink)]"
                  >
                    <DotsThree size={16} weight="bold" />
                  </button>
                </Cell>
              </Row>
            ))}
          </Table>
        </Card>
      )}

      {tab === "certification" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-start">
          <Card>
            <CardHead
              title="인증 정보"
              desc="인증이 만료되면 신규 자산 등록과 거래 확정이 제한됩니다."
              action={needsRenewal > 0 ? <Badge tone="warn">{needsRenewal}건 조치 필요</Badge> : undefined}
            />
            <Table head={["서류", "상태", "확인일", "비고", ""]} align={["left", "left", "right", "left", "right"]}>
              {certifications.map((cert) => {
                const ok = cert.status === "인증 완료";
                return (
                  <Row key={cert.label}>
                    <Cell strong>{cert.label}</Cell>
                    <Cell>
                      <span
                        className={`flex items-center gap-1.5 ${
                          ok ? "text-[var(--af-link-deep)]" : "text-[var(--af-warn-deep)]"
                        }`}
                      >
                        {ok ? (
                          <CheckCircle size={13} weight="fill" />
                        ) : (
                          <WarningCircle size={13} weight="fill" />
                        )}
                        {cert.status}
                      </span>
                    </Cell>
                    <Cell align="right" mono muted nowrap>
                      {cert.at}
                    </Cell>
                    <Cell muted>{cert.note}</Cell>
                    <Cell align="right">
                      <Button variant={ok ? "ghost" : "secondary"} size="sm">
                        {ok ? "보기" : "갱신"}
                      </Button>
                    </Cell>
                  </Row>
                );
              })}
            </Table>
          </Card>

          <Card soft>
            <CardHead title="인증 안내" desc="AssetFlow는 인증된 기업과 리셀러만 거래에 참여합니다." />
            <ul className="space-y-3">
              {[
                "사업자등록증과 법인 인감증명서는 가입 시 1회 확인합니다.",
                "정산 계좌는 법인 명의만 등록할 수 있습니다.",
                "전자세금계산서 담당자가 바뀌면 재등록이 필요합니다.",
                "인증 서류는 암호화 보관되며 거래 상대에게 공개되지 않습니다.",
              ].map((line) => (
                <li key={line} className="flex gap-2 text-[13px] leading-6 text-[var(--af-body)]">
                  <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[var(--af-hairline-strong)]" />
                  {line}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {tab === "notification" && (
        <Card padded={false}>
          <div className="border-b border-[var(--af-hairline)] px-6 py-5">
            <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--af-ink)]">
              알림 설정
            </h2>
            <p className="mt-1 text-[13px] text-[var(--af-mute)]">
              입찰 마감처럼 시간에 민감한 알림은 SMS를 함께 켜두는 것을 권장합니다.
            </p>
          </div>

          <div className="hidden items-center border-b border-[var(--af-hairline)] bg-[var(--af-soft)] px-6 py-2.5 sm:flex">
            <span className="flex-1 text-[12px] text-[var(--af-mute)]">알림 유형</span>
            <span className="w-20 text-center text-[12px] text-[var(--af-mute)]">이메일</span>
            <span className="w-20 text-center text-[12px] text-[var(--af-mute)]">SMS</span>
          </div>

          <ul>
            {notificationPrefs.map((pref) => (
              <li
                key={pref.id}
                className="flex flex-col gap-3 border-b border-[var(--af-hairline)] px-6 py-4 last:border-b-0 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-medium text-[var(--af-ink)]">{pref.label}</p>
                  <p className="mt-0.5 text-[12.5px] text-[var(--af-mute)]">{pref.detail}</p>
                </div>
                <div className="flex items-center gap-8 sm:gap-0">
                  <span className="flex w-20 justify-center sm:justify-center">
                    <Toggle
                      on={prefs[pref.id].email}
                      label={`${pref.label} 이메일 수신`}
                      onChange={() =>
                        setPrefs((prev) => ({
                          ...prev,
                          [pref.id]: { ...prev[pref.id], email: !prev[pref.id].email },
                        }))
                      }
                    />
                  </span>
                  <span className="flex w-20 justify-center">
                    <Toggle
                      on={prefs[pref.id].sms}
                      label={`${pref.label} SMS 수신`}
                      onChange={() =>
                        setPrefs((prev) => ({
                          ...prev,
                          [pref.id]: { ...prev[pref.id], sms: !prev[pref.id].sms },
                        }))
                      }
                    />
                  </span>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between gap-4 border-t border-[var(--af-hairline)] bg-[var(--af-soft)] px-6 py-4">
            <p className="text-[12.5px] leading-5 text-[var(--af-mute)]">
              수신 설정은 담당자별로 저장됩니다. 다른 담당자의 설정은 변경되지 않습니다.
            </p>
            <Button size="md">저장</Button>
          </div>
        </Card>
      )}

      <Drawer
        open={inviteOpen}
        title="담당자 초대"
        subtitle="초대 메일의 링크로 가입하면 자동으로 이 기업에 연결됩니다."
        onClose={() => setInviteOpen(false)}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" full onClick={() => setInviteOpen(false)}>
              취소
            </Button>
            <Button full onClick={() => setInviteOpen(false)} disabled={!inviteEmail.includes("@")}>
              초대 메일 보내기
            </Button>
          </div>
        }
      >
        <div className="space-y-5">
          <Field label="회사 이메일" required hint="atech-hq.co.kr 도메인 계정만 초대할 수 있습니다.">
            <Input
              value={inviteEmail}
              onChange={setInviteEmail}
              placeholder="name@atech-hq.co.kr"
              type="email"
            />
          </Field>
          <Field label="권한" required>
            <Select value={invitePermission} options={PERMISSIONS} onChange={setInvitePermission} />
          </Field>

          <div className="rounded-[6px] border border-[var(--af-hairline)] bg-[var(--af-soft)] p-4">
            <p className="text-[13px] font-medium text-[var(--af-ink)]">권한별 접근 범위</p>
            <ul className="mt-2.5 space-y-2">
              {[
                { k: "관리자", v: "전체, 거래 확정과 계약 서명 포함" },
                { k: "자산 등록", v: "자산 등록, 견적 확인, 검수 신청" },
                { k: "거래 승인", v: "입찰 비교와 거래 확정" },
                { k: "정산 조회", v: "거래 문서와 정산 내역 조회" },
                { k: "조회 전용", v: "대시보드와 리포트만 조회" },
              ].map((line) => (
                <li key={line.k} className="flex gap-3 text-[12.5px] leading-5">
                  <span className="w-16 shrink-0 font-medium text-[var(--af-ink)]">{line.k}</span>
                  <span className="text-[var(--af-body)]">{line.v}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
