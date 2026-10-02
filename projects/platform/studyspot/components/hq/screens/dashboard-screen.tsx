"use client";

import { Badge, Button, Card, CardHead, Cell, PageHead, Row, Stat, Table } from "@/projects/platform/studyspot/components/admin/admin-ui";
import {
  BRANCH_STATUS_LABEL,
  BRANCH_STATUS_TONE,
  CONTENT_STATUS_LABEL,
  CONTENT_STATUS_TONE,
  DEVICE_STATUS_LABEL,
  DEVICE_STATUS_TONE,
  dateOnly,
  won,
  type HqNavigate,
} from "@/projects/platform/studyspot/lib/navigation";
import { BRANCHES, HQ_CONTENT, HQ_DEVICES } from "@/projects/platform/studyspot/lib/mock-data";

const OPERATING_COUNT = BRANCHES.filter((branch) => branch.status === "operating").length;
const TOTAL_REVENUE = BRANCHES.reduce((sum, branch) => sum + branch.monthlyRevenue, 0);
const TOTAL_SEATS = BRANCHES.reduce((sum, branch) => sum + branch.freeSeatTotal, 0);
const AVAILABLE_SEATS = BRANCHES.reduce((sum, branch) => sum + branch.freeSeatAvailable, 0);
const OCCUPIED_SEATS = TOTAL_SEATS - AVAILABLE_SEATS;
const SEAT_UTILIZATION = Math.round((OCCUPIED_SEATS / TOTAL_SEATS) * 100);

const FAULTY_DEVICES = HQ_DEVICES.filter((device) => device.status === "error" || device.status === "offline");

const REGION_STATS = Object.values(
  BRANCHES.reduce<Record<string, { region: string; count: number; revenue: number }>>((acc, branch) => {
    const bucket = acc[branch.region] ?? { region: branch.region, count: 0, revenue: 0 };
    bucket.count += 1;
    bucket.revenue += branch.monthlyRevenue;
    acc[branch.region] = bucket;
    return acc;
  }, {}),
).sort((a, b) => b.revenue - a.revenue);

const MAX_REGION_REVENUE = Math.max(...REGION_STATS.map((region) => region.revenue));

export function DashboardScreen({ onNavigate }: { onNavigate: HqNavigate }) {
  return (
    <div className="flex flex-col gap-6">
      <PageHead
        eyebrow="본사 관리자 콘솔"
        title="통합 대시보드"
        desc="전국 StudySpot 지점의 운영 현황, 통합 매출, 장비 장애를 한 화면에서 모니터링하세요."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="전체 지점 수" value={`${BRANCHES.length}개`} note={`${OPERATING_COUNT}개 운영 중`} />
        <Stat label="통합 이번 달 매출" value={won(TOTAL_REVENUE)} note="전 지점 합산" emphasis />
        <Stat label="전체 좌석 이용률" value={`${SEAT_UTILIZATION}%`} note={`자유석 ${OCCUPIED_SEATS} / ${TOTAL_SEATS}석`} />
        <Stat label="장애 발생 장비" value={`${FAULTY_DEVICES.length}대`} note={`전체 ${HQ_DEVICES.length}대 중`} />
      </div>

      <Card>
        <CardHead title="지역별 운영 현황" desc="지역별 지점 수와 이번 달 합산 매출" />
        <div className="flex flex-col gap-4">
          {REGION_STATS.map((region) => (
            <div key={region.region}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[13.5px] font-medium text-[var(--ss-ink)]">
                  {region.region}
                  <span className="ml-1.5 text-[12px] font-normal text-[var(--ss-mute)]">{region.count}개 지점</span>
                </span>
                <span className="ss-mono text-[13px] text-[var(--ss-mute)]">{won(region.revenue)}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[var(--ss-surface)]">
                <div
                  className="h-2 rounded-full bg-[var(--ss-ink)]"
                  style={{ width: `${MAX_REGION_REVENUE === 0 ? 0 : (region.revenue / MAX_REGION_REVENUE) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 items-start">
        <Card>
          <CardHead
            title="지점별 상태"
            desc={`전국 ${BRANCHES.length}개 지점 운영 현황`}
            action={
              <Button variant="ghost" size="sm" onClick={() => onNavigate("branches")}>
                전체보기
              </Button>
            }
          />
          <Table head={["지점명", "지역", "상태", "이번 달 매출"]} align={["left", "left", "left", "right"]} minWidth={560}>
            {BRANCHES.map((branch) => (
              <Row key={branch.id}>
                <Cell strong>{branch.name}</Cell>
                <Cell muted>{branch.region}</Cell>
                <Cell>
                  <Badge tone={BRANCH_STATUS_TONE[branch.status]} dot>
                    {BRANCH_STATUS_LABEL[branch.status]}
                  </Badge>
                </Cell>
                <Cell align="right" mono strong>
                  {won(branch.monthlyRevenue)}
                </Cell>
              </Row>
            ))}
          </Table>
        </Card>

        <Card>
          <CardHead
            title="실시간 장애 현황"
            desc="장애 또는 오프라인 상태의 장비"
            action={
              <Button variant="ghost" size="sm" onClick={() => onNavigate("devices")}>
                전체보기
              </Button>
            }
          />
          {FAULTY_DEVICES.length === 0 ? (
            <p className="py-6 text-center text-[13px] text-[var(--ss-mute)]">현재 장애가 발생한 장비가 없습니다.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {FAULTY_DEVICES.map((device) => {
                const branch = BRANCHES.find((b) => b.id === device.branchId);
                return (
                  <li
                    key={device.id}
                    className="flex items-start justify-between gap-3 border-b border-[var(--ss-hairline)] pb-3 last:border-b-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[13.5px] font-medium text-[var(--ss-ink)]">{device.name}</p>
                      <p className="ss-mono mt-1 truncate text-[12px] text-[var(--ss-mute)]">
                        {branch?.name ?? device.branchId} | {device.reading}
                      </p>
                    </div>
                    <Badge tone={DEVICE_STATUS_TONE[device.status]} dot>
                      {DEVICE_STATUS_LABEL[device.status]}
                    </Badge>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      <Card>
        <CardHead
          title="최근 배포 콘텐츠"
          desc="본사에서 배포한 최신 공지, 이벤트, 배너"
          action={
            <Button variant="ghost" size="sm" onClick={() => onNavigate("content")}>
              전체보기
            </Button>
          }
        />
        <Table head={["제목", "배포 범위", "게시 기간", "상태"]} minWidth={520}>
          {HQ_CONTENT.slice(0, 4).map((item) => (
            <Row key={item.id}>
              <Cell strong>{item.title}</Cell>
              <Cell muted>{item.branchScope === "all" ? "전체 지점" : item.branchScope}</Cell>
              <Cell mono muted nowrap>
                {dateOnly(item.startAt)} ~ {dateOnly(item.endAt)}
              </Cell>
              <Cell>
                <Badge tone={CONTENT_STATUS_TONE[item.status]}>{CONTENT_STATUS_LABEL[item.status]}</Badge>
              </Cell>
            </Row>
          ))}
        </Table>
      </Card>
    </div>
  );
}
