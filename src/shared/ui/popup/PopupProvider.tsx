import { useCallback, useMemo, useState, type ReactNode } from "react";
import { Popup } from "./Popup";
import { PopupContext } from "./context";
import type { PopupRenderOptions, PopupRenderResult } from "./types";

interface PopupProviderProps {
  children: ReactNode;
  renderPopup?: (options: PopupRenderOptions) => PopupRenderResult | null;
}

export const PopupProvider = ({ children, renderPopup }: PopupProviderProps) => {
  const [popupType, setPopupType] = useState<string | null>(null);
  const [popupOptions, setPopupOptions] = useState<unknown>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openPopup = useCallback((type: string, options?: unknown) => {
    setPopupType(type);
    setPopupOptions(options);
    setIsOpen(true);
  }, []);

  const closePopup = useCallback(() => {
    setIsOpen(false);
    setPopupType(null);
    setPopupOptions(null);
  }, []);

  const popupConfig = useMemo(() => {
    if (!popupType || !renderPopup) {
      return null;
    }

    return renderPopup({
      type: popupType,
      options: popupOptions,
      closePopup,
    });
  }, [closePopup, popupOptions, popupType, renderPopup]);

  return (
    <PopupContext.Provider value={{ openPopup, closePopup }}>
      {children}
      {popupConfig && (
        <Popup isOpen={isOpen} onClose={closePopup} direction={popupConfig.direction ?? "center"}>
          {popupConfig.content}
        </Popup>
      )}
    </PopupContext.Provider>
  );
};
