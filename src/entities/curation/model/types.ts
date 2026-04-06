import type { Ramenya } from "@/entities/ramenya/model/types";

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
  type: number;
}
