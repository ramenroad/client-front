import pig from "../assets/images/ramen/pig.png";
import sio from "../assets/images/ramen/sio.png";
import soy from "../assets/images/ramen/soy.png";
import iekei from "../assets/images/ramen/iekei.png";
import jiro from "../assets/images/ramen/jiro.png";
import toripaitan from "../assets/images/ramen/toripaitan.png";
import niboshi from "../assets/images/ramen/niboshi.png";
import asari from "../assets/images/ramen/asari.png";
import aburasoba from "../assets/images/ramen/aburasoba.png";
import tsukemen from "../assets/images/ramen/tsukemen.png";
import miso from "../assets/images/ramen/miso.png";
import dandan from "../assets/images/ramen/dandan.png";
import mazemen from "../assets/images/ramen/mazemen.png";

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
];

export enum OpenStatus {
  OPEN = "영업 중",
  CLOSED = "영업 종료",
  BREAK = "쉬는 중",
  BEFORE_OPEN = "영업 전",
  DAY_OFF = "휴무일",
}

export const genrePath = [
  {
    genre: "돈코츠",
    image: pig,
  },
  {
    genre: "시오",
    image: sio,
  },
  {
    genre: "쇼유",
    image: soy,
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
  {
    genre: "아사리",
    image: asari,
  },
  {
    genre: "아부라소바",
    image: aburasoba,
  },
  {
    genre: "츠케멘",
    image: tsukemen,
  },
  {
    genre: "미소",
    image: miso,
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

export const SORT_TYPES = ["추천순", "거리순", "평점순"];
