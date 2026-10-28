import { AGENT, CUSTOMER, EVIDENCE_SLOTS, FEE, FILING, won } from "@/projects/monitoring/taxdesk/lib/mock-data";

/* 신고대리 의뢰 내역서. 법정 서식이 아니라 서비스가 신청 정보로 자동 생성하는 정리 문서라
   서명란, 도장, 완료 일시, 접수번호를 두지 않는다. 첫 화면은 예시값, 의뢰 확인 단계는 이 고객의 값을 넣는다. */

export type RequestSummary = {
  badge: string;
  sections: { title: string; rows: [string, string][] }[];
  files: string[];
  filesNote: string;
};

export const EXAMPLE_SUMMARY: RequestSummary = {
  badge: "신청 정보 예시",
  sections: [
    {
      title: "의뢰인 정보",
      rows: [
        ["상호", "메이커리 컴퍼니"],
        ["대표자", "김○○"],
        ["사업자등록번호", "123-45-*****"],
        ["연락처", "010-****-5678"],
      ],
    },
    {
      title: "담당 세무사",
      rows: [
        ["사무소", "택스데스크 세무회계"],
        ["담당 세무사", "이○○"],
        ["의뢰 업무", "부가가치세 신고대행"],
      ],
    },
    {
      title: "의뢰 내용",
      rows: [
        ["신고 대상", "2025년 부가가치세 확정신고"],
        ["업무 범위", "제출자료 검토 및 신고대행"],
        ["기본 수수료", `${won(FEE.base)}원`],
      ],
    },
  ],
  files: ["사업자등록증", "매출, 매입 관련 자료", "카드, 판매채널 정산내역"],
  filesNote: "신청 내용에 따라 제출자료가 달라질 수 있습니다",
};

const submitted = EVIDENCE_SLOTS.filter((s) => s.files.length > 0);

export const CUSTOMER_SUMMARY: RequestSummary = {
  badge: "결제 전 확인",
  sections: [
    {
      title: "의뢰인 정보",
      rows: [
        ["상호", CUSTOMER.business],
        ["대표자", CUSTOMER.owner],
        ["사업자등록번호", CUSTOMER.bizNo],
        ["연락처", CUSTOMER.phone],
      ],
    },
    {
      title: "담당 세무사",
      rows: [
        ["사무소", AGENT.office],
        ["담당 세무사", `${AGENT.name} ${AGENT.title}`],
        ["의뢰 업무", "부가가치세 신고대행"],
      ],
    },
    {
      title: "의뢰 내용",
      rows: [
        ["신고 대상", `${FILING.period.split(" ")[0]} 부가가치세 ${FILING.kind}`],
        ["업무 범위", "제출자료 검토 및 신고대행"],
        ["수수료", `${won(FEE.total)}원 (부가세 포함)`],
      ],
    },
  ],
  files: submitted.map((s) => s.title),
  filesNote: `올린 증빙 ${submitted.length}종. 검토 중 보완 요청이 오면 추가로 올려요`,
};

function SectionTitle({ children }: { children: string }) {
  return (
    <p className="border-b-[0.75px] border-[#1d1d1f] pb-[1.2%] text-[0.8em] font-semibold">{children}</p>
  );
}

export function RequestSummaryDocument({
  fontSize = 10,
  data = EXAMPLE_SUMMARY,
}: {
  /** 문서 전체 글자 기준. 미리보기 폭에 맞춰 바꾼다. "1em"이면 부모의 반응형 글자 크기를 따른다 */
  fontSize?: number | string;
  data?: RequestSummary;
}) {
  return (
    <div
      className="aspect-[1/1.414] w-full bg-white text-[#1d1d1f] shadow-[var(--td-paper-shadow)]"
      style={{ fontSize, padding: "7% 8%" }}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-[4%]">
          <div className="min-w-0">
            <p className="text-[1.5em] font-bold leading-[1.25] tracking-[-0.01em]">신고대리 의뢰 내역서</p>
            <p className="mt-[0.4em] text-[0.76em] text-[#6e6e73]">부가가치세 신고대행 신청 정보</p>
          </div>
          <span className="shrink-0 rounded-full bg-[var(--td-parch)] px-[0.8em] py-[0.3em] text-[0.68em] font-semibold text-[#6e6e73]">
            {data.badge}
          </span>
        </div>

        {data.sections.map((s) => (
          <div key={s.title} className="mt-[5%]">
            <SectionTitle>{s.title}</SectionTitle>
            <dl className="mt-[1.5%]">
              {s.rows.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[34%_1fr] py-[0.28em] text-[0.76em] leading-[1.45]">
                  <dt className="text-[#6e6e73]">{k}</dt>
                  <dd className="min-w-0 font-medium tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}

        <div className="mt-[5%]">
          <SectionTitle>제출자료 목록</SectionTitle>
          <ul className="mt-[1.5%]">
            {data.files.map((f, i) => (
              <li key={f} className="flex gap-[0.6em] py-[0.28em] text-[0.76em] leading-[1.45]">
                <span className="w-[1em] shrink-0 tabular-nums text-[#6e6e73]">{i + 1}</span>
                <span className="font-medium">{f}</span>
              </li>
            ))}
          </ul>
          <p className="mt-[0.5em] text-[0.66em] text-[#86868b]">{data.filesNote}</p>
        </div>

        <p className="mt-auto border-t-[0.75px] border-[#e0e0e3] pt-[3%] text-[0.64em] leading-[1.6] text-[#86868b]">
          본 문서는 서비스 내 신고대리 의뢰 내용을 정리한 문서입니다.
          <br />
          홈택스 수임동의 또는 신고 접수증을 대체하지 않습니다.
        </p>
      </div>
    </div>
  );
}
