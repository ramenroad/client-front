import { QueryClientProvider } from "@tanstack/react-query";
import { Routes } from "./pages/Routes.tsx";
import { queryClient } from "./core/queryClient";
import tw from "twin.macro";
import { ToastProvider } from "./components/ToastProvider.tsx";
import "swiper/css";

function App() {
  return (
    <ToastProvider>
      <QueryClientProvider client={queryClient}>
        <Screen>
          <View>
            <Routes />
          </View>
        </Screen>
      </QueryClientProvider>
    </ToastProvider>
  );
}

const Screen = tw.section`
  flex justify-center min-h-screen overflow-hidden box-border
`;

const View = tw.main`
  relative flex flex-col items-center box-border
  w-390 min-h-screen
  border-0 border-x border-border border-solid
`;

export default App;
