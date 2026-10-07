# 구조 레퍼런스 (읽기 전용 포인터 — 복사본 아님)

복사본을 두지 않는다. 아래 **원본 경로**를 직접 읽는다.

| 무엇 | 원본 경로 |
| --- | --- |
| 디자인 시스템 산문 | `projects/b2b/assetflow/design.md` |
| 팔레트 파일 — **색 위주다** | `projects/b2b/assetflow/styles/` |
| 엔터프라이즈 프리미티브 (Table/Drawer/Pagination/차트) | `projects/b2b/assetflow/components/ui.tsx` |
| 셸 C1 — 다크 레일 콘솔 | `projects/b2b/assetflow/components/admin/admin-shell.tsx` |
| 셸 C2 — 라이트 워크벤치 | `projects/platform/studyspot/components/admin/admin-shell.tsx` |
| 셸 C3 — 상단 커맨드 바 | `projects/community/waypoint/components/admin/admin-shell.tsx` |
| 셸 C4 — 아이콘 레일 + 섹션 리스트 | `projects/b2b/logisync/components/shell.tsx` |
| 사용자 콘솔 T자형 (관리자 셸과 다른 축) | `projects/b2b/assetflow/components/layout/app-shell.tsx` |

**가져오는 것:** 구조, 상태 커버리지, 완성도 기준.

**가져오지 않는 것:** 색, 타입 스케일 수치, 모션 수치, radius 값, tone 어휘,
mock 인물/시각(`박채린`, `09:41`), `@/projects/b2b/assetflow/...` 절대 import.
수치는 CLAUDE.md `## Motion`의 "스케일 복제 금지"에 따라 새로 고른다.

## 이번 프로젝트 배정

- 프리셋: console
- 사용자 화면 셸: C3 상단 커맨드 바 (레일 없음)
- 팔레트 구성: 1 단일 액센트 / 라이트 뉴트럴 (디자인시스템 지정: apple_compact)
- 디자인시스템: apple_compact

배정 근거와 "이 아키타입에서 쓰지 않는 부품"은 `design.md`의 "아키타입" 절에 적는다.
