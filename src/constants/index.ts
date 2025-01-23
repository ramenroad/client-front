import pig from "../assets/images/pig.png";
import sio from "../assets/images/sio.png";
import soy from "../assets/images/soy.png";
import iekei from "../assets/images/iekei.png";
import jiro from "../assets/images/jiro.png";
import toripaitan from "../assets/images/toripaitan.png";
import niboshi from "../assets/images/niboshi.png";
import asari from "../assets/images/asari.png";
import aburasoba from "../assets/images/aburasoba.png";
import tsukemen from "../assets/images/tsukemen.png";
import miso from "../assets/images/miso.png";
import dandan from "../assets/images/dandan.png";

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
];
