import { AGENT, CUSTOMER, FILING } from "@/projects/monitoring/taxdesk/lib/mock-data";

/* 위임장 양식. 사용자 위임장 화면과 관리자 위임장 탭이 같은 문서를 렌더한다.
   합성된 사용자 입력값은 파랑 틴트 칸, 사전 세팅된 대리인 값은 파치먼트 칸 (design.md 위임장 문서 시스템). */

export type SignMode = "stamp" | "sign" | "none";

export function Stamp({ name = CUSTOMER.owner, size = 60 }: { name?: string; size?: number }) {
  const chars = (name + "인").slice(0, 4).split("");
  // 한국 인감 관례: 오른쪽 열 위에서 아래, 다음 왼쪽 열
  const ordered = [chars[2], chars[0], chars[3], chars[1]];
  return (
    <span
      aria-label={`${name} 도장`}
      className="inline-grid shrink-0 rotate-[-6deg] grid-cols-2 place-items-center rounded-full border-[2.5px] border-[var(--td-stamp)] font-bold leading-none text-[var(--td-stamp)] opacity-90 mix-blend-multiply"
      style={{ width: size, height: size, fontSize: size * 0.27, padding: size * 0.12 }}
    >
      {ordered.map((c, i) => (
        <span key={i}>{c}</span>
      ))}
    </span>
  );
}

export function Signature({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 64" aria-label="류정민 서명" className={className} fill="none">
      <path
        d="M8 42c10-18 18-30 22-28 5 3-9 30-4 31 6 1 14-24 20-23 5 1-3 19 2 20 6 1 11-14 17-14 5 0 1 12 6 12 8 0 12-20 20-22 6-1 2 16 8 16 7 0 13-10 20-12 5-1 6 6 12 5 7-1 14-6 21-9"
        stroke="#1d1d1f"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M40 52c22-4 52-6 82-4" stroke="#1d1d1f" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function Row({
  label,
  value,
  kind,
  mono,
}: {
  label: string;
  value: string;
  kind: "user" | "agent";
  mono?: boolean;
}) {
  return (
    <div className="grid grid-cols-[30%_1fr] border-b-[0.75px] border-[#1d1d1f] last:border-b-0">
      <div className="border-r-[0.75px] border-[#1d1d1f] px-[3%] py-[1.6%] text-[0.72em] font-semibold text-[#333336]">
        {label}
      </div>
      <div
        className={`min-w-0 px-[3%] py-[1.6%] text-[0.78em] ${kind === "user" ? "bg-[var(--td-blue-tint)]" : "bg-[var(--td-parch)]"} ${
          mono ? "td-mono" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

export function PoaDocument({
  signMode,
  fontSize = 14,
  showLegend = false,
}: {
  signMode: SignMode;
  /** 문서 전체 글자 기준. 미리보기 폭에 맞춰 바꾼다 */
  fontSize?: number;
  showLegend?: boolean;
}) {
  return (
    <div
      className="aspect-[1/1.414] w-full bg-white text-[#1d1d1f] shadow-[var(--td-paper-shadow)]"
      style={{ fontSize, padding: "7% 8%" }}
    >
      <div className="flex h-full flex-col">
        <p className="text-center text-[1.6em] font-bold tracking-[0.4em]">위 임 장</p>
        <p className="mt-[1.5%] text-center text-[0.72em] text-[#7a7a7e]">세무대리 수임 및 전자신고 위임</p>

        <p className="mt-[5%] text-[0.78em] font-semibold">위임인</p>
        <div className="mt-[1.5%] border-[0.75px] border-[#1d1d1f]">
          <Row kind="user" label="상호" value={CUSTOMER.business} />
          <Row kind="user" label="사업자등록번호" value={CUSTOMER.bizNo} mono />
          <Row kind="user" label="성명 (대표자)" value={CUSTOMER.owner} />
          <Row kind="user" label="사업장 소재지" value={CUSTOMER.address} />
          <Row kind="user" label="연락처" value={CUSTOMER.phone} />
        </div>

        <p className="mt-[4%] text-[0.78em] font-semibold">수임인 (대리인)</p>
        <div className="mt-[1.5%] border-[0.75px] border-[#1d1d1f]">
          <Row kind="agent" label="성명" value={`${AGENT.name} ${AGENT.title}`} />
          <Row kind="agent" label="사무소" value={`${AGENT.office} | ${AGENT.phone}`} />
          <Row kind="agent" label="등록번호" value={`${AGENT.regNo} | 관리번호 ${AGENT.managerNo}`} />
          <Row kind="agent" label="사업장 소재지" value={AGENT.address} />
        </div>

        <p className="mt-[4%] text-[0.78em] font-semibold">위임 내용</p>
        <div className="mt-[1.5%] border-[0.75px] border-[#1d1d1f] px-[3%] py-[2%] text-[0.74em] leading-[1.6]">
          <span className="bg-[var(--td-blue-tint)]">
            {FILING.period} 부가가치세 {FILING.kind} ({FILING.range})
          </span>
          에 관한 신고서 작성, 전자신고 및 부속서류 제출, 신고 내역과 납부 내역 조회 일체
        </div>

        <p className="mt-auto pt-[4%] text-center text-[0.74em] leading-[1.6]">
          위 본인은 위 수임인에게 위 사항을 위임합니다.
        </p>
        <p className="mt-[2%] text-center text-[0.78em]">2026년 1월 8일</p>

        <div className="mt-[3%] flex items-center justify-end gap-[3%]">
          <span className="text-[0.78em]">위임인</span>
          <span className="bg-[var(--td-blue-tint)] px-[1.5%] text-[0.86em] font-semibold">{CUSTOMER.owner}</span>
          <span className="relative inline-flex h-[3.4em] w-[5.6em] items-center justify-center">
            {signMode === "none" && <span className="text-[0.74em] text-[#7a7a7e]">(서명 또는 인)</span>}
            {signMode === "stamp" && (
              <span className="absolute inset-0 flex items-center justify-center">
                <Stamp size={fontSize * 3.4} />
              </span>
            )}
            {signMode === "sign" && (
              <span className="absolute inset-0 flex items-center justify-center">
                <Signature className="h-full w-full" />
              </span>
            )}
          </span>
        </div>

        {showLegend && (
          <div className="mt-[3%] flex items-center gap-[4%] border-t-[0.75px] border-[#e0e0e3] pt-[2%] text-[0.64em] text-[#7a7a7e]">
            <span className="flex items-center gap-1.5">
              <span className="h-[0.9em] w-[0.9em] bg-[var(--td-blue-tint)] ring-1 ring-[#c8dcf3]" />
              신청 정보에서 채움
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-[0.9em] w-[0.9em] bg-[var(--td-parch)] ring-1 ring-[#e0e0e3]" />
              대리인 사전 등록
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
