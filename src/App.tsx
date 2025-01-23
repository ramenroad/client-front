import { QueryClientProvider } from "@tanstack/react-query";
import { Routes } from "./pages/Routes.tsx";
import { queryClient } from "./core/queryClient";
import tw from "twin.macro";
import { Footer } from "./components/common/Footer.tsx";
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Screen>
        <View>
          <Routes />
          <Footer />
        </View>
      </Screen>

    </QueryClientProvider>
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
