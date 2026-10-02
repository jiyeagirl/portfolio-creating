"use client";

import { useState } from "react";
import { Check, Plus, ShieldCheck, X } from "@phosphor-icons/react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardHead,
  Cell,
  Drawer,
  Field,
  Input,
  PageHead,
  Row,
  Select,
  Table,
  Toggle,
} from "@/projects/b2b/genderinsight/components/ui";
import { ADMIN_USERS, AUDIT_LOG, PRIVACY_SETTINGS } from "@/projects/b2b/genderinsight/lib/mock-data";
import type { AdminRole, AdminUser } from "@/projects/b2b/genderinsight/lib/types";

const ROLE_TONE: Record<AdminRole, "ink" | "info" | "neutral"> = {
  슈퍼관리자: "ink",
  운영자: "info",
  뷰어: "neutral",
};

const PERMISSION_MATRIX: { label: string; access: Record<AdminRole, boolean> }[] = [
  { label: "진단 생성 / 삭제", access: { 슈퍼관리자: true, 운영자: true, 뷰어: false } },
  { label: "참여자 관리 / PIN 발급", access: { 슈퍼관리자: true, 운영자: true, 뷰어: false } },
  { label: "리마인드 이메일 발송", access: { 슈퍼관리자: true, 운영자: true, 뷰어: false } },
  { label: "결과 분석 / 리포트 조회", access: { 슈퍼관리자: true, 운영자: true, 뷰어: true } },
  { label: "리포트 생성 / 다운로드", access: { 슈퍼관리자: true, 운영자: true, 뷰어: false } },
  { label: "권한 관리 / 개인정보 설정", access: { 슈퍼관리자: true, 운영자: false, 뷰어: false } },
  { label: "개별 참여자 응답 조회", access: { 슈퍼관리자: false, 운영자: false, 뷰어: false } },
];

const ROLES: AdminRole[] = ["슈퍼관리자", "운영자", "뷰어"];

export function AdminSettings() {
  const [admins, setAdmins] = useState<AdminUser[]>(ADMIN_USERS);
  const [privacy, setPrivacy] = useState(PRIVACY_SETTINGS);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<AdminRole>("운영자");

  const changeRole = (id: string, role: AdminRole) => {
    setAdmins((prev) => prev.map((a) => (a.id === id ? { ...a, role } : a)));
  };

  const invite = () => {
    if (!inviteEmail.trim()) return;
    setAdmins((prev) => [
      {
        id: `adm${Date.now()}`,
        name: inviteEmail.split("@")[0],
        department: "인사팀",
        role: inviteRole,
        email: inviteEmail.trim(),
        lastActiveAt: "-",
      },
      ...prev,
    ]);
    setInviteEmail("");
    setInviteOpen(false);
  };

  return (
    <div className="gi-enter space-y-8">
      <PageHead
        eyebrow="권한 및 개인정보 보호 설정"
        title="권한 / 개인정보 설정"
        desc="관리자 권한, 익명 응답 정책, 개인정보 접근 제한을 관리합니다."
      />

      <Card padded={false}>
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 pb-0">
          <CardHead title="관리자 권한 관리" desc="역할별로 접근 가능한 기능이 다릅니다" />
          <Button size="sm" icon={<Plus size={13} weight="bold" />} onClick={() => setInviteOpen(true)}>
            관리자 초대
          </Button>
        </div>
        <div className="px-5 pt-4 pb-5">
          <Table head={["이름", "소속", "역할", "최근 활동", "권한 변경"]} minWidth={620}>
            {admins.map((admin) => (
              <Row key={admin.id}>
                <Cell strong>
                  <span className="flex items-center gap-2.5">
                    <Avatar name={admin.name} size={28} />
                    {admin.name}
                  </span>
                </Cell>
                <Cell muted>{admin.department}</Cell>
                <Cell>
                  <Badge tone={ROLE_TONE[admin.role]}>{admin.role}</Badge>
                </Cell>
                <Cell muted mono nowrap>
                  {admin.lastActiveAt}
                </Cell>
                <Cell align="right">
                  <Select value={admin.role} onChange={(v) => changeRole(admin.id, v as AdminRole)} options={ROLES} />
                </Cell>
              </Row>
            ))}
          </Table>
        </div>
      </Card>

      <Card padded={false}>
        <div className="p-5 pb-0">
          <CardHead title="역할별 접근 권한" desc="슈퍼관리자, 운영자, 뷰어의 기능 접근 범위" />
        </div>
        <div className="px-5 pb-5">
          <Table head={["기능", "슈퍼관리자", "운영자", "뷰어"]} align={["left", "center", "center", "center"]} minWidth={480}>
            {PERMISSION_MATRIX.map((row) => (
              <Row key={row.label}>
                <Cell strong>{row.label}</Cell>
                {ROLES.map((role) => (
                  <Cell key={role} align="center">
                    {row.access[role] ? (
                      <Check size={14} weight="bold" className="mx-auto text-[var(--gi-accent-deep)]" />
                    ) : (
                      <X size={12} className="mx-auto text-[var(--gi-mute)]" />
                    )}
                  </Cell>
                ))}
              </Row>
            ))}
          </Table>
        </div>
      </Card>

      <Card>
        <CardHead title="개인정보 보호 정책" desc="참여자 익명성과 관리자의 개인정보 접근 범위를 설정합니다" />
        <div className="divide-y divide-[var(--gi-hairline)]">
          <div className="flex items-center justify-between gap-4 py-3.5 first:pt-0">
            <div>
              <p className="text-[13.5px] font-medium text-[var(--gi-ink)]">익명 응답 정책</p>
              <p className="mt-0.5 text-[12.5px] leading-5 text-[var(--gi-mute)]">
                응답 데이터에서 개인 식별 정보를 분리해 통계에만 반영합니다
              </p>
            </div>
            <Toggle
              on={privacy.anonymousResponse}
              onChange={() => setPrivacy((p) => ({ ...p, anonymousResponse: !p.anonymousResponse }))}
              label="익명 응답 정책"
            />
          </div>
          <div className="flex items-center justify-between gap-4 py-3.5">
            <div>
              <p className="text-[13.5px] font-medium text-[var(--gi-ink)]">최소 응답 인원 기준</p>
              <p className="mt-0.5 text-[12.5px] leading-5 text-[var(--gi-mute)]">
                응답 인원이 이 값보다 적은 부서, 직급 단위는 통계를 공개하지 않습니다
              </p>
            </div>
            <div className="w-[104px] shrink-0">
              <Select
                value={String(privacy.minResponseCount)}
                onChange={(v) => setPrivacy((p) => ({ ...p, minResponseCount: Number(v) }))}
                options={["3", "5", "10", "15"]}
              />
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 py-3.5">
            <div>
              <p className="text-[13.5px] font-medium text-[var(--gi-ink)]">조직 통계 공개</p>
              <p className="mt-0.5 text-[12.5px] leading-5 text-[var(--gi-mute)]">
                최소 인원 기준을 만족하는 부서, 직급의 집계 결과를 관리자 콘솔에 공개합니다
              </p>
            </div>
            <Toggle
              on={privacy.orgStatDisclosure}
              onChange={() => setPrivacy((p) => ({ ...p, orgStatDisclosure: !p.orgStatDisclosure }))}
              label="조직 통계 공개"
            />
          </div>
          <div className="flex items-center justify-between gap-4 py-3.5">
            <div>
              <p className="text-[13.5px] font-medium text-[var(--gi-ink)]">개인정보 접근 제한</p>
              <p className="mt-0.5 text-[12.5px] leading-5 text-[var(--gi-mute)]">
                참여자 이메일, 휴대폰 번호는 슈퍼관리자만 조회할 수 있습니다
              </p>
            </div>
            <Toggle
              on={privacy.restrictPersonalAccess}
              onChange={() => setPrivacy((p) => ({ ...p, restrictPersonalAccess: !p.restrictPersonalAccess }))}
              label="개인정보 접근 제한"
            />
          </div>
          <div className="flex items-center justify-between gap-4 py-3.5 last:pb-0">
            <div>
              <p className="flex items-center gap-1.5 text-[13.5px] font-medium text-[var(--gi-ink)]">
                <ShieldCheck size={14} weight="bold" className="text-[var(--gi-accent-deep)]" />
                관리자의 개별 응답 조회 차단
              </p>
              <p className="mt-0.5 text-[12.5px] leading-5 text-[var(--gi-mute)]">
                관리자 권한과 무관하게 특정 참여자 1인의 응답 내용은 시스템에서 조회를 차단합니다
              </p>
            </div>
            <Toggle
              on={privacy.blockIndividualLookup}
              onChange={() => setPrivacy((p) => ({ ...p, blockIndividualLookup: !p.blockIndividualLookup }))}
              label="관리자의 개별 응답 조회 차단"
            />
          </div>
        </div>
      </Card>

      <Card padded={false}>
        <div className="p-5 pb-0">
          <CardHead title="감사 로그" desc="관리자 활동과 시스템 보호 조치 기록" />
        </div>
        <div className="px-5 pb-5">
          <Table head={["작업자", "작업", "대상", "일시"]} minWidth={560}>
            {AUDIT_LOG.map((entry) => (
              <Row key={entry.id}>
                <Cell strong>{entry.actor}</Cell>
                <Cell>{entry.action}</Cell>
                <Cell muted>{entry.target}</Cell>
                <Cell muted mono nowrap>
                  {entry.at}
                </Cell>
              </Row>
            ))}
          </Table>
        </div>
      </Card>

      <Drawer open={inviteOpen} title="관리자 초대" subtitle="이메일로 관리자 초대장을 발송합니다" onClose={() => setInviteOpen(false)}>
        <div className="space-y-5">
          <Field label="이메일" required>
            <Input value={inviteEmail} onChange={setInviteEmail} placeholder="admin@company.kr" type="email" />
          </Field>
          <Field label="역할">
            <Select value={inviteRole} onChange={(v) => setInviteRole(v as AdminRole)} options={ROLES} />
          </Field>
        </div>
        <div className="mt-6 flex gap-2">
          <Button variant="secondary" full onClick={() => setInviteOpen(false)}>
            취소
          </Button>
          <Button full onClick={invite}>
            초대 발송
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
