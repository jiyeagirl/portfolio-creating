import Image from "next/image";
import Link from "next/link";

const CATEGORIES = [
  {
    label: "WOMEN",
    sub: "여성 컬렉션",
    href: "#products",
    seed: "vestire-category-women",
    span: "lg:col-span-6",
    aspect: "aspect-[4/3]",
  },
  {
    label: "MEN",
    sub: "남성 컬렉션",
    href: "#products",
    seed: "vestire-category-men",
    span: "lg:col-span-3",
    aspect: "aspect-[3/4]",
  },
  {
    label: "ACCESSORIES",
    sub: "액세서리",
    href: "#products",
    seed: "vestire-category-accessories",
    span: "lg:col-span-3",
    aspect: "aspect-[3/4]",
  },
];

export function CategoryStrip() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-16 sm:py-20 lg:px-10">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {CATEGORIES.map((category) => (
          <Link
            key={category.label}
            href={category.href}
            className={`group relative block overflow-hidden ${category.aspect} ${category.span}`}
          >
            <Image
              src={`https://picsum.photos/seed/${category.seed}/1200/1000`}
              alt={category.sub}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-[20px] font-semibold tracking-[0.08em]">
                {category.label}
              </p>
              <p className="mt-1 text-[13px] text-white/80">{category.sub}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
