import { OpenStatus } from "../constants";

export type BusinessHour = {
  day: string;
  operatingTime: string; // e.g., "09:00 – 18:00"
  breakTime: string; // e.g., "12:00 – 13:00"
  isOpen: boolean;
};

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
}

export interface Banner {
  _id: string;
  name: string;
  description: string;
  priority: number;
  redirectUrl: string;
  isShown: boolean;
  bannerImageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface RamenyaGroup {
  _id: string;
  name: string;
  description: string;
  priority: number;
  isShown: boolean;
  ramenyas: Ramenya[];
  descriptionImageUrl: string;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export type Region = string[];

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
