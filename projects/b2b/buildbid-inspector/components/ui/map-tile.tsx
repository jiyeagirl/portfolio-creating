import Image from "next/image";
import { MapPinLine } from "@phosphor-icons/react/ssr";
import { MAP_TILES } from "@/projects/b2b/buildbid-inspector/lib/mock-data";

/* Styled as a "map tile" placeholder, not a claim to be the real satellite
   photo of the address — see design.md 사진 매핑. The desaturate + cool-hue
   filter and grid overlay push the aerial stock photo toward a generic
   map-texture read rather than "photo of this exact site". */
export function MapTile({
  tileId,
  className = "h-[132px] w-full",
  radiusClassName = "rounded-[18px]",
}: {
  tileId: string;
  className?: string;
  radiusClassName?: string;
}) {
  const tile = MAP_TILES[tileId] ?? MAP_TILES.a;

  return (
    <div className={`relative overflow-hidden border border-[var(--bbi-border)] ${radiusClassName} ${className}`}>
      <Image
        src={`https://picsum.photos/id/${tile.picsumId}/600/400`}
        alt={`${tile.caption} 지도 썸네일`}
        fill
        sizes="360px"
        className="object-cover [filter:saturate(.55)_brightness(1.05)_hue-rotate(-8deg)]"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(20,24,26,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(20,24,26,0.55) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(20,24,26,0)_55%,rgba(20,24,26,0.45)_100%)]" />
      <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded-[9999px] bg-white/95 px-2.5 py-1">
        <MapPinLine size={13} weight="bold" className="text-[var(--bbi-accent)]" />
        <span className="text-[11px] font-bold leading-[14px] text-[var(--bbi-ink)]">현장 위치 (지도 목업)</span>
      </div>
    </div>
  );
}
