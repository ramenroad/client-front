import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { queryClient } from "@/shared/api/query-client";
import { PopupProvider } from "@/shared/ui/popup";
import { ToastProvider } from "@/shared/ui/toast";
import "@/app/providers/initializeHttpAuth";
import { renderAppPopup } from "./popupRegistry";

interface AppProvidersProps {
  children: ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <PopupProvider renderPopup={renderAppPopup}>
      <ToastProvider>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </ToastProvider>
    </PopupProvider>
  );
};

export default AppProviders;
