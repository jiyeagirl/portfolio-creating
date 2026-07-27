"use client";

import { motion, useReducedMotion } from "motion/react";

export type Mood = "great" | "good" | "tired";

const BODY_COLOR: Record<Mood, string> = {
  great: "#FF6F4D",
  good: "#FF8B6B",
  tired: "#D9AF95",
};

export function Mascot({ size = 108, mood = "good" }: { size?: number; mood?: Mood }) {
  const reduce = useReducedMotion();
  const height = size * 1.32;
  const tired = mood === "tired";
  const great = mood === "great";

  return (
    <motion.div
      className="relative"
      style={{ width: size, height: height + 22 }}
      animate={reduce || tired ? undefined : { y: [0, -8, 0] }}
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
        className="absolute left-1/2 top-[20px] -translate-x-1/2 -rotate-[5deg] shadow-[0_14px_24px_-14px_rgba(23,20,16,0.35)]"
        style={{
          width: size,
          height,
          borderRadius: "48% 52% 50% 50% / 58% 55% 45% 42%",
          background: BODY_COLOR[mood],
        }}
      >
        {!tired && <div className="absolute left-[20%] top-[16%] h-[18%] w-[26%] rounded-full bg-white/35" />}

        <div className="absolute left-1/2 top-[48%] flex -translate-x-1/2 gap-[16px]">
          {tired ? (
            <>
              <span className="h-[2.5px] w-[11px] rounded-full bg-[#2B231F]" />
              <span className="h-[2.5px] w-[11px] rounded-full bg-[#2B231F]" />
            </>
          ) : (
            <>
              <span className="h-[8px] w-[8px] rounded-full bg-[#2B231F]" />
              <span className="h-[8px] w-[8px] rounded-full bg-[#2B231F]" />
            </>
          )}
        </div>

        {!tired && (
          <>
            <div
              className={`absolute left-[15%] top-[60%] h-[9px] w-[15px] rounded-full bg-white/40 ${
                great ? "opacity-90" : "opacity-60"
              }`}
            />
            <div
              className={`absolute right-[15%] top-[60%] h-[9px] w-[15px] rounded-full bg-white/40 ${
                great ? "opacity-90" : "opacity-60"
              }`}
            />
          </>
        )}

        {tired ? (
          <div className="absolute left-1/2 top-[62%] h-[2.5px] w-[13px] -translate-x-1/2 rounded-full bg-[#2B231F]" />
        ) : (
          <div className="absolute left-1/2 top-[59%] h-[7px] w-[15px] -translate-x-1/2 rounded-b-full border-b-[2.5px] border-[#2B231F]" />
        )}
      </div>
    </motion.div>
  );
}
