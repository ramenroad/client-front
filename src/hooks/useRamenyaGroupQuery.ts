import {
    getRamenyaGroup,
  } from "../api/group";
  import { useQuery } from "@tanstack/react-query";
  
  
  export const useRamenyaGroupQuery = () => {
    return useQuery({
      queryKey: ["ramenyaGroup"],
      queryFn: () => getRamenyaGroup(),
    });
  };
  