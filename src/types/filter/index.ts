export interface FilterOptions {
  isOpen: boolean;
  sort: SortType;
  genre: string[];
}

export enum SortType {
  DEFAULT = "기본순",
  RATING = "평점 높은 순",
  DISTANCE = "거리 가까운 순",
}
