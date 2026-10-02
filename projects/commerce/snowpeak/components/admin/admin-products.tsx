"use client";

import { useMemo, useState } from "react";
import { Image as ImageIcon, Plus, UploadSimple } from "@phosphor-icons/react";
import { ADMIN_PRODUCTS, formatWon } from "@/projects/commerce/snowpeak/lib/mock-data";
import type { AdminProductCategory, AdminProductRow } from "@/projects/commerce/snowpeak/lib/types";
import {
  Badge,
  Button,
  Cell,
  Drawer,
  Field,
  Input,
  PageHead,
  Pagination,
  Row,
  Select,
  Table,
  Tabs,
  Toggle,
} from "@/projects/commerce/snowpeak/components/admin/admin-ui";

type CategoryFilter = "전체" | AdminProductCategory;

const CATEGORIES: AdminProductCategory[] = ["객실", "리프트권", "시즌권", "렌탈", "패키지"];

const PER_PAGE = 10;

export function AdminProducts() {
  const [rows, setRows] = useState<AdminProductRow[]>(ADMIN_PRODUCTS);
  const [category, setCategory] = useState<CategoryFilter>("전체");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);

  const [draftName, setDraftName] = useState("");
  const [draftCategory, setDraftCategory] = useState<AdminProductCategory>("객실");
  const [draftPrice, setDraftPrice] = useState("");
  const [draftStock, setDraftStock] = useState("");
  const [draftPromo, setDraftPromo] = useState("");
  const [draftExposed, setDraftExposed] = useState(true);

  const filtered = useMemo(
    () => (category === "전체" ? rows : rows.filter((r) => r.category === category)),
    [rows, category],
  );

  const pageRows = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const openRow = rows.find((r) => r.id === openId) ?? null;

  const counts = (key: CategoryFilter) =>
    key === "전체" ? rows.length : rows.filter((r) => r.category === key).length;

  const openEdit = (row: AdminProductRow) => {
    setOpenId(row.id);
    setDraftName(row.name);
    setDraftCategory(row.category);
    setDraftPrice(String(row.price));
    setDraftStock(String(row.stock));
    setDraftPromo(row.promo ?? "");
    setDraftExposed(row.exposed);
  };

  const closeEdit = () => setOpenId(null);

  const saveEdit = () => {
    if (!openId) return;
    const price = parseInt(draftPrice.replace(/[^0-9]/g, ""), 10) || 0;
    const stock = parseInt(draftStock.replace(/[^0-9]/g, ""), 10) || 0;
    const trimmedPromo = draftPromo.trim();
    setRows((prev) =>
      prev.map((r) =>
        r.id === openId
          ? {
              ...r,
              name: draftName,
              category: draftCategory,
              price,
              stock,
              exposed: draftExposed,
              promo: trimmedPromo ? trimmedPromo : undefined,
              updatedAt: "2023-10-15",
            }
          : r,
      ),
    );
    closeEdit();
  };

  return (
    <div className="space-y-6">
      <PageHead
        eyebrow="상품 관리"
        title="객실 / 리프트권 / 시즌권 / 렌탈 / 패키지"
        desc="전 상품군의 가격, 재고, 노출 여부와 프로모션 문구를 한 화면에서 관리합니다. 행을 눌러 상세 설정을 편집하세요."
        actions={
          <Button variant="primary" icon={<Plus size={14} weight="bold" />}>
            신규 상품 등록
          </Button>
        }
      />

      <div>
        <Tabs<CategoryFilter>
          value={category}
          onChange={(next) => {
            setCategory(next);
            setPage(1);
          }}
          items={[
            { key: "전체", label: "전체", count: counts("전체") },
            ...CATEGORIES.map((c) => ({ key: c as CategoryFilter, label: c, count: counts(c) })),
          ]}
        />

        <div className="mt-4">
          <Table
            head={["상품명", "카테고리", "가격", "재고", "노출여부", "최근수정일"]}
            align={["left", "left", "right", "right", "left", "left"]}
            minWidth={680}
          >
            {pageRows.map((row) => (
              <Row key={row.id} onClick={() => openEdit(row)} active={row.id === openId}>
                <Cell strong>{row.name}</Cell>
                <Cell>
                  <Badge tone="neutral">{row.category}</Badge>
                </Cell>
                <Cell align="right" mono strong>
                  {formatWon(row.price)}원
                </Cell>
                <Cell align="right" mono>
                  {row.stock}
                </Cell>
                <Cell>
                  <Badge tone={row.exposed ? "success" : "neutral"}>{row.exposed ? "노출" : "숨김"}</Badge>
                </Cell>
                <Cell mono nowrap muted>
                  {row.updatedAt}
                </Cell>
              </Row>
            ))}
          </Table>
          <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
        </div>
      </div>

      <Drawer
        open={openRow !== null}
        title={openRow?.name ?? ""}
        subtitle={openRow ? `${openRow.category} | ${openRow.id}` : undefined}
        onClose={closeEdit}
        footer={
          <div className="flex items-center gap-2">
            <Button variant="primary" onClick={saveEdit}>
              저장
            </Button>
            <Button variant="secondary" onClick={closeEdit}>
              취소
            </Button>
          </div>
        }
      >
        {openRow && (
          <div className="space-y-5">
            <Field label="상품명" required>
              <Input value={draftName} onChange={setDraftName} placeholder="상품명" />
            </Field>

            <Field label="카테고리">
              <Select
                value={draftCategory}
                options={CATEGORIES}
                onChange={(v) => setDraftCategory(v as AdminProductCategory)}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="가격" hint="원 단위로 입력">
                <Input value={draftPrice} onChange={setDraftPrice} type="number" suffix="원" />
              </Field>
              <Field label="재고">
                <Input value={draftStock} onChange={setDraftStock} type="number" />
              </Field>
            </div>

            <Field label="프로모션 문구" hint="상품 카드에 노출되는 짧은 홍보 문구입니다">
              <Input value={draftPromo} onChange={setDraftPromo} placeholder="예: 사전예약 15%" />
            </Field>

            <Field label="노출 여부">
              <Toggle on={draftExposed} onChange={() => setDraftExposed((v) => !v)} label="판매 페이지 노출" />
            </Field>

            <div>
              <p className="text-[13px] font-medium text-[var(--sp-ink)]">이미지 관리</p>
              <div className="mt-1.5 flex items-center justify-between gap-3 rounded-[6px] border border-dashed border-[var(--sp-border-strong)] bg-[var(--sp-surface-soft)] px-3 py-3">
                <span className="flex items-center gap-2 text-[13px] text-[var(--sp-mute)]">
                  <ImageIcon size={15} />
                  이미지 없음
                </span>
                <Button variant="secondary" size="sm" icon={<UploadSimple size={13} />}>
                  업로드
                </Button>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
