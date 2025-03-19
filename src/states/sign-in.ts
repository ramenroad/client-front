import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createJSONStorage } from "zustand/middleware";
import { Tokens } from "../types";

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
    }
  )
);
