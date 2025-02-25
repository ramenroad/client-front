/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
declare global {
  interface Window {
    kakao: any;
    dataLayer: any[];
    gtag: (
      command: 'event',
      eventName: string,
      eventParams: {
        [key: string]: unknown;
      }
    ) => void;
  }
}
  

createRoot(document.getElementById("root")!).render(<App />);
