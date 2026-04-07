import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Coordinate } from "@/shared/lib/number";

interface UseLocationStoreType {
  current: Coordinate;
}

export const useLocationStore = create<UseLocationStoreType>()(
  immer(() => ({
    current: { latitude: 0, longitude: 0 },
  })),
);

export const setCurrentLocation = (current: Coordinate) => {
  useLocationStore.setState((state) => {
    state.current = current;
    return state;
  });
};
