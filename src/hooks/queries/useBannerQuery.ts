import { getBanner } from "../../api/banner";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export const useBannerQuery = () => {
  return useQuery({
    ...queryKeys.banner.all,
    queryFn: getBanner,
    select: (data) => Array.isArray(data) ? data.sort((a, b) => b.priority - a.priority) : [],
  });
};
