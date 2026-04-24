const DEFAULT_DATA = {
  additionalServices: [
    "차량 원상복구 및 순정화",
    "테슬라 순정 부품 부분 교체",
    "테슬라 정품 소모품 장착",
    "알리익스프레스 제품 설치",
    "서드파티 제품 부분 수리 및 펌웨어 업데이트 / 리부트",
    "신제품 관련 설치 및 상담"
  ],
  notes: [
    "개인이 직접 구매한 제품을 매장에 가져오시면 설치 및 시공합니다.",
    "기재된 금액은 제품 설치 및 장착에 대한 공임비용입니다. (제품 포함 가격 X)",
    "제품 초기 불량 및 내구성에 대한 고장은 보증하지 않습니다.",
    "제품 설치 시공에 대한 A/S는 6개월 보증합니다.",
    "순정화 및 원상복구는 상시 가능합니다. (비용 발생)",
    "정확하고 완벽한 작업을 위해 소요 시간이 길어질 수 있습니다.",
    "문제 및 이슈가 있는 제품들은 시공 요청이 거절될 수 있습니다."
  ],
  categories: [
    {
      id: "door",
      name: "도 어 (4)",
      nameEn: "Door",
      items: [
        { id: "d1", name: "오토 도어 핸들", sub: "[무선]", juniper: 30, highland: 30, threey: 30, sx: null, type: "normal" },
        { id: "d2", name: "도어 소프트 클로징", sub: "[고스트도어]", juniper: 30, highland: 30, threey: 30, sx: null, type: "normal" },
        { id: "d3", name: "셋트 할인 장착", sub: "[무선 오토도어 + 소프트클로징]", juniper: 50, highland: 50, threey: 50, sx: null, type: "set" }
      ]
    },
    {
      id: "frunk",
      name: "프 렁 크",
      nameEn: "Frunk",
      items: [
        { id: "f1", name: "오토 프렁크", sub: "[자동 열기 / 닫기]", juniper: 15, highland: 15, threey: 15, sx: 15, type: "normal" },
        { id: "f2", name: "프렁크 소프트 클로징", sub: "[수동오픈]", juniper: 5, highland: 5, threey: 5, sx: 5, type: "normal" }
      ]
    },
    {
      id: "steering",
      name: "스 티 어 링",
      nameEn: "Steering",
      items: [
        { id: "s1", name: "요크 핸들 장착", sub: "", juniper: 5, highland: 5, threey: 5, sx: 6, type: "normal" },
        { id: "s2", name: "에어백 혼커버 교체", sub: "[미파손 / 재사용]", juniper: 4, highland: 4, threey: 4, sx: null, type: "normal" }
      ]
    },
    {
      id: "gear",
      name: "기 어 변 속",
      nameEn: "Gear Shift",
      items: [
        { id: "g1", name: "칼럼 기어", sub: "", juniper: 5, highland: 5, threey: null, sx: null, type: "normal" }
      ]
    },
    {
      id: "ambient",
      name: "엠 비 언 트",
      nameEn: "Ambient",
      items: [
        { id: "a1", name: "BSD 엠비언트 시스템", sub: "[송풍구]", juniper: 4, highland: 4, threey: 4, sx: null, type: "normal" }
      ]
    },
    {
      id: "display",
      name: "디 스 플 레 이",
      nameEn: "Display",
      items: [
        { id: "dp1", name: "스위블 모니터", sub: "", juniper: 5, highland: 5, threey: 5, sx: null, type: "normal" },
        { id: "dp2", name: "리어 모니터", sub: "[워크인 비노출 선매립]", juniper: null, highland: null, threey: 5, sx: null, type: "normal" },
        { id: "dp3", name: "미니 속도계", sub: "", juniper: 5, highland: 5, threey: 5, sx: null, type: "normal" },
        { id: "dp4", name: "장착형 디스플레이", sub: "[선매립]", juniper: 10, highland: 10, threey: 10, sx: null, type: "normal" }
      ]
    },
    {
      id: "seat",
      name: "시 트",
      nameEn: "Seat",
      items: [
        { id: "se1", name: "무선 워크인", sub: "[무선]", juniper: null, highland: null, threey: null, sx: 4, type: "normal" },
        { id: "se2", name: "레그레스트 설치", sub: "[수동식]", juniper: null, highland: null, threey: null, sx: 7, type: "normal" }
      ]
    },
    {
      id: "roof",
      name: "글 라 스 루 프",
      nameEn: "Glass Roof",
      items: [
        { id: "r1", name: "선쉐이드", sub: "[수동식]", juniper: null, highland: null, threey: null, sx: 5, type: "normal" },
        { id: "r2", name: "선쉐이드", sub: "[전동식]", juniper: 15, highland: null, threey: null, sx: 15, type: "normal" }
      ]
    },
    {
      id: "dashcam",
      name: "블 랙 박 스",
      nameEn: "Dashcam",
      items: [
        { id: "dc1", name: "전원 모듈 설치", sub: "[JB모듈]", juniper: 5, highland: 5, threey: 5, sx: null, type: "normal" },
        { id: "dc2", name: "전원 모듈 + 블랙박스 설치", sub: "[JB모듈]", juniper: 15, highland: 15, threey: 15, sx: null, type: "normal" }
      ]
    },
    {
      id: "s3xy",
      name: "s3xy 버 튼",
      nameEn: "s3xy Button",
      items: [
        { id: "sx1", name: "제품 설치", sub: "[커맨더 / 노브 / 버튼 / 스톡 / 스트립]", juniper: 3, highland: 3, threey: 3, sx: 3, type: "normal" }
      ]
    },
    {
      id: "others",
      name: "기 타",
      nameEn: "Others",
      items: [
        { id: "o1", name: "기타 제품 및 악세서리 설치", sub: "", juniper: null, highland: null, threey: null, sx: null, type: "consult" }
      ]
    }
  ]
};

function loadData() {
  try {
    const saved = localStorage.getItem('smith_data');
    return saved ? JSON.parse(saved) : JSON.parse(JSON.stringify(DEFAULT_DATA));
  } catch {
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

function saveData(data) {
  localStorage.setItem('smith_data', JSON.stringify(data));
}

function resetData() {
  localStorage.removeItem('smith_data');
}
