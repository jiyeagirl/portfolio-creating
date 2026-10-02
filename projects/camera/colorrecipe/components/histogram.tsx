function seededBars(seed: string, channelOffset: number, count: number) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i) + channelOffset) & 0xffffffff;
  }
  const bars: number[] = [];
  for (let i = 0; i < count; i++) {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    const noise = (hash % 1000) / 1000;
    const bell = Math.exp(-Math.pow((i - count / 2) / (count / 3), 2));
    bars.push(Math.max(0.04, bell * 0.75 + noise * 0.35));
  }
  return bars;
}

const CHANNELS = [
  { offset: 0, color: "#F2555F" },
  { offset: 97, color: "#5FC271" },
  { offset: 233, color: "#4E9BF2" },
];

export function Histogram({ seed }: { seed: string }) {
  const barCount = 48;

  return (
    <div className="flex h-24 items-end gap-[1px] overflow-hidden rounded-xl bg-[var(--cr-surface)] px-2 pb-2 pt-3">
      {Array.from({ length: barCount }).map((_, i) => {
        const heights = CHANNELS.map((c) => seededBars(seed, c.offset, barCount)[i]);
        const maxHeight = Math.max(...heights);
        return (
          <div key={i} className="relative flex-1" style={{ height: "100%" }}>
            {CHANNELS.map((c, ci) => (
              <div
                key={c.color}
                className="absolute bottom-0 w-full mix-blend-screen"
                style={{
                  height: `${heights[ci] * 100}%`,
                  backgroundColor: c.color,
                  opacity: 0.55,
                }}
              />
            ))}
            <div
              className="absolute bottom-0 w-full bg-white/10"
              style={{ height: `${maxHeight * 100}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}
