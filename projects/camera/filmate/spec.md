# FILMATE — Product Spec

## 1. Overview

FILMATE는 다양한 필름 카메라의 색감과 질감을 실시간으로 구현하여, 촬영 순간부터
아날로그 감성을 경험할 수 있는 프리미엄 iOS 카메라 애플리케이션이다.

촬영 전부터 실제 결과물을 실시간 프리뷰로 확인할 수 있으며, LUT 기반 색보정과
Metal Shader 기반 광학 효과(그레인, 비네팅, 라이트 리크)를 통해 필름 특유의
색감과 입자감을 자연스럽게 재현한다.

- **플랫폼**: iOS (iPhone 16 Pro 기준, 393×852pt)
- **포지셔닝**: Leica FOTOS / Fujifilm X App / Dazz Cam 계열의 프리미엄 필름 카메라 앱
- **제작 목적**: 포트폴리오용 고품질 UI 목업. 실제 카메라 파이프라인·저장소·과금
  로직은 구현하지 않으며, 화면 완성도와 인터랙션 디테일을 우선한다.

## 2. Non-goals

- 실제 기기 카메라 API 연동
- 실제 이미지 처리(LUT 적용은 CSS/SVG로 시각적으로만 시뮬레이션)
- 로그인, 결제, 클라우드 동기화 등 비즈니스 로직
- Android / 태블릿 대응 (iPhone 단일 해상도 목업)

## 3. Information Architecture

```
/filmate                  → /filmate/camera 로 리다이렉트
/filmate/camera           → 1. Camera (메인 화면)
/filmate/films             → 2. Film Roll Selection
/filmate/films/[filmId]    → 3. Film Detail
/filmate/contact-sheet      → 4. Contact Sheet
/filmate/settings           → 5. Settings
```

Camera 화면을 허브로 하여 4개의 화면으로 뻗어나가는 구조:

- Camera 상단 톱니바퀴 → Settings
- Camera 하단 필름 인디케이터 탭 → Film Roll Selection
- Camera 하단 좌측 썸네일 → Contact Sheet
- Film Roll Selection에서 필름 카드 탭 → Film Detail
- 각 서브 화면은 좌상단 Back으로 Camera(또는 이전 화면)로 복귀

## 4. Screens & Requirements

### 4.1 Camera (실시간 촬영)

- Full Screen Camera Preview (배경 사진 위에 선택된 필름의 LUT를 실시간 합성한 것처럼 표현)
- 필름 변경 Carousel: 화면 하단, 가로 스크롤 스냅, 현재 필름명 상시 노출
- 셔터 버튼: 화면 하단 중앙, 큰 원형, 프레스 시 촉각적 피드백(scale)
- 카메라 전환 버튼 (전/후면)
- 플래시 토글 (Off / On / Auto)
- 설정 진입 아이콘
- 실시간 LUT 적용이 프리뷰에 그대로 반영 (촬영 결과 = 프리뷰와 동일하다는 것을 배지/카피로 명시)
- 최근 촬영 썸네일 (Contact Sheet 진입점)
- 상단 iOS 상태바 (시간/신호/배터리) — 카메라 위이므로 라이트 텍스트

### 4.2 Film Roll Selection

- 5종 필름을 실제 필름 롤처럼 표현: Kodak Gold, Portra 400, Fuji Classic, Mono 400, Cinema Warm
- 좌우 스와이프(가로 스크롤 스냅)로 필름 간 이동
- 각 필름: 롤 라벨 아트, 대표 썸네일, 짧은 설명, 색 계열 스와치
- 현재 선택된 필름 명확히 표시 (체크 배지 + 하단 인디케이터 도트)
- 필름 카드 탭 → Film Detail 진입
- "이 필름으로 촬영" CTA → Camera로 복귀하며 해당 필름 적용

### 4.3 Film Detail

- 필름 히어로 이미지 (해당 필름 톤으로 그레이딩된 대표 컷)
- 필름 소개 (브랜드 스토리 톤의 카피)
- 색감 설명 + 색 팔레트 스와치 (5색)
- 샘플 사진 그리드 (3~4컷, 실제 톤 적용)
- 특징 리스트 (그레인, 채도, 대비, 색 시프트 경향 등)
- 추천 촬영 상황 (예: 골든아워 인물, 여행 스냅 등) 태그
- "이 필름 사용하기" 하단 고정 CTA

### 4.4 Contact Sheet

- "오늘 촬영" 섹션: 날짜, 총 컷 수, 사용 필름 수
- 필름별 보기 (필터 탭: 전체 / Kodak Gold / Portra 400 / …)
- 격자 보기: 필름 네거티브 스트립 감성 (스프로킷 홀, 프레임 번호, 필름 종류 각인)
- 사진 탭 → 확대 보기 (풀스크린 라이트박스, 좌우 스와이프로 다음/이전, 촬영 정보 오버레이)
- 아날로그 콘택트 시트 특유의 질감(필름 스트립 보더, 인덱스 프린트 느낌)

### 4.5 Settings

- iOS 그룹 리스트 스타일
- 저장 옵션 (원본 + 필름 버전 저장 / 필름 버전만 저장)
- 해상도 (12MP / 24MP / 48MP ProRAW)
- 워터마크 (필름 프레임 워터마크 On/Off, 스타일 선택)
- 셔터 사운드 (On/Off, 사운드 스타일)
- LUT 품질 (표준 / 고품질 — 프리뷰 처리 품질 트레이드오프 설명 포함)
- 하단에 앱 버전 / 크레딧

## 5. Data Model (mock)

```ts
Film {
  id, name, engName, tagline,
  description, characteristics[], recommendedFor[],
  colorGrade: { filter css 파라미터 },
  palette: string[5],
  heroImage, sampleImages[3~4]
}

Shot {
  id, filmId, takenAt, thumbnail, isFavorite
}
```

## 6. Tech Constraints

- 기존 워크스페이스(Next.js App Router, Tailwind v4, shadcn 패턴, Phosphor Icons,
  Motion, Pretendard)를 그대로 재사용한다.
- 신규 npm 패키지 설치 없음.
- 신규 Next.js 프로젝트 생성 없음 — 기존 저장소의 `app/filmate/**` 라우트로 편입.
- 프로젝트 전용 코드는 `projects/camera/filmate/{components,lib}`에 위치.
- 정적 이미지 자산은 `public/filmate/`에 위치.
