/*
 * 강좌 썸네일 (사용자가 assets/에 넣은 1280x720 이미지, 2026-10-28). 한 장씩 열어 강좌와 맞는지 확인했다.
 * 이미지는 정적 데이터라 localStorage에 저장된 강좌 데이터와 상관없이 항상 이 표를 쓴다.
 * c10 TypeScript 실무 패턴은 이미지가 없어 타이틀 타일로 두고 사진 요청 목록에 올렸다.
 */
import aiVideo from "@/projects/platform/eduon/assets/thumb-ai-video-intro.jpg";
import colorGrading from "@/projects/platform/eduon/assets/thumb-ai-color-grading.jpg";
import promptEngineering from "@/projects/platform/eduon/assets/thumb-prompt-engineering.jpg";
import agentAutomation from "@/projects/platform/eduon/assets/thumb-ai-agent-automation.jpg";
import figmaAppUi from "@/projects/platform/eduon/assets/thumb-figma-app-ui.jpg";
import brandIdentity from "@/projects/platform/eduon/assets/thumb-brand-identity.jpg";
import digitalDrawing from "@/projects/platform/eduon/assets/thumb-digital-drawing.jpg";
import bwComposition from "@/projects/platform/eduon/assets/thumb-bw-composition.jpg";
import reactComponent from "@/projects/platform/eduon/assets/thumb-react-component.jpg";
import pythonData from "@/projects/platform/eduon/assets/thumb-python-data.jpg";
import gitWorkflow from "@/projects/platform/eduon/assets/thumb-git-workflow.jpg";

export const THUMBS: Record<string, string | null> = {
  c01: aiVideo.src, // 편집 타임라인, 생성형 AI 영상 제작 입문
  c02: colorGrading.src, // 보정 전후 비교와 컬러 휠
  c03: promptEngineering.src, // 회의록 요약 프롬프트 채팅 화면
  c04: agentAutomation.src, // 메일 수신부터 승인까지 자동화 흐름도
  c05: figmaAppUi.src, // Figma 앱 화면 편집
  c06: brandIdentity.src, // A커피 로고, 컬러, 타이포 가이드
  c07: digitalDrawing.src, // 머그컵 드로잉 캔버스
  c08: bwComposition.src, // 흑백 풍경과 구도 격자, 히스토그램
  c09: reactComponent.src, // CourseCard 컴포넌트 코드
  c10: null, // 이미지 없음, 타이틀 타일
  c11: pythonData.src, // pandas 코드와 월별 매출 차트
  c12: gitWorkflow.src, // git log 브랜치 그래프
};
