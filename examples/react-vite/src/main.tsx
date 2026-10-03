import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@noir-tv-ui/core/tokens.css";
import "@noir-tv-ui/core/noir.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
