import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
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
      storage: createJSONStorage(
        (): StateStorage => ({
          getItem: (name) => {
            const localValue = localStorage.getItem(name);
            if (localValue !== null) {
              return localValue;
            }

            const sessionValue = sessionStorage.getItem(name);
            if (sessionValue !== null) {
              localStorage.setItem(name, sessionValue);
              sessionStorage.removeItem(name);
            }

            return sessionValue;
          },
          setItem: (name, value) => {
            localStorage.setItem(name, value);
            sessionStorage.removeItem(name);
          },
          removeItem: (name) => {
            localStorage.removeItem(name);
            sessionStorage.removeItem(name);
          },
        }),
      ),
    },
  ),
);

interface UserInformationStore {
  userInformation: UserInformation | null;
  clearUserInformation: () => void;
}

export const useUserInformationStore = create<UserInformationStore>()(
  persist<UserInformationStore>(
    (set) => ({
      userInformation: null,
      clearUserInformation: () => {
        set({ userInformation: null });
      },
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

export const clearUserInformation = () => {
  useUserInformationStore.getState().clearUserInformation();
};
