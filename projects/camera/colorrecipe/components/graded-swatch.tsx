import Image from "next/image";
import { GrainOverlay } from "@/projects/camera/colorrecipe/components/grain-overlay";
import type { ColorGrade } from "@/projects/camera/colorrecipe/lib/types";

export function GradedSwatch({
  src,
  alt,
  grade,
  intensity = 100,
  sizes,
  priority,
  className = "",
}: {
  src: string;
  alt: string;
  grade: ColorGrade;
  /** LUT strength 0-100. 0 shows the untouched original, 100 shows the full grade. */
  intensity?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? "393px"}
        priority={priority}
        className="object-cover"
      />
      {intensity > 0 && (
        <div className="absolute inset-0" style={{ opacity: intensity / 100 }}>
          <Image
            src={src}
            alt=""
            aria-hidden
            fill
            sizes={sizes ?? "393px"}
            className="object-cover"
            style={{ filter: grade.filter }}
          />
          {grade.overlayGradient && (
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: grade.overlayGradient,
                mixBlendMode: grade.overlayBlend,
              }}
            />
          )}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ boxShadow: `inset 0 0 120px rgba(0,0,0,${grade.vignette})` }}
          />
          <GrainOverlay intensity={grade.grain} />
        </div>
      )}
    </div>
  );
}
