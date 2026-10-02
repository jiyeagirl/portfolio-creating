"use client";

import { useMemo, useState } from "react";
import {
  BookmarkSimple,
  MagnifyingGlass,
  Plus,
  Sparkle,
  TrendUp,
} from "@phosphor-icons/react";
import {
  Badge,
  Button,
  Card,
  CardHead,
  Cell,
  ChannelTag,
  DefList,
  Drawer,
  EmptyState,
  Eyebrow,
  Field,
  FilterChips,
  Input,
  PageHead,
  Preview,
  RankBars,
  Row,
  Select,
  Stat,
  Table,
  Toggle,
} from "@/projects/monitoring/brandpilot/components/ui";
import {
  aiKeywordInsights,
  collectPipeline,
  refCategories,
  referenceSummary,
  references,
  refSources,
} from "@/projects/monitoring/brandpilot/lib/mock-data";
import {
  CHANNEL_LABEL,
  num,
  SOURCE_STATE_LABEL,
  SOURCE_STATE_TONE,
} from "@/projects/monitoring/brandpilot/lib/navigation";
import type { Reference } from "@/projects/monitoring/brandpilot/lib/types";

type Filter = "all" | "bookmarked" | string;

const PLATFORMS = ["Meta", "Instagram", "TikTok", "YouTube", "Naver"];

export function ReferencesScreen() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState<Reference | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newPlatform, setNewPlatform] = useState(PLATFORMS[0]);
  const [newEndpoint, setNewEndpoint] = useState("");
  const [newKeywords, setNewKeywords] = useState("");
  const [sources, setSources] = useState<Record<string, boolean>>(
    Object.fromEntries(refSources.map((s) => [s.id, s.enabled])),
  );
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>(
    Object.fromEntries(references.map((r) => [r.id, r.bookmarked])),
  );

  const activeSources = Object.values(sources).filter(Boolean).length;
  const savedCount = Object.values(bookmarks).filter(Boolean).length;
  const weekly = refSources
    .filter((s) => sources[s.id])
    .reduce((sum, s) => sum + s.weekly, 0);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return references.filter((r) => {
      const inFilter =
        filter === "all"
          ? true
          : filter === "bookmarked"
            ? bookmarks[r.id]
            : r.categoryId === filter;
      if (!inFilter) return false;
      if (!q) return true;
      return [r.title, r.categoryLabel, r.sourceName, ...r.keywords]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [filter, query, bookmarks]);

  return (
    <div className="space-y-8">
      <PageHead
        eyebrow="브랜드"
        title="레퍼런스 탐색"
        desc="Meta 광고 라이브러리, Instagram Graph API 등 각 플랫폼이 공개한 API로 업계 광고를 수집하고 소구 방식에 따라 분류합니다. 검색해서 찾은 캠페인 사례를 저장해 두면 콘텐츠 생성 화면에서 참고 자료로 바로 불러옵니다."
        actions={
          <Button
            size="md"
            variant="secondary"
            onClick={() => setAddOpen(true)}
            icon={<Plus size={14} />}
          >
            소스 연동
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="누적 수집 레퍼런스" value={`${num(1284)}건`} delta="+118" note="최근 30일" />
        <Stat label="이번 주 신규" value={`${weekly}건`} delta="+12" note="지난주 대비" emphasis />
        <Stat label="저장한 캠페인 사례" value={`${savedCount}건`} note="콘텐츠 생성에서 인용" />
        <Stat
          label="연동 소스"
          value={`${activeSources}/${refSources.length}`}
          note="공개 API만 사용"
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <div className="space-y-3">
            <div className="sm:max-w-[320px]">
              <Input value={query} onChange={setQuery} placeholder="키워드, 분류, 소재명 검색" />
            </div>
            <FilterChips
              value={filter}
              onChange={setFilter}
              items={[
                { key: "all", label: "전체", count: references.length },
                { key: "bookmarked", label: "북마크", count: savedCount },
                ...refCategories.map((c) => ({
                  key: c.id,
                  label: c.label,
                  count: references.filter((r) => r.categoryId === c.id).length,
                })),
              ]}
            />
          </div>

          {visible.length === 0 ? (
            <EmptyState
              icon={<MagnifyingGlass size={19} weight="bold" />}
              title="조건에 맞는 레퍼런스가 없습니다"
              desc="검색어를 줄이거나 분류를 전체로 바꿔보세요. 수집 소스를 더 켜면 다음 주기부터 대상이 늘어납니다."
              action={
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setQuery("");
                    setFilter("all");
                  }}
                >
                  조건 초기화
                </Button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((r) => (
                <Card key={r.id} padded={false} className="overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setDetail(r)}
                    className="block w-full text-left"
                  >
                    <Preview photo={r.photo} alt={r.title} ratio="4 / 3" rounded={0} />
                  </button>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-[12px] text-[var(--bp-mute)]">
                          {r.categoryLabel}
                        </p>
                        <button
                          type="button"
                          onClick={() => setDetail(r)}
                          className="mt-0.5 block w-full truncate text-left text-[14px] font-medium text-[var(--bp-ink)]"
                        >
                          {r.title}
                        </button>
                      </div>
                      <button
                        type="button"
                        aria-label={bookmarks[r.id] ? "북마크 해제" : "북마크"}
                        onClick={() => setBookmarks((p) => ({ ...p, [r.id]: !p[r.id] }))}
                        className="shrink-0 text-[var(--bp-mute)] transition-colors hover:text-[var(--bp-accent)]"
                      >
                        <BookmarkSimple
                          size={16}
                          weight={bookmarks[r.id] ? "fill" : "regular"}
                          className={bookmarks[r.id] ? "text-[var(--bp-accent)]" : ""}
                        />
                      </button>
                    </div>
                    <p className="mt-1.5 truncate text-[12px] text-[var(--bp-mute)]">
                      출처 {r.sourceName}
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <ChannelTag channel={r.channel} label={CHANNEL_LABEL[r.channel]} />
                      <span className="bp-mono text-[12px] text-[var(--bp-mute)]">
                        {r.engagement}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {r.keywords.map((k) => (
                        <Badge key={k} tone="neutral">
                          {k}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <Card>
            <CardHead
              title="AI 인사이트 요약"
              desc="수집하고 분류한 소재 전체에서 반복되는 패턴만 추립니다"
              action={<Sparkle size={15} weight="fill" className="text-[var(--bp-accent)]" />}
            />
            <ul className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {referenceSummary.map((s) => (
                <li
                  key={s.id}
                  className="rounded-[6px] border border-[var(--bp-hairline)] p-4 lg:border-0 lg:border-l lg:pl-4 lg:first:border-l-0 lg:first:pl-0"
                >
                  <Badge tone="neutral">{s.tag}</Badge>
                  <p className="mt-2 text-[13.5px] font-medium leading-5 text-[var(--bp-ink)]">
                    {s.title}
                  </p>
                  <p className="mt-1.5 text-[12.5px] leading-5 text-[var(--bp-body)]">{s.detail}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="space-y-6">
          <Card soft>
            <CardHead title="수집 파이프라인" desc="소스 수집 → 중복 제거 → 자동 분류 순으로 돕니다" />
            <DefList columns={1} items={collectPipeline} />
            <p className="mt-4 border-t border-[var(--bp-hairline)] pt-4 text-[12px] leading-5 text-[var(--bp-mute)]">
              원문 이미지와 영상은 저장하지 않고 플랫폼이 내려주는 링크와 메타데이터만 보관합니다.
              썸네일은 표시 시점에 원문에서 불러옵니다.
            </p>
          </Card>

          <Card>
            <CardHead
              title="AI 키워드 분석"
              desc="최근 30일 수집분에서 반복된 표현"
              action={<Sparkle size={15} weight="fill" className="text-[var(--bp-accent)]" />}
            />
            <RankBars
              data={aiKeywordInsights.map((k) => ({
                label: k.keyword,
                value: k.count,
                caption: `${k.count}회 ${k.delta}`,
              }))}
            />
            <p className="mt-4 border-t border-[var(--bp-hairline)] pt-4 text-[12.5px] leading-5 text-[var(--bp-body)]">
              <TrendUp size={13} weight="bold" className="mr-1 inline align-[-2px]" />
              15초 루틴 관련 표현이 가장 빠르게 늘고 있습니다. 숏폼 기획 시 참고하세요.
            </p>
          </Card>
        </div>
      </div>

      <Card>
        <CardHead
          title="연동 소스"
          desc="각 플랫폼이 공개한 API로만 가져옵니다. 스크래핑하거나 특정 브랜드 계정을 지목해 수집하지 않습니다."
          action={
            <span className="bp-mono text-[12.5px] text-[var(--bp-mute)]">
              주 {weekly}건 수집
            </span>
          }
        />
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {refSources.map((s) => (
            <li
              key={s.id}
              className={`rounded-[6px] border border-[var(--bp-hairline)] p-4 transition-opacity ${
                sources[s.id] ? "" : "opacity-60"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2 text-[14px] font-medium text-[var(--bp-ink)]">
                    {s.name}
                    <Badge tone={SOURCE_STATE_TONE[s.state]}>{SOURCE_STATE_LABEL[s.state]}</Badge>
                  </p>
                  {/* 실제 호출하는 API 경로를 노출해야 "어디서 어떻게 가져오는지"가 드러난다.
                      API 이름과 경로는 가운뎃점 없이 공백만으로 띄운다. */}
                  <p className="bp-mono mt-1.5 flex flex-wrap items-baseline gap-x-2.5 text-[12px] leading-4 text-[var(--bp-accent-deep)]">
                    <span>{s.api}</span>
                    <span>{s.path}</span>
                  </p>
                </div>
                <Toggle
                  on={sources[s.id]}
                  label={`${s.name} 수집`}
                  onChange={() => setSources((p) => ({ ...p, [s.id]: !p[s.id] }))}
                />
              </div>
              <p className="mt-3 text-[13px] leading-5 text-[var(--bp-body)]">{s.scope}</p>
              <p className="mt-1.5 text-[12px] leading-5 text-[var(--bp-mute)]">{s.note}</p>
              <div className="bp-mono mt-3 flex items-center justify-between border-t border-[var(--bp-hairline)] pt-3 text-[12px] text-[var(--bp-mute)]">
                <span>최근 동기화 {s.lastSyncAt}</span>
                <span>{s.weekly > 0 ? `주 ${s.weekly}건` : "수집 없음"}</span>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardHead title="수집 이력" desc="최근 수집된 순서" />
        {/* 5열 상한. 출처는 레퍼런스 셀의 보조 줄로 내려 컬럼 예산을 지킨다
            (design.md "표 밀도 · 컬럼 예산"). */}
        <Table
          head={["레퍼런스", "분류", "채널", "반응", "수집일"]}
          align={["left", "left", "left", "right", "right"]}
          minWidth={620}
        >
          {references.map((r) => (
            <Row key={r.id} onClick={() => setDetail(r)}>
              <Cell strong>
                <span className="block truncate">{r.title}</span>
                <span className="mt-0.5 block truncate text-[12px] font-normal text-[var(--bp-mute)]">
                  {r.sourceName}
                </span>
              </Cell>
              <Cell nowrap>{r.categoryLabel}</Cell>
              <Cell nowrap>
                <ChannelTag channel={r.channel} label={CHANNEL_LABEL[r.channel]} />
              </Cell>
              <Cell align="right" mono>
                {r.engagement}
              </Cell>
              <Cell align="right" mono muted nowrap>
                {r.collectedAt}
              </Cell>
            </Row>
          ))}
        </Table>
      </Card>

      <Drawer
        open={detail !== null}
        title={detail?.title ?? ""}
        subtitle={detail ? `${detail.categoryLabel} ${CHANNEL_LABEL[detail.channel]}` : undefined}
        onClose={() => setDetail(null)}
        footer={
          <Button
            full
            onClick={() => {
              if (detail) setBookmarks((p) => ({ ...p, [detail.id]: true }));
              setDetail(null);
            }}
            icon={<BookmarkSimple size={14} weight="fill" />}
          >
            캠페인 사례로 저장
          </Button>
        }
      >
        {detail && (
          <div className="space-y-5">
            <Preview photo={detail.photo} alt={detail.title} ratio="4 / 3" />
            <div>
              <p className="text-[13px] font-medium text-[var(--bp-ink)]">AI 스타일 분석</p>
              <p className="mt-1.5 text-[13.5px] leading-6 text-[var(--bp-body)]">
                {detail.styleNotes}
              </p>
            </div>
            <div>
              <p className="text-[13px] font-medium text-[var(--bp-ink)]">추출된 키워드</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {detail.keywords.map((k) => (
                  <Badge key={k} tone="accent">
                    {k}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="rounded-[6px] bg-[var(--bp-soft)] p-4">
              <Eyebrow>반응</Eyebrow>
              <p className="bp-mono mt-1.5 text-[18px] font-semibold text-[var(--bp-ink)]">
                {detail.engagement}
              </p>
              <p className="mt-2 text-[12px] leading-5 text-[var(--bp-mute)]">
                출처 {detail.sourceName}
                <br />
                수집일 {detail.collectedAt}
              </p>
            </div>
          </div>
        )}
      </Drawer>

      <Drawer
        open={addOpen}
        title="소스 연동"
        subtitle="플랫폼 공개 API를 연결하면 다음 동기화부터 소재를 모아 자동으로 분류합니다"
        onClose={() => setAddOpen(false)}
        footer={
          <Button full onClick={() => setAddOpen(false)}>
            인증하고 연동
          </Button>
        }
      >
        <div className="space-y-4">
          <Field label="플랫폼" required>
            <Select value={newPlatform} options={PLATFORMS} onChange={setNewPlatform} />
          </Field>
          <Field
            label="엔드포인트"
            required
            hint="공개 문서에 있는 조회용 엔드포인트만 등록할 수 있습니다. 로그인 세션이나 비공개 데이터를 요구하는 주소는 거부됩니다."
          >
            <Input
              value={newEndpoint}
              onChange={setNewEndpoint}
              placeholder="Ad Library API GET /ads_archive"
            />
          </Field>
          <Field
            label="수집 키워드"
            hint="쉼표로 구분합니다. 이 키워드에 걸리는 공개 소재만 가져옵니다."
          >
            <Input
              value={newKeywords}
              onChange={setNewKeywords}
              placeholder="수분크림, 세럼, 선케어"
            />
          </Field>
          <Field label="동기화 주기">
            <div className="flex gap-2">
              {["매일 06:00", "주 2회", "주 1회"].map((label, i) => (
                <span
                  key={label}
                  className={`rounded-[6px] border px-3 py-2 text-[13px] ${
                    i === 0
                      ? "border-[var(--bp-accent)] bg-[var(--bp-accent-soft)] font-medium text-[var(--bp-accent-deep)]"
                      : "border-[var(--bp-hairline)] text-[var(--bp-body)]"
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>
          </Field>
          <div className="rounded-[6px] bg-[var(--bp-soft)] p-4">
            <Eyebrow>연동 전 확인</Eyebrow>
            <ul className="mt-2 space-y-1.5 text-[12.5px] leading-5 text-[var(--bp-body)]">
              <li>플랫폼별 앱 검수와 신원 확인이 끝난 계정이어야 합니다.</li>
              <li>할당량을 넘기면 다음 주기로 자동 이월됩니다.</li>
              <li>원문은 저장하지 않고 링크와 메타데이터만 보관합니다.</li>
            </ul>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
