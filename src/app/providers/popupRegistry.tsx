import PopupConfirm, { type PopupConfirmProps } from "@/shared/ui/popup/PopupConfirm";
import { PopupIframe, type PopupIframeProps } from "@/shared/ui/popup/PopupIframe";
import type { PopupRenderOptions, PopupRenderResult } from "@/shared/ui/popup";
import { PopupFilter, type PopupFilterProps, PopupSort, type PopupSortProps } from "@/widgets/ramenya/filter-popup";

export const renderAppPopup = ({ type, options, closePopup }: PopupRenderOptions): PopupRenderResult | null => {
  switch (type) {
    case "FILTER":
      return {
        content: <PopupFilter {...(options as Omit<PopupFilterProps, "onClose">)} onClose={closePopup} />,
        direction: "bottom",
      };
    case "SORT":
      return {
        content: <PopupSort {...(options as Omit<PopupSortProps, "onClose">)} onClose={closePopup} />,
        direction: "bottom",
      };
    case "CONFIRM":
      return {
        content: <PopupConfirm {...(options as Omit<PopupConfirmProps, "onClose">)} onClose={closePopup} />,
      };
    case "IFRAME":
      return {
        content: <PopupIframe {...(options as Omit<PopupIframeProps, "onClose">)} onClose={closePopup} />,
      };
    default:
      return null;
  }
};
