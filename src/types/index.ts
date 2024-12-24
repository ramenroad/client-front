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
  address: string;
  thumbnailUrl?: string;
}
