import type { MenuBoard } from "@/entities/menu-board/model/types";
import type { UserReview } from "@/entities/review/model/types";
import type { OpenStatus } from "./constants";

export type BusinessHour = {
  day: string;
  operatingTime: string;
  breakTime: string;
  isOpen: boolean;
};

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface Ramenya {
  _id: string;
  name: string;
  region: string;
  genre: string[];
  businessHours: BusinessHour[];
  ramenroadReview: {
    description: string;
    oneLineReview: string;
  };
  address: string;
  thumbnailUrl?: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  kakaoMapUrl?: string;
  naverMapUrl?: string;
  googleMapUrl?: string;
}

export interface BusinessStatus {
  status: OpenStatus;
  todayHours: {
    operatingTime: string | null;
    breakTime: string | null;
  } | null;
}

export interface RemenyaDetail {
  name: string;
  thumbnailUrl: string;
  genre: string[];
  region: string;
  address: string;
  latitude: number;
  longitude: number;
  contactNumber: string;
  instagramProfile: string;
  businessHours: BusinessHour[];
  recommendedMenu: {
    name: string;
    price: number;
  }[];
  isSelfmadeNoodle: boolean;
  ramenroadReview: {
    oneLineReview: string;
    description: string;
  };
  reviewCount?: number;
  rating?: number;
  reviews?: UserReview[];
  menus?: string[];
  naverMapUrl?: string;
  kakaoMapUrl?: string;
  googleMapUrl?: string;
  menuBoard: MenuBoard[];
}

export type Region = string[];
