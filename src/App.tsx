import { QueryClientProvider } from "@tanstack/react-query";
import { Routes } from "./pages/Routes.tsx";
import { queryClient } from "./core/queryClient";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes />
    </QueryClientProvider>
  );
}

export default App;
