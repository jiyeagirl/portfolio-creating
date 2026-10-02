import type { NavigateFn } from "@/projects/platform/dressday/lib/types";
import { CONTAINER } from "@/projects/platform/dressday/components/site/ui";

// 필수 링크, 고객센터, 사업자 정보만 둔다 (web.md 내비게이션: 링크 4열 농장 금지)
const LINKS = ["자주 묻는 질문", "오염, 훼손 기준", "이용약관", "개인정보처리방침"];

export function Footer({ onNavigate }: { onNavigate: NavigateFn }) {
  void onNavigate;
  return (
    <footer className="mt-16 border-t border-[var(--dd-hairline)] bg-white lg:mt-24">
      <div className={`${CONTAINER} flex flex-col gap-6 py-10 lg:flex-row lg:items-end lg:justify-between`}>
        <div>
          <p className="text-[14px] text-[var(--dd-muted)]">고객센터</p>
          <p className="dd-num mt-1 text-[21px] font-bold">1670-0918</p>
          <p className="dd-num mt-1 text-[14px] text-[var(--dd-muted)]">매일 10:00~22:00, 배송 문의는 21:30까지</p>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[14px]">
          {LINKS.map((l) => (
            <li key={l} className={l === "개인정보처리방침" ? "font-semibold" : "text-[var(--dd-body)]"}>
              {l}
            </li>
          ))}
        </ul>
      </div>
      <div className="border-t border-[var(--dd-hairline)]">
        <p className={`${CONTAINER} dd-pretty py-5 text-[13px] leading-5 text-[var(--dd-muted)]`}>
          (주)드레스데이 | 대표 오세린 | 사업자등록번호 214-87-30952 | 통신판매업 2025-서울성동-01842 | 서울 성동구 아차산로17길 48, 5층 | © 2026 DRESSDAY
        </p>
      </div>
    </footer>
  );
}
