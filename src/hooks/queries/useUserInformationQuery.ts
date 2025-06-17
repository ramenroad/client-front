import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import { getUserInformation } from "../../api/auth";
import { useSignInStore } from "../../states/sign-in";

export const useUserInformationQuery = () => {
  const { accessToken } = useSignInStore();

  const userInformationQuery = useQuery({
    ...queryKeys.user.information,
    queryFn: getUserInformation,
    enabled: !!accessToken,
  });

  return { userInformationQuery };
};
