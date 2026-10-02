"use client";

import { useMemo, useState } from "react";
import {
  BatteryHigh,
  CalendarBlank,
  MapPin,
  Phone,
  ShieldCheck,
  UserCircle,
} from "@phosphor-icons/react";
import { MiniMap } from "@/projects/monitoring/caresignal/components/mini-map";
import {
  AdminButton,
  Cell,
  DetailRow,
  Drawer,
  EmptyState,
  Monogram,
  PageHead,
  Pagination,
  Panel,
  Row,
  SearchField,
  SelectField,
  StatusTag,
  Table,
  Tag,
} from "@/projects/monitoring/caresignal/components/admin/ui";
import { ACCOUNT_LABEL, users } from "@/projects/monitoring/caresignal/lib/admin-data";
import type { AdminUser } from "@/projects/monitoring/caresignal/lib/types";

const PAGE_SIZE = 8;
const DONGS = ["전체", "정릉1동", "정릉2동", "정릉3동", "정릉4동"];
const STATUSES = [
  { value: "all", label: "전체 상태" },
  { value: "safe", label: "안전" },
  { value: "caution", label: "주의" },
  { value: "danger", label: "위험" },
];

export function AdminUsers() {
  const [query, setQuery] = useState("");
  const [dong, setDong] = useState("전체");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AdminUser | null>(null);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (dong !== "전체" && u.dong !== dong) return false;
      if (status !== "all" && u.status !== status) return false;
      if (query && !u.name.includes(query) && !u.guardian.includes(query) && !u.id.includes(query)) {
        return false;
      }
      return true;
    });
  }, [query, dong, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <PageHead
        title="사용자 관리"
        description="등록된 사용자와 보호자, 안심 구역, 계정 상태를 관리합니다. 이름을 누르면 상세 정보를 볼 수 있습니다."
        actions={<AdminButton variant="primary">사용자 등록</AdminButton>}
      />

      <Panel>
        <div className="flex flex-wrap items-center gap-2 border-b border-[#f0f0f0] px-5 py-3.5">
          <SearchField value={query} onChange={setQuery} placeholder="이름, 보호자, 사용자 번호 검색" />
          <SelectField
            label="동 선택"
            value={dong}
            onChange={(v) => {
              setDong(v);
              setPage(1);
            }}
            options={DONGS.map((d) => ({ value: d, label: d }))}
          />
          <SelectField
            label="상태 선택"
            value={status}
            onChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            options={STATUSES}
          />
        </div>

        {paged.length === 0 ? (
          <EmptyState
            title="조건에 맞는 사용자가 없습니다"
            body="검색어나 필터를 조정해 보세요. 동, 상태 필터를 초기화하면 전체 사용자를 다시 볼 수 있습니다."
          />
        ) : (
          <>
            <Table head={["사용자", "동", "상태", "보호자", "마지막 신호", "배터리", "이번 주 이벤트", ""]}>
              {paged.map((u) => (
                <Row key={u.id} onClick={() => setSelected(u)}>
                  <Cell strong>
                    <span className="flex items-center gap-2.5">
                      <Monogram name={u.name} size={30} tone="primary" />
                      <span>
                        <span className="block">{u.name}</span>
                        <span className="block text-[12px] font-normal text-[#a1a1a6]">
                          {u.age}세 · {u.gender}
                        </span>
                      </span>
                    </span>
                  </Cell>
                  <Cell>{u.dong}</Cell>
                  <Cell>
                    <StatusTag status={u.status} />
                  </Cell>
                  <Cell>
                    {u.guardian}
                    <span className="ml-1 text-[12px] text-[#a1a1a6]">{u.guardianRelation}</span>
                  </Cell>
                  <Cell>{u.lastSignal}</Cell>
                  <Cell>
                    <span className={u.battery <= 20 ? "font-semibold text-[#d70015]" : ""}>
                      {u.account === "pending" ? "-" : `${u.battery}%`}
                    </span>
                  </Cell>
                  <Cell>{u.weekEvents}건</Cell>
                  <Cell align="right">
                    <Tag tone={u.account === "active" ? "safe" : u.account === "pending" ? "primary" : "neutral"}>
                      {ACCOUNT_LABEL[u.account]}
                    </Tag>
                  </Cell>
                </Row>
              ))}
            </Table>
            <Pagination page={page} pageCount={pageCount} total={filtered.length} onChange={setPage} />
          </>
        )}
      </Panel>

      <Drawer
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.name ?? ""}
        subtitle={selected ? `${selected.id} · ${selected.dong}` : undefined}
        footer={
          selected && (
            <>
              <AdminButton variant="secondary">이용 이력 보기</AdminButton>
              <AdminButton variant="primary">정보 수정</AdminButton>
            </>
          )
        }
      >
        {selected && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Monogram name={selected.name} size={52} tone="primary" />
              <div>
                <p className="text-[17px] font-semibold text-[#1d1d1f]">{selected.name}</p>
                <p className="mt-1 text-[13px] text-[#7a7a7a]">
                  {selected.age}세 · {selected.gender} · 담당 {selected.manager}
                </p>
              </div>
              <span className="ml-auto">
                <StatusTag status={selected.status} />
              </span>
            </div>

            <MiniMap
              className="h-[152px] w-full"
              markers={[{ id: selected.id, x: selected.x, y: selected.y, kind: "user", status: selected.status, pulse: selected.status !== "safe" }]}
              showLabels={false}
              rounded="rounded-[11px]"
            />

            <div>
              <p className="mb-1 flex items-center gap-1.5 text-[13px] font-semibold text-[#1d1d1f]">
                <UserCircle size={15} weight="fill" className="text-[#7a7a7a]" />
                기본 정보
              </p>
              <DetailRow label="휴대폰">{selected.phone}</DetailRow>
              <DetailRow label="주소">{selected.address}</DetailRow>
              <DetailRow label="등록일">{selected.joinedAt}</DetailRow>
              <DetailRow label="계정 상태">{ACCOUNT_LABEL[selected.account]}</DetailRow>
            </div>

            <div>
              <p className="mb-1 flex items-center gap-1.5 text-[13px] font-semibold text-[#1d1d1f]">
                <Phone size={15} weight="fill" className="text-[#7a7a7a]" />
                보호자
              </p>
              <DetailRow label="이름">
                {selected.guardian} ({selected.guardianRelation})
              </DetailRow>
              <DetailRow label="연락처">{selected.guardianPhone}</DetailRow>
            </div>

            <div>
              <p className="mb-1 flex items-center gap-1.5 text-[13px] font-semibold text-[#1d1d1f]">
                <MapPin size={15} weight="fill" className="text-[#7a7a7a]" />
                생활권
              </p>
              <DetailRow label="안심 구역">{selected.safeZone}</DetailRow>
              <DetailRow label="이번 주 이벤트">{selected.weekEvents}건</DetailRow>
            </div>

            <div>
              <p className="mb-1 flex items-center gap-1.5 text-[13px] font-semibold text-[#1d1d1f]">
                <BatteryHigh size={15} weight="fill" className="text-[#7a7a7a]" />
                기기 상태
              </p>
              <DetailRow label="배터리">{selected.account === "pending" ? "미연결" : `${selected.battery}%`}</DetailRow>
              <DetailRow label="마지막 신호">{selected.lastSignal}</DetailRow>
            </div>

            <div>
              <p className="mb-1 flex items-center gap-1.5 text-[13px] font-semibold text-[#1d1d1f]">
                <ShieldCheck size={15} weight="fill" className="text-[#7a7a7a]" />
                담당자
              </p>
              <DetailRow label="담당 사회복지사">{selected.manager}</DetailRow>
              <DetailRow label="소속 기관">한빛종합사회복지관</DetailRow>
            </div>

            <div className="flex items-center gap-2 rounded-[11px] bg-[#f5f5f7] p-3.5">
              <CalendarBlank size={16} weight="regular" className="shrink-0 text-[#7a7a7a]" />
              <p className="text-[12.5px] leading-[1.5] text-[#7a7a7a]">
                이용 이력은 최근 90일까지 조회할 수 있습니다. 그 이전 기록은 보관소에서 확인합니다.
              </p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
