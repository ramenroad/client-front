import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserInformation } from "../../types/user";

interface UserInformationStore {
  userInformation: UserInformation | null;
}

export const useUserInformationStore = create<UserInformationStore>()(
  persist(
    // @ts-ignore
    (set) => ({
      userInformation: null,
    }),
    {
      name: "user-information-storage",
    },
  ),
);

export const setUserInformation = (userInformation: UserInformation) => {
  useUserInformationStore.setState((state) => {
    state.userInformation = userInformation;
    return state;
  });
};
