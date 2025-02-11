import { createQueryKeyStore } from "@lukemorales/query-key-factory";

export const queryKeys = createQueryKeyStore({
  banner: {
    all: null,
  },
  ramenya: {
    all: null,
    detail: (id: string) => [id],
    group: null,
    list: (params: { type: "region" | "genre"; value: string }) =>
      [params.type, params.value] as const,
  },

});