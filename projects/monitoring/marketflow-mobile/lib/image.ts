/* 고정 picsum id만 사용(랜덤/해시 시드 금지). id별 실제 내용은 design.md "사진 매핑" 표 참고. */
export function picsumUrl(id: number, width: number, height: number): string {
  return `https://picsum.photos/id/${id}/${width}/${height}`;
}
