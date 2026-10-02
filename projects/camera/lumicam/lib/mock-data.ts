import type {
  ErrorLog,
  FilterPack,
  LutAsset,
  ReleaseNote,
  RenderLog,
  ShareChannel,
  ShareRecord,
} from "./types";

export const filterPacks: FilterPack[] = [
  { id: "sunlit-gold", name: "Sunlit Gold 200", tagline: "따뜻한 골든아워 데일리 필름", photoId: 64, previewFilter: "saturate(1.18) contrast(1.04) brightness(1.03) sepia(.14) hue-rotate(-8deg)", price: "무료", owned: true, downloads: "182K", rating: 4.8, tags: ["무료", "인기"] },
  { id: "cream-portrait", name: "Cream Portrait 400", tagline: "크리미한 인물톤", photoId: 1027, previewFilter: "saturate(.86) contrast(.9) brightness(1.06) sepia(.07)", price: "무료", owned: true, downloads: "146K", rating: 4.9, tags: ["무료"] },
  { id: "harbor-teal", name: "Harbor Teal 100", tagline: "쿨톤 해안 스냅", photoId: 1050, previewFilter: "saturate(1.08) contrast(1.06) hue-rotate(6deg) brightness(.97)", price: "무료", owned: true, downloads: "97K", rating: 4.6, tags: ["무료"] },
  { id: "slate-mono", name: "Slate Mono 400", tagline: "하이 콘트라스트 흑백", photoId: 1074, previewFilter: "grayscale(1) contrast(1.3) brightness(1.02)", price: "무료", owned: true, downloads: "121K", rating: 4.7, tags: ["무료", "인기"] },
  { id: "dusk-cinema", name: "Dusk Cinema", tagline: "틸 앤 앰버 시네마틱", photoId: 1067, previewFilter: "saturate(1.14) contrast(1.16)", price: "무료", owned: true, downloads: "88K", rating: 4.7, tags: ["무료"] },
  { id: "vintage-drive", name: "Vintage Drive", tagline: "70년대 로드트립 감성", photoId: 1070, previewFilter: "saturate(.82) contrast(1.05) sepia(.28) hue-rotate(-4deg)", price: "₩4,400", owned: false, downloads: "12K", rating: 4.5, tags: ["신규", "프리미엄"] },
  { id: "forest-trail", name: "Forest Trail", tagline: "짙은 그린, 트레킹 스냅", photoId: 1018, previewFilter: "saturate(1.1) contrast(1.08) hue-rotate(-8deg) brightness(.96)", price: "₩3,300", owned: false, downloads: "31K", rating: 4.6, tags: ["인기", "프리미엄"] },
  { id: "tide", name: "Tide", tagline: "파도의 질감을 살리는 하이키 톤", photoId: 1041, previewFilter: "saturate(.92) contrast(.96) brightness(1.1) hue-rotate(4deg)", price: "₩3,300", owned: false, downloads: "9K", rating: 4.4, tags: ["프리미엄"] },
  { id: "fog-coast", name: "Fog Coast", tagline: "해무 낀 흐린 날의 저채도 톤", photoId: 338, previewFilter: "saturate(.7) contrast(.88) brightness(1.04)", price: "₩2,900", owned: false, downloads: "6K", rating: 4.3, tags: ["신규", "프리미엄"] },
];

export const lutAssets: LutAsset[] = [
  { id: "lut-01", filmId: "sunlit-gold", fileName: "sunlit_gold_v3.cube", category: "데일리", version: "v3.1", status: "active", sizeKb: 384, updatedAt: "2022.03.14", uploadedBy: "김도윤" },
  { id: "lut-02", filmId: "cream-portrait", fileName: "cream_portrait_v2.cube", category: "인물", version: "v2.4", status: "active", sizeKb: 384, updatedAt: "2022.03.22", uploadedBy: "김도윤" },
  { id: "lut-03", filmId: "harbor-teal", fileName: "harbor_teal_v2.cube", category: "자연", version: "v2.0", status: "active", sizeKb: 384, updatedAt: "2022.04.05", uploadedBy: "이서연" },
  { id: "lut-04", filmId: "slate-mono", fileName: "slate_mono_v4.cube", category: "모노", version: "v4.2", status: "active", sizeKb: 256, updatedAt: "2022.04.18", uploadedBy: "이서연" },
  { id: "lut-05", filmId: "dusk-cinema", fileName: "dusk_cinema_v1.cube", category: "시네마틱", version: "v1.6", status: "active", sizeKb: 384, updatedAt: "2022.05.02", uploadedBy: "김도윤" },
  { id: "lut-06", filmId: "forest-trail", fileName: "forest_trail_v1.cube", category: "자연", version: "v1.2", status: "active", sizeKb: 384, updatedAt: "2022.06.11", uploadedBy: "박하은" },
  { id: "lut-07", filmId: "vintage-drive", fileName: "vintage_drive_beta2.cube", category: "실험", version: "beta 0.2", status: "draft", sizeKb: 384, updatedAt: "2022.07.03", uploadedBy: "박하은" },
  { id: "lut-08", filmId: "tide", fileName: "tide_v1_deprecated.cube", category: "실험", version: "v1.0", status: "disabled", sizeKb: 256, updatedAt: "2022.06.28", uploadedBy: "박하은" },
];

export const renderLogs: RenderLog[] = [
  { id: "rl-01", at: "2022.07.09 21:14", device: "iPhone 13 Pro", filmId: "dusk-cinema", gpuMs: 8.2, frameDrops: 0, status: "정상" },
  { id: "rl-02", at: "2022.07.09 20:58", device: "iPhone SE(3세대)", filmId: "slate-mono", gpuMs: 15.6, frameDrops: 4, status: "저하" },
  { id: "rl-03", at: "2022.07.09 19:40", device: "iPad Pro 11(M1)", filmId: "harbor-teal", gpuMs: 5.1, frameDrops: 0, status: "정상" },
  { id: "rl-04", at: "2022.07.09 18:22", device: "iPhone 12", filmId: "sunlit-gold", gpuMs: 9.7, frameDrops: 1, status: "정상" },
  { id: "rl-05", at: "2022.07.08 22:03", device: "iPhone 13", filmId: "vintage-drive", gpuMs: 19.3, frameDrops: 6, status: "실패" },
  { id: "rl-06", at: "2022.07.08 17:11", device: "iPhone 13 Pro", filmId: "cream-portrait", gpuMs: 6.8, frameDrops: 0, status: "정상" },
];

export const errorLogs: ErrorLog[] = [
  { id: "el-01", at: "2022.07.08 22:03", code: "GPU-LUT-timeout", message: "vintage_drive_beta2.cube 3D LUT 로드 5초 초과로 폴백 처리됨", device: "iPhone 13", resolved: false },
  { id: "el-02", at: "2022.07.06 11:47", code: "IO-export-fail", message: "48MP ProRAW 내보내기 중 저장공간 부족으로 실패", device: "iPhone SE(3세대)", resolved: true },
  { id: "el-03", at: "2022.06.29 09:12", code: "METAL-shader-nan", message: "halation 셰이더 파라미터 NaN 감지, 기본값으로 복구", device: "iPad Pro 11(M1)", resolved: true },
  { id: "el-04", at: "2022.06.14 20:35", code: "SYNC-json-conflict", message: "필터 JSON Import 시 버전 충돌(로컬 v2.1 vs 원격 v2.4)", device: "iPhone 12", resolved: true },
];

export const releaseNotes: ReleaseNote[] = [
  { version: "1.4.0", releasedAt: "2022.07.01", channel: "정식", notes: "Forest Trail 필터 팩 추가, 프레임 드롭 개선", adoption: 41 },
  { version: "1.3.2", releasedAt: "2022.06.02", channel: "정식", notes: "JSON 필터 Import 충돌 처리 개선", adoption: 78 },
  { version: "1.4.0-beta.3", releasedAt: "2022.06.20", channel: "베타", notes: "Vintage Drive 실험 LUT 테스트 빌드", adoption: 6 },
  { version: "1.3.0", releasedAt: "2022.04.28", channel: "정식", notes: "iPad 편집 스튜디오 출시, 히스토그램/RGB 분포 추가", adoption: 94 },
];

export const shareChannels: ShareChannel[] = [
  { id: "airdrop", label: "AirDrop", icon: "airdrop" },
  { id: "message", label: "메시지", icon: "message" },
  { id: "instagram", label: "인스타그램", icon: "instagram" },
  { id: "link", label: "링크 복사", icon: "link" },
  { id: "qr", label: "QR 코드", icon: "qr" },
  { id: "json", label: "JSON 내보내기", icon: "json" },
];

export const shareRecords: ShareRecord[] = [
  { id: "sh-01", filmId: "dusk-cinema", photoId: 1067, channel: "인스타그램", sharedAt: "2022.07.09 19:52" },
  { id: "sh-02", filmId: "harbor-teal", photoId: 1050, channel: "AirDrop", sharedAt: "2022.07.09 12:08" },
  { id: "sh-03", filmId: "sunlit-gold", photoId: 64, channel: "JSON 내보내기", sharedAt: "2022.07.07 09:31" },
];

export const downloadStats = [
  { label: "Sunlit Gold", value: 182 },
  { label: "Cream Portrait", value: 146 },
  { label: "Slate Mono", value: 121 },
  { label: "Harbor Teal", value: 97 },
  { label: "Dusk Cinema", value: 88 },
  { label: "Forest Trail", value: 31, emphasis: true },
];

export const activityStats = [
  { month: "3월", dau: 1204, shots: 8840 },
  { month: "4월", dau: 1860, shots: 13920 },
  { month: "5월", dau: 2410, shots: 19680 },
  { month: "6월", dau: 2990, shots: 24310 },
  { month: "7월", dau: 3640, shots: 29870 },
];

export const gpuStatus = {
  renderQueue: 3,
  avgGpuMs: 9.4,
  frameDropRate: 1.8,
  cacheHitRate: 92.4,
  updatedAt: "2022.07.09 21:20",
};

export const onboardingSteps = [
  {
    id: "intro",
    eyebrow: "LUMI CAM",
    title: "필름 카메라의 색감을 그대로",
    body: "3D LUT와 Metal 기반 실시간 렌더링으로 필름 특유의 색감을 셔터를 누르는 순간 그대로 보여줍니다.",
    photoId: 823,
  },
  {
    id: "how",
    eyebrow: "촬영 방식",
    title: "찍는 순간 바로 필름 톤",
    body: "촬영 후 보정하는 방식이 아니라, 라이브 프리뷰에 이미 필름 색감이 입혀진 상태로 셔터를 누릅니다.",
    photoId: 91,
  },
  {
    id: "preset",
    eyebrow: "취향 설정",
    title: "선호하는 필름을 골라주세요",
    body: "가장 자주 쓸 필름을 선택하면 카메라 실행 시 기본값으로 설정돼요. 언제든 바꿀 수 있어요.",
    photoId: 0,
  },
  {
    id: "camera-permission",
    eyebrow: "권한 요청",
    title: "카메라 접근을 허용해주세요",
    body: "실시간 프리뷰와 촬영을 위해 카메라 접근 권한이 필요합니다.",
    photoId: 0,
  },
  {
    id: "library-permission",
    eyebrow: "권한 요청",
    title: "사진 라이브러리 접근을 허용해주세요",
    body: "촬영한 필름 사진을 라이브러리에 저장하려면 접근 권한이 필요합니다.",
    photoId: 0,
  },
  {
    id: "done",
    eyebrow: "설정 완료",
    title: "이제 촬영을 시작해요",
    body: "선택한 필름으로 첫 컷을 남겨보세요. 언제든 필터와 광학 효과를 다시 조절할 수 있어요.",
    photoId: 0,
  },
];
