"use client";

import { Bell } from "@phosphor-icons/react";
import {
  ADMIN_INQUIRIES,
  CATEGORY_SIZE_TREND,
  DASHBOARD_STATS_PF,
  RECOMMEND_ACCURACY_SHARE,
  formatWon,
} from "@/projects/commerce/pawfit/lib/mock-data";
import type { AdminInquiry } from "@/projects/commerce/pawfit/lib/types";
import {
  CategoryBars,
  Metric,
  PageHead,
  Panel,
  ShareBar,
  Tag,
} from "@/projects/commerce/pawfit/components/admin/admin-ui";

const INQUIRY_STATUS_TONE: Record<AdminInquiry["status"], "success" | "warning" | "neutral"> = {
  대기: "warning",
  답변완료: "success",
  종료: "neutral",
};

export function AdminDashboard() {
  const stats = DASHBOARD_STATS_PF;

  const recentInquiries = [...ADMIN_INQUIRIES]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0))
    .slice(0, 3);

  return (
    <>
      <PageHead
        title="운영 대시보드"
        description="가입 회원과 반려동물 등록 현황, 주문과 매출, 사이즈 추천 성과를 한 화면에서 확인합니다."
        actions={
          <span className="flex items-center gap-1.5 rounded-full border border-[var(--pf-warning)]/25 bg-[var(--pf-warning)]/[0.08] px-3 py-1.5 text-[12.5px] font-semibold text-[var(--pf-warning)]">
            <Bell size={13} weight="fill" />
            답변 대기 문의 {stats.pendingInquiries}건
          </span>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="가입 회원 수"
          value={stats.totalMembers.toLocaleString("ko-KR")}
          unit="명"
        />
        <Metric
          label="등록 반려동물 수"
          value={stats.totalPets.toLocaleString("ko-KR")}
          unit="마리"
        />
        <Metric
          label="오늘 주문 건수"
          value={stats.todayOrders.toLocaleString("ko-KR")}
          unit="건"
          note={`인기 상품 ${stats.popularProduct}`}
        />
        <Metric
          label="오늘 매출"
          value={formatWon(stats.todayRevenue)}
          unit="원"
        />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="이달 매출"
          value={formatWon(stats.monthRevenue)}
          unit="원"
        />
        <Metric
          label="추천 사용률"
          value={stats.recommendationUsageRate.toFixed(1)}
          unit="%"
          note="전체 구매 중 사이즈 추천을 거친 비율"
        />
        <Metric
          label="사이즈 추천 성공률"
          value={stats.recommendationSuccessRate.toFixed(1)}
          unit="%"
          note="정확해요 + 약간 달라요 기준"
        />
        <Metric
          label="피드백 건수"
          value={stats.feedbackCount.toLocaleString("ko-KR")}
          unit="건"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="카테고리별 사이즈 추천 사용 현황" note="최근 30일 기준, 단위는 건">
          <CategoryBars data={CATEGORY_SIZE_TREND} />
        </Panel>
        <Panel title="추천 정확도 비중" note="사이즈 피드백에 남겨진 정확도 응답 기준">
          <ShareBar data={RECOMMEND_ACCURACY_SHARE} />
        </Panel>
      </div>

      <Panel className="mt-4" title="최근 문의" note="가장 최근에 접수된 고객 문의 3건입니다">
        <ul className="divide-y divide-[var(--pf-hairline)]">
          {recentInquiries.map((inquiry) => (
            <li key={inquiry.id} className="flex items-center gap-4 px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-semibold">{inquiry.subject}</p>
                <p className="mt-0.5 text-[12px] text-[var(--pf-muted)]">
                  {inquiry.member}
                  <span className="pf-num ml-2">{inquiry.createdAt}</span>
                </p>
              </div>
              <Tag tone="neutral">{inquiry.category}</Tag>
              <Tag tone={INQUIRY_STATUS_TONE[inquiry.status]}>{inquiry.status}</Tag>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
