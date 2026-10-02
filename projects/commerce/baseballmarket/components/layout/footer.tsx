"use client";

/* vercel 규칙: 푸터는 캔버스(흰색) 위 4컬럼이고 상단 헤어라인으로만 본문과 나뉜다.
   clay 시절에는 크림 배경이었는데, vercel은 밴드 순환의 마지막을 흰색으로 닫는다. */

const COLUMNS: { title: string; items: string[] }[] = [
  { title: "거래", items: ["매물 탐색", "티켓 정가 기준", "안전거래 안내", "판매 가이드"] },
  { title: "커뮤니티", items: ["구단 게시판", "직관 후기", "굿즈 자랑", "커뮤니티 규칙"] },
  { title: "고객지원", items: ["자주 묻는 질문", "1:1 문의", "분쟁 조정 절차", "신고 센터"] },
  { title: "회사", items: ["서비스 소개", "이용약관", "개인정보 처리방침", "채용"] },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--bm-hairline)] bg-[var(--bm-canvas)]">
      <div className="mx-auto max-w-[1280px] px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[var(--bm-ink)] text-[15px] font-semibold text-[var(--bm-on-ink)]"
              >
                B
              </span>
              <span className="text-[16px] font-semibold tracking-[-0.02em] text-[var(--bm-ink)]">
                베이스볼마켓
              </span>
            </div>
            <p className="mt-3 text-[13px] leading-[20px] text-[var(--bm-muted)]">
              야구 팬을 위한 유니폼, 굿즈, 티켓 거래와 구단 커뮤니티
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-[13px] font-semibold leading-[18px] text-[var(--bm-ink)]">
                {col.title}
              </h3>
              <ul className="mt-3.5 space-y-2.5">
                {col.items.map((item) => (
                  <li key={item}>
                    <span className="text-[13px] leading-[20px] text-[var(--bm-muted)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 border-t border-[var(--bm-hairline)] pt-6">
          <p className="text-[12px] leading-[19px] text-[var(--bm-muted-soft)]">
            베이스볼마켓 주식회사 | 대표 정하윤 | 사업자등록번호 214-88-01937
          </p>
          <p className="mt-1 text-[12px] leading-[19px] text-[var(--bm-muted-soft)]">
            통신판매업신고 2026-대전둔산-0418 | 고객센터 1660-2087 (평일 10:00-18:00)
          </p>
          <p className="mt-3 text-[12px] leading-[19px] text-[var(--bm-muted-soft)]">
            베이스볼마켓은 통신판매중개자로서 거래 당사자가 아니며, 회원 간 거래에 대한 책임을 지지 않습니다.
            티켓 정가 기준표는 각 구장 공시 가격을 기준으로 운영팀이 주 단위로 갱신합니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
