import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

declare global {
  interface Window {
    kakao: unknown;
  }
}

createRoot(document.getElementById("root")!).render(<App />);
