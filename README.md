# Portfolio Workspace

여러 개의 포트폴리오 UI 목업 프로젝트를 하나의 Next.js 앱에서 관리하는 워크스페이스입니다.
새 프로젝트를 만들 때마다 Next.js를 새로 생성하지 않고, 이 저장소를 계속 재사용합니다.

## 시작하기

```bash
npm run dev
```

`http://localhost:3000`을 열면 등록된 프로젝트 목록이 보입니다.

## 구조

```
app/
  layout.tsx              워크스페이스 루트 레이아웃
  globals.css              전역 스타일 토큰
  page.tsx                  워크스페이스 랜딩 (프로젝트 목록, projects/ 자동 스캔)
  [category]/[project]/
    page.tsx                 유일한 동적 라우트 — projects/<category>/<project>/src/index를 렌더링

components/
  shared/                    프로젝트에 종속되지 않는 공용 컴포넌트 (PhoneFrame, StatusBar 등)

projects/
  <category>/
    <project-name>/
      src/index.tsx            진입점 (default export 필수)
      components/               프로젝트 전용 컴포넌트
      lib/                      데이터, 유틸
      styles/                   프로젝트 전용 CSS
      spec.md, design.md          기획/디자인 문서
```

새 프로젝트를 추가하는 방법과 규칙은 [CLAUDE.md](./CLAUDE.md)의 "Workspace Architecture" 섹션을 참고하세요.
`app/` 디렉터리는 프로젝트가 늘어나도 파일 개수가 늘어나지 않습니다.
