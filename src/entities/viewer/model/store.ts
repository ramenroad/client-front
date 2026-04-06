import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Tokens, UserInformation } from "./types";

interface SignInState {
  isSignIn: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  setIsSignIn: (isSignIn: boolean) => void;
  setTokens: (tokens: Tokens) => void;
  clearTokens: () => void;
}

export const useSignInStore = create<SignInState>()(
  persist(
    (set) => ({
      isSignIn: false,
      accessToken: null,
      refreshToken: null,
      setIsSignIn: (isSignIn) => set({ isSignIn }),
      setTokens: (tokens) =>
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          isSignIn: true,
        }),
      clearTokens: () =>
        set({
          accessToken: null,
          refreshToken: null,
          isSignIn: false,
        }),
    }),
    {
      name: "sign-in-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

interface UserInformationStore {
  userInformation: UserInformation | null;
}

export const useUserInformationStore = create<UserInformationStore>()(
  persist<UserInformationStore>(
    () => ({
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
