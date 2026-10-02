import Image from "next/image";
import { FilmGrain } from "@/projects/camera/lumicam/components/film-grain";
import type { ColorGrade } from "@/projects/camera/lumicam/lib/types";

export function GradedPhoto({
  src,
  alt,
  grade,
  sizes,
  priority,
  className = "",
  ungraded = false,
}: {
  src: string;
  alt: string;
  grade: ColorGrade;
  sizes?: string;
  priority?: boolean;
  className?: string;
  /** 원본/편집 비교 화면에서 필터 없이 원본 그대로 보여줄 때 */
  ungraded?: boolean;
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
        style={{ filter: ungraded ? undefined : grade.filter }}
      />
      {!ungraded && grade.overlayGradient && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: grade.overlayGradient, mixBlendMode: grade.overlayBlend }}
        />
      )}
      {!ungraded && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ boxShadow: `inset 0 0 120px rgba(0,0,0,${grade.vignette})` }}
        />
      )}
      {!ungraded && <FilmGrain intensity={grade.grain} />}
    </div>
  );
}
