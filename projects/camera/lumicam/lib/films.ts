import type { Film } from "./types";

export function picsum(id: number, w: number, h: number) {
  return `https://picsum.photos/id/${id}/${w}/${h}`;
}

export const films: Film[] = [
  {
    id: "sunlit-gold",
    name: "Sunlit Gold 200",
    shortName: "Sunlit Gold",
    tagline: "낮의 햇살을 그대로 담다",
    description:
      "따뜻한 앰버 톤과 선명한 채도로 골든아워의 공기를 재현하는 데일리 필름입니다. 피부 톤이 화사하게 살아나 인물 촬영에 특히 강합니다.",
    characteristics: ["따뜻한 앰버 톤", "중간 대비", "선명한 채도", "부드러운 그레인"],
    recommendedFor: ["골든아워 인물", "여행 스냅", "일상 기록"],
    iso: 200,
    colorGrade: {
      filter: "saturate(1.18) contrast(1.04) brightness(1.03) sepia(.14) hue-rotate(-8deg)",
      overlayGradient: "linear-gradient(160deg, rgba(194,121,46,0.3), rgba(194,121,46,0) 58%)",
      overlayBlend: "soft-light",
      grain: 0.3,
      vignette: 0.14,
    },
    palette: ["#C2792E", "#E3A25C", "#8B4A2B", "#F4D9A0", "#3B2A1E"],
    heroId: 64,
  },
  {
    id: "cream-portrait",
    name: "Cream Portrait 400",
    shortName: "Cream Portrait",
    tagline: "크리미한 인물톤의 정석",
    description:
      "낮은 대비와 절제된 채도로 피부 톤을 자연스럽고 부드럽게 표현합니다. 웨딩과 인물 사진가들이 가장 신뢰하는 톤입니다.",
    characteristics: ["낮은 대비", "크리미한 스킨톤", "절제된 채도", "미세한 그레인"],
    recommendedFor: ["웨딩 스냅", "실내 인물", "차분한 정물"],
    iso: 400,
    colorGrade: {
      filter: "saturate(.86) contrast(.9) brightness(1.06) sepia(.07)",
      overlayGradient: "linear-gradient(160deg, rgba(224,178,155,0.26), rgba(224,178,155,0) 62%)",
      overlayBlend: "soft-light",
      grain: 0.2,
      vignette: 0.08,
    },
    palette: ["#E8C7B0", "#D9A88F", "#B98671", "#F3E4D6", "#6B4A3A"],
    heroId: 1027,
  },
  {
    id: "harbor-teal",
    name: "Harbor Teal 100",
    shortName: "Harbor Teal",
    tagline: "시원한 그린, 정직한 톤",
    description:
      "차분한 그린과 틸 계열이 강조되는 쿨톤 필름입니다. 자연광 아래 풍경과 해안 스냅에서 특유의 청량감을 냅니다.",
    characteristics: ["쿨 틸 시프트", "높은 선명도", "단단한 대비", "깨끗한 하이라이트"],
    recommendedFor: ["해안 절벽", "숲과 자연", "맑은 날 스냅"],
    iso: 100,
    colorGrade: {
      filter: "saturate(1.08) contrast(1.06) hue-rotate(6deg) brightness(.97)",
      overlayGradient: "linear-gradient(160deg, rgba(45,98,94,0.26), rgba(45,98,94,0) 60%)",
      overlayBlend: "multiply",
      grain: 0.26,
      vignette: 0.12,
    },
    palette: ["#2D625E", "#4E8C84", "#8FA9A0", "#C9D8D0", "#1B3A37"],
    heroId: 1050,
  },
  {
    id: "slate-mono",
    name: "Slate Mono 400",
    shortName: "Slate Mono",
    tagline: "빛과 그림자만 남기다",
    description:
      "높은 대비의 하이컨트라스트 흑백 필름입니다. 굵은 그레인이 인물의 표정과 도시의 질감을 극적으로 강조합니다.",
    characteristics: ["하이 콘트라스트", "굵은 그레인", "깊은 쉐도우", "선명한 하이라이트"],
    recommendedFor: ["다큐멘터리 스냅", "야간 도시", "드라마틱한 인물"],
    iso: 400,
    colorGrade: {
      filter: "grayscale(1) contrast(1.3) brightness(1.02)",
      grain: 0.52,
      vignette: 0.22,
    },
    palette: ["#F0F0EA", "#B4B4AC", "#78786F", "#3A3A34", "#141410"],
    heroId: 1074,
  },
  {
    id: "dusk-cinema",
    name: "Dusk Cinema",
    shortName: "Dusk Cinema",
    tagline: "영화 같은 순간을 위해",
    description:
      "쉐도우는 틸로, 하이라이트는 앰버로 갈라지는 시네마틱 스플릿톤입니다. 해질녘 도심과 실내 조명 아래에서 극적인 무드를 만듭니다.",
    characteristics: ["틸 앤 앰버", "깊은 대비", "시네마틱 무드", "중간 그레인"],
    recommendedFor: ["해질녘 도심", "실내 무드 조명", "인물 시네마 룩"],
    iso: 250,
    colorGrade: {
      filter: "saturate(1.14) contrast(1.16)",
      overlayGradient: "linear-gradient(200deg, rgba(20,46,52,0.32), rgba(226,157,84,0.26) 100%)",
      overlayBlend: "soft-light",
      grain: 0.32,
      vignette: 0.18,
    },
    palette: ["#E29D54", "#142E34", "#F0C083", "#0C1E22", "#8A4F2A"],
    heroId: 1067,
  },
];

export function getFilm(id: string) {
  return films.find((f) => f.id === id);
}
