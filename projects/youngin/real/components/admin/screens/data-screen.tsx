"use client";

/* 09 시설 / 상점 데이터 관리 — 강조 화면(spec.md 7절 4순위).
   공공데이터 원본을 그대로 두지 않고 현장 실사와 사용자 신고로 보정하는 흐름을 보여준다.
   등록/수정 폼은 드로어로 열고, 보정 결과는 하단 이력 로그에 남는다(모두 mock, 저장 없음). */

import { useMemo, useState } from "react";
import { CheckCircle, DownloadSimple, PencilSimpleLine, Plus, Warning } from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  CardHead,
  Cell,
  DefList,
  Drawer,
  EmptyState,
  Field,
  Input,
  PageHead,
  Pagination,
  Row,
  SearchInput,
  Segmented,
  Select,
  Table,
  Textarea,
  Toggle,
} from "@/projects/youngin/real/components/admin/ui";
import {
  ADMIN_SUMMARY,
  CORRECTION_LOGS,
  DATA_RECORDS,
  DISTRICTS,
} from "@/projects/youngin/real/lib/mock-data";
import type { DataRecord } from "@/projects/youngin/real/lib/types";

const KIND_FILTER = [
  { key: "전체", label: "전체" },
  { key: "시설", label: "시설" },
  { key: "매장", label: "매장" },
] as const;

const SOURCE_OPTIONS: DataRecord["source"][] = [
  "공공데이터포털",
  "상인회 제출",
  "현장 실사",
  "사용자 신고 반영",
];

const SOURCE_TONE: Record<DataRecord["source"], "neutral" | "info" | "warn" | "ok"> = {
  공공데이터포털: "info",
  "상인회 제출": "neutral",
  "현장 실사": "ok",
  "사용자 신고 반영": "warn",
};

const PER_PAGE = 8;

export function DataScreen() {
  const [kind, setKind] = useState<(typeof KIND_FILTER)[number]["key"]>("전체");
  const [zone, setZone] = useState("전체 구역");
  const [source, setSource] = useState("전체 출처");
  const [query, setQuery] = useState("");
  const [onnuriOnly, setOnnuriOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<DataRecord | null>(null);
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => {
    return DATA_RECORDS.filter((r) => (kind === "전체" ? true : r.kind === kind))
      .filter((r) => (zone === "전체 구역" ? true : r.zoneCode === zone))
      .filter((r) => (source === "전체 출처" ? true : r.source === source))
      .filter((r) => (onnuriOnly ? r.onnuri : true))
      .filter((r) =>
        query.trim() === ""
          ? true
          : `${r.name} ${r.id} ${r.category}`.toLowerCase().includes(query.trim().toLowerCase()),
      );
  }, [kind, zone, source, onnuriOnly, query]);

  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const unverified = DATA_RECORDS.filter((r) => !r.verified).length;

  /* 필터를 바꾸면 결과 수가 달라지므로 항상 1페이지로 되돌린다. */
  const onKind = (value: (typeof KIND_FILTER)[number]["key"]) => {
    setKind(value);
    setPage(1);
  };
  const onZone = (value: string) => {
    setZone(value);
    setPage(1);
  };
  const onSource = (value: string) => {
    setSource(value);
    setPage(1);
  };
  const onQuery = (value: string) => {
    setQuery(value);
    setPage(1);
  };
  const onOnnuri = (value: boolean) => {
    setOnnuriOnly(value);
    setPage(1);
  };

  const drawerOpen = creating || editing !== null;

  return (
    <div className="cp-enter space-y-8">
      <PageHead
        eyebrow={`데이터 기준일 ${ADMIN_SUMMARY.baseDate}`}
        title="시설 / 상점 데이터 관리"
        desc="공공데이터포털 배포분을 기준으로 두고 상인회 제출 자료와 현장 실사로 보정합니다. 여기서 바꾼 값은 다음 배포 때 사용자 화면에 반영됩니다."
        actions={
          <>
            <Button variant="secondary" icon={<DownloadSimple size={14} weight="bold" />}>
              CSV 내려받기
            </Button>
            <Button icon={<Plus size={14} weight="bold" />} onClick={() => setCreating(true)}>
              신규 등록
            </Button>
          </>
        }
      />

      {unverified > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-[8px] border border-[var(--cp-warn-soft)] bg-[var(--cp-warn-soft)] px-4 py-3">
          <Warning size={16} weight="fill" className="shrink-0 text-[var(--cp-warn)]" />
          <p className="min-w-0 flex-1 text-[13px] text-[var(--cp-warn)]">
            현장 실사로 확인되지 않은 항목이 {unverified}건 있습니다. 검증 전 데이터는 사용자
            화면에서 기준일과 함께 노출됩니다.
          </p>
          <Button size="sm" variant="secondary">
            실사 배정
          </Button>
        </div>
      )}

      <Card padded={false}>
        <div className="flex flex-wrap items-center gap-3 border-b border-[var(--cp-hairline)] p-5">
          <Segmented value={kind} items={[...KIND_FILTER]} onChange={onKind} />
          <div className="min-w-[220px] flex-1">
            <SearchInput
              value={query}
              onChange={onQuery}
              placeholder="시설명, 매장명, 관리번호 검색"
            />
          </div>
          <div className="w-[150px]">
            <Select
              value={zone}
              onChange={onZone}
              options={["전체 구역", ...DISTRICTS.map((d) => d.zoneCode)]}
            />
          </div>
          <div className="w-[170px]">
            <Select
              value={source}
              onChange={onSource}
              options={["전체 출처", ...SOURCE_OPTIONS]}
            />
          </div>
          <label className="flex shrink-0 items-center gap-2 text-[13px] text-[var(--cp-body)]">
            온누리 가맹만
            <Toggle on={onnuriOnly} onChange={onOnnuri} label="온누리 가맹만 보기" />
          </label>
        </div>

        <div className="p-5">
          {paged.length === 0 ? (
            <EmptyState
              title="조건에 맞는 데이터가 없습니다"
              desc="구분, 구역, 출처 필터를 넓히거나 검색어를 지우고 다시 시도해 주세요."
            />
          ) : (
            <>
              {/* 컬럼 6개 고정. 관리번호는 이름 칸, 상대 위치는 주소 칸 보조 줄로 내려 폭을 아꼈다. */}
              <Table
                head={["이름 / 관리번호", "분류", "구역 / 주소", "온누리", "출처 / 기준일", "상태"]}
                align={["left", "left", "left", "center", "left", "right"]}
                minWidth={900}
              >
                {paged.map((record) => (
                  <Row key={record.id} onClick={() => setEditing(record)}>
                    <Cell strong>
                      <span className="block">{record.name}</span>
                      <span className="cp-num mt-0.5 block text-[12px] text-[var(--cp-mute)]">
                        {record.id}
                      </span>
                    </Cell>
                    <Cell nowrap>
                      <Badge tone={record.kind === "시설" ? "info" : "neutral"}>{record.kind}</Badge>
                      <span className="ml-2 text-[13px]">{record.category}</span>
                    </Cell>
                    <Cell>
                      <span className="cp-num block text-[12.5px] font-medium text-[var(--cp-ink)]">
                        {record.zoneCode} | {record.address}
                      </span>
                      <span className="mt-0.5 block text-[12px] text-[var(--cp-mute)]">
                        {record.relativeLocation}
                      </span>
                    </Cell>
                    <Cell align="center">
                      {record.onnuri ? <Badge tone="info">가맹</Badge> : <span className="text-[var(--cp-faint)]">-</span>}
                    </Cell>
                    <Cell>
                      <Badge tone={SOURCE_TONE[record.source]}>{record.source}</Badge>
                      <span className="cp-num mt-1 block text-[12px] text-[var(--cp-mute)]">
                        {record.baseDate}
                      </span>
                    </Cell>
                    <Cell align="right" nowrap>
                      {record.verified ? (
                        <span className="inline-flex items-center gap-1 text-[12.5px] font-medium text-[var(--cp-ok)]">
                          <CheckCircle size={13} weight="fill" />
                          검증됨
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[12.5px] font-medium text-[var(--cp-warn)]">
                          <Warning size={13} weight="fill" />
                          실사 대기
                        </span>
                      )}
                    </Cell>
                  </Row>
                ))}
              </Table>
              <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
            </>
          )}
        </div>
      </Card>

      {/* 보정 이력 로그 */}
      <Card>
        <CardHead
          title="공공데이터 보정 이력"
          desc="원본 값과 보정 후 값을 함께 남겨 어디서 무엇이 바뀌었는지 되짚을 수 있게 합니다"
          action={<Badge tone="neutral">최근 {CORRECTION_LOGS.length}건</Badge>}
        />
        <Table
          head={["일시", "대상", "항목", "변경 전 / 후", "처리자"]}
          align={["left", "left", "left", "left", "right"]}
          minWidth={820}
        >
          {CORRECTION_LOGS.map((log) => (
            <Row key={log.id}>
              <Cell num nowrap muted>
                {log.at}
              </Cell>
              <Cell strong>
                <span className="block">{log.target}</span>
                <span className="mt-0.5 block text-[12px] text-[var(--cp-mute)]">
                  {log.source}
                </span>
              </Cell>
              <Cell nowrap>{log.field}</Cell>
              <Cell>
                <span className="block text-[12.5px] text-[var(--cp-mute)] line-through">
                  {log.before}
                </span>
                <span className="mt-0.5 block text-[13px] font-medium text-[var(--cp-ink)]">
                  {log.after}
                </span>
              </Cell>
              <Cell align="right" nowrap muted>
                {log.by}
              </Cell>
            </Row>
          ))}
        </Table>
      </Card>

      {/* 등록 / 수정 폼 */}
      <Drawer
        open={drawerOpen}
        title={creating ? "신규 데이터 등록" : (editing?.name ?? "")}
        subtitle={creating ? "저장 전에는 사용자 화면에 노출되지 않습니다" : editing?.id}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        footer={
          <div className="flex items-center justify-between gap-3">
            {!creating && (
              <Button variant="danger" icon={<Warning size={14} weight="bold" />}>
                노출 중지
              </Button>
            )}
            <div className="ml-auto flex gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  setCreating(false);
                  setEditing(null);
                }}
              >
                취소
              </Button>
              <Button icon={<PencilSimpleLine size={14} weight="bold" />}>저장</Button>
            </div>
          </div>
        }
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="이름" required hint="가명 규칙을 따릅니다. 실제 상호를 쓰지 않습니다">
              <Input value={editing?.name ?? ""} placeholder="예: A 상점가 공중화장실" />
            </Field>
            <Field label="구분" required>
              <Select value={editing?.kind ?? "시설"} options={["시설", "매장"]} />
            </Field>
            <Field label="분류" required>
              <Input value={editing?.category ?? ""} placeholder="예: AED, 농수산 / 청과" />
            </Field>
            <Field label="상권 구역" required>
              <Select
                value={editing?.zoneCode ?? DISTRICTS[0].zoneCode}
                options={DISTRICTS.map((d) => d.zoneCode)}
              />
            </Field>
          </div>

          <Field label="도로명 주소" required hint="행정동은 가명 표기, 도로명과 건물번호는 실제 값">
            <Input value={editing?.address ?? ""} placeholder="예: △△동 시장로 9" />
          </Field>

          <Field
            label="상대 위치"
            hint="주소만으로 찾기 어려운 골목, 건물 안 위치를 보조로 적습니다"
          >
            <Textarea
              value={editing?.relativeLocation ?? ""}
              placeholder="예: 상점가 내 1구역, 시장 입구 아치 왼편"
              rows={2}
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="가상 좌표 X" hint="추상화 지도 캔버스 0~100 값">
              <Input value="46.0" suffix="x" />
            </Field>
            <Field label="가상 좌표 Y" hint="실제 좌표계와 매핑되지 않습니다">
              <Input value="58.0" suffix="y" />
            </Field>
          </div>

          <div className="flex items-center justify-between rounded-[6px] border border-[var(--cp-hairline)] bg-[var(--cp-soft)] px-4 py-3">
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-[var(--cp-ink)]">온누리상품권 가맹</p>
              <p className="mt-0.5 text-[12px] text-[var(--cp-mute)]">
                매장에만 적용됩니다. 해지 시 사용자 화면 배지가 즉시 사라집니다
              </p>
            </div>
            <Toggle
              on={editing?.onnuri ?? false}
              onChange={() => undefined}
              label="온누리상품권 가맹 여부"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="정보 출처" required>
              <Select value={editing?.source ?? SOURCE_OPTIONS[0]} options={SOURCE_OPTIONS} />
            </Field>
            <Field label="데이터 기준일" required>
              <Input value={editing?.baseDate ?? ADMIN_SUMMARY.baseDate} />
            </Field>
          </div>

          {editing && (
            <div className="rounded-[6px] border border-[var(--cp-hairline)] p-4">
              <p className="mb-2 text-[13px] font-medium text-[var(--cp-ink)]">현재 저장된 값</p>
              <DefList
                columns={1}
                items={[
                  { label: "관리번호", value: <span className="cp-num">{editing.id}</span> },
                  { label: "구역", value: <span className="cp-num">{editing.zoneCode}</span> },
                  { label: "출처", value: editing.source },
                  { label: "기준일", value: <span className="cp-num">{editing.baseDate}</span> },
                  {
                    label: "검증",
                    value: editing.verified ? (
                      <Badge tone="ok">검증됨</Badge>
                    ) : (
                      <Badge tone="warn">실사 대기</Badge>
                    ),
                  },
                ]}
              />
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
}
