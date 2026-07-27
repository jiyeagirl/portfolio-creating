"use client";

import { motion, useReducedMotion } from "motion/react";

export function Mascot({ size = 108 }: { size?: number }) {
  const reduce = useReducedMotion();
  const height = size * 1.32;

  return (
    <motion.div
      className="relative"
      style={{ width: size, height: height + 22 }}
      animate={reduce ? undefined : { y: [0, -8, 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg
        className="absolute left-1/2 top-0 -translate-x-1/2"
        width={30}
        height={26}
        viewBox="0 0 30 26"
        fill="none"
        aria-hidden
      >
        <path d="M15 26V12" stroke="#5C8A52" strokeWidth={2.5} strokeLinecap="round" />
        <path d="M15 14C15 14 6 14 6 5C15 5 15 14 15 14Z" fill="#8FCB6E" />
        <path d="M15 12C15 12 24 12 24 3C15 3 15 12 15 12Z" fill="#79B85B" />
      </svg>

      <div
        className="absolute left-1/2 top-[20px] -translate-x-1/2 -rotate-[5deg] bg-[#FF6F4D] shadow-[0_18px_28px_-10px_rgba(255,111,77,0.5)]"
        style={{
          width: size,
          height,
          borderRadius: "48% 52% 50% 50% / 58% 55% 45% 42%",
        }}
      >
        <div className="absolute left-[20%] top-[16%] h-[18%] w-[26%] rounded-full bg-white/35" />

        <div className="absolute left-1/2 top-[48%] flex -translate-x-1/2 gap-[16px]">
          <span className="h-[8px] w-[8px] rounded-full bg-[#2B231F]" />
          <span className="h-[8px] w-[8px] rounded-full bg-[#2B231F]" />
        </div>

        <div className="absolute left-[15%] top-[60%] h-[9px] w-[15px] rounded-full bg-[#FF9B7A]/70" />
        <div className="absolute right-[15%] top-[60%] h-[9px] w-[15px] rounded-full bg-[#FF9B7A]/70" />

        <div className="absolute left-1/2 top-[59%] h-[7px] w-[15px] -translate-x-1/2 rounded-b-full border-b-[2.5px] border-[#2B231F]" />
      </div>
    </motion.div>
  );
}
