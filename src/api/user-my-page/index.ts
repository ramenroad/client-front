import { instanceWithNoVersioning } from "../index";

export interface UserMyPageResponse {
  nickname: string;
  profileImageUrl: string;
  currentMonthReviewCount: number;
  avgReviewRating: number;
  reviewCount: number;
  isPublic: boolean;
}

export const getUserMyPage = async (userId: string) => {
  const response = await instanceWithNoVersioning.get<UserMyPageResponse>(`/mypage/user/${userId}`);
  return response.data;
};

export const patchMyPagePublic = async (isPublic: boolean) => {
  const response = await instanceWithNoVersioning.patch(`/mypage/isPublic`, { isPublic });
  return response.data;
};
