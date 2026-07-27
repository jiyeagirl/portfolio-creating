import Link from "next/link";
import {
  FacebookLogo,
  InstagramLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/ssr";

const FOOTER_COLUMNS = [
  {
    title: "SHOP",
    links: [
      { label: "신상품", href: "#products" },
      { label: "베스트셀러", href: "#best-seller" },
      { label: "여성", href: "#products" },
      { label: "남성", href: "#products" },
      { label: "액세서리", href: "#products" },
    ],
  },
  {
    title: "고객센터",
    links: [
      { label: "공지사항", href: "#" },
      { label: "자주 묻는 질문", href: "#" },
      { label: "배송/교환/반품", href: "#" },
      { label: "사이즈 가이드", href: "#" },
    ],
  },
  {
    title: "COMPANY",
    links: [
      { label: "브랜드 스토리", href: "#" },
      { label: "매장 안내", href: "#" },
      { label: "채용", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-[1400px] px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-4">
            <p className="text-[20px] font-semibold tracking-[0.1em]">
              VESTIRE
            </p>
            <p className="max-w-[36ch] text-[13px] leading-relaxed text-muted">
              매 시즌 오래 입을 수 있는 옷을 만듭니다. 좋은 소재와 단정한
              태도로 완성한 컨템포러리 웨어.
            </p>
            <div className="mt-2 flex items-center gap-3">
              <Link
                href="#"
                aria-label="인스타그램"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-surface"
              >
                <InstagramLogo size={16} weight="regular" />
              </Link>
              <Link
                href="#"
                aria-label="페이스북"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-surface"
              >
                <FacebookLogo size={16} weight="regular" />
              </Link>
              <Link
                href="#"
                aria-label="유튜브"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:bg-surface"
              >
                <YoutubeLogo size={16} weight="regular" />
              </Link>
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="flex flex-col gap-3">
              <p className="text-[13px] font-semibold tracking-[0.06em] text-muted">
                {column.title}
              </p>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-foreground/85 transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-8 text-[12px] leading-relaxed text-muted lg:flex-row lg:items-center lg:justify-between">
          <p>
            (주)베스티르 · 대표 한지수 · 사업자등록번호 214-87-30452 ·
            통신판매업신고 제2023-서울성동-1189호
            <br className="hidden lg:block" />
            서울특별시 성동구 성수이로 45, 3층 · 고객센터 1522-0483 (평일
            10:00-18:00) · help@vestire.co.kr
          </p>
          <p>© 2026 VESTIRE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
