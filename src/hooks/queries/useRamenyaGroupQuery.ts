import { getRamenyaGroup } from "../../api/group";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export const useRamenyaGroupQuery = () => {
  return useQuery({
    ...queryKeys.ramenya.group,
    queryFn: () => getRamenyaGroup(),
  });
};
