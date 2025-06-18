import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import { getUserMyPage } from "../../api/user-my-page";

export const useUserMyPageQuery = (userId?: string) => {
  const userMyPageQuery = useQuery({
    ...queryKeys.userMyPage.user(userId!),
    queryFn: () => getUserMyPage(userId!),
    enabled: !!userId,
  });

  return { userMyPageQuery };
};
