import { useQuery } from "@tanstack/react-query";
import { getBanner, getRamenyaGroup } from "@/entities/curation/api";
import { queryKeys } from "@/shared/model/query-keys";

export const useBannerQuery = () => {
  const bannerQuery = useQuery({
    ...queryKeys.banner.all,
    queryFn: getBanner,
    select: (data) => (Array.isArray(data) ? data.sort((a, b) => b.priority - a.priority) : []),
  });

  return { bannerQuery };
};

export const useRamenyaGroupQuery = () => {
  const ramenyaGroupQuery = useQuery({
    ...queryKeys.ramenya.group,
    queryFn: getRamenyaGroup,
  });

  return { ramenyaGroupQuery };
};
