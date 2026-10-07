# 구조 레퍼런스 (읽기 전용 포인터 — 복사본 아님)

복사본을 두지 않는다. 아래 **원본 경로**를 직접 읽는다.

| 무엇 | 원본 경로 |
| --- | --- |
| 디자인 시스템 산문 | `projects/community/locly/design.md` |
| 반응형 대응 폭 (플랫폼 줄) | `projects/community/locly/spec.md` |
| 사이트 구조 (헤더, 푸터, 화면, 공용 ui) | `projects/community/locly/components/site/` |
| 모바일 표시 장치 (`<ResponsiveSite>`로 감싼다) | `components/shared/responsive-site.tsx` |
| 엔터프라이즈 프리미티브 (Table/Drawer/Pagination/차트) | `projects/b2b/assetflow/components/ui.tsx` |
| 셸 C1 — 다크 레일 콘솔 | `projects/b2b/assetflow/components/admin/admin-shell.tsx` |
| 셸 C2 — 라이트 워크벤치 | `projects/platform/studyspot/components/admin/admin-shell.tsx` |
| 셸 C3 — 상단 커맨드 바 | `projects/community/waypoint/components/admin/admin-shell.tsx` |
| 셸 C4 — 아이콘 레일 + 섹션 리스트 | `projects/b2b/logisync/components/shell.tsx` |

**가져오는 것:** 구조, 상태 커버리지, 완성도 기준.

**가져오지 않는 것:** 색, 타입 스케일 수치, 모션 수치, radius 값, tone 어휘,
mock 인물/시각(`박채린`, `09:41`), `@/projects/b2b/assetflow/...` 절대 import.
수치는 CLAUDE.md `## Motion`의 "스케일 복제 금지"에 따라 새로 고른다.

## 이번 프로젝트 배정

- 프리셋: web
- 홈 골격: 도구형 4단계 흐름. 업로드는 좌정렬 분할(드롭 영역 좌, 설정 우), 인식 확인은 뷰어 + 목록 마스터-디테일, 결과는 요약 2열 + 표 + 차트, 견적은 폼 + 고정 요약 패널
- 관리자 셸: C3 (상단 커맨드 바)
- 팔레트 구성: 4 (틴티드 뉴트럴, 콜드 슬레이트)

배정 근거와 "이 아키타입에서 쓰지 않는 부품"은 `design.md`의 "아키타입" 절에 적는다.
