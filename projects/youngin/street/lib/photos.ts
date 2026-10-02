/*
 * 검증된 Pexels 고정 URL 표. 랜덤/해시 시드는 쓰지 않는다.
 *
 * picsum은 보행 위험 요소(파손된 보도블록, 적치물, 쓰러진 가로등) 사진 적중률이
 * 사실상 0이라 pawfit/snowpeak의 선례대로 Pexels로 대체했다.
 * 아래 캡션은 후보를 한 장씩 실제로 내려받아 눈으로 확인한 내용이고, 유형과의 짝을
 * 바꿀 때는 반드시 다시 확인한다. (CLAUDE.md Images 규칙, design.md "사진 매핑")
 *
 * 11574520 — 회색 석재 보도블록이 깨져 들리고 아래 구멍이 뚫린 인도, 앞쪽 적백 안전 테이프.
 * 26292299 — 붉은 보행자 전용 노면 도색이 크게 박리되어 회색 콘크리트가 드러난 바닥,
 *            가운데 흰 보행자 픽토그램.
 * 16123307 — 콘크리트 인도 판 사이가 벌어져 단차와 잡초가 생긴 이음새 클로즈업.
 * 8415827  — 나뭇잎 그림자가 진 콘크리트 포장길에서 수동 휠체어를 손으로 밀며 이동하는
 *            사람의 측면 하반신.
 * 12841982 — 회색 건물 벽 앞 보도블록 위 낡은 빨간 철제 수거함과 옆에 쌓인 쓰레기 봉투.
 * 9953451  — 바닥에 쓰러진 가로등 등기구와 주변에 흩어진 유리 파편, 사선으로 뻗은 기둥.
 * 37098586 — 책가방을 멘 초등학생 두 명이 뒷모습으로 횡단보도를 건너는 장면, 초록 보행신호.
 *
 * 탈락 후보는 design.md의 "탈락시킨 후보와 이유"에 남겨 뒀다 (영문/일본어 표지가
 * 화면을 차지하거나, 식별 가능한 해외 랜드마크가 배경에 잡힌 컷들).
 */

const PEXELS: Record<string, number> = {
  brokenBlock: 11574520,
  peeledPaint: 26292299,
  slabGap: 16123307,
  wheelchairPath: 8415827,
  dumpedBags: 12841982,
  fallenLamp: 9953451,
  schoolCrossing: 37098586,
};

export type PhotoKey = keyof typeof PEXELS;

/** Pexels 이미지 CDN은 압축/리사이즈 파라미터를 쿼리로 받는다. */
export function photo(key: string, width: number): string {
  const id = PEXELS[key];
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;
}
