import { getRamenyaList } from "../api/list-page";
import { useQuery } from "@tanstack/react-query";

export const useRamenyaListQuery = (location?: string) => {
  return useQuery({
    queryKey: ["ramenyaList", location],
    queryFn: () => getRamenyaList(location!),
    enabled: !!location,
  });
};
