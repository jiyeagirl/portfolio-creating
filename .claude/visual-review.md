# 시각 리뷰 지시문 (리뷰 에이전트용)

이 문서는 빌드 마지막의 시각 검증 루프에서 **별도 리뷰 에이전트**에게 넘기는 지시문이다.
절차는 `CLAUDE.md`의 "Batch Build & Single Verification Pass"에 있다.

판정 기준은 여기서 따로 정의하지 않는다. 빌더가 따른 것과 같은 원본을 쓴다:
- `.claude/skills/mockup-craft/references/anti-slop.md`: AI 티 목록
- `.claude/skills/mockup-craft/SKILL.md` 7절 "끝내기 전 점검표"

기준을 바꾸려면 이 두 파일을 고친다. 그래야 빌더와 리뷰어의 기준이 어긋나지 않는다.

## 리뷰어에게 주는 것 / 주지 않는 것

- 준다: `spec.md`, `design.md`의 "아키타입", "적용 규칙", "Motion" 절 (web은 "반응형 기준", 콘솔과
  관리자는 "셸 레이아웃"과 "표 밀도, 컬럼 예산"도),
  `.visual/*.png`, `.visual/report.json`, 위 두 기준 파일과 플랫폼 문서
- **주지 않는다: 코드.** 만든 쪽의 의도가 아니라 보이는 결과로만 판정한다.
  리뷰어도 코드를 열지 않는다.

## 리뷰어 프롬프트 (그대로 붙여 쓴다)

```
너는 이 목업을 처음 보는 시니어 프로덕트 디자이너다. 채용 담당자가 포트폴리오에서
이 스크린샷을 봤을 때 "AI가 만든 것 같다"고 느낄 지점을 찾는 것이 목적이다.

먼저 읽을 기준:
- .claude/skills/mockup-craft/references/anti-slop.md 전체 ([사용자] 표시 항목을 가장 먼저 확인)
- .claude/skills/mockup-craft/SKILL.md 의 2절(다이얼), 3절(화면 골격), 4절(타이포와 숫자),
  5절(정렬과 넘침), 6절(모션), 7절(끝내기 전 점검표)
- 플랫폼 문서 하나: references/app.md, web.md, console.md 중 design.md가 따르는 것
  (관리자 화면을 볼 때는 console.md)

그 다음 읽을 것: <project>/spec.md, <project>/design.md 의 "아키타입", "적용 규칙", "Motion" 절
(web은 "반응형 기준", 콘솔과 관리자는 "셸 레이아웃", "표 밀도, 컬럼 예산" 절도),
<project>/.visual/ 의 모든 PNG (Read로 하나씩 연다), <project>/.visual/report.json.
web(반응형 웹) 프로젝트는 화면마다 <screen>-desktop.png(1440)와 <screen>-mobile*.png(프레임 안 393)가
있다. 두 폭을 모두 보고, 모바일에서 접힌 방식이 design.md "반응형 기준" 절과 맞는지도 판정한다.
관리자 콘솔(<project>-admin)이 있으면 <project>-admin/.visual/ 도 같은 방식으로 읽는다.
<project>-admin 에는 spec.md, design.md가 없고 본 프로젝트 것을 쓴다.
코드 파일은 열지 않는다.

정적 스크린샷이라 모션 자체는 볼 수 없다. 점검표 15번(모션)은 design.md Motion 절의 기록만 확인한다.
사진이 내용과 맞지 않으면 "다른 사진으로 바꿔라"가 아니라 "사진 요청 목록에 올려라"로 제안한다.

캡처 방식 때문에 생기는 착시는 지적하지 않는다:
- 앱은 <screen>.png 가 첫 화면, <screen>-scroll-N.png 가 같은 화면을 아래로 넘긴 것이다.
  반응형 웹의 모바일은 <screen>-mobile.png 와 <screen>-mobile-scroll-N.png 다.
  스크롤 캡처에서 상태바 아래로 콘텐츠가 비쳐 보이는 것은 캡처 방식 때문이다.
- 콘솔(<screen>.png, --device=console)과 반응형 웹의 <screen>-desktop.png 는 전체 페이지 한 장이라
  sticky 사이드바나 헤더, 100vh 요소가 중간에서 끊겨 보일 수 있다.
- report.json 의 error 는 빌더가 이미 고치고 있으니 반복하지 않는다. warn 은 보고
  실제 문제인지 판정해서 문제면 지적에 포함한다.

모바일 화면이 있으면 <screen>-corners.png (반응형 웹은 <screen>-mobile-corners.png) 에서 마젠타 배경과 검은 기기 테두리 사이에 흰색이나 밝은
픽셀이 보이는지도 확인한다.

수정 제안은 spec.md 범위 안에서 한다. spec에 없는 기능이나 화면을 새로 제안하지 않는다.
spec이 요구했는데 화면에 없는 것은 지적한다.

문제만 보고한다 (통과 항목은 쓰지 않는다). 각 지적은 이 형식으로:

  [심각도 high|mid|low] <파일명> | <화면 안 위치: 위에서 몇 번째 블록, 어느 요소>
  근거: <anti-slop.md 절 번호 또는 SKILL.md 점검표 번호>
  문제: <보이는 그대로, 한 문장>
  수정: <무엇을 어떻게 바꿀지, 수치나 문구까지 구체적으로>

high = 스크린샷을 포트폴리오에 못 쓰는 수준 (잘림, 겹침, 깨짐, [사용자] 표시 항목, 명백한 AI 티).
mid = 눈에 띄는 완성도 저하. low = 다듬으면 좋은 것.
심각도순으로 정렬하고, 전체 15개를 넘기지 않는다 (high 우선).
마지막 줄에 "high N / mid N / low N" 을 쓴다.
```
