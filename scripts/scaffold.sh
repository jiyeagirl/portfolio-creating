#!/usr/bin/env bash
set -euo pipefail

# ------------------------------------------------------------------
# scaffold.sh — 목업 프로젝트 표준 뼈대 생성 스크립트
# LLM 호출 없이 순수 파일 복사/생성만 수행 → 생성 시간 최소화
#
# 사용법: ./scaffold.sh <카테고리>/<새프로젝트명> [app|web|console|<소스경로>] [--with-admin] [--with-mobile]
#         [--archetype A<n>] [--shell C<n>] [--palette <1-6>]   # 셋 다 선택 — 생략이 기본
# 예:     ./scaffold.sh camera/moviediary                       # 모바일 앱 (filmate 기준, 기본값)
#         ./scaffold.sh platform/dressday web --with-admin      # 고객용 반응형 웹 + -admin 형제
#         ./scaffold.sh b2b/neworder console                    # 웹 콘솔 (assetflow 기준)
#         ./scaffold.sh b2b/neworder console --with-admin --with-mobile
#                                                                # 웹 콘솔 + 관리자(얇은 엔트리) +
#                                                                # 모바일(완전한 형제 프로젝트)
#         ./scaffold.sh healthcare/mediday --archetype A6        # 골격을 직접 지정 (선택)
#         ./scaffold.sh camera/moviediary /path/to/proj         # 임의 소스 (하위 호환)
#
# 프리셋:
#   app (기본) → projects/camera/filmate      — 모바일 앱. PhoneFrame, 393x852 캔버스
#   web        → projects/community/locly     — 고객용 반응형 웹. 데스크톱 1440 + 모바일 393
#                                               (모바일은 ResponsiveSite로 iPhone 프레임 안)
#   console    → projects/b2b/assetflow       — 웹 콘솔/관리자 대시보드. 셸 + 표 중심
#   (2026-09 이전에는 web이 콘솔을 뜻했다. 콘솔은 이제 console이다.)
#
# 이 스크립트는 폴더 스켈레톤과 원본을 가리키는 _reference.md 한 장을 만든다.
# 레퍼런스 파일을 복사하지 않는다 — 예전에는 _reference-ui.tsx(28KB)를 포함해
# 파일 81개를 복사했고, 전부 원본과 바이트 동일한 사본이라 assetflow의 하드코딩
# hex와 절대 import까지 함께 번졌다. tsconfig의 include: ["**/*.tsx"]가 그 사본들을
# 매 tsc마다 타입체크하는 부작용도 있었다.
#
# 공용 컴포넌트(PhoneFrame/Toggle/ScreenHeader 등)는 워크스페이스 루트
# components/shared/에만 있고 모든 프로젝트가 `@/components/shared/...`로 직접
# import한다 — 복사 대상이 아니다. app/도 워크스페이스 루트에 하나뿐이라
# 프로젝트 폴더 안에 만들지 않는다. lib/은 프로젝트마다 도메인이 전부 달라
# 항상 새로 쓴다 — 이 워크스페이스에는 공용 lib 레이어 자체가 없다.
#
# --archetype / --shell / --palette: 선택적 override다. 기본 경로는 생략이고, 그때
#   _reference.md에 <미정>으로 남는다 — 이후 spec.md의 도메인을 읽고 ARCHETYPES.md에서
#   배정해 채운다. 사용자가 골격에 이미 의견을 밝혔을 때만 인자로 넘긴다.
#   카탈로그는 루트 ARCHETYPES.md, 팔레트 구성은 CLAUDE.md ## Color.
#   A1(섹션 스택)은 이미 12개가 점유해 값과 무관하게 거부된다.
#
# --with-admin: 관리자 콘솔에 별도 URL만 주는 "얇은 엔트리" 형제 프로젝트
#   (assetflow-admin, lumi-admin, orderlog-admin과 동일 구성). 실제 화면 코드는
#   본 프로젝트 components/admin/ 안에 있다.
# --with-mobile: console 메인 프로덕트에 딸린 "완전히 독립된" 모바일 형제 프로젝트
#   (marketflow-mobile과 동일 구성). admin과 달리 얇은 엔트리가 아니라 자체
#   spec.md/design.md/styles/_reference.md를 갖는 완전한 스캐폴드다.
#   console 프리셋에서만 쓴다 — app은 이미 모바일이고, web(반응형)은 모바일 화면을 포함한다.
# ------------------------------------------------------------------

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BASE_DIR="$ROOT_DIR/projects"
FILMATE="$BASE_DIR/camera/filmate"
LOCLY="$BASE_DIR/community/locly"
ASSETFLOW="$BASE_DIR/b2b/assetflow"
ARCHETYPES="$ROOT_DIR/ARCHETYPES.md"

USAGE="사용법: ./scaffold.sh <카테고리>/<프로젝트명> [app|web|console|<소스경로>] [--with-admin] [--with-mobile]
       골격 override(선택, 생략이 기본): [--archetype A<n>] [--shell C<n>] [--palette <1-6>]"

NEW_PATH=""
SOURCE_ARG=""
WITH_ADMIN=0
WITH_MOBILE=0
ARCHETYPE=""
SHELL_ARCH=""
PALETTE=""

# --- 인자 파싱 (플래그는 위치 무관, --opt VALUE / --opt=VALUE 둘 다 허용) ---
while [ $# -gt 0 ]; do
  case "$1" in
    --with-admin)     WITH_ADMIN=1 ;;
    --with-mobile)    WITH_MOBILE=1 ;;
    --archetype)      ARCHETYPE="${2:-}"; shift ;;
    --archetype=*)    ARCHETYPE="${1#*=}" ;;
    --shell)          SHELL_ARCH="${2:-}"; shift ;;
    --shell=*)        SHELL_ARCH="${1#*=}" ;;
    --palette)        PALETTE="${2:-}"; shift ;;
    --palette=*)      PALETTE="${1#*=}" ;;
    -*)
      echo "❌ 알 수 없는 옵션: $1"
      echo "   $USAGE"
      exit 1
      ;;
    *)
      if [ -z "$NEW_PATH" ]; then
        NEW_PATH="$1"
      elif [ -z "$SOURCE_ARG" ]; then
        SOURCE_ARG="$1"
      else
        echo "❌ 인자가 너무 많습니다: $1"
        exit 1
      fi
      ;;
  esac
  shift
done

if [ -z "$NEW_PATH" ]; then
  echo "❌ $USAGE"
  exit 1
fi

# --- 아키타입/셸/팔레트 검증 ---
# A1(섹션 스택)은 12개 프로젝트가 점유했다. 이게 이 워크스페이스가 "다 비슷해 보이는"
# 단일 최대 원인이라 스크립트 레벨에서 막는다.
if [ "$ARCHETYPE" = "A1" ]; then
  echo "❌ A1(섹션 스택)은 신규 배정할 수 없습니다 — 이미 12개 프로젝트가 점유했습니다."
  echo "   ARCHETYPES.md에서 다른 아키타입을 고르세요. 맞는 것이 없으면 그 문서에"
  echo "   새 아키타입을 먼저 추가한 뒤 쓰세요."
  exit 1
fi

if [ -n "$ARCHETYPE" ]; then
  if [ ! -f "$ARCHETYPES" ]; then
    echo "❌ ARCHETYPES.md를 찾을 수 없습니다: $ARCHETYPES"
    exit 1
  fi
  if ! grep -q "^## $ARCHETYPE — " "$ARCHETYPES"; then
    echo "❌ 알 수 없는 아키타입: $ARCHETYPE (ARCHETYPES.md에 정의되어 있지 않습니다)"
    exit 1
  fi
fi

if [ -n "$SHELL_ARCH" ]; then
  if ! grep -q "^## $SHELL_ARCH — " "$ARCHETYPES"; then
    echo "❌ 알 수 없는 셸 아키타입: $SHELL_ARCH (ARCHETYPES.md에 정의되어 있지 않습니다)"
    exit 1
  fi
fi

case "$PALETTE" in
  ""|[1-6]) ;;
  *)
    echo "❌ 팔레트 구성은 1~6 중 하나입니다 (CLAUDE.md ## Color): $PALETTE"
    exit 1
    ;;
esac

CATEGORY="${NEW_PATH%%/*}"
NEW_NAME="${NEW_PATH#*/}"

if [ "$CATEGORY" = "$NEW_NAME" ]; then
  echo "❌ 카테고리 없이 입력됨. '<카테고리>/<프로젝트명>' 형식으로 입력하세요. 예: camera/moviediary"
  exit 1
fi

# 같은 카테고리 안에서 아키타입 중복은 경고만 한다 (실패시키지 않음) — 의도적으로
# 같은 골격을 쓰는 경우가 드물게 있고, 그 판단은 사람이 한다.
if [ -n "$ARCHETYPE" ]; then
  # 배정 기록은 _reference.md("- 홈 아키타입: A<n>")에 남고, 사용자가 직접 정했으면 spec.md에 있다.
  DUP="$( { grep -ls "^아키타입: *$ARCHETYPE *$" "$BASE_DIR/$CATEGORY"/*/spec.md
            grep -ls "^- 홈 아키타입: *$ARCHETYPE *$" "$BASE_DIR/$CATEGORY"/*/_reference.md; } 2>/dev/null || true)"
  if [ -n "$DUP" ]; then
    echo "  ⚠ 같은 카테고리에 이미 $ARCHETYPE 를 쓰는 프로젝트가 있습니다:"
    echo "$DUP" | sed 's|^|      |'
    echo "    의도한 것이 아니면 ARCHETYPES.md에서 다른 것을 고르세요."
  fi
fi

# --- 프리셋 해석 ---
# 'app'/'web'/'console'은 프리셋 키워드, '/'가 들어 있으면 소스 경로(하위 호환)로 취급한다.
case "$SOURCE_ARG" in
  ""|app)
    PRESET="app"
    SOURCE="$FILMATE"
    ;;
  web)
    PRESET="web"
    SOURCE="$LOCLY"
    echo "ℹ web은 고객용 반응형 웹 프리셋이다. 관리자/업무용 콘솔이면 console을 쓴다."
    ;;
  console)
    PRESET="console"
    SOURCE="$ASSETFLOW"
    ;;
  */*)
    PRESET="custom"
    SOURCE="$SOURCE_ARG"
    ;;
  *)
    echo "❌ 알 수 없는 프리셋: $SOURCE_ARG"
    echo "   'app', 'web', 'console', 또는 소스 프로젝트 경로를 입력하세요."
    exit 1
    ;;
esac

if [ "$WITH_MOBILE" -eq 1 ] && [ "$PRESET" != "console" ]; then
  echo "❌ --with-mobile은 console 프리셋에서만 사용합니다."
  echo "   app은 이미 모바일이고, web(반응형)은 모바일 화면을 자체적으로 포함합니다."
  echo "   웹 콘솔 제품에 별도 모바일 앱 형제를 추가할 때만 의미가 있습니다."
  exit 1
fi

if [ ! -d "$SOURCE" ]; then
  echo "❌ 소스 프로젝트를 찾을 수 없습니다: $SOURCE"
  exit 1
fi

TARGET="$BASE_DIR/$CATEGORY/$NEW_NAME"
ADMIN_TARGET="$BASE_DIR/$CATEGORY/$NEW_NAME-admin"
MOBILE_TARGET="$BASE_DIR/$CATEGORY/$NEW_NAME-mobile"

# spec.md/design.md만 미리 존재하는 건 허용한다 (스캐폴드 전에 spec.md를 먼저 써두는 관례) —
# 그 외 항목(components/, lib/, src/, styles/, 기타 파일)이 있으면 이미 스캐폴드된
# 프로젝트로 간주해 거부한다.
check_target_available() {
  local target="$1"
  local label="$2"
  if [ -d "$target" ]; then
    local unexpected
    unexpected="$(find "$target" -mindepth 1 -maxdepth 1 ! -name 'spec.md' ! -name 'design.md')"
    if [ -n "$unexpected" ]; then
      echo "❌ 이미 존재하는 프로젝트입니다: $target"
      exit 1
    fi
    echo "  ℹ 기존 spec.md/design.md 발견 — 유지한 채로 스캐폴드 진행: $label"
  fi
}

check_target_available "$TARGET" "$CATEGORY/$NEW_NAME"
if [ "$WITH_ADMIN" -eq 1 ]; then
  check_target_available "$ADMIN_TARGET" "$CATEGORY/$NEW_NAME-admin"
fi
if [ "$WITH_MOBILE" -eq 1 ]; then
  check_target_available "$MOBILE_TARGET" "$CATEGORY/$NEW_NAME-mobile"
fi

# 폴더 스켈레톤 + 빈 design.md + 원본을 가리키는 _reference.md를 <target>에 만든다.
# 레퍼런스 파일은 복사하지 않는다 — 경로만 적고 거기서 직접 읽게 한다.
scaffold_skeleton() {
  local target="$1"
  local preset="$2"      # app | web | console | custom
  local source="$3"
  local needs_console="$4"  # 1이면 관리자/웹 콘솔 레퍼런스 행을 포함
  local inherit="${5:-1}"   # 0이면 --archetype/--palette를 물려받지 않는다 (-mobile 형제)
  local archetype="$ARCHETYPE" palette="$PALETTE"
  if [ "$inherit" -eq 0 ]; then archetype=""; palette=""; fi

  mkdir -p "$target/components" \
           "$target/lib" \
           "$target/src" \
           "$target/styles"

  touch "$target/design.md"
  # 시각 검증 루프(CLAUDE.md Batch Build 5단계)를 마치면 빌더가 지운다.
  # 남아 있고 이번 세션에서 이 프로젝트를 건드렸으면 .claude/hooks/stop-visual-gate.mjs가
  # 턴을 끝내기 전에 한 번 상기시킨다.
  touch "$target/.visual-pending"

  {
    echo "# 구조 레퍼런스 (읽기 전용 포인터 — 복사본 아님)"
    echo
    echo "복사본을 두지 않는다. 아래 **원본 경로**를 직접 읽는다."
    echo
    echo "| 무엇 | 원본 경로 |"
    echo "| --- | --- |"
    if [ "$preset" = "app" ]; then
      echo "| 디자인 시스템 산문 (spacing/radius/타입 스케일이 여기 있다) | \`${source#$ROOT_DIR/}/design.md\` |"
      echo "| 팔레트 파일 — **색만 들어 있다** | \`${source#$ROOT_DIR/}/styles/\` |"
      echo "| 화면 구현 (완성도 기준. 공용 ui.tsx는 없다) | \`${source#$ROOT_DIR/}/components/screens/\` |"
    elif [ "$preset" = "web" ]; then
      echo "| 디자인 시스템 산문 | \`${source#$ROOT_DIR/}/design.md\` |"
      echo "| 반응형 대응 폭 (플랫폼 줄) | \`${source#$ROOT_DIR/}/spec.md\` |"
      echo "| 사이트 구조 (헤더, 푸터, 화면, 공용 ui) | \`${source#$ROOT_DIR/}/components/site/\` |"
      echo "| 모바일 표시 장치 (\`<ResponsiveSite>\`로 감싼다) | \`components/shared/responsive-site.tsx\` |"
    else
      echo "| 디자인 시스템 산문 | \`${source#$ROOT_DIR/}/design.md\` |"
      echo "| 팔레트 파일 — **색 위주다** | \`${source#$ROOT_DIR/}/styles/\` |"
    fi
    if [ "$needs_console" -eq 1 ]; then
      echo "| 엔터프라이즈 프리미티브 (Table/Drawer/Pagination/차트) | \`projects/b2b/assetflow/components/ui.tsx\` |"
      echo "| 셸 C1 — 다크 레일 콘솔 | \`projects/b2b/assetflow/components/admin/admin-shell.tsx\` |"
      echo "| 셸 C2 — 라이트 워크벤치 | \`projects/platform/studyspot/components/admin/admin-shell.tsx\` |"
      echo "| 셸 C3 — 상단 커맨드 바 | \`projects/community/waypoint/components/admin/admin-shell.tsx\` |"
      echo "| 셸 C4 — 아이콘 레일 + 섹션 리스트 | \`projects/b2b/logisync/components/shell.tsx\` |"
    fi
    if [ "$preset" = "console" ]; then
      echo "| 사용자 콘솔 T자형 (관리자 셸과 다른 축) | \`projects/b2b/assetflow/components/layout/app-shell.tsx\` |"
    fi
    echo
    echo "**가져오는 것:** 구조, 상태 커버리지, 완성도 기준."
    echo
    echo "**가져오지 않는 것:** 색, 타입 스케일 수치, 모션 수치, radius 값, tone 어휘,"
    echo "mock 인물/시각(\`박채린\`, \`09:41\`), \`@/projects/b2b/assetflow/...\` 절대 import."
    echo "수치는 CLAUDE.md \`## Motion\`의 \"스케일 복제 금지\"에 따라 새로 고른다."
    echo
    echo "## 이번 프로젝트 배정"
    echo
    # 프리셋 줄은 .claude/hooks가 읽는다 (app → app.md, web → web.md, console → console.md).
    echo "- 프리셋: $preset"
    case "$preset" in
      web)     echo "- 홈 골격: <미정 — mockup-craft references/web.md의 홈 골격 어휘에서 고를 것>" ;;
      console) echo "- 사용자 화면 셸: <미정 — T자형(assetflow app-shell) 또는 ARCHETYPES.md C1~C4>" ;;
      *)       echo "- 홈 아키타입: ${archetype:-<미정 — spec.md 읽고 ARCHETYPES.md에서 고를 것>}" ;;
    esac
    if [ "$WITH_ADMIN" -eq 1 ] && [ "$inherit" -eq 1 ]; then
      echo "- 관리자 셸: ${SHELL_ARCH:-<미정 — ARCHETYPES.md C1~C4>}"
    fi
    echo "- 팔레트 구성: ${palette:-<미정 — CLAUDE.md \`## Color\` 1~6>}"
    echo
    echo "배정 근거와 \"이 아키타입에서 쓰지 않는 부품\"은 \`design.md\`의 \"아키타입\" 절에 적는다."
  } > "$target/_reference.md"

  echo "  ✓ _reference.md (원본 경로 포인터 + 아키타입 배정)"
}

CONSOLE=0
if [ "$PRESET" = "console" ] || [ "$WITH_ADMIN" -eq 1 ]; then
  CONSOLE=1
fi

echo "▶ '$SOURCE' 를 구조 레퍼런스로 '$TARGET' 생성 중... (프리셋: $PRESET)"
scaffold_skeleton "$TARGET" "$PRESET" "$SOURCE" "$CONSOLE"

# --with-mobile — console 메인 프로덕트에 완전히 독립된 모바일 형제 프로젝트를 추가한다.
# admin과 달리 얇은 엔트리가 아니라 marketflow-mobile처럼 자체 spec.md/design.md/
# styles/를 갖는 완전한 별도 스캐폴드다 — 모바일은 항상 app 프리셋 구조(PhoneFrame)라
# 소스는 메인 프리셋과 무관하게 항상 filmate로 고정한다.
if [ "$WITH_MOBILE" -eq 1 ]; then
  echo "▶ '$FILMATE' 를 구조 레퍼런스로 '$MOBILE_TARGET' 생성 중... (프리셋: app, 모바일 형제)"
  scaffold_skeleton "$MOBILE_TARGET" "app" "$FILMATE" 0 0
fi

# --with-admin — 관리자 콘솔에 별도 URL을 주는 얇은 엔트리 형제 프로젝트.
# 실제 화면 코드는 본 프로젝트의 components/admin/ 안에 두는 것이 이 워크스페이스의
# 관례다 (assetflow-admin, lumi-admin, orderlog-admin과 동일한 구성).
#
# 엔트리와 함께 components/admin/admin-app.tsx 시드도 반드시 만든다. 워크스페이스의
# 모든 프로젝트는 app/[category]/[project]/page.tsx 하나를 공유하는 컴파일 단위라
# (템플릿 리터럴 dynamic import → 번들러가 projects/*/*/src/를 context 모듈 하나로
# 묶는다), 엔트리만 만들고 admin-app.tsx를 비워두면 이 프로젝트가 아니라 워크스페이스의
# "모든" 프로젝트 URL이 500이 난다. 스캐폴드 직후 트리는 항상 컴파일돼야 한다.
if [ "$WITH_ADMIN" -eq 1 ]; then
  mkdir -p "$TARGET/components/admin" "$ADMIN_TARGET/src"

  # PascalCase 컴포넌트명 생성: my-new-order → MyNewOrder
  COMPONENT_NAME="$(echo "$NEW_NAME" | awk -F'-' '{for(i=1;i<=NF;i++) printf toupper(substr($i,1,1)) substr($i,2); print ""}')"

  cat > "$ADMIN_TARGET/src/index.tsx" <<EOF
"use client";

// 워크스페이스 라우트는 \`projects/<category>/<project>/src/index\`만 렌더링한다.
// 관리자 콘솔에 사용자 콘솔과 완전히 분리된 URL(/$CATEGORY/$NEW_NAME-admin)과
// 별도 로그인을 주기 위한 엔트리이고, 실제 화면은 모두
// projects/$CATEGORY/$NEW_NAME/components/admin/ 안에 있다.
import { AdminApp } from "@/projects/$CATEGORY/$NEW_NAME/components/admin/admin-app";

export default function ${COMPONENT_NAME}Admin() {
  return <AdminApp />;
}
EOF

  cat > "$ADMIN_TARGET/src/meta.ts" <<EOF
export const meta = {
  title: "$COMPONENT_NAME Admin / 관리자 콘솔",
  description:
    "$COMPONENT_NAME 관리자 콘솔입니다. spec.md의 관리자 IA에 맞춰 이 설명을 교체하세요.",
};
EOF

  # 시드 admin-app.tsx. 의존성이 0이어야 한다 — 이 시점엔 styles/$NEW_NAME.css도
  # admin-shell.tsx도 없으므로 CSS import, phosphor, 공용 컴포넌트를 쓰면 안 된다.
  # Tailwind 유틸리티만 쓴다.
  cat > "$TARGET/components/admin/admin-app.tsx" <<EOF
"use client";

// scaffold.sh가 만든 시드다. 지우지 말고 "교체"한다.
//
// 워크스페이스의 모든 프로젝트는 app/[category]/[project]/page.tsx 하나를 공유하는
// 컴파일 단위다. $NEW_NAME-admin/src/index.tsx가 존재하지 않는 모듈을 import하면
// 이 프로젝트만이 아니라 워크스페이스의 "모든" 프로젝트 URL이 500이 난다.
// 이 파일은 그 상태를 막기 위해 존재한다.
//
// 관리자 화면을 만들 때 이 파일을 통째로 교체한다 (AdminApp named export만 유지).
// 교체한 AdminApp은 초기 화면을 ?screen=<name>에서 읽는다. 시각 검증 루프가 관리자 화면을
// 하나씩 캡처하는 방법이 이것뿐이다. 선례: projects/b2b/assetflow/components/admin/admin-app.tsx
export function AdminApp() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-white px-6">
      <div className="max-w-[46ch] text-center">
        <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-neutral-900">
          관리자 콘솔 준비 중
        </h1>
      </div>
    </main>
  );
}
EOF

  echo "  ✓ $CATEGORY/$NEW_NAME-admin/src/ (얇은 엔트리 — index.tsx + meta.ts)"
  echo "  ✓ components/admin/admin-app.tsx (시드 — 교체 대상. 지우면 워크스페이스 전체가 500)"
fi

echo ""
echo "✅ 완료: $TARGET"
echo "   - components/, lib/, src/: 빈 폴더 (spec.md 기반으로 새로 작성)"
echo "   - styles/: 비어있음 — design.md 작성 후 채울 것"
echo "   - design.md: 비어있음. '아키타입' 절을 첫 번째로 쓴다"
echo "   - _reference.md: 원본 경로 포인터. 레퍼런스는 복사되지 않았으니 그 경로에서 직접 읽을 것"
echo "   - .visual-pending: 시각 검증 루프(CLAUDE.md Batch Build 5단계)를 마치면 지울 것 (gitignore라 git status에 안 보인다)"

echo ""
echo "   📐 골격 배정 (ARCHETYPES.md / CLAUDE.md ## Color)"
case "$PRESET" in
  web)     echo "      - 홈 골격:     미정 — mockup-craft references/web.md 어휘에서 고를 것" ;;
  console) echo "      - 사용자 화면: 미정 — T자형 또는 C1~C4" ;;
  *)       echo "      - 홈 아키타입: ${ARCHETYPE:-미정 — spec.md 읽고 고를 것 (A1은 금지)}" ;;
esac
if [ "$WITH_ADMIN" -eq 1 ]; then
  echo "      - 관리자 셸:   ${SHELL_ARCH:-미정 — C1(다크 레일) / C2(워크벤치) / C4(아이콘 레일 + 섹션 리스트). 관리자는 항상 좌측 사이드바, C3는 신규 배정 금지}"
fi
echo "      - 팔레트 구성: ${PALETTE:-미정 — 1~6 중. 1(라이트 뉴트럴+액센트1)은 기존 프로젝트 대부분이 써서 포화}"
echo "      - 수치(타이밍/이징/타입 스케일/radius)는 레퍼런스에서 옮기지 않는다."
echo "        CLAUDE.md ## Motion의 '스케일 복제 금지'에 따라 새로 고른다."

if [ "$PRESET" = "console" ]; then
  echo "   - 콘솔 프로젝트이므로 PhoneFrame을 쓰지 않는다. design.md에는 '기기 프레임 안쪽 규칙'"
  echo "     대신 '셸 레이아웃'과 '표 밀도, 컬럼 예산' 절을 쓴다."
elif [ "$PRESET" = "web" ]; then
  echo "   - 반응형 웹이다. src/index.tsx는 <ResponsiveSite>로 사이트를 감싼다 (모바일 393은 iPhone 프레임 안)."
  echo "     design.md에는 '기기 프레임 안쪽 규칙' 대신 '반응형 기준' 절을 쓴다."
  echo "     시각 검증: npm run visual -- $CATEGORY $NEW_NAME <화면...> --device=web"
else
  echo "   - 공용 컴포넌트(PhoneFrame/Toggle/ScreenHeader 등)는 복사하지 않는다 —"
  echo "     항상 @/components/shared/*에서 직접 import한다."
fi

if [ "$WITH_ADMIN" -eq 1 ]; then
  echo ""
  echo "   📌 관리자 분리: $CATEGORY/$NEW_NAME-admin (URL: /$CATEGORY/$NEW_NAME-admin)"
  echo "      - components/admin/admin-app.tsx 는 시드 상태다. 관리자 화면을 만들면서"
  echo "        반드시 교체한다 — 안 하면 시드 화면이 그대로 URL에 남는다."
  echo "      - 단, 지우지는 않는다. 라우트가 공유 컴파일 단위라 이 파일이 없으면"
  echo "        무관한 프로젝트 URL까지 전부 500이 난다."
  echo "      - 사용자 콘솔 쪽에는 관리자 진입점(내비 항목/로그인 옵션)을 두지 않는다."
  echo "      - 본 프로젝트 spec.md/design.md에 이 분리 사실을 기록한다."
  echo "      - 교체한 AdminApp은 ?screen=을 읽는다. 시각 검증은"
  echo "        npm run visual -- $CATEGORY $NEW_NAME-admin <화면...> --device=console"
fi

if [ "$WITH_MOBILE" -eq 1 ]; then
  echo ""
  echo "   📌 모바일 형제: $CATEGORY/$NEW_NAME-mobile (URL: /$CATEGORY/$NEW_NAME-mobile)"
  echo "      - marketflow-mobile과 동일한 패턴: admin과 달리 얇은 엔트리가 아니라"
  echo "        완전히 독립된 스캐폴드다. 이 프로젝트도 자체 spec.md/design.md를 쓰고"
  echo "        화면을 처음부터(app 프리셋, PhoneFrame 기준) 빌드해야 한다."
  echo "      - 같은 제품이면 색상/톤은 메인 웹 콘솔과 일관되게 맞추되, 셸 구조는"
  echo "        PhoneFrame 기준 모바일 UI로 새로 설계한다 (CLAUDE.md 참고)."
fi
