export type ColorGrade = {
  filter: string;
  overlayGradient?: string;
  overlayBlend?: "soft-light" | "multiply" | "overlay";
  grain: number;
  vignette: number;
};

export type Film = {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  characteristics: string[];
  recommendedFor: string[];
  iso: number;
  colorGrade: ColorGrade;
  palette: string[];
  heroSeed: string;
};

function picsum(seed: string, w: number, h: number) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

export const films: Film[] = [
  {
    id: "kodak-gold",
    name: "Kodak Gold 200",
    shortName: "Kodak Gold",
    tagline: "낮의 햇살을 그대로 담다",
    description:
      "따뜻한 앰버 톤과 선명한 채도로 골든아워의 공기를 재현하는 데일리 필름입니다. 피부 톤이 화사하게 살아나 인물 촬영에 특히 강합니다.",
    characteristics: ["따뜻한 앰버 톤", "중간 대비", "선명한 채도", "부드러운 그레인"],
    recommendedFor: ["골든아워 인물", "여행 스냅", "일상 기록"],
    iso: 200,
    colorGrade: {
      filter: "saturate(1.15) contrast(1.05) brightness(1.02) sepia(.12) hue-rotate(-6deg)",
      overlayGradient:
        "linear-gradient(160deg, rgba(232,163,61,0.32), rgba(232,163,61,0) 58%)",
      overlayBlend: "soft-light",
      grain: 0.32,
      vignette: 0.16,
    },
    palette: ["#E8A33D", "#C97C3C", "#8B4A2B", "#F4D9A0", "#3B2A1E"],
    heroSeed: "filmate-golden-hour-portrait",
  },
  {
    id: "portra-400",
    name: "Portra 400",
    shortName: "Portra 400",
    tagline: "크리미한 인물톤의 정석",
    description:
      "낮은 대비와 절제된 채도로 피부 톤을 자연스럽고 부드럽게 표현합니다. 웨딩과 인물 사진가들이 가장 신뢰하는 톤입니다.",
    characteristics: ["낮은 대비", "크리미한 스킨톤", "절제된 채도", "미세한 그레인"],
    recommendedFor: ["웨딩 스냅", "실내 인물", "차분한 정물"],
    iso: 400,
    colorGrade: {
      filter: "saturate(.88) contrast(.92) brightness(1.05) sepia(.08)",
      overlayGradient:
        "linear-gradient(160deg, rgba(217,168,143,0.28), rgba(217,168,143,0) 62%)",
      overlayBlend: "soft-light",
      grain: 0.22,
      vignette: 0.1,
    },
    palette: ["#E8C7B0", "#D9A88F", "#B98671", "#F3E4D6", "#6B4A3A"],
    heroSeed: "filmate-cafe-window-still-life",
  },
  {
    id: "fuji-classic",
    name: "Fuji Classic 100",
    shortName: "Fuji Classic",
    tagline: "시원한 그린, 정직한 톤",
    description:
      "차분한 그린과 틸 계열이 강조되는 클래식 후지 톤입니다. 자연광 아래 풍경과 도시 스냅에서 특유의 청량감을 냅니다.",
    characteristics: ["쿨 그린 시프트", "높은 선명도", "단단한 대비", "깨끗한 하이라이트"],
    recommendedFor: ["도시 풍경", "숲과 자연", "맑은 날 스냅"],
    iso: 100,
    colorGrade: {
      filter: "saturate(1.1) contrast(1.08) hue-rotate(4deg) brightness(.98)",
      overlayGradient:
        "linear-gradient(160deg, rgba(47,93,82,0.28), rgba(47,93,82,0) 60%)",
      overlayBlend: "multiply",
      grain: 0.28,
      vignette: 0.14,
    },
    palette: ["#4E7C6B", "#2F5D52", "#8FA98F", "#1F3A34", "#C9D4C4"],
    heroSeed: "filmate-coastal-cliff-walk",
  },
  {
    id: "mono-400",
    name: "Mono 400",
    shortName: "Mono 400",
    tagline: "빛과 그림자만 남기다",
    description:
      "높은 대비의 하이컨트라스트 흑백 필름입니다. 굵은 그레인이 인물의 표정과 도시의 질감을 극적으로 강조합니다.",
    characteristics: ["하이 콘트라스트", "굵은 그레인", "깊은 쉐도우", "선명한 하이라이트"],
    recommendedFor: ["다큐멘터리 스냅", "야간 도시", "드라마틱한 인물"],
    iso: 400,
    colorGrade: {
      filter: "grayscale(1) contrast(1.28) brightness(1.04)",
      grain: 0.55,
      vignette: 0.24,
    },
    palette: ["#F5F5F0", "#B8B8B0", "#7A7A72", "#3A3A36", "#121210"],
    heroSeed: "filmate-night-market-alley",
  },
  {
    id: "cinema-warm",
    name: "Cinema Warm",
    shortName: "Cinema Warm",
    tagline: "영화 같은 순간을 위해",
    description:
      "쉐도우는 틸로, 하이라이트는 오렌지로 갈라지는 시네마틱 스플릿톤입니다. 해질녘 도심과 실내 조명 아래에서 극적인 무드를 만듭니다.",
    characteristics: ["틸 앤 오렌지", "깊은 대비", "시네마틱 무드", "중간 그레인"],
    recommendedFor: ["해질녘 도심", "실내 무드 조명", "인물 시네마 룩"],
    iso: 250,
    colorGrade: {
      filter: "saturate(1.12) contrast(1.14)",
      overlayGradient:
        "linear-gradient(200deg, rgba(18,49,56,0.34), rgba(242,184,114,0.26) 100%)",
      overlayBlend: "soft-light",
      grain: 0.34,
      vignette: 0.2,
    },
    palette: ["#E07A3C", "#2A5A62", "#F2B872", "#123138", "#8C4A2A"],
    heroSeed: "filmate-mountain-lake-mist",
  },
];

export function getFilm(id: string) {
  return films.find((f) => f.id === id);
}

export const sampleSeeds = [
  "filmate-golden-hour-portrait",
  "filmate-cafe-window-still-life",
  "filmate-coastal-cliff-walk",
  "filmate-night-market-alley",
  "filmate-mountain-lake-mist",
  "filmate-autumn-park-bench",
  "filmate-vintage-car-detail",
  "filmate-city-street-dusk",
];

export function shotUrl(seed: string, size = 800) {
  return picsum(seed, size, size);
}
