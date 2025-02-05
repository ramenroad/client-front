import {
    getRamenyaGroup,
    getRamenyaGroupDetail,
  } from "../api/group";
  import { useQuery } from "@tanstack/react-query";
  
  
  export const useRamenyaGroupQuery = () => {
    return useQuery({
      queryKey: ["ramenyaGroup"],
      queryFn: () => getRamenyaGroup(),
    });
  };
  
  export const useRamenyaGroupDetailQuery = (id: string) => {
    return useQuery({
      queryKey: ["ramenyaGroupDetail", id],
      queryFn: () => getRamenyaGroupDetail(id),
      enabled: !!id,
    });
  };