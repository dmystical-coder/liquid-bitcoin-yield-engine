import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import StarknetProvider from "./services/StarknetProvider";
import { BitcoinWalletProvider } from "./services/BitcoinWalletProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BitcoinWalletProvider>
      <StarknetProvider>
        <App />
      </StarknetProvider>
    </BitcoinWalletProvider>
  </StrictMode>
);
