"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowClockwise,
  CheckCircle,
  DownloadSimple,
  FileXls,
  Info,
  Plus,
  Sparkle,
  UploadSimple,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  CardHead,
  Cell,
  DefList,
  Field,
  Input,
  Meter,
  PageHead,
  Row,
  Select,
  Table,
  Tabs,
} from "@/projects/b2b/assetflow/components/ui";
import { bulkRows, makerSuggestions } from "@/projects/b2b/assetflow/lib/mock-data";
import { CATEGORY_LABEL, won, type Navigate } from "@/projects/b2b/assetflow/lib/navigation";
import type { Grade } from "@/projects/b2b/assetflow/lib/types";

type Mode = "single" | "bulk";

const CATEGORIES = Object.values(CATEGORY_LABEL);
const GRADES: Grade[] = ["A", "B", "C", "D"];
const GRADE_HINT: Record<Grade, string> = {
  A: "미세 사용감, 기능 이상 없음",
  B: "생활 스크래치, 기능 이상 없음",
  C: "외관 손상 또는 부속 누락",
  D: "기능 이상, 부품 회수 대상",
};

/** 사진 업로드 미리보기. 직접 확인한 노트북 사진 id만 쓴다. */
const UPLOADED = [
  { id: 0, name: "front_01.jpg", size: "2.4MB" },
  { id: 8, name: "keyboard_02.jpg", size: "1.9MB" },
  { id: 9, name: "side_03.jpg", size: "2.1MB" },
];

/** 감가 계수는 mock. 실제 AI 시세 산출 로직은 구현하지 않는다. */
const GRADE_FACTOR: Record<Grade, number> = { A: 1.06, B: 0.94, C: 0.78, D: 0.52 };

export function RegisterScreen({ onNavigate }: { onNavigate: Navigate }) {
  const [mode, setMode] = useState<Mode>("single");

  const [name, setName] = useState("업무용 노트북 14형");
  const [query, setQuery] = useState("KB-14");
  const [picked, setPicked] = useState<(typeof makerSuggestions)[number] | null>(makerSuggestions[0]);
  const [category, setCategory] = useState("노트북");
  const [quantity, setQuantity] = useState("42");
  const [purchasedAt, setPurchasedAt] = useState("2023-03");
  const [grade, setGrade] = useState<Grade>("B");
  const [note, setNote] = useState("상판 미세 스크래치 다수, 충전기 전량 포함");
  const [photos, setPhotos] = useState(UPLOADED);
  const [computedAt, setComputedAt] = useState("07. 28 09:41");

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return makerSuggestions.filter(
      (s) =>
        s.model.toLowerCase().includes(q) ||
        s.maker.toLowerCase().includes(q) ||
        s.spec.toLowerCase().includes(q),
    );
  }, [query]);

  const qty = Number(quantity) || 0;
  const months = useMemo(() => {
    const [y, m] = purchasedAt.split("-").map(Number);
    if (!y || !m) return 0;
    return Math.max(0, (2026 - y) * 12 + (7 - m));
  }, [purchasedAt]);

  const listPrice = picked?.listPrice ?? 0;
  const timeFactor = Math.max(0.12, 1 - months * 0.018);
  const volumeFactor = qty >= 30 ? 1.07 : qty >= 10 ? 1.03 : 1;
  const unit = Math.round((listPrice * timeFactor * GRADE_FACTOR[grade] * volumeFactor) / 1000) * 1000;
  const total = unit * qty;
  const confidence = picked ? Math.min(96, 62 + Math.round(qty / 2) + (months < 36 ? 12 : 4)) : 0;

  const okRows = bulkRows.filter((r) => r.ok).length;
  const errorRows = bulkRows.length - okRows;

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow="자산 등록"
        title="매각할 자산 등록"
        desc="제조사와 모델명을 입력하면 사양이 자동으로 채워지고, 등록 즉시 AI 자동 시세가 산출됩니다. 수량이 많으면 엑셀로 한 번에 올릴 수 있습니다."
        actions={
          <Button
            variant="secondary"
            size="md"
            icon={<DownloadSimple size={14} />}
            onClick={() => undefined}
          >
            엑셀 양식 받기
          </Button>
        }
      />

      <Tabs
        value={mode}
        onChange={setMode}
        items={[
          { key: "single" as Mode, label: "개별 등록" },
          { key: "bulk" as Mode, label: "엑셀 일괄 등록", count: bulkRows.length },
        ]}
      />

      {mode === "single" ? (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="space-y-6">
            <Card>
              <CardHead title="자산 정보" desc="필수 항목만 채워도 자동 시세를 받아볼 수 있습니다." />
              <div className="space-y-5">
                <Field label="자산명" required>
                  <Input value={name} onChange={setName} placeholder="예: 업무용 노트북 14형" />
                </Field>

                <Field
                  label="제조사 / 모델명"
                  required
                  hint="모델명 일부만 입력해도 등록된 사양 DB에서 자동으로 찾아줍니다."
                >
                  <div className="relative">
                    <Input
                      value={query}
                      onChange={(next) => {
                        setQuery(next);
                        setPicked(null);
                      }}
                      placeholder="예: KB-1440U"
                    />
                    {matches.length > 0 && !picked && (
                      <ul className="af-enter absolute left-0 right-0 top-11 z-20 overflow-hidden rounded-[6px] border border-[var(--af-hairline)] bg-[var(--af-canvas)] shadow-[var(--af-shadow-pop)]">
                        {matches.map((match) => (
                          <li key={`${match.maker}-${match.model}`}>
                            <button
                              type="button"
                              onClick={() => {
                                setPicked(match);
                                setQuery(match.model);
                              }}
                              className="flex w-full items-center justify-between gap-4 border-b border-[var(--af-hairline)] px-3 py-2.5 text-left transition-colors last:border-b-0 hover:bg-[var(--af-soft)]"
                            >
                              <span className="min-w-0">
                                <span className="block text-[13.5px] font-medium text-[var(--af-ink)]">
                                  {match.maker} {match.model}
                                </span>
                                <span className="block truncate text-[12px] text-[var(--af-mute)]">
                                  {match.spec}
                                </span>
                              </span>
                              <span className="af-mono shrink-0 text-[12px] text-[var(--af-mute)]">
                                신품 {won(match.listPrice)}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Field>

                {picked && (
                  <div className="flex items-start gap-2.5 rounded-[6px] border border-[var(--af-hairline)] bg-[var(--af-soft)] px-3.5 py-3">
                    <CheckCircle
                      size={15}
                      weight="fill"
                      className="mt-px shrink-0 text-[var(--af-link)]"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium text-[var(--af-ink)]">
                        {picked.maker} {picked.model} 사양을 불러왔습니다
                      </p>
                      <p className="af-mono mt-0.5 text-[12px] text-[var(--af-body)]">{picked.spec}</p>
                    </div>
                    <button
                      type="button"
                      aria-label="선택 해제"
                      onClick={() => setPicked(null)}
                      className="shrink-0 text-[var(--af-mute)] transition-colors hover:text-[var(--af-ink)]"
                    >
                      <X size={13} />
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <Field label="분류" required>
                    <Select value={category} options={CATEGORIES} onChange={setCategory} />
                  </Field>
                  <Field label="수량" required>
                    <Input value={quantity} onChange={setQuantity} suffix="대" />
                  </Field>
                  <Field label="구매 시기" required>
                    <Input value={purchasedAt} onChange={setPurchasedAt} type="month" />
                  </Field>
                </div>

                <Field label="자가 신고 등급" required hint={GRADE_HINT[grade]}>
                  <div className="flex gap-2">
                    {GRADES.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGrade(g)}
                        aria-pressed={grade === g}
                        className={`h-10 flex-1 rounded-[6px] border text-[14px] font-medium transition-colors ${
                          grade === g
                            ? "border-[var(--af-primary)] bg-[var(--af-primary)] text-[var(--af-on-primary)]"
                            : "border-[var(--af-hairline)] bg-[var(--af-canvas)] text-[var(--af-body)] hover:bg-[var(--af-soft)]"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="상태 특이사항" hint="검수원이 현장에서 확인할 항목입니다. 정확할수록 최종가 변동이 적습니다.">
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-[6px] border border-[var(--af-hairline)] bg-[var(--af-canvas)] px-3 py-2.5 text-[14px] leading-6 text-[var(--af-ink)] outline-none transition-colors placeholder:text-[var(--af-mute)] focus:border-[var(--af-hairline-strong)]"
                  />
                </Field>
              </div>
            </Card>

            <Card>
              <CardHead
                title="사진 업로드"
                desc="정면, 상판, 키보드, 포트부 4장 이상 권장. 사진이 많을수록 자동 시세 신뢰도가 올라갑니다."
                action={<Badge tone="neutral">{photos.length} / 10</Badge>}
              />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {photos.map((photo) => (
                  <figure
                    key={photo.id}
                    className="group relative overflow-hidden rounded-[6px] border border-[var(--af-hairline)]"
                  >
                    <Image
                      src={`https://picsum.photos/id/${photo.id}/320/240`}
                      alt={`업로드한 자산 사진 ${photo.name}`}
                      width={160}
                      height={120}
                      className="h-[104px] w-full object-cover"
                    />
                    <button
                      type="button"
                      aria-label={`${photo.name} 삭제`}
                      onClick={() => setPhotos((prev) => prev.filter((p) => p.id !== photo.id))}
                      className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-[4px] bg-[rgba(23,23,23,0.72)] text-white transition-colors hover:bg-[var(--af-primary)]"
                    >
                      <X size={11} />
                    </button>
                    <figcaption className="af-mono border-t border-[var(--af-hairline)] bg-[var(--af-soft)] px-2 py-1.5 text-[11px] text-[var(--af-mute)]">
                      {photo.name} | {photo.size}
                    </figcaption>
                  </figure>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setPhotos((prev) =>
                      prev.length >= 10
                        ? prev
                        : [...prev, { id: 2, name: `port_0${prev.length + 1}.jpg`, size: "1.7MB" }],
                    )
                  }
                  className="flex h-[133px] flex-col items-center justify-center gap-1.5 rounded-[6px] border border-dashed border-[var(--af-hairline-strong)] bg-[var(--af-soft)] text-[var(--af-mute)] transition-colors hover:border-[var(--af-primary)] hover:text-[var(--af-ink)]"
                >
                  <Plus size={16} weight="bold" />
                  <span className="text-[12.5px]">사진 추가</span>
                </button>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="xl:sticky xl:top-24">
              <CardHead
                title="AI 자동 시세"
                desc="입력값이 바뀔 때마다 즉시 다시 계산합니다."
                action={
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<ArrowClockwise size={12} />}
                    onClick={() => setComputedAt("07. 28 09:41")}
                    ariaLabel="시세 다시 계산"
                  >
                    갱신
                  </Button>
                }
              />

              {picked && qty > 0 ? (
                <>
                  <div className="rounded-[8px] border border-[var(--af-primary)] bg-[var(--af-primary)] p-5 text-[var(--af-on-primary)]">
                    <p className="flex items-center gap-1.5 text-[12.5px] text-white/70">
                      <Sparkle size={12} weight="fill" />
                      예상 매각 총액
                    </p>
                    <p className="mt-2 text-[30px] font-semibold leading-9 tracking-[-0.04em]">
                      {won(total)}
                    </p>
                    <p className="af-mono mt-1.5 text-[12.5px] text-white/70">
                      대당 {won(unit)} × {qty}대
                    </p>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-baseline justify-between">
                      <p className="text-[13px] text-[var(--af-mute)]">시세 신뢰도</p>
                      <p className="af-mono text-[13px] font-medium text-[var(--af-ink)]">
                        {confidence}%
                      </p>
                    </div>
                    <div className="mt-2">
                      <Meter value={confidence} />
                    </div>
                    <p className="mt-2 text-[12px] leading-4 text-[var(--af-mute)]">
                      사진 {photos.length}장, 동일 모델 최근 거래 17건을 반영했습니다.
                    </p>
                  </div>

                  <div className="mt-5 border-t border-[var(--af-hairline)] pt-4">
                    <DefList
                      columns={1}
                      items={[
                        { label: "신품가 (대당)", value: won(listPrice) },
                        { label: "사용 기간", value: `${months}개월` },
                        {
                          label: "기간 감가",
                          value: (
                            <span className="text-[var(--af-error-deep)]">
                              {Math.round((timeFactor - 1) * 100)}%
                            </span>
                          ),
                        },
                        {
                          label: `등급 ${grade} 보정`,
                          value: (
                            <span
                              className={
                                GRADE_FACTOR[grade] >= 1
                                  ? "text-[var(--af-link-deep)]"
                                  : "text-[var(--af-error-deep)]"
                              }
                            >
                              {GRADE_FACTOR[grade] >= 1 ? "+" : ""}
                              {Math.round((GRADE_FACTOR[grade] - 1) * 100)}%
                            </span>
                          ),
                        },
                        {
                          label: "수량 보정",
                          value: (
                            <span className="text-[var(--af-link-deep)]">
                              +{Math.round((volumeFactor - 1) * 100)}%
                            </span>
                          ),
                        },
                        { label: "산출 시각", value: <span className="af-mono">{computedAt}</span> },
                      ]}
                    />
                  </div>

                  <div className="mt-5 flex items-start gap-2 rounded-[6px] bg-[var(--af-soft)] px-3.5 py-3">
                    <Info size={14} className="mt-px shrink-0 text-[var(--af-mute)]" />
                    <p className="text-[12px] leading-[18px] text-[var(--af-body)]">
                      자동 시세는 참고용 기준가입니다. 현장 검수 후 등급이 조정되면 최종 입찰가는
                      달라질 수 있습니다.
                    </p>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <Button variant="secondary" full onClick={() => undefined}>
                      임시 저장
                    </Button>
                    <Button full onClick={() => onNavigate("assetDetail", "a1")}>
                      등록하고 견적 확인
                    </Button>
                  </div>
                </>
              ) : (
                <div className="rounded-[8px] border border-dashed border-[var(--af-hairline-strong)] bg-[var(--af-soft)] px-5 py-10 text-center">
                  <p className="text-[13.5px] font-medium text-[var(--af-ink)]">
                    모델명과 수량을 입력해 주세요
                  </p>
                  <p className="mt-1.5 text-[12.5px] leading-5 text-[var(--af-mute)]">
                    사양 DB에서 모델을 선택하면 자동 시세가 바로 계산됩니다.
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHead
              title="엑셀 일괄 등록"
              desc="양식 파일에 자산을 채워 올리면 행 단위로 검증합니다. 오류가 있는 행만 고쳐서 다시 올릴 수 있습니다."
            />
            <div className="flex flex-col items-center justify-center gap-3 rounded-[8px] border border-dashed border-[var(--af-hairline-strong)] bg-[var(--af-soft)] px-6 py-10">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--af-hairline)] bg-[var(--af-canvas)] text-[var(--af-body)]">
                <UploadSimple size={18} weight="bold" />
              </span>
              <p className="text-[14px] font-medium text-[var(--af-ink)]">
                파일을 끌어다 놓거나 선택하세요
              </p>
              <p className="text-[12.5px] text-[var(--af-mute)]">
                .xlsx | 최대 5MB | 한 번에 500행까지
              </p>
              <div className="mt-1 flex gap-2">
                <Button variant="secondary" size="sm" icon={<DownloadSimple size={13} />}>
                  양식 받기
                </Button>
                <Button size="sm" icon={<UploadSimple size={13} />}>
                  파일 선택
                </Button>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-[6px] border border-[var(--af-hairline)] px-4 py-3">
              <span className="flex min-w-0 items-center gap-2.5">
                <FileXls size={20} className="shrink-0 text-[var(--af-body)]" />
                <span className="min-w-0">
                  <span className="block truncate text-[13.5px] font-medium text-[var(--af-ink)]">
                    2026Q3_처분자산_목록.xlsx
                  </span>
                  <span className="af-mono block text-[11.5px] text-[var(--af-mute)]">
                    248KB | 07. 28 09:38 업로드
                  </span>
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-2">
                <Badge tone="ink">{okRows}행 정상</Badge>
                <Badge tone="danger">{errorRows}행 오류</Badge>
              </span>
            </div>
          </Card>

          <Card>
            <CardHead
              title="검증 결과"
              desc="오류 행은 등록되지 않습니다. 수정 후 해당 행만 다시 올려도 됩니다."
              action={
                <Button size="sm" disabled={okRows === 0}>
                  정상 {okRows}행 등록
                </Button>
              }
            />
            <Table
              head={["행", "임시 코드", "자산명", "제조사", "모델", "수량", "검증"]}
              align={["right", "left", "left", "left", "left", "right", "left"]}
            >
              {bulkRows.map((row) => (
                <Row key={row.row}>
                  <Cell align="right" mono muted>
                    {row.row}
                  </Cell>
                  <Cell mono>{row.code}</Cell>
                  <Cell strong>{row.name}</Cell>
                  <Cell>{row.maker}</Cell>
                  <Cell mono>{row.model}</Cell>
                  <Cell align="right" mono>
                    {row.qty}
                  </Cell>
                  <Cell>
                    <span className="flex items-center gap-1.5">
                      {row.ok ? (
                        <CheckCircle size={14} weight="fill" className="shrink-0 text-[var(--af-link)]" />
                      ) : (
                        <WarningCircle
                          size={14}
                          weight="fill"
                          className="shrink-0 text-[var(--af-error)]"
                        />
                      )}
                      <span className={row.ok ? "" : "text-[var(--af-error-deep)]"}>
                        {row.message}
                      </span>
                    </span>
                  </Cell>
                </Row>
              ))}
            </Table>
          </Card>
        </div>
      )}
    </div>
  );
}
