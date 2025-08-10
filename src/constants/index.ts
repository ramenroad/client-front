import pig from "../assets/images/ramen/pig.png";
import sio from "../assets/images/ramen/sio.png";
import soy from "../assets/images/ramen/soy.png";
import iekei from "../assets/images/ramen/iekei.png";
import jiro from "../assets/images/ramen/jiro.png";
import toripaitan from "../assets/images/ramen/toripaitan.png";
import niboshi from "../assets/images/ramen/niboshi.png";
import aburasoba from "../assets/images/ramen/aburasoba.png";
import tsukemen from "../assets/images/ramen/tsukemen.png";
import miso from "../assets/images/ramen/miso.png";
import dandan from "../assets/images/ramen/dandan.png";
import mazemen from "../assets/images/ramen/mazemen.png";
import { FilterOptions } from "../types/filter";
import { SortType } from "../types/filter";

export const RAMENYA_TYPES = [
  "이에케",
  "돈코츠",
  "쇼유",
  "시오",
  "미소",
  "청탕",
  "아부라",
  "지로",
  "탄탄멘",
  "토리",
  "츠케멘",
] as const;

export const RAMENYA_LOCATION_LIST = [
  {
    name: ["연남동", "홍대"],
    location: {
      latitude: 37.5541984,
      longitude: 126.9211314,
    },
  },
  {
    name: ["합정", "망원"],
    location: {
      latitude: 37.547525,
      longitude: 126.9113693,
    },
  },
  {
    name: ["강남"],
    location: {
      latitude: 37.5009345,
      longitude: 127.0320245,
    },
  },
  {
    name: ["시청", "서울역"],
    location: {
      latitude: 37.5542324,
      longitude: 126.982672,
    },
  },
  //   {
  //     "y": 35.1521117,
  //     "_lat": 35.1521117,
  //     "x": 129.1643727,
  //     "_lng": 129.1643727
  // }
  {
    name: ["부산"],
    location: {
      latitude: 35.1521117,
      longitude: 129.1643727,
    },
  },
  {
    name: ["판교"],
    location: {
      latitude: 37.3852154,
      longitude: 127.1151282,
    },
  },
] as const;

export type RamenyaType = (typeof RAMENYA_TYPES)[number];

export enum OpenStatus {
  OPEN = "영업 중",
  CLOSED = "영업 종료",
  BREAK = "준비시간",
  BEFORE_OPEN = "영업 전",
  DAY_OFF = "휴무일",
}

export const genrePath = [
  {
    genre: "쇼유",
    image: soy,
  },
  {
    genre: "시오",
    image: sio,
  },
  {
    genre: "미소",
    image: miso,
  },
  {
    genre: "돈코츠",
    image: pig,
  },
  {
    genre: "츠케멘",
    image: tsukemen,
  },

  {
    genre: "이에케",
    image: iekei,
  },
  {
    genre: "지로",
    image: jiro,
  },
  {
    genre: "토리파이탄",
    image: toripaitan,
  },
  {
    genre: "니보시",
    image: niboshi,
  },
  // {
  //   genre: "아사리",
  //   image: asari,
  // },
  {
    genre: "아부라소바",
    image: aburasoba,
  },
  {
    genre: "탄탄멘",
    image: dandan,
  },
  {
    genre: "마제소바",
    image: mazemen,
  },
];

export const ramenroadEmail = "ramenroad99@gmail.com";

export const initialFilterOptions: FilterOptions = {
  isOpen: false,
  sort: SortType.DEFAULT,
  genre: [],
};

export const WEEKDAYS_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

export type WeekdaysOrderType = (typeof WEEKDAYS_ORDER)[number];

export const DAY_MAP: Record<string, string> = {
  mon: "월",
  tue: "화",
  wed: "수",
  thu: "목",
  fri: "금",
  sat: "토",
  sun: "일",
} as const;

export const MAP_MODE = {
  LIST: "list",
  CARD: "card",
} as const;

export type MapModeType = (typeof MAP_MODE)[keyof typeof MAP_MODE];

// ResultListOverlay 높이 상수 (3단계) - vh 기반
export const OVERLAY_HEIGHTS = {
  COLLAPSED: "8dvh", // 최소 높이
  HALF: "35dvh", // 중간 높이
  EXPANDED: "80dvh", // 최대 높이
} as const;

export type OverlayHeightType = (typeof OVERLAY_HEIGHTS)[keyof typeof OVERLAY_HEIGHTS];

export const SEARCH_MODE = {
  KEYWORD: "keyword",
  NEARBY: "nearby",
} as const;

export type SearchModeType = (typeof SEARCH_MODE)[keyof typeof SEARCH_MODE];
