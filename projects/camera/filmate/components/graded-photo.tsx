import Image from "next/image";
import { FilmGrain } from "@/projects/camera/filmate/components/film-grain";
import type { ColorGrade } from "@/projects/camera/filmate/lib/films";

export function GradedPhoto({
  src,
  alt,
  grade,
  sizes,
  priority,
  className = "",
}: {
  src: string;
  alt: string;
  grade: ColorGrade;
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
      <FilmGrain intensity={grade.grain} />
    </div>
  );
}
