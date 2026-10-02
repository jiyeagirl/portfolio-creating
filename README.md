# Portfolio Workspace

여러 개의 포트폴리오 UI 목업 프로젝트를 하나의 Next.js 앱에서 관리하는 워크스페이스입니다.
새 프로젝트를 만들 때마다 Next.js를 새로 생성하지 않고, 이 저장소를 계속 재사용합니다.

## 시작하기

```bash
npm run dev
```

처음 설치한 기기에서는 캡처 도구용 브라우저를 한 번 받아야 합니다: `npx playwright install chromium`

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
  shared/                    프로젝트에 종속되지 않는 공용 컴포넌트 (PhoneFrame, StatusBar, HomeIndicator, WatchFrame, Toggle, ScreenHeader, ResponsiveSite)

projects/
  <category>/
    <project-name>/
      src/index.tsx            진입점 (default export 필수)
      components/               프로젝트 전용 컴포넌트
      lib/                      데이터, 유틸
      styles/                   프로젝트 전용 CSS
      spec.md, design.md          기획/디자인 문서
```

## 자주 쓰는 명령

| 명령 | 하는 일 |
| --- | --- |
| `/scaffold <카테고리>/<이름> [app\|web\|console] [--with-admin] [--with-mobile]` | 새 프로젝트 뼈대 생성 (Claude Code 슬래시 명령). app 모바일 앱, web 고객용 반응형 웹, console 관리자 콘솔 |
| `npm run visual -- <카테고리> <이름> <화면...> [--device=web\|console]` | 빌드 검증용 캡처와 DOM 검사, 결과는 `.visual/`. 반응형 웹은 `--device=web`(데스크톱 + 프레임 안 모바일), 콘솔과 `-admin`은 `--device=console` |
| `npm run capture -- <카테고리> <이름> <화면...> [--device=web]` | 포트폴리오용 투명 배경 기기 PNG, 결과는 `screenshots/`. 반응형 웹의 모바일 컷은 `--device=web` |

디자인 판단 기준은 저장소에 포함된 워크스페이스 전용 skill `.claude/skills/mockup-craft/`에 있습니다.
`.claude/hooks/`의 hook이 금지 문자, 없는 import, skill 미적용, 시각 검증 누락을 자동으로 잡습니다.

새 프로젝트를 추가하는 방법과 규칙은 [CLAUDE.md](./CLAUDE.md)의 "Workspace Architecture" 섹션을 참고하세요.
`app/` 디렉터리는 프로젝트가 늘어나도 파일 개수가 늘어나지 않습니다.
