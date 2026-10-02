/*
 * picsum 고정 id 표. 랜덤/해시 시드는 쓰지 않는다.
 * 아래 캡션은 실제로 이미지를 한 장씩 열어 확인한 내용이고, 시나리오와의 짝을
 * 바꿀 때는 반드시 다시 확인한다. (CLAUDE.md Images 규칙)
 *
 * 195 — 저녁 상가 골목. 전구 줄조명이 걸린 좁은 시장 통로, 양옆 점포. 붐비는 저녁 거리.
 * 173 — 한낮의 강한 태양. 도시 원경 위로 내려앉은 노란 열기, 실루엣 한 명.
 * 186 — 눈 덮인 길과 앙상한 겨울 나무. 안개 낀 한파 풍경.
 * 221 — 좁은 골목을 사이에 둔 밀집 노후 고층 건물. 외부 계단과 창문이 빼곡함.
 */
export const PHOTO = {
  market: 195,
  heatwave: 173,
  coldwave: 186,
  denseBuildings: 221,
} as const;

export function picsum(id: number, w: number, h: number) {
  return `https://picsum.photos/id/${id}/${w}/${h}`;
}
