import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import { getUserInformation } from "../../api/auth";

export const useUserInformationQuery = () => {
  const userInformationQuery = useQuery({
    ...queryKeys.user.information,
    queryFn: getUserInformation,
  });

  return { userInformationQuery };
};
