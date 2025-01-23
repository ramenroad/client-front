import mainImage from "../assets/images/main-image.png";

export const bannerImages = [
    {
      id: 1,
      image: mainImage,
      link: "https://www.google.com",
    },
    {
      id: 2,
      image: "https://picsum.photos/350/200",
      link: "https://www.naver.com",
    },

  ];

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
