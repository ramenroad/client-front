import { getRamenyaDetail } from "../../api/detail-page";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export const useRamenyaDetailQuery = (id?: string) => {
  return useQuery({
    ...queryKeys.ramenya.detail(id!),
    queryFn: () => getRamenyaDetail(id!),
    enabled: !!id,
  });
};
