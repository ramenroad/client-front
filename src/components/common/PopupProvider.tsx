import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { Popup } from "./Popup";
import { PopupType } from "../../types";
import { PopupFilter } from "./PopupFilter";

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

  useEffect(() => {
    console.log(popupType);
  }, [popupType]);

  if (popupType === PopupType.FILTER) {
    popupContent = <PopupFilter onClose={closePopup} />;
  }

  return (
    <PopupContext.Provider value={{ openPopup, closePopup }}>
      {children}
      <Popup isOpen={isOpen} onClose={closePopup}>
        {popupContent}
      </Popup>
    </PopupContext.Provider>
  );
};

export const usePopupContext = () => {
  const ctx = useContext(PopupContext);
  if (!ctx)
    throw new Error("usePopupContext must be used within a PopupProvider");
  return ctx;
};
