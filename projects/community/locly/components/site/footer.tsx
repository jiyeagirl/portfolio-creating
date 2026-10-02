"use client";

import { NEIGHBORHOOD } from "@/projects/community/locly/lib/mock-data";
import type { NavigateFn } from "@/projects/community/locly/lib/navigation";
import { CONTAINER, LoclyMark } from "@/projects/community/locly/components/site/ui";

const COLUMNS: { heading: string; items: string[] }[] = [
  { heading: "커뮤니티", items: ["자유게시판", "우리동네 소식", "질문하기", "맛집추천"] },
  { heading: "동네", items: ["지역행사", "동네가게", "모임", "주민참여"] },
  { heading: "이용안내", items: ["공지사항", "자주 묻는 질문", "이용약관", "개인정보처리방침"] },
  { heading: "운영", items: ["나인구청", "나인동 주민센터", "제휴 문의", "신고 센터"] },
];

export function SiteFooter({ onNavigate }: { onNavigate: NavigateFn }) {
  return (
    <footer className="mt-24 bg-[var(--lc-dark)] text-[var(--lc-on-dark-soft)]">
      <div className={`${CONTAINER} py-16`}>
        <div className="grid gap-10 md:grid-cols-[1.3fr_repeat(4,1fr)]">
          <div>
            <div className="flex items-center gap-2 text-[var(--lc-on-dark)]">
              <LoclyMark size={17} className="text-[var(--lc-primary)]" />
              <span className="text-[17px] font-semibold tracking-[-0.01em]">LOCLY</span>
            </div>
            <p className="mt-3 max-w-[30ch] text-[14px] leading-[1.55]">
              우리 지역의 모든 이야기가 연결되는 공간
            </p>
            <p className="mt-4 text-[13px] text-[var(--lc-on-dark-soft)]/70">{NEIGHBORHOOD}</p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="text-[13px] font-medium text-[var(--lc-on-dark)]">{col.heading}</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.items.map((item) => (
                  <li key={item} className="text-[14px] leading-[1.4]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--lc-hairline-dark)] pt-6">
          <p className="text-[13px] text-[var(--lc-on-dark-soft)]/70">
            LOCLY는 포트폴리오용 목업입니다. 실존 지역·상호·인물과 무관합니다.
          </p>
          {/* No admin entry point here — the operator console is a separate
              service at /community/locly-admin with its own login. */}
          <button
            onClick={() => onNavigate("civic")}
            className="text-[13px] font-medium text-[var(--lc-on-dark-soft)]"
          >
            주민 의견 남기기
          </button>
        </div>
      </div>
    </footer>
  );
}
