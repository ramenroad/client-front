import { getBanner } from "../api/banner";
import { useQuery } from "@tanstack/react-query";

export const useBannerQuery = () => {
  return useQuery({
    queryKey: ["banner"],
    queryFn: getBanner,
    select: (data) => Array.isArray(data) ? data.sort((a, b) => b.priority - a.priority) : [],
  });
};
