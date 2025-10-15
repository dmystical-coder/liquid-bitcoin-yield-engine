import { createAppKit } from "@reown/appkit/react";
import { BitcoinAdapter } from "@reown/appkit-adapter-bitcoin";
import { bitcoin } from "@reown/appkit/networks";
import type { ReactNode } from "react";
import { useEffect } from "react";
import useAppStore from "../store/useAppStore";

// 1. Get projectId from Reown Dashboard
// For now using a demo projectId - replace with your own from https://dashboard.reown.com
const projectId = import.meta.env.VITE_REOWN_PROJECT_ID || "YOUR_PROJECT_ID";

// 2. Create a metadata object
const metadata = {
  name: "Liquid Bitcoin Yield Engine",
  description: "The Bitcoin Account that Earns and Spends",
  url:
    typeof window !== "undefined"
      ? window.location.origin
      : "https://example.com",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// 3. Define Bitcoin networks
const networks = [bitcoin] as const;

// 4. Create Bitcoin Adapter
const bitcoinAdapter = new BitcoinAdapter();

// 5. Create AppKit instance
export const appKit = createAppKit({
  adapters: [bitcoinAdapter],
  networks: networks as any,
  projectId,
  metadata,
  features: {
    analytics: false, // Optional - can enable if you have analytics set up
  },
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "rgb(0,122,255)",
    "--w3m-border-radius-master": "12px",
  },
});

// Provider component
export function BitcoinWalletProvider({ children }: { children: ReactNode }) {
  const { loginWithBitcoinWallet } = useAppStore();

  useEffect(() => {
    // Subscribe to wallet connection events
    appKit.subscribeAccount((account: any) => {
      if (account.address && account.isConnected) {
        // Wallet connected
        loginWithBitcoinWallet({
          address: account.address,
          walletType: "xverse", // Can be extended to detect wallet type
        });
      }
    });

    // No cleanup needed as subscribeAccount doesn't return an unsubscribe function
  }, [loginWithBitcoinWallet]);

  return <>{children}</>;
}

// Hook to get wallet connection status
export function useBitcoinWallet() {
  return {
    openModal: () => appKit.open(),
    closeModal: () => appKit.close(),
    disconnect: () => appKit.disconnect(),
  };
}
