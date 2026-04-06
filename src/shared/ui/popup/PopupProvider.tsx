import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { PopupType } from "@/shared/model/popup";
import PopupFilter, { type PopupFilterProps } from "./PopupFilter";
import PopupSort, { type PopupSortProps } from "./PopupSort";
import PopupConfirm, { type PopupConfirmProps } from "./PopupConfirm";
import { PopupIframe, type PopupIframeProps } from "./PopupIframe";
import { Popup } from "./Popup";

interface PopupContextType {
  openPopup: (type: PopupType, options?: unknown) => void;
  closePopup: () => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const PopupProvider = ({ children }: { children: ReactNode }) => {
  const [popupType, setPopupType] = useState<PopupType | null>(null);
  const [popupOptions, setPopupOptions] = useState<unknown>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openPopup = useCallback((type: PopupType, options?: unknown) => {
    setPopupType(type);
    setPopupOptions(options);
    setIsOpen(true);
  }, []);

  const closePopup = useCallback(() => {
    setIsOpen(false);
    setPopupType(null);
    setPopupOptions(null);
  }, []);

  let popupContent: ReactNode = null;
  let popupDirection: "center" | "bottom" = "center";

  switch (popupType) {
    case PopupType.FILTER:
      popupContent = <PopupFilter {...(popupOptions as PopupFilterProps)} onClose={closePopup} />;
      popupDirection = "bottom";
      break;
    case PopupType.SORT:
      popupContent = <PopupSort {...(popupOptions as PopupSortProps)} onClose={closePopup} />;
      popupDirection = "bottom";
      break;
    case PopupType.CONFIRM:
      popupContent = <PopupConfirm {...(popupOptions as PopupConfirmProps)} onClose={closePopup} />;
      popupDirection = "center";
      break;
    case PopupType.IFRAME:
      popupContent = <PopupIframe {...(popupOptions as PopupIframeProps)} onClose={closePopup} />;
      popupDirection = "center";
      break;
    default:
      popupContent = null;
  }

  return (
    <PopupContext.Provider value={{ openPopup, closePopup }}>
      {children}
      {popupContent && (
        <Popup isOpen={isOpen} onClose={closePopup} direction={popupDirection}>
          {popupContent}
        </Popup>
      )}
    </PopupContext.Provider>
  );
};

export const usePopupContext = () => {
  const context = useContext(PopupContext);

  if (!context) {
    throw new Error("usePopupContext must be used within a PopupProvider");
  }

  return context;
};
