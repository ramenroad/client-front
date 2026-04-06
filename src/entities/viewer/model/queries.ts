import { useQuery } from "@tanstack/react-query";
import { getUserInformation, getUserMyPage } from "@/entities/viewer/api";
import { queryKeys } from "@/shared/model/query-keys";
import { useSignInStore } from "./store";

export const useUserInformationQuery = () => {
  const { accessToken } = useSignInStore();

  const userInformationQuery = useQuery({
    ...queryKeys.user.information,
    queryFn: getUserInformation,
    enabled: !!accessToken,
  });

  return { userInformationQuery };
};

export const useUserMyPageQuery = (userId?: string) => {
  const userMyPageQuery = useQuery({
    ...queryKeys.userMyPage.user(userId!),
    queryFn: () => getUserMyPage(userId!),
    enabled: !!userId,
  });

  return { userMyPageQuery };
};
