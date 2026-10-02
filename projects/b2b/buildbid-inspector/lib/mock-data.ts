import type {
  ChecklistCategory,
  ChecklistItem,
  EquipmentType,
  InspectionJob,
} from "./types";
import bulldozer1 from "@/projects/b2b/buildbid-inspector/assets/equipment/bulldozer-1.jpg";
import excavator3 from "@/projects/b2b/buildbid-inspector/assets/equipment/excavator-3.jpg";
import forklift2 from "@/projects/b2b/buildbid-inspector/assets/equipment/forklift-2.jpg";
import craneMobile2 from "@/projects/b2b/buildbid-inspector/assets/equipment/crane-mobile-2.jpg";
import dumptruck4 from "@/projects/b2b/buildbid-inspector/assets/equipment/dumptruck-4.jpg";
import loader2 from "@/projects/b2b/buildbid-inspector/assets/equipment/loader-2.jpg";

export const INSPECTOR_NAME = "김도현";
export const INSPECTOR_ROLE = "현장 검수원";
export const TODAY_LABEL = "2024년 6월 20일 목요일";

// Picsum id -> caption. Hand-verified by downloading each id and viewing the
// contents before assigning it a role (see design.md "사진 매핑" for the
// full audit table). Map tiles get a saturate/hue overlay in <MapTile /> so
// they read as a styled placeholder tile, never as a claim to be the real
// satellite photo of the address.
export const MAP_TILES: Record<string, { picsumId: string; caption: string }> = {
  a: { picsumId: "1058", caption: "도심 녹지 항공 텍스처" },
  b: { picsumId: "1050", caption: "외곽 지형 항공 텍스처" },
  c: { picsumId: "88", caption: "도로망 항공 텍스처" },
};

export const EQUIPMENT_PHOTO_POOL: { picsumId: string; label: string }[] = [
  { picsumId: "1079", label: "유압 실린더 로드 클로즈업" },
  { picsumId: "23", label: "금속 표면 마모/스크래치 클로즈업" },
  { picsumId: "96", label: "계기판/센서 유닛 클로즈업" },
  { picsumId: "1031", label: "차체 프레임 구조 클로즈업" },
  { picsumId: "1081", label: "외관 패널 라인 클로즈업" },
  { picsumId: "1028", label: "작업 현장 전경 (외부 환경)" },
];

export const EQUIPMENT_ICON: Record<EquipmentType, string> = {
  굴삭기: "excavator",
  크레인: "crane",
  지게차: "forklift",
  덤프트럭: "truck",
  로더: "loader",
  불도저: "bulldozer",
};

export function formatUsage(type: EquipmentType, hours: number): string {
  if (type === "덤프트럭") return `${hours.toLocaleString("ko-KR")}km 주행`;
  return `${hours.toLocaleString("ko-KR")}h 가동`;
}

export const JOBS: InspectionJob[] = [
  {
    id: "job-1",
    scheduledTime: "07:40",
    equipmentType: "불도저",
    equipmentModel: "캐터필러 D6",
    equipmentYear: 2016,
    equipmentHours: 8220,
    photo: bulldozer1,
    companyName: "E개발",
    contactName: "정하윤",
    contactRole: "현장소장",
    contactPhone: "010-4482-7710",
    address: "경기 이천시 마장면 공단로 55",
    addressDetail: "이천물류단지 3블록 야적장",
    mapTileId: "b",
    status: "완료",
    requestNote: "토공 작업 종료 장비, 매각 전 정밀 검수 요청",
  },
  {
    id: "job-2",
    scheduledTime: "09:00",
    equipmentType: "굴삭기",
    equipmentModel: "볼보 EC220DL",
    equipmentYear: 2019,
    equipmentHours: 4820,
    photo: excavator3,
    companyName: "A중공업",
    contactName: "박정수",
    contactRole: "장비팀장",
    contactPhone: "010-2814-3392",
    address: "서울 강서구 오정로 128",
    addressDetail: "A중공업 강서 기계야드 2번 게이트",
    mapTileId: "a",
    status: "진행중",
    requestNote: "붐 실린더 누유 의심 — 유압 계통 중점 확인 요청",
  },
  {
    id: "job-3",
    scheduledTime: "10:40",
    equipmentType: "지게차",
    equipmentModel: "현대 25D-9",
    equipmentYear: 2021,
    equipmentHours: 1240,
    photo: forklift2,
    companyName: "B물류",
    contactName: "이현아",
    contactRole: "구매대리",
    contactPhone: "010-9927-5561",
    address: "인천 서구 백범로 456",
    addressDetail: "B물류 청라물류센터 지하 1층 하역장",
    mapTileId: "c",
    status: "예정",
  },
  {
    id: "job-4",
    scheduledTime: "13:20",
    equipmentType: "크레인",
    equipmentModel: "콜롬 NK500B (이동식)",
    equipmentYear: 2017,
    equipmentHours: 6050,
    photo: craneMobile2,
    companyName: "C건설기계",
    contactName: "최민석",
    contactRole: "장비운영부장",
    contactPhone: "010-6603-8847",
    address: "경기 화성시 향남읍 하길리 78-3",
    addressDetail: "C건설기계 화성 임대야드",
    mapTileId: "b",
    status: "예정",
    requestNote: "와이어로프 마모 상태 사진 필수 요청",
  },
  {
    id: "job-5",
    scheduledTime: "15:00",
    equipmentType: "덤프트럭",
    equipmentModel: "현대 엑시언트 15톤",
    equipmentYear: 2020,
    equipmentHours: 89400,
    photo: dumptruck4,
    companyName: "D로지스틱스",
    contactName: "한지훈",
    contactRole: "운행관리팀",
    contactPhone: "010-3315-2098",
    address: "서울 금천구 디지털로 190",
    addressDetail: "D로지스틱스 가산 차고지 3번 라인",
    mapTileId: "a",
    status: "예정",
  },
  {
    id: "job-6",
    scheduledTime: "16:30",
    equipmentType: "로더",
    equipmentModel: "현대 955L",
    equipmentYear: 2018,
    equipmentHours: 5600,
    photo: loader2,
    companyName: "F산업",
    contactName: "오세인",
    contactRole: "자재관리자",
    contactPhone: "010-7742-1136",
    address: "경기 김포시 대곶면 대곶남로 210",
    addressDetail: "F산업 김포 자재보관소",
    mapTileId: "c",
    status: "예정",
  },
];

export function getJob(id: string): InspectionJob | undefined {
  return JOBS.find((job) => job.id === id);
}

const TEMPLATE: { category: ChecklistCategory; items: string[] }[] = [
  {
    category: "엔진",
    items: [
      "엔진오일 누유 여부",
      "냉각수량 및 누수 흔적",
      "시동 및 공회전 상태",
      "배기가스 색상 및 이상음",
    ],
  },
  {
    category: "유압",
    items: [
      "유압 호스 누유 여부",
      "유압 실린더 작동 상태",
      "유압오일 레벨 및 오염도",
      "붐/암 작동 반응 속도",
    ],
  },
  {
    category: "전기",
    items: [
      "배터리 단자 부식 상태",
      "계기판 경고등 점등 여부",
      "전조등·작업등 작동",
      "배선 피복 손상 여부",
    ],
  },
  {
    category: "외관",
    items: [
      "차체 도장 및 부식 상태",
      "유리·미러 파손 여부",
      "캐빈 내부 청결·파손 상태",
      "사이드미러 고정 상태",
    ],
  },
  {
    category: "하부주행체",
    items: [
      "트랙·타이어 마모도",
      "하부롤러 및 스프라켓 상태",
      "체인 장력 상태",
      "제동장치 반응",
    ],
  },
  {
    category: "안전장치",
    items: [
      "안전벨트 상태",
      "소화기 비치 및 점검일자",
      "후방카메라·경보음 작동",
      "비상정지 스위치 작동",
    ],
  },
];

export function buildChecklist(): ChecklistItem[] {
  const items: ChecklistItem[] = [];
  let idx = 0;
  for (const group of TEMPLATE) {
    for (const label of group.items) {
      idx += 1;
      items.push({
        id: `chk-${idx}`,
        category: group.category,
        label,
        result: null,
        memo: "",
      });
    }
  }
  return items;
}

export const CHECKLIST_CATEGORIES: ChecklistCategory[] = TEMPLATE.map((g) => g.category);
