import { createQueryKeyStore } from "@lukemorales/query-key-factory";

export const queryKeys = createQueryKeyStore({
  banner: {
    all: null,
  },
  ramenya: {
    all: null,
    detail: (id: string) => [id],
    group: null,
    regions: null,
    list: (params: { type: "region" | "genre"; value: string }) => [params.type, params.value] as const,
  },
  user: {
    information: null,
  },
  review: {
    userReview: (userId: string) => [userId],
    my: null,
  },
  userMyPage: {
    user: (userId: string) => [userId],
  },
});
