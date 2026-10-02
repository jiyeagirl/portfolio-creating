"use client";

import { motion, useReducedMotion } from "motion/react";

export type Mood = "great" | "good" | "tired";

const BODY_COLOR: Record<Mood, string> = {
  great: "#FF6F4D",
  good: "#FF8B6B",
  tired: "#D9AF95",
};

/** The size every hardcoded measurement below is drawn at. Anything in px is
 *  multiplied by `size / BASE`, so the sprout, eyes, cheeks and mouth keep the
 *  same proportions at 52px as at 108px. Without this the face stayed a fixed
 *  number of pixels while the body shrank, and small instances (routine,
 *  mypage) ended up with a visibly different face from the large ones. */
const BASE = 108;

export function Mascot({ size = 108, mood = "good" }: { size?: number; mood?: Mood }) {
  const reduce = useReducedMotion();
  const s = size / BASE;
  const px = (value: number) => value * s;
  const height = size * 1.32;
  const tired = mood === "tired";
  const great = mood === "great";

  const eye = tired
    ? { width: px(11), height: px(2.5) }
    : { width: px(8), height: px(8) };

  return (
    <motion.div
      className="relative"
      style={{ width: size, height: height + px(22) }}
      animate={reduce || tired ? undefined : { y: [0, -px(8), 0] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg
        className="absolute left-1/2 top-0 -translate-x-1/2"
        width={px(30)}
        height={px(26)}
        viewBox="0 0 30 26"
        fill="none"
        aria-hidden
      >
        <path d="M15 26V12" stroke="#5C8A52" strokeWidth={2.5} strokeLinecap="round" />
        <path d="M15 14C15 14 6 14 6 5C15 5 15 14 15 14Z" fill="#8FCB6E" />
        <path d="M15 12C15 12 24 12 24 3C15 3 15 12 15 12Z" fill="#79B85B" />
      </svg>

      <div
        className="absolute left-1/2 -translate-x-1/2 -rotate-[5deg]"
        style={{
          top: px(20),
          width: size,
          height,
          borderRadius: "48% 52% 50% 50% / 58% 55% 45% 42%",
          background: BODY_COLOR[mood],
          boxShadow: `0 ${px(14)}px ${px(24)}px ${-px(14)}px rgba(23,20,16,0.35)`,
        }}
      >
        {!tired && <div className="absolute left-[20%] top-[16%] h-[18%] w-[26%] rounded-full bg-white/35" />}

        <div
          className="absolute left-1/2 top-[48%] flex -translate-x-1/2"
          style={{ gap: px(16) }}
        >
          <span className="rounded-full bg-[#2B231F]" style={eye} />
          <span className="rounded-full bg-[#2B231F]" style={eye} />
        </div>

        {!tired && (
          <>
            <div
              className={`absolute left-[15%] top-[60%] rounded-full bg-white/40 ${
                great ? "opacity-90" : "opacity-60"
              }`}
              style={{ width: px(15), height: px(9) }}
            />
            <div
              className={`absolute right-[15%] top-[60%] rounded-full bg-white/40 ${
                great ? "opacity-90" : "opacity-60"
              }`}
              style={{ width: px(15), height: px(9) }}
            />
          </>
        )}

        {tired ? (
          <div
            className="absolute left-1/2 top-[62%] -translate-x-1/2 rounded-full bg-[#2B231F]"
            style={{ width: px(13), height: px(2.5) }}
          />
        ) : (
          <div
            className="absolute left-1/2 top-[59%] -translate-x-1/2 rounded-b-full border-[#2B231F]"
            style={{ width: px(15), height: px(7), borderBottomWidth: px(2.5) }}
          />
        )}
      </div>
    </motion.div>
  );
}
