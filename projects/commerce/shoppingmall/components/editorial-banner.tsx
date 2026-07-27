import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";

export function EditorialBanner() {
  return (
    <section id="lookbook" className="bg-accent text-accent-foreground">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 lg:grid-cols-12">
        <div className="flex flex-col justify-center gap-6 px-6 py-16 sm:px-10 sm:py-20 lg:col-span-5 lg:px-16 lg:py-0">
          <h2 className="max-w-[14ch] text-[30px] font-semibold leading-[1.15] tracking-tight sm:text-[38px]">
            2026 가을, 레이어링의 정석
          </h2>
          <p className="max-w-[38ch] text-[15px] leading-relaxed text-accent-foreground/80">
            얇은 니트와 묵직한 아우터를 겹쳐 입는 법. 이번 시즌 룩북에서
            스타일리스트의 코디를 확인하세요.
          </p>
          <Link
            href="#products"
            className="inline-flex w-fit items-center gap-2 border-b border-accent-foreground/50 pb-1 text-[14px] font-medium transition-colors hover:border-accent-foreground"
          >
            룩북 전체보기
            <ArrowRight size={15} weight="bold" />
          </Link>
        </div>
        <div className="group relative aspect-[4/3] overflow-hidden lg:col-span-7 lg:aspect-auto">
          <Image
            src="https://picsum.photos/seed/vestire-lookbook-layering/1600/1200"
            alt="2026 가을 레이어링 룩북"
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
}
