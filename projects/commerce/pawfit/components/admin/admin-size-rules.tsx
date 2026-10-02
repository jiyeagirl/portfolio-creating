"use client";

import { useMemo, useState } from "react";
import { Plus, Ruler, X } from "@phosphor-icons/react";
import { ADMIN_SIZE_RULES } from "@/projects/commerce/pawfit/lib/mock-data";
import type { AdminSizeRule } from "@/projects/commerce/pawfit/lib/types";
import {
  FilterChips,
  Drawer,
  PageHead,
  Pagination,
  Panel,
  SearchInput,
} from "@/projects/commerce/pawfit/components/admin/admin-ui";
import {
  DangerGhostButton,
  Field,
  GhostButton,
  PrimaryButton,
  inputClass,
} from "@/projects/commerce/pawfit/components/ui";

type BrandFilter = "all" | "PawFit" | "A펫웨어" | "B프렌즈" | "C도그";

const BRAND_OPTIONS: { key: BrandFilter; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "PawFit", label: "PawFit" },
  { key: "A펫웨어", label: "A펫웨어" },
  { key: "B프렌즈", label: "B프렌즈" },
  { key: "C도그", label: "C도그" },
];

const PER_PAGE = 6;

type RuleDraft = Omit<AdminSizeRule, "id">;

const BLANK_DRAFT: RuleDraft = {
  brand: "PawFit",
  scope: "",
  weightRange: "",
  chestRange: "",
  neckRange: "",
  recommendedSize: "",
  updatedAt: "2026-07-30",
};

/** "3~6kg", "34~40cm" 같은 표기에서 숫자 하한/상한만 뽑아낸다. */
function parseRangeBounds(range: string): [number, number] {
  const parts = range
    .split("~")
    .map((part) => parseFloat(part.replace(/[^0-9.]/g, "")));
  if (parts.length < 2 || Number.isNaN(parts[0]) || Number.isNaN(parts[1])) {
    return [0, 0];
  }
  return [parts[0], parts[1]];
}

function RuleForm({
  draft,
  onChange,
  onSubmit,
  onCancel,
  submitLabel,
  extra,
}: {
  draft: RuleDraft;
  onChange: (next: RuleDraft) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  submitLabel: string;
  extra?: React.ReactNode;
}) {
  const set = (key: keyof RuleDraft) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...draft, [key]: e.target.value });

  return (
    <div className="space-y-4">
      <Field label="브랜드">
        <input className={inputClass} value={draft.brand} onChange={set("brand")} placeholder="PawFit" />
      </Field>
      <Field label="적용 대상" helper="견종, 묘종 또는 체구 구간을 입력합니다">
        <input className={inputClass} value={draft.scope} onChange={set("scope")} placeholder="소형견 전체" />
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="몸무게 범위">
          <input className={inputClass} value={draft.weightRange} onChange={set("weightRange")} placeholder="3~6kg" />
        </Field>
        <Field label="가슴둘레 범위">
          <input className={inputClass} value={draft.chestRange} onChange={set("chestRange")} placeholder="34~40cm" />
        </Field>
        <Field label="목둘레 범위">
          <input className={inputClass} value={draft.neckRange} onChange={set("neckRange")} placeholder="22~26cm" />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="추천 사이즈">
          <input className={inputClass} value={draft.recommendedSize} onChange={set("recommendedSize")} placeholder="S" />
        </Field>
        <Field label="최종수정일">
          <input className={inputClass} value={draft.updatedAt} onChange={set("updatedAt")} placeholder="2026-07-30" />
        </Field>
      </div>
      <div className="flex items-center gap-2.5 pt-1">
        <PrimaryButton full={false} onClick={onSubmit}>
          {submitLabel}
        </PrimaryButton>
        {onCancel && (
          <GhostButton full={false} onClick={onCancel}>
            취소
          </GhostButton>
        )}
      </div>
      {extra}
    </div>
  );
}

export function AdminSizeRules() {
  const [rows, setRows] = useState<AdminSizeRule[]>(ADMIN_SIZE_RULES);
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState<BrandFilter>("all");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<RuleDraft | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [addDraft, setAddDraft] = useState<RuleDraft>(BLANK_DRAFT);
  const [ruleSeq, setRuleSeq] = useState(rows.length + 1);

  const [testWeight, setTestWeight] = useState("");
  const [testChest, setTestChest] = useState("");
  const [testNeck, setTestNeck] = useState("");
  const [testResult, setTestResult] = useState<AdminSizeRule | null | "none">(null);

  const filtered = useMemo(() => {
    const q = query.trim();
    return rows.filter((row) => {
      if (brand !== "all" && row.brand !== brand) return false;
      if (!q) return true;
      return row.brand.includes(q) || row.scope.includes(q);
    });
  }, [rows, query, brand]);

  const pageRows = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const openRow = rows.find((r) => r.id === openId) ?? null;

  const counts = (key: BrandFilter) =>
    key === "all" ? rows.length : rows.filter((r) => r.brand === key).length;

  const openEdit = (row: AdminSizeRule) => {
    setOpenId(row.id);
    setEditDraft({
      brand: row.brand,
      scope: row.scope,
      weightRange: row.weightRange,
      chestRange: row.chestRange,
      neckRange: row.neckRange,
      recommendedSize: row.recommendedSize,
      updatedAt: row.updatedAt,
    });
  };

  const closeEdit = () => {
    setOpenId(null);
    setEditDraft(null);
  };

  const saveEdit = () => {
    if (!openId || !editDraft) return;
    setRows((prev) => prev.map((r) => (r.id === openId ? { ...r, ...editDraft } : r)));
    closeEdit();
  };

  const deleteRule = () => {
    if (!openId) return;
    setRows((prev) => prev.filter((r) => r.id !== openId));
    closeEdit();
  };

  const submitAdd = () => {
    const id = `rule-new-${ruleSeq}`;
    setRuleSeq((n) => n + 1);
    setRows((prev) => [{ id, ...addDraft }, ...prev]);
    setAddDraft(BLANK_DRAFT);
    setAddOpen(false);
    setPage(1);
  };

  const runTest = () => {
    const weight = parseFloat(testWeight.replace(/[^0-9.]/g, ""));
    if (Number.isNaN(weight)) {
      setTestResult("none");
      return;
    }
    const match = rows.find((rule) => {
      const [min, max] = parseRangeBounds(rule.weightRange);
      return weight >= min && weight <= max;
    });
    setTestResult(match ?? "none");
  };

  return (
    <>
      <PageHead
        title="사이즈 기준표 관리"
        description="브랜드별, 품종별 사이즈 기준과 몸무게, 가슴둘레, 목둘레 추천 룰을 관리하고 새 규칙을 등록합니다."
        actions={
          <GhostButton full={false} onClick={() => setAddOpen((v) => !v)}>
            <span className="flex items-center gap-1.5">
              <Plus size={14} weight="bold" />
              새 규칙 추가
            </span>
          </GhostButton>
        }
      />

      {addOpen && (
        <Panel className="mb-4" title="새 규칙 추가" note="브랜드와 적용 대상, 신체 치수 범위를 입력합니다">
          <div className="px-5 py-5">
            <RuleForm
              draft={addDraft}
              onChange={setAddDraft}
              onSubmit={submitAdd}
              onCancel={() => {
                setAddOpen(false);
                setAddDraft(BLANK_DRAFT);
              }}
              submitLabel="규칙 추가"
            />
          </div>
        </Panel>
      )}

      <Panel
        className="mb-4"
        title="미리보기 테스트"
        note="반려동물의 몸무게, 가슴둘레, 목둘레를 입력해 어떤 규칙과 매칭되는지 확인합니다"
      >
        <div className="flex flex-wrap items-end gap-3 px-5 py-5">
          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold text-[var(--pf-muted)]">몸무게(kg)</span>
            <input
              type="number"
              value={testWeight}
              onChange={(e) => setTestWeight(e.target.value)}
              placeholder="6.2"
              className={`${inputClass} w-28`}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold text-[var(--pf-muted)]">가슴둘레(cm)</span>
            <input
              type="number"
              value={testChest}
              onChange={(e) => setTestChest(e.target.value)}
              placeholder="45"
              className={`${inputClass} w-28`}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-[12px] font-semibold text-[var(--pf-muted)]">목둘레(cm)</span>
            <input
              type="number"
              value={testNeck}
              onChange={(e) => setTestNeck(e.target.value)}
              placeholder="28"
              className={`${inputClass} w-28`}
            />
          </label>
          <PrimaryButton full={false} onClick={runTest}>
            테스트
          </PrimaryButton>

          {testResult === "none" && (
            <span className="flex items-center gap-1.5 rounded-full border border-[var(--pf-error)]/25 bg-[var(--pf-error)]/[0.08] px-3 py-1.5 text-[12.5px] font-semibold text-[var(--pf-error)]">
              일치하는 규칙이 없습니다
            </span>
          )}
          {testResult && testResult !== "none" && (
            <span className="flex items-center gap-1.5 rounded-full border border-[var(--pf-success)]/25 bg-[var(--pf-success)]/[0.08] px-3 py-1.5 text-[12.5px] font-semibold text-[var(--pf-success)]">
              <Ruler size={13} weight="bold" />
              {testResult.brand} 추천 사이즈 {testResult.recommendedSize}
            </span>
          )}
        </div>
      </Panel>

      <Panel
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <SearchInput
              value={query}
              onChange={(v) => {
                setQuery(v);
                setPage(1);
              }}
              placeholder="브랜드, 적용 대상 검색"
            />
            <FilterChips<BrandFilter>
              value={brand}
              onChange={(v) => {
                setBrand(v);
                setPage(1);
              }}
              options={BRAND_OPTIONS.map((o) => ({ ...o, count: counts(o.key) }))}
            />
          </div>
        }
        title="사이즈 규칙 목록"
        note="행을 누르면 상세 내용을 수정하거나 삭제할 수 있습니다"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-[var(--pf-hairline)] text-[11.5px] text-[var(--pf-muted)]">
                <th className="px-5 py-3 font-semibold">브랜드</th>
                <th className="px-3 py-3 font-semibold">적용 대상</th>
                <th className="px-3 py-3 font-semibold">몸무게 범위</th>
                <th className="px-3 py-3 font-semibold">가슴둘레 범위</th>
                <th className="px-3 py-3 font-semibold">목둘레 범위</th>
                <th className="px-3 py-3 font-semibold">추천 사이즈</th>
                <th className="px-5 py-3 font-semibold">최종수정일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--pf-hairline)]">
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <p className="text-[14px] font-semibold">조건에 맞는 규칙이 없습니다</p>
                    <p className="mt-1.5 text-[12.5px] text-[var(--pf-muted)]">
                      브랜드 필터를 전체로 바꾸거나 검색어를 지워 보세요.
                    </p>
                  </td>
                </tr>
              ) : (
                pageRows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => openEdit(row)}
                    className="cursor-pointer text-[13px] hover:bg-[var(--pf-surface-card)]"
                  >
                    <td className="px-5 py-3 font-semibold">{row.brand}</td>
                    <td className="px-3 py-3 text-[var(--pf-muted)]">{row.scope}</td>
                    <td className="pf-num px-3 py-3">{row.weightRange}</td>
                    <td className="pf-num px-3 py-3">{row.chestRange}</td>
                    <td className="pf-num px-3 py-3">{row.neckRange}</td>
                    <td className="px-3 py-3 font-semibold">{row.recommendedSize}</td>
                    <td className="pf-num px-5 py-3 text-[var(--pf-muted)]">{row.updatedAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
      </Panel>

      {openRow && editDraft && (
        <Drawer onClose={closeEdit}>
          <div className="flex items-start justify-between">
            <div>
              <p className="pf-num text-[12.5px] text-[var(--pf-muted)]">{openRow.id}</p>
              <h2 className="mt-1 text-[19px] font-semibold tracking-tight">규칙 상세</h2>
            </div>
            <button
              type="button"
              onClick={closeEdit}
              aria-label="닫기"
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[var(--pf-surface-card)]"
            >
              <X size={16} weight="bold" />
            </button>
          </div>

          <div className="mt-5">
            <RuleForm
              draft={editDraft}
              onChange={setEditDraft}
              onSubmit={saveEdit}
              submitLabel="저장"
            />
          </div>

          <div className="mt-6">
            <DangerGhostButton onClick={deleteRule}>규칙 삭제</DangerGhostButton>
          </div>
        </Drawer>
      )}
    </>
  );
}
