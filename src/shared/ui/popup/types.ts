import type { ReactNode } from "react";

export type PopupDirection = "center" | "bottom";

export interface PopupRenderResult {
  content: ReactNode;
  direction?: PopupDirection;
}

export interface PopupRenderOptions {
  type: string;
  options: unknown;
  closePopup: () => void;
}
