import { createQueryKeyStore } from "@lukemorales/query-key-factory";

export const queryKeys = createQueryKeyStore({
  banner: {
    all: null,
  },
  community: {
    list: (params: { page?: number; limit?: number; category?: string }) =>
      [params.page, params.limit, params.category] as const,
    detail: (boardId: string) => [boardId],
    comments: (boardId: string) => [boardId],
  },
  mypage: {
    nicknameCheck: (nickname: string) => [nickname],
    notices: (type: "공지사항" | "패치노트" | "약관") => [type],
    notice: (noticeId: string) => [noticeId],
    myPosts: null,
    myComments: null,
    recentViewedRamenya: null,
  },
  ramenya: {
    all: null,
    detail: (id: string) => [id],
    group: null,
    regions: null,
    list: (params: { type: "region" | "genre"; value: string }) => [params.type, params.value] as const,
    listWithGeolocation: (latitude?: number, longitude?: number, radius?: number) => [latitude, longitude, radius],
    listWithSearch: (keyword?: string, nearby?: boolean, latitude?: number, longitude?: number) => [
      keyword,
      nearby,
      latitude,
      longitude,
    ],
    searchAutoComplete: (query: string) => [query],
  },
  user: {
    information: null,
  },
  review: {
    userReview: (userId: string) => [userId],
    ramenyaReview: (ramenyaId: string) => [ramenyaId],
    my: null,
    detail: (reviewId: string) => [reviewId],
    images: (reviewId: string) => [reviewId],
  },
  userMyPage: {
    user: (userId: string) => [userId],
  },
  search: {
    history: null,
  },
});
