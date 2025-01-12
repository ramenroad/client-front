import { getRamenyaDetail } from "../api/detail-page";
import { useQuery } from "@tanstack/react-query";

export const useRamenyaDetailQuery = (id: string) => {
  return useQuery({
    queryKey: ["ramenyaDetail", id],
    queryFn: () => getRamenyaDetail(id),
    enabled: !!id,
  });
};
