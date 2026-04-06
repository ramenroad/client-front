/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRoot } from "react-dom/client";
import App from "@/app";
import "@/app/styles/global.css";

declare global {
  interface Window {
    kakao: any;
  }
}

createRoot(document.getElementById("root")!).render(<App />);
