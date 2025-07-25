import { QueryClientProvider } from "@tanstack/react-query";
import { Routes } from "./pages/Routes.tsx";
import { queryClient } from "./core/queryClient";
import tw from "twin.macro";
import "swiper/css";
import { PopupProvider } from "./components/popup/PopupProvider.tsx";
import { ToastProvider } from "./components/toast/ToastProvider.tsx";

function App() {
  return (
    <PopupProvider>
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <Screen>
            <View>
              <Routes />
            </View>
          </Screen>
        </QueryClientProvider>
      </ToastProvider>
    </PopupProvider>
  );
}

const Screen = tw.section`
  flex justify-center min-h-[100dvh] overflow-hidden box-border
`;

const View = tw.main`
  relative flex flex-col items-center box-border
  w-390 min-h-[100dvh]
  border-0 border-x border-border border-solid
`;

export default App;
