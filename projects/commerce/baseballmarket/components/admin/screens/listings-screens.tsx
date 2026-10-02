"use client";

import { useState } from "react";
import { Warning } from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  Cell,
  Chip,
  DefList,
  DetailPanel,
  Input,
  MonoIndex,
  Pagination,
  Row,
  SearchInput,
  Select,
  Table,
  TeamMark,
} from "@/projects/commerce/baseballmarket/components/ui";
import {
  BANNED_KEYWORDS,
  CATEGORY_TILES,
  KRW,
  LISTINGS,
  OVERPRICE_HITS,
  PRICE_RULES,
  TEAMS,
  overFaceRatio,
  seller,
  teamLabel,
} from "@/projects/commerce/baseballmarket/lib/mock-data";

/* 매물 / 티켓 섹션의 5개 뷰. */

export function ListingTableScreen() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("전체");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);

  const rows = LISTINGS.filter(
    (l) => (cat === "전체" || l.category === cat) && (!q || l.title.includes(q)),
  );
  const sel = rows.find((l) => l.id === selected) ?? null;

  return (
    <div className="flex flex-col gap-5 xl:flex-row">
      <div className="min-w-0 flex-1">
        <div className="mb-4 flex flex-wrap items-center gap-2.5">
          <div className="w-full sm:w-[280px]">
            <SearchInput value={q} onChange={setQ} placeholder="매물명 검색" />
          </div>
          <div className="w-[148px]">
            <Select value={cat} onChange={setCat} options={["전체", "유니폼", "굿즈", "티켓"]} />
          </div>
          <span className="bm-num ml-auto text-[13px] text-[var(--bm-muted)]">{rows.length}건</span>
        </div>

        {/* 디테일 패널과 나란히 서므로 5열 640px 예산이다 (design.md 표 밀도 절).
            판매자는 매물 셀 2번째 줄로, 시즌은 구단 셀 2번째 줄로 내렸다. */}
        <Table head={["매물 / 판매자", "구단 / 시즌", "카테고리", "판매가", "상태"]} minWidth={640}>
          {rows.map((l) => (
            <Row key={l.id} onClick={() => setSelected(l.id)} active={selected === l.id}>
              <Cell strong className="max-w-[220px]">
                <span className="block truncate">{l.title}</span>
                <span className="block truncate text-[12px] font-normal text-[var(--bm-muted)]">
                  {seller(l.sellerId).nickname}
                </span>
              </Cell>
              <Cell>
                <span className="flex items-center gap-2">
                  <TeamMark id={l.team} size={22} />
                  <span className="min-w-0">
                    <span className="block truncate text-[13px]">{teamLabel(l.team)}</span>
                    <span className="bm-num block text-[12px] text-[var(--bm-muted)]">
                      {l.uniform ? `${l.uniform.season} ${l.uniform.kind}` : l.ticket?.gameDate.slice(5) ?? "-"}
                    </span>
                  </span>
                </span>
              </Cell>
              <Cell>{l.category}</Cell>
              <Cell num strong>
                {KRW(l.price)}
              </Cell>
              <Cell>
                <Badge
                  tone={
                    l.status === "판매중"
                      ? "success"
                      : l.status === "노출중단"
                        ? "danger"
                        : "neutral"
                  }
                >
                  {l.status}
                </Badge>
              </Cell>
            </Row>
          ))}
        </Table>
        <Pagination page={page} total={4} onChange={setPage} />
      </div>

      {sel && (
        <DetailPanel
          title={sel.title}
          sub={`${teamLabel(sel.team)} | ${sel.category}`}
          onClose={() => setSelected(null)}
          foot={
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" full size="sm">
                수정
              </Button>
              <Button variant="danger" full size="sm">
                노출 중단
              </Button>
            </div>
          }
        >
          <DefList
            rows={[
              { label: "판매가", value: <span className="bm-num">{KRW(sel.price)}</span> },
              {
                label: "정가",
                value: <span className="bm-num">{sel.facePrice ? KRW(sel.facePrice) : "-"}</span>,
              },
              { label: "상태 등급", value: sel.condition },
              { label: "거래 방식", value: sel.method.join(" / ") },
              { label: "지역", value: sel.dong },
              { label: "판매자", value: seller(sel.sellerId).nickname },
              { label: "등록", value: <span className="bm-num">{sel.createdAt.slice(0, 10)}</span> },
            ]}
          />
          {sel.category === "티켓" && overFaceRatio(sel) > 10 && (
            <div className="flex items-start gap-2.5 rounded-[8px] bg-[var(--bm-error-soft)] p-3.5">
              <Warning size={15} weight="fill" className="mt-0.5 shrink-0 text-[var(--bm-error-deep)]" />
              <p className="text-[13px] leading-[20px] text-[var(--bm-error-deep)]">
                정가 대비 +{overFaceRatio(sel)}%로 자동 탐지 목록에 올라 있습니다.
              </p>
            </div>
          )}
          <div>
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--bm-muted)]">
              설명
            </p>
            <p className="text-[13px] leading-[20px] text-[var(--bm-body)]">{sel.desc}</p>
          </div>
        </DetailPanel>
      )}
    </div>
  );
}

export function OverPriceScreen() {
  const [selected, setSelected] = useState<string | null>(OVERPRICE_HITS[0].id);
  const sel = OVERPRICE_HITS.find((h) => h.id === selected) ?? null;

  return (
    <div className="space-y-5">
      <Card tone="card">
        <div className="flex flex-wrap items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold leading-[21px] text-[var(--bm-ink)]">
              정가 기준표 대비 10퍼센트 초과 매물을 자동으로 잡습니다
            </p>
            <p className="mt-1 text-[13px] leading-[20px] text-[var(--bm-muted)]">
              기준표 v4.2 기준으로 매 30분마다 재검사합니다. 허용 처리한 매물은 다음 검사에서 제외됩니다.
            </p>
          </div>
          <Badge tone="danger">
            미처리 {OVERPRICE_HITS.filter((h) => h.state === "미처리").length}건
          </Badge>
        </div>
      </Card>

      <div className="flex flex-col gap-5 xl:flex-row">
        <div className="min-w-0 flex-1">
          {/* 원래 7열로 잡았다가 잘렸다. 디테일 패널과 나란히 서면 가용폭이 700px라
              940도 1040도 들어가지 않는다. 구장과 구역, 정가와 판매가를 각각 한 셀
              2줄로 접어 5열 640px로 맞췄다 (design.md 표 밀도 절). */}
          <Table
            head={["매물", "구장 / 구역", "정가 → 판매가", "초과율", "상태"]}
            minWidth={640}
          >
            {OVERPRICE_HITS.map((h) => {
              const ratio = Math.round(((h.asking - h.face) / h.face) * 100);
              return (
                <Row key={h.id} onClick={() => setSelected(h.id)} active={selected === h.id}>
                  <Cell strong className="max-w-[200px]">
                    <span className="block truncate">{h.listingLabel}</span>
                  </Cell>
                  <Cell>
                    <span className="block truncate text-[13px]">{h.stadium}</span>
                    <span className="block truncate text-[12px] text-[var(--bm-muted)]">
                      {h.zone}
                    </span>
                  </Cell>
                  <Cell num>
                    <span className="block text-[12px] text-[var(--bm-muted)] line-through">
                      {KRW(h.face)}
                    </span>
                    <span className="block font-semibold text-[var(--bm-ink)]">
                      {KRW(h.asking)}
                    </span>
                  </Cell>
                  <Cell num>
                    <span
                      className="font-semibold"
                      style={{ color: ratio > 10 ? "var(--bm-error-deep)" : "var(--bm-link-deep)" }}
                    >
                      +{ratio}%
                    </span>
                  </Cell>
                  <Cell>
                    <Badge
                      tone={
                        h.state === "미처리" ? "danger" : h.state === "노출중단" ? "neutral" : "success"
                      }
                    >
                      {h.state}
                    </Badge>
                  </Cell>
                </Row>
              );
            })}
          </Table>
        </div>

        {sel && (
          <DetailPanel
            title={sel.listingLabel}
            sub={`${sel.stadium} ${sel.zone}`}
            onClose={() => setSelected(null)}
            foot={
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" full size="sm">
                  허용
                </Button>
                <Button variant="danger" full size="sm">
                  노출 중단
                </Button>
              </div>
            }
          >
            <DefList
              rows={[
                { label: "좌석 정가", value: <span className="bm-num">{KRW(sel.face)}</span> },
                { label: "판매 요청가", value: <span className="bm-num">{KRW(sel.asking)}</span> },
                {
                  label: "차액",
                  value: <span className="bm-num">{KRW(sel.asking - sel.face)}</span>,
                },
                { label: "판매자", value: sel.seller },
                { label: "탐지 시각", value: <span className="bm-num">{sel.detectedAt}</span> },
              ]}
            />
            <div className="rounded-[8px] bg-[var(--bm-surface)] p-4">
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--bm-muted)]">
                처리 메모
              </p>
              <p className="mt-2 text-[13px] leading-[20px] text-[var(--bm-body)]">
                예매 수수료를 포함해도 기준을 넘습니다. 판매자에게 정가 이하 재등록을 안내한 뒤
                노출을 중단하는 것이 표준 절차입니다.
              </p>
            </div>
          </DetailPanel>
        )}
      </div>
    </div>
  );
}

export function PriceRulesScreen() {
  const [q, setQ] = useState("");
  const rows = PRICE_RULES.filter((r) => !q || r.stadium.includes(q) || r.zone.includes(q));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="w-full sm:w-[280px]">
          <SearchInput value={q} onChange={setQ} placeholder="구장 또는 구역" />
        </div>
        <Badge tone="neutral">현재 버전 v4.2</Badge>
        <div className="ml-auto">
          <Button size="sm">기준표 추가</Button>
        </div>
      </div>

      <Table head={["구장", "좌석 구역", "평일 정가", "주말 정가", "갱신일", "버전"]}>
        {rows.map((r) => (
          <Row key={r.id}>
            <Cell strong>{r.stadium}</Cell>
            <Cell>{r.zone}</Cell>
            <Cell num>{KRW(r.weekday)}</Cell>
            <Cell num>{KRW(r.weekend)}</Cell>
            <Cell num>{r.updatedAt}</Cell>
            <Cell>
              <Badge tone={r.version === "v4.2" ? "success" : "neutral"}>{r.version}</Badge>
            </Cell>
          </Row>
        ))}
      </Table>

      <Card tone="soft">
        <p className="text-[13px] font-semibold leading-[18px] text-[var(--bm-body-strong)]">
          기준표 운영 원칙
        </p>
        <ul className="mt-3 space-y-2 text-[13px] leading-[20px] text-[var(--bm-body)]">
          <li>각 구장 공시 가격을 기준으로 주 단위로 갱신하며, 갱신 시 버전을 올립니다.</li>
          <li>버전이 올라가면 기존 매물은 재검사 대상이 되고 자동 탐지 목록이 다시 계산됩니다.</li>
          <li>예매 수수료를 감안해 기준 대비 10퍼센트까지는 정상 범위로 봅니다.</li>
        </ul>
      </Card>
    </div>
  );
}

export function MasterDataScreen() {
  const [tab, setTab] = useState<"category" | "team">("category");

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <Chip label="카테고리" active={tab === "category"} onClick={() => setTab("category")} />
        <Chip label="구단" active={tab === "team"} onClick={() => setTab("team")} />
      </div>

      {tab === "category" ? (
        <Table head={["순번", "카테고리", "설명", "지표", "노출"]}>
          {CATEGORY_TILES.map((c) => (
            <Row key={c.key}>
              <Cell>
                <MonoIndex n={c.index} />
              </Cell>
              <Cell strong>{c.label}</Cell>
              <Cell>{c.sub}</Cell>
              <Cell num>{c.metric}</Cell>
              <Cell>
                <Badge tone="success">노출중</Badge>
              </Cell>
            </Row>
          ))}
        </Table>
      ) : (
        <Table head={["구단", "연고", "홈 구장", "등록 매물", "활성 지수"]}>
          {TEAMS.map((t, i) => (
            <Row key={t.id}>
              <Cell strong>
                <span className="flex items-center gap-2">
                  <TeamMark id={t.id} size={24} />
                  {t.name}
                </span>
              </Cell>
              <Cell>{t.city}</Cell>
              <Cell>{t.stadium}</Cell>
              <Cell num>{[1284, 1102, 987, 764, 702, 651, 588, 512, 431, 388][i]}</Cell>
              <Cell num>{[92, 88, 81, 66, 61, 54, 47, 41, 33, 28][i]}</Cell>
            </Row>
          ))}
        </Table>
      )}
    </div>
  );
}

export function BannedItemsScreen() {
  const [word, setWord] = useState("");
  const rows = BANNED_KEYWORDS.filter((k) => k.scope !== "게시글");

  return (
    <div className="space-y-5">
      <Card tone="card">
        <p className="text-[15px] font-semibold leading-[21px] text-[var(--bm-ink)]">
          금지 품목 키워드
        </p>
        <p className="mt-1 text-[13px] leading-[20px] text-[var(--bm-muted)]">
          매물 제목과 설명에서 이 키워드가 발견되면 등록 단계에서 경고하고 검토 대상으로 올립니다.
        </p>
        <div className="mt-4 flex gap-2.5">
          <div className="flex-1">
            <Input value={word} onChange={setWord} placeholder="추가할 키워드" />
          </div>
          <Button>추가</Button>
        </div>
      </Card>

      <Table head={["키워드", "적용 범위", "탐지 건수", "등록일", "등록자"]}>
        {rows.map((k) => (
          <Row key={k.id}>
            <Cell strong>{k.word}</Cell>
            <Cell>
              <Badge tone="neutral">{k.scope}</Badge>
            </Cell>
            <Cell num>{k.hits}</Cell>
            <Cell num>{k.addedAt}</Cell>
            <Cell>{k.addedBy}</Cell>
          </Row>
        ))}
      </Table>
    </div>
  );
}
