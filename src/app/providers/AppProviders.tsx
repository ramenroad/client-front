import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { queryClient } from "@/shared/api/query-client";
import { PopupProvider } from "@/shared/ui/popup";
import { ToastProvider } from "@/shared/ui/toast";

interface AppProvidersProps {
  children: ReactNode;
}

const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <PopupProvider>
      <ToastProvider>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </ToastProvider>
    </PopupProvider>
  );
};

export default AppProviders;
