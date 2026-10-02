"use client";

import { useState } from "react";
import { DownloadSimple, Plus } from "@phosphor-icons/react";
import {
  ADMIN_ACTIVITY,
  ADMIN_FACILITIES,
  ADMIN_SUMMARY,
  BAND_STATS,
  BANNERS,
  MONTHLY_SCANS,
} from "@/projects/youngin/child/lib/mock-data";
import { BAND_LABEL, BAND_RANGE, CATEGORY_LABEL } from "@/projects/youngin/child/lib/navigation";
import type { Tone } from "@/projects/youngin/child/components/admin/ui";
import {
  Badge,
  BarChart,
  Button,
  Card,
  CardHead,
  Cell,
  PageHead,
  Pagination,
  RankBars,
  Row,
  Stat,
  Table,
  Tabs,
  Timeline,
} from "@/projects/youngin/child/components/admin/ui";

type TableTab = "banners" | "facilities";

const PER_PAGE = 4;

const BANNER_STATUS_TONE: Record<string, Tone> = {
  "노출 중": "accent",
  예약: "neutral",
  종료: "lock",
};

const FACILITY_STATUS_TONE: Record<string, Tone> = {
  "운영 중": "accent",
  점검: "stamp",
  휴관: "lock",
};

const number = new Intl.NumberFormat("ko-KR");

export function DashboardScreen() {
  const [tab, setTab] = useState<TableTab>("banners");
  const [page, setPage] = useState(1);

  const total = tab === "banners" ? BANNERS.length : ADMIN_FACILITIES.length;
  const from = (page - 1) * PER_PAGE;
  const bannerRows = BANNERS.slice(from, from + PER_PAGE);
  const facilityRows = ADMIN_FACILITIES.slice(from, from + PER_PAGE);

  function switchTab(next: TableTab) {
    setTab(next);
    setPage(1);
  }

  return (
    <div className="yc-enter space-y-8">
      <PageHead
        eyebrow="운영 현황"
        title="아동 놀이시설 이용 현황"
        desc="아이 연령대에 맞춰 시설, 미션, 복지 배너가 자동으로 매칭됩니다. 배너 노출 대상을 바꾸면 다음 접속부터 반영됩니다."
        actions={
          <>
            <Button variant="secondary" icon={<DownloadSimple size={14} weight="bold" />}>
              통계 내려받기
            </Button>
            <Button icon={<Plus size={14} weight="bold" />}>복지 배너 등록</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="가입 아동"
          value={number.format(ADMIN_SUMMARY.children)}
          unit="명"
          delta={ADMIN_SUMMARY.childrenDelta}
          note="이번 달 신규"
        />
        <Stat
          label="이번 달 QR 인증"
          value={number.format(ADMIN_SUMMARY.monthlyScans)}
          unit="건"
          delta={ADMIN_SUMMARY.scanDelta}
          note="전월 대비"
          emphasis
        />
        <Stat
          label="운영 시설"
          value={String(ADMIN_SUMMARY.facilities)}
          unit="곳"
          note="점검 중 1곳 포함"
        />
        <Stat
          label="노출 중 배너"
          value={String(ADMIN_SUMMARY.liveBanners)}
          unit="건"
          note="예약 1건, 종료 1건"
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHead
            title="월별 QR 인증 건수"
            desc="물놀이장이 문을 여는 7월부터 인증이 뚜렷하게 늘어납니다."
            action={<Badge tone="accent">8월 집계 중</Badge>}
          />
          <BarChart data={MONTHLY_SCANS} format={(value) => number.format(value)} />
        </Card>

        <Card>
          <CardHead title="연령대별 이용" desc="배너 탭 전환율은 노출 대비 클릭 비율입니다." />
          <RankBars
            data={BAND_STATS.map((stat) => ({
              label: BAND_LABEL[stat.band],
              value: stat.visits,
              caption: `${number.format(stat.visits)}건`,
              sub: `${BAND_RANGE[stat.band]} | 아동 ${number.format(stat.children)}명 | 탭 전환율 ${stat.tapRate}%`,
            }))}
          />
        </Card>
      </div>

      <Card>
        <Tabs
          value={tab}
          onChange={switchTab}
          items={[
            { key: "banners", label: "복지 배너", count: BANNERS.length },
            { key: "facilities", label: "시설 관리", count: ADMIN_FACILITIES.length },
          ]}
        />

        <div className="pt-4">
          {tab === "banners" ? (
            <Table
              head={["배너명", "분류", "노출 연령대", "노출수", "탭 전환율", "상태"]}
              align={["left", "left", "left", "right", "right", "left"]}
              minWidth={760}
            >
              {bannerRows.map((banner) => (
                  <Row key={banner.id}>
                    <Cell strong>
                      {banner.title}
                      <span className="mt-0.5 block text-[12px] font-normal text-[var(--yc-mute)]">
                        {banner.department} | {banner.period}
                      </span>
                    </Cell>
                    <Cell>{banner.kind}</Cell>
                    <Cell muted>
                      {banner.bands.map((band) => BAND_LABEL[band]).join(", ")}
                    </Cell>
                    <Cell align="right" num>
                      {number.format(banner.impressions)}
                    </Cell>
                    <Cell align="right" num strong>
                      {((banner.taps / banner.impressions) * 100).toFixed(1)}%
                    </Cell>
                    <Cell>
                      <Badge tone={BANNER_STATUS_TONE[banner.status]} dot={banner.status === "노출 중"}>
                        {banner.status}
                      </Badge>
                    </Cell>
                  </Row>
              ))}
            </Table>
          ) : (
            <Table
              head={["시설명", "카테고리", "대상 연령대", "QR 인증", "최근 동기화", "상태"]}
              align={["left", "left", "left", "right", "right", "left"]}
              minWidth={760}
            >
              {facilityRows.map((facility) => (
                  <Row key={facility.id}>
                    <Cell strong>
                      {facility.name}
                      <span className="mt-0.5 block text-[12px] font-normal text-[var(--yc-mute)]">
                        {facility.district}
                      </span>
                    </Cell>
                    <Cell>{CATEGORY_LABEL[facility.category]}</Cell>
                    <Cell muted>
                      {facility.bands.map((band) => BAND_LABEL[band]).join(", ")}
                    </Cell>
                    <Cell align="right" num>
                      {number.format(facility.qrScans)}
                    </Cell>
                    <Cell align="right" num muted nowrap>
                      {facility.lastSyncedAt}
                    </Cell>
                    <Cell>
                      <Badge tone={FACILITY_STATUS_TONE[facility.status]}>{facility.status}</Badge>
                    </Cell>
                  </Row>
              ))}
            </Table>
          )}

          <Pagination page={page} total={total} perPage={PER_PAGE} onChange={setPage} />
        </div>
      </Card>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHead
            title="최근 운영 활동"
            desc="배너 노출 대상과 시즌 미션 변경 이력입니다."
            action={<Button variant="ghost" size="sm">전체 보기</Button>}
          />
          <Timeline steps={ADMIN_ACTIVITY} />
        </Card>

        <Card>
          <CardHead title="노출 규칙" desc="아이 프로필의 개월 수만으로 매칭됩니다." />
          <ul className="space-y-3">
            {BAND_STATS.map((stat) => (
              <li
                key={stat.band}
                className="flex items-start justify-between gap-3 border-b border-[var(--yc-hairline)] pb-3 last:border-b-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="text-[13.5px] font-medium text-[var(--yc-ink)]">
                    {BAND_LABEL[stat.band]}
                  </p>
                  <p className="yc-num mt-0.5 text-[12px] text-[var(--yc-mute)]">
                    {BAND_RANGE[stat.band]}
                  </p>
                </div>
                <Badge tone="neutral">
                  배너 {BANNERS.filter((banner) => banner.bands.includes(stat.band)).length}건
                </Badge>
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-[6px] bg-[var(--yc-surface-soft)] p-3 text-[12.5px] leading-5 text-[var(--yc-body)]">
            연령대가 바뀌는 아동에게는 전환 2주 전부터 다음 단계 미션 예고가 먼저 노출됩니다.
          </p>
        </Card>
      </div>
    </div>
  );
}
