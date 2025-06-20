import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { TimerProvider } from "./context/TimerContext.tsx";

createRoot(document.getElementById("root")!).render(
  <TimerProvider>
    <App />
  </TimerProvider>
);
