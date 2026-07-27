"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { motion, useReducedMotion, type Variants } from "motion/react";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.15 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-[100dvh] items-end overflow-hidden bg-surface">
      <Image
        src="https://picsum.photos/seed/vestire-hero-editorial-look/1800/1200"
        alt="VESTIRE 2026 가을 컬렉션 룩"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      <motion.div
        initial={reduce ? undefined : "hidden"}
        animate={reduce ? undefined : "show"}
        variants={reduce ? undefined : container}
        className="relative z-10 w-full px-6 pb-16 pt-24 sm:px-10 sm:pb-20 lg:px-16 lg:pb-24"
      >
        <div className="mx-auto max-w-[1400px]">
          <motion.h1
            variants={reduce ? undefined : item}
            className="max-w-[16ch] text-[40px] font-semibold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            오래, 자주 입고 싶은 옷
          </motion.h1>
          <motion.p
            variants={reduce ? undefined : item}
            className="mt-5 max-w-[42ch] text-[15px] leading-relaxed text-white/85 sm:text-base"
          >
            2026 가을 컬렉션이 도착했습니다. 계절이 바뀌어도 오래 곁에 두고
            싶은 옷을 만듭니다.
          </motion.p>
          <motion.div
            variants={reduce ? undefined : item}
            className="mt-8 flex flex-wrap items-center gap-6"
          >
            <Link
              href="#lookbook"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[14px] font-semibold tracking-tight text-black transition-transform active:scale-[0.98]"
            >
              컬렉션 보기
              <ArrowRight size={16} weight="bold" />
            </Link>
            <Link
              href="#best-seller"
              className="inline-flex items-center gap-1.5 text-[14px] font-medium text-white/90 underline decoration-white/40 underline-offset-4 transition-colors hover:text-white"
            >
              베스트셀러 보기
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
