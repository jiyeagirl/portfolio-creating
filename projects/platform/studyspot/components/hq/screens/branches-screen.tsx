"use client";

import { useState } from "react";
import { Plus } from "@phosphor-icons/react";
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
  SearchInput,
  Segmented,
  Select,
  Table,
} from "@/projects/platform/studyspot/components/admin/admin-ui";
import {
  BRANCH_STATUS_LABEL,
  BRANCH_STATUS_TONE,
  won,
  type HqNavigate,
} from "@/projects/platform/studyspot/lib/navigation";
import { BRANCHES } from "@/projects/platform/studyspot/lib/mock-data";
import type { Branch, BranchStatus } from "@/projects/platform/studyspot/lib/types";

/* ── 좌석 구성 요약 (표 셀용) ── */

function facilitySummary(branch: Branch) {
  const parts: string[] = [];
  if (branch.hasFreeSeat) parts.push("자유석");
  if (branch.hasFixedSeat) parts.push("고정석");
  if (branch.hasStudyRoom) parts.push("스터디룸");
  return parts.length > 0 ? parts.join(" / ") : "구성 없음";
}

/* ── 좌석 구성 칩 (드로어용) ── */

type FacilityKey = "hasFreeSeat" | "hasFixedSeat" | "hasStudyRoom";

const FACILITY_ITEMS: { key: FacilityKey; label: string }[] = [
  { key: "hasFreeSeat", label: "자유석" },
  { key: "hasFixedSeat", label: "고정석" },
  { key: "hasStudyRoom", label: "스터디룸" },
];

function FacilityChips({
  values,
  onToggle,
}: {
  values: Record<FacilityKey, boolean>;
  onToggle?: (key: FacilityKey) => void;
}) {
  const interactive = Boolean(onToggle);
  return (
    <div className="flex flex-wrap gap-2">
      {FACILITY_ITEMS.map((item) => {
        const active = values[item.key];
        return (
          <button
            key={item.key}
            type="button"
            disabled={!interactive}
            aria-pressed={active}
            onClick={() => onToggle?.(item.key)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors ${
              active
                ? "border-[var(--ss-ink)] bg-[var(--ss-ink)] text-[var(--ss-on-ink)]"
                : "border-[var(--ss-hairline-strong)] text-[var(--ss-mute)]"
            } ${interactive ? "cursor-pointer" : "cursor-default"}`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── 상태 필터 / 상태 선택 옵션 ── */

type StatusFilter = "all" | BranchStatus;

const STATUS_FILTER_ITEMS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "operating", label: BRANCH_STATUS_LABEL.operating },
  { key: "preparing", label: BRANCH_STATUS_LABEL.preparing },
  { key: "closed", label: BRANCH_STATUS_LABEL.closed },
];

const STATUS_OPTIONS: { key: BranchStatus; label: string }[] = [
  { key: "operating", label: BRANCH_STATUS_LABEL.operating },
  { key: "preparing", label: BRANCH_STATUS_LABEL.preparing },
  { key: "closed", label: BRANCH_STATUS_LABEL.closed },
];

/* ── 편집 / 신규 등록 초안 ── */

interface BranchEditDraft {
  name: string;
  region: string;
  address: string;
  openTime: string;
  closeTime: string;
  ownerName: string;
  status: BranchStatus;
}

interface BranchCreateDraft {
  name: string;
  region: string;
  address: string;
  openTime: string;
  closeTime: string;
  ownerName: string;
  status: BranchStatus;
  freeSeatTotal: string;
  hasFreeSeat: boolean;
  hasFixedSeat: boolean;
  hasStudyRoom: boolean;
}

const EMPTY_CREATE_DRAFT: BranchCreateDraft = {
  name: "",
  region: "",
  address: "",
  openTime: "",
  closeTime: "",
  ownerName: "",
  status: "preparing",
  freeSeatTotal: "",
  hasFreeSeat: false,
  hasFixedSeat: false,
  hasStudyRoom: false,
};

export function BranchesScreen({}: { onNavigate: HqNavigate }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [closedOverrides, setClosedOverrides] = useState<Record<string, boolean>>({});

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [editDraft, setEditDraft] = useState<BranchEditDraft | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [createDraft, setCreateDraft] = useState<BranchCreateDraft>(EMPTY_CREATE_DRAFT);

  const effectiveStatus = (branch: Branch): BranchStatus => (closedOverrides[branch.id] ? "closed" : branch.status);

  const filtered = BRANCHES.filter((branch) => {
    const status = effectiveStatus(branch);
    if (statusFilter !== "all" && status !== statusFilter) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      branch.name.toLowerCase().includes(q) ||
      branch.region.toLowerCase().includes(q) ||
      branch.ownerName.toLowerCase().includes(q)
    );
  });

  const selectedBranch = BRANCHES.find((branch) => branch.id === selectedId) ?? null;

  const openDetail = (branch: Branch) => {
    setSelectedId(branch.id);
    setEditing(false);
    setEditDraft(null);
  };

  const closeDetail = () => {
    setSelectedId(null);
    setEditing(false);
    setEditDraft(null);
  };

  const startEdit = (branch: Branch) => {
    setEditDraft({
      name: branch.name,
      region: branch.region,
      address: branch.address,
      openTime: branch.openTime,
      closeTime: branch.closeTime,
      ownerName: branch.ownerName,
      status: effectiveStatus(branch),
    });
    setEditing(true);
  };

  const handleSave = () => {
    setEditing(false);
  };

  const handleCloseBranch = (branch: Branch) => {
    const confirmed = window.confirm(
      `${branch.name} 지점을 휴점 처리할까요? 처리 후 지점 상태가 휴점으로 표시됩니다.`,
    );
    if (!confirmed) return;
    setClosedOverrides((prev) => ({ ...prev, [branch.id]: true }));
    setEditing(false);
  };

  const openCreate = () => {
    setCreateDraft(EMPTY_CREATE_DRAFT);
    setCreateOpen(true);
  };

  const closeCreate = () => setCreateOpen(false);

  return (
    <div className="flex flex-col gap-6">
      <PageHead
        eyebrow="본사 관리자 콘솔"
        title="지점 관리"
        desc="전국 지점의 기본 정보, 운영시간, 좌석 구성, 점주 계정과 운영 상태를 한곳에서 관리하세요."
        actions={
          <Button icon={<Plus size={16} />} onClick={openCreate}>
            신규 지점 등록
          </Button>
        }
      />

      <Card>
        <CardHead title="전체 지점" desc={`총 ${BRANCHES.length}개 지점 운영 현황`} />

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="sm:max-w-[320px] sm:flex-1">
            <SearchInput value={query} onChange={setQuery} placeholder="지점명, 지역, 점주명으로 검색" />
          </div>
          <Segmented value={statusFilter} items={STATUS_FILTER_ITEMS} onChange={setStatusFilter} />
        </div>

        <Table
          head={["지점명", "지역", "점주", "좌석 구성", "상태", "이번 달 매출"]}
          align={["left", "left", "left", "left", "left", "right"]}
          minWidth={640}
        >
          {filtered.map((branch) => {
            const status = effectiveStatus(branch);
            return (
              <Row key={branch.id} onClick={() => openDetail(branch)}>
                <Cell strong>{branch.name}</Cell>
                <Cell muted>{branch.region}</Cell>
                <Cell>{branch.ownerName}</Cell>
                <Cell muted nowrap>
                  {facilitySummary(branch)}
                </Cell>
                <Cell>
                  <Badge tone={BRANCH_STATUS_TONE[status]} dot>
                    {BRANCH_STATUS_LABEL[status]}
                  </Badge>
                </Cell>
                <Cell align="right" mono strong>
                  {won(branch.monthlyRevenue)}
                </Cell>
              </Row>
            );
          })}
        </Table>

        {filtered.length === 0 && (
          <p className="py-10 text-center text-[13px] text-[var(--ss-mute)]">검색 조건에 맞는 지점이 없습니다.</p>
        )}
      </Card>

      {/* ── 지점 상세 / 정보 수정 드로어 ── */}
      <Drawer
        open={selectedBranch !== null}
        title={selectedBranch?.name ?? ""}
        subtitle={selectedBranch ? `${selectedBranch.region} | ${selectedBranch.address}` : undefined}
        onClose={closeDetail}
        footer={
          selectedBranch && (
            <div className="flex items-center justify-between gap-3">
              <Button onClick={handleSave}>저장</Button>
              {effectiveStatus(selectedBranch) !== "closed" && (
                <Button variant="danger" onClick={() => handleCloseBranch(selectedBranch)}>
                  지점 휴점 처리
                </Button>
              )}
            </div>
          )
        }
      >
        {selectedBranch && (
          <div className="flex flex-col gap-6">
            {!editing && (
              <div className="flex justify-end">
                <Button variant="secondary" size="sm" onClick={() => startEdit(selectedBranch)}>
                  정보 수정
                </Button>
              </div>
            )}

            {editing && editDraft ? (
              <div className="flex flex-col gap-4">
                <Field label="지점명">
                  <Input
                    value={editDraft.name}
                    onChange={(v) => setEditDraft((prev) => (prev ? { ...prev, name: v } : prev))}
                  />
                </Field>
                <Field label="지역">
                  <Input
                    value={editDraft.region}
                    onChange={(v) => setEditDraft((prev) => (prev ? { ...prev, region: v } : prev))}
                  />
                </Field>
                <Field label="주소">
                  <Input
                    value={editDraft.address}
                    onChange={(v) => setEditDraft((prev) => (prev ? { ...prev, address: v } : prev))}
                  />
                </Field>
                <Field label="운영시간">
                  <div className="flex items-center gap-2">
                    <Input
                      value={editDraft.openTime}
                      onChange={(v) => setEditDraft((prev) => (prev ? { ...prev, openTime: v } : prev))}
                    />
                    <span className="text-[13px] text-[var(--ss-mute)]">~</span>
                    <Input
                      value={editDraft.closeTime}
                      onChange={(v) => setEditDraft((prev) => (prev ? { ...prev, closeTime: v } : prev))}
                    />
                  </div>
                </Field>
                <Field label="점주명">
                  <Input
                    value={editDraft.ownerName}
                    onChange={(v) => setEditDraft((prev) => (prev ? { ...prev, ownerName: v } : prev))}
                  />
                </Field>
                <Field label="운영 상태">
                  <Select
                    value={BRANCH_STATUS_LABEL[editDraft.status]}
                    options={STATUS_OPTIONS.map((option) => option.label)}
                    onChange={(label) => {
                      const option = STATUS_OPTIONS.find((item) => item.label === label);
                      if (!option) return;
                      setEditDraft((prev) => (prev ? { ...prev, status: option.key } : prev));
                    }}
                  />
                </Field>
              </div>
            ) : (
              <DefList
                columns={1}
                items={[
                  { label: "지점명", value: selectedBranch.name },
                  { label: "지역", value: selectedBranch.region },
                  { label: "주소", value: selectedBranch.address },
                  { label: "운영시간", value: `${selectedBranch.openTime} ~ ${selectedBranch.closeTime}` },
                  { label: "점주명", value: selectedBranch.ownerName },
                  {
                    label: "운영 상태",
                    value: (
                      <Badge tone={BRANCH_STATUS_TONE[effectiveStatus(selectedBranch)]}>
                        {BRANCH_STATUS_LABEL[effectiveStatus(selectedBranch)]}
                      </Badge>
                    ),
                  },
                ]}
              />
            )}

            <Field label="좌석 구성">
              <FacilityChips
                values={{
                  hasFreeSeat: selectedBranch.hasFreeSeat,
                  hasFixedSeat: selectedBranch.hasFixedSeat,
                  hasStudyRoom: selectedBranch.hasStudyRoom,
                }}
              />
            </Field>

            <DefList
              columns={1}
              items={[
                { label: "자유석 수", value: `${selectedBranch.freeSeatTotal}석` },
                { label: "이번 달 매출", value: won(selectedBranch.monthlyRevenue) },
              ]}
            />
          </div>
        )}
      </Drawer>

      {/* ── 신규 지점 등록 드로어 ── */}
      <Drawer
        open={createOpen}
        title="신규 지점 등록"
        subtitle="새로운 지점의 기본 정보를 입력하세요"
        onClose={closeCreate}
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={closeCreate}>
              취소
            </Button>
            <Button onClick={closeCreate}>지점 등록</Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label="지점명">
            <Input
              value={createDraft.name}
              onChange={(v) => setCreateDraft((prev) => ({ ...prev, name: v }))}
              placeholder="예) StudySpot 인천 송도점"
            />
          </Field>
          <Field label="지역">
            <Input
              value={createDraft.region}
              onChange={(v) => setCreateDraft((prev) => ({ ...prev, region: v }))}
              placeholder="예) 인천"
            />
          </Field>
          <Field label="주소">
            <Input
              value={createDraft.address}
              onChange={(v) => setCreateDraft((prev) => ({ ...prev, address: v }))}
              placeholder="예) 인천 연수구 송도과학로 12"
            />
          </Field>
          <Field label="운영시간">
            <div className="flex items-center gap-2">
              <Input
                value={createDraft.openTime}
                onChange={(v) => setCreateDraft((prev) => ({ ...prev, openTime: v }))}
                placeholder="09:00"
              />
              <span className="text-[13px] text-[var(--ss-mute)]">~</span>
              <Input
                value={createDraft.closeTime}
                onChange={(v) => setCreateDraft((prev) => ({ ...prev, closeTime: v }))}
                placeholder="22:00"
              />
            </div>
          </Field>
          <Field label="점주명">
            <Input
              value={createDraft.ownerName}
              onChange={(v) => setCreateDraft((prev) => ({ ...prev, ownerName: v }))}
              placeholder="담당 점주명"
            />
          </Field>
          <Field label="운영 상태">
            <Select
              value={BRANCH_STATUS_LABEL[createDraft.status]}
              options={STATUS_OPTIONS.map((option) => option.label)}
              onChange={(label) => {
                const option = STATUS_OPTIONS.find((item) => item.label === label);
                if (!option) return;
                setCreateDraft((prev) => ({ ...prev, status: option.key }));
              }}
            />
          </Field>
          <Field label="자유석 수" hint="지점에 배치할 자유석 좌석 수">
            <Input
              type="number"
              value={createDraft.freeSeatTotal}
              onChange={(v) => setCreateDraft((prev) => ({ ...prev, freeSeatTotal: v }))}
              placeholder="0"
            />
          </Field>
          <Field label="좌석 구성" hint="제공하는 좌석 유형을 선택하세요">
            <FacilityChips
              values={{
                hasFreeSeat: createDraft.hasFreeSeat,
                hasFixedSeat: createDraft.hasFixedSeat,
                hasStudyRoom: createDraft.hasStudyRoom,
              }}
              onToggle={(key) => setCreateDraft((prev) => ({ ...prev, [key]: !prev[key] }))}
            />
          </Field>
        </div>
      </Drawer>
    </div>
  );
}
