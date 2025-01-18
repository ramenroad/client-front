import { QueryClientProvider } from "@tanstack/react-query";
import { Routes } from "./pages/Routes.tsx";
import { queryClient } from "./core/queryClient";
import tw from "twin.macro";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Screen>
        <View>
          <Routes />
        </View>
      </Screen>
    </QueryClientProvider>
  );
}

const Screen = tw.section`
  flex justify-center min-h-screen overflow-hidden box-border
`;

const View = tw.main`
  flex flex-col items-center box-border
  w-390 h-full
  border-0 border-x border-border border-solid
`;

export default App;
