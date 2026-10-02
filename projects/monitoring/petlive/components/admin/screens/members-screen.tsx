"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  DefList,
  Drawer,
  InitialsAvatar,
  PageHead,
  Pagination,
  Row,
  Cell,
  SearchInput,
  Segmented,
  Table,
} from "@/projects/monitoring/petlive/components/admin/admin-ui";
import { ADMIN_MEMBERS, DEVICES, PETS } from "@/projects/monitoring/petlive/lib/mock-data";
import { dateTime, type AdminNavigate } from "@/projects/monitoring/petlive/lib/navigation";
import type { MemberStatus } from "@/projects/monitoring/petlive/lib/types";

const PER_PAGE = 6;

export function MembersScreen({}: { onNavigate: AdminNavigate }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | MemberStatus>("all");
  const [page, setPage] = useState(1);
  const [statusOverride, setStatusOverride] = useState<Record<string, MemberStatus>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const members = ADMIN_MEMBERS.map((m) => ({ ...m, status: statusOverride[m.id] ?? m.status }));

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const matchesQuery =
        query.trim() === "" ||
        m.name.includes(query) ||
        m.email.toLowerCase().includes(query.toLowerCase()) ||
        m.phone.includes(query);
      const matchesFilter = filter === "all" || m.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [members, query, filter]);

  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const selected = members.find((m) => m.id === selectedId) ?? null;

  const toggleStatus = (id: string, current: MemberStatus) => {
    setStatusOverride((prev) => ({ ...prev, [id]: current === "active" ? "inactive" : "active" }));
  };

  return (
    <div className="space-y-6">
      <PageHead
        eyebrow="관리자 콘솔"
        title="사용자 관리"
        desc="회원 목록을 조회하고 계정 상태를 관리하세요."
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="w-full max-w-[320px]">
          <SearchInput
            value={query}
            onChange={(v) => {
              setQuery(v);
              setPage(1);
            }}
            placeholder="이름, 이메일, 전화번호 검색"
          />
        </div>
        <Segmented
          value={filter}
          onChange={(v) => {
            setFilter(v);
            setPage(1);
          }}
          items={[
            { key: "all", label: "전체" },
            { key: "active", label: "활성" },
            { key: "inactive", label: "비활성" },
          ]}
        />
      </div>

      <Card padded={false}>
        <div className="px-5 pt-5">
          <Table head={["이름", "이메일", "가입일", "상태", "펫 | 디바이스", "최근 로그인"]} minWidth={640}>
            {paged.map((member) => (
              <Row key={member.id} onClick={() => setSelectedId(member.id)}>
                <Cell strong>
                  <span className="flex items-center gap-2.5">
                    <InitialsAvatar name={member.name} />
                    {member.name}
                  </span>
                </Cell>
                <Cell muted>{member.email}</Cell>
                <Cell muted mono nowrap>
                  {dateTime(member.joinedAt)}
                </Cell>
                <Cell>
                  <Badge tone={member.status === "active" ? "positive" : "neutral"} dot>
                    {member.status === "active" ? "활성" : "비활성"}
                  </Badge>
                </Cell>
                <Cell mono>
                  {member.petsCount} | {member.devicesCount}
                </Cell>
                <Cell muted mono nowrap>
                  {dateTime(member.lastLoginAt)}
                </Cell>
              </Row>
            ))}
          </Table>
        </div>
        <div className="px-5 pb-5">
          <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
        </div>
      </Card>

      <Drawer
        open={selected !== null}
        title={selected?.name ?? ""}
        subtitle={selected?.email}
        onClose={() => setSelectedId(null)}
        footer={
          selected && (
            <Button
              full
              variant={selected.status === "active" ? "danger" : "primary"}
              onClick={() => toggleStatus(selected.id, selected.status)}
            >
              {selected.status === "active" ? "계정 비활성화" : "계정 활성화"}
            </Button>
          )
        }
      >
        {selected && (
          <div className="space-y-6">
            <DefList
              items={[
                { label: "전화번호", value: selected.phone },
                { label: "가입일", value: dateTime(selected.joinedAt) },
                { label: "최근 로그인", value: dateTime(selected.lastLoginAt) },
                { label: "요금제", value: selected.plan },
                {
                  label: "계정 상태",
                  value: (
                    <Badge tone={selected.status === "active" ? "positive" : "neutral"} dot>
                      {selected.status === "active" ? "활성" : "비활성"}
                    </Badge>
                  ),
                },
              ]}
              columns={1}
            />

            {selected.id === "m1" ? (
              <div>
                <p className="mb-2 text-[13px] font-medium text-[var(--pl-ink)]">등록 반려동물 | 디바이스</p>
                <ul className="space-y-2">
                  {PETS.map((pet) => (
                    <li
                      key={pet.id}
                      className="flex items-center justify-between rounded-[8px] border border-[var(--pl-hairline)] px-3 py-2 text-[13px]"
                    >
                      <span className="text-[var(--pl-body)]">
                        {pet.name} ({pet.species === "dog" ? "반려견" : "반려묘"})
                      </span>
                      <span className="pl-mono text-[12px] text-[var(--pl-mute)]">
                        카메라 {DEVICES.filter((d) => d.petId === pet.id).length}대
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-[13px] leading-5 text-[var(--pl-mute)]">
                반려동물 {selected.petsCount}마리, 등록 디바이스 {selected.devicesCount}대가 있습니다. 상세
                레코드는 웹캠 관리 화면의 소유자 필터로 확인하세요.
              </p>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
