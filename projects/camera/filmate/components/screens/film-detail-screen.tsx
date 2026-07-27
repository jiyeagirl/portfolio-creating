import { ArrowLeft } from "@phosphor-icons/react/ssr";
import { sampleSeeds, type Film } from "@/projects/camera/filmate/lib/films";
import type { FilmateNavigate } from "@/projects/camera/filmate/lib/navigation";
import { GradedPhoto } from "@/projects/camera/filmate/components/graded-photo";

export function FilmDetailScreen({
  film,
  onNavigate,
}: {
  film: Film;
  onNavigate: FilmateNavigate;
}) {
  const samples = sampleSeeds.filter((seed) => seed !== film.heroSeed).slice(0, 4);

  return (
    <div className="h-full w-full pb-10">
      <div className="relative h-[380px] w-full">
        <GradedPhoto
          src={`https://picsum.photos/seed/${film.heroSeed}/800/900`}
          alt={film.name}
          grade={film.colorGrade}
          priority
          sizes="393px"
          className="h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--fm-bg)] via-black/10 to-black/30" />

        <button
          type="button"
          onClick={() => onNavigate("films")}
          className="absolute left-5 top-[70px] flex h-10 w-10 items-center justify-center rounded-full bg-black/40 backdrop-blur-md"
          aria-label="필름 롤로 돌아가기"
        >
          <ArrowLeft size={20} weight="regular" />
        </button>

        <div className="absolute inset-x-6 bottom-6">
          <span className="text-[11px] font-medium tabular-nums tracking-wide text-[var(--fm-warm-gray)]">
            ISO {film.iso}
          </span>
          <h1 className="mt-1 text-[28px] font-bold leading-tight tracking-tight">
            {film.name}
          </h1>
          <p className="mt-1 text-[14px] text-[var(--fm-foreground)]/80">{film.tagline}</p>
        </div>
      </div>

      <div className="space-y-8 px-6 pt-7">
        <p className="text-[15px] leading-[1.7] text-[var(--fm-warm-gray)]">
          {film.description}
        </p>

        <section>
          <h2 className="mb-3 text-[17px] font-semibold tracking-tight">색감</h2>
          <div className="flex gap-2">
            {film.palette.map((color) => (
              <div key={color} className="flex-1">
                <div
                  className="h-14 w-full rounded-xl border border-white/10"
                  style={{ backgroundColor: color }}
                />
                <p className="mt-1.5 text-center text-[10px] font-medium tabular-nums text-[var(--fm-warm-gray)]">
                  {color.toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-[17px] font-semibold tracking-tight">샘플 컷</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {samples.map((seed) => (
              <div key={seed} className="relative aspect-square overflow-hidden rounded-xl">
                <GradedPhoto
                  src={`https://picsum.photos/seed/${seed}/400/400`}
                  alt={`${film.name} 샘플 사진`}
                  grade={film.colorGrade}
                  sizes="180px"
                  className="h-full w-full"
                />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-[17px] font-semibold tracking-tight">특징</h2>
          <div className="flex flex-wrap gap-2">
            {film.characteristics.map((c) => (
              <span
                key={c}
                className="rounded-full border border-[var(--fm-border)] bg-[var(--fm-surface)] px-3 py-1.5 text-[12px] font-medium text-[var(--fm-foreground)]/90"
              >
                {c}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-[17px] font-semibold tracking-tight">추천 촬영 상황</h2>
          <div className="divide-y divide-[var(--fm-border)] overflow-hidden rounded-xl border border-[var(--fm-border)]">
            {film.recommendedFor.map((r) => (
              <div
                key={r}
                className="flex items-center gap-3 bg-[var(--fm-surface)] px-4 py-3.5"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--fm-accent)]" />
                <span className="text-[14px] text-[var(--fm-foreground)]/90">{r}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="px-6 pt-8">
        <button
          type="button"
          onClick={() => onNavigate("camera")}
          className="flex h-[52px] w-full items-center justify-center rounded-full bg-[var(--fm-accent)] text-[15px] font-semibold text-[#1a1305]"
        >
          이 필름 사용하기
        </button>
      </div>
    </div>
  );
}
