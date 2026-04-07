import { createContext } from "react";

export interface PopupContextType {
  openPopup: (type: string, options?: unknown) => void;
  closePopup: () => void;
}

export const PopupContext = createContext<PopupContextType | undefined>(undefined);
