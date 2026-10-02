/*
 * 고정 picsum id 표. 랜덤 seed를 쓰면 캡션과 사진이 어긋나기 때문에
 * id를 직접 열어 확인한 뒤 아래 설명과 짝지어 두었다. 캡션을 바꿀 때는
 * 반드시 이 표의 설명을 먼저 읽고 사진과 맞는지 확인할 것.
 *
 *  129 — 노을 지는 공원 벤치에 두 사람이 등을 보이고 앉아 있는 사진
 *  255 — 큰 나무가 줄지어 선 넓은 흙길 산책로 (근린공원)
 *  553 — 낙엽이 두껍게 쌓인 숲길의 나무 벤치 두 개 (공원 쉼터)
 *  858 — 포장 보도를 걷는 사람의 다리와 신발 클로즈업 (걷기)
 *  405 — 낮은 벽돌 주택이 이어진 좁은 골목과 1층 상점 (주택가)
 *  437 — 붉은 벽돌 코너 건물, 차양과 파라솔이 늘어선 상가 (동네 상가)
 *  342 — 버스와 오토바이가 지나는 번화한 거리, 배낭 멘 보행자 (대로변)
 */
export const PHOTO = {
  benchCouple: 129,
  parkPath: 255,
  parkBench: 553,
  walking: 858,
  alley: 405,
  shopStreet: 437,
  mainStreet: 342,
} as const;

export function photoUrl(id: number, w: number, h: number) {
  return `https://picsum.photos/id/${id}/${w}/${h}`;
}
