# Bitcoin Wallet Integration with Reown AppKit

This document explains how to set up and use the Bitcoin wallet connection feature using Reown AppKit and Xverse API.

## Overview

This integration enables users to:

- ✅ Connect their Bitcoin wallets (Xverse, Leather, OKX, etc.) using Reown AppKit
- ✅ View real-time Bitcoin balance from their connected wallet
- ✅ See actual transaction history from the blockchain
- ✅ Access real Bitcoin wallet data via the Xverse API
- 🔄 Future: Earn yield on Bitcoin, make Lightning payments

## Setup Instructions

### 1. Get Your Reown Project ID

1. Go to [Reown Dashboard](https://dashboard.reown.com)
2. Create a new project or use an existing one
3. Copy your Project ID

### 2. Configure Environment Variables

Create a `.env.local` file in the `frontend` directory:

```bash
VITE_REOWN_PROJECT_ID=your_project_id_here

# Optional: Xverse API Key for higher rate limits
VITE_XVERSE_API_KEY=
```

Replace `your_project_id_here` with the Project ID you copied from the Reown Dashboard.

**Note:** The Xverse API key is optional. The app works without it but may have lower rate limits.

### 3. Supported Wallets

The integration supports multiple Bitcoin wallets including:

- **Xverse Wallet** (Primary)
- **Leather Wallet** (formerly Hiro)
- **OKX Wallet**
- **Unisat Wallet**
- And more...

## How It Works

### User Flow

1. User clicks "Or, connect your Bitcoin wallet" on the onboarding screen
2. Reown AppKit modal opens with available Bitcoin wallet options
3. User selects their preferred wallet (e.g., Xverse)
4. Wallet extension prompts user to connect
5. Upon connection, the app automatically:
   - Stores the wallet address
   - Authenticates the user
   - Loads dashboard data
   - Enables Bitcoin features

### Technical Implementation

#### Files Modified/Created:

1. **`src/services/BitcoinWalletProvider.tsx`** - Main provider and configuration

   - Initializes Reown AppKit with Bitcoin adapter
   - Subscribes to wallet connection events
   - Updates app store when wallet connects/disconnects

2. **`src/screens/OnboardingScreen.tsx`** - Updated connect button

   - Triggers Reown AppKit modal on button click

3. **`src/store/useAppStore.ts`** - Added new action

   - `loginWithBitcoinWallet()` - Handles wallet-based authentication

4. **`src/main.tsx`** - Wrapped app with provider
   - Enables Bitcoin wallet functionality app-wide

## Testing the Integration

### Local Development

1. Install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Navigate to the onboarding screen
4. Click "Or, connect your Bitcoin wallet"
5. The Reown AppKit modal should open

### Testing with Xverse Wallet

1. Install [Xverse Wallet Extension](https://www.xverse.app/)
2. Create/Import a Bitcoin wallet in Xverse
3. In your app, click "Or, connect your Bitcoin wallet"
4. Select "Xverse" from the modal
5. Approve the connection in the Xverse popup
6. You should be logged in and redirected to the dashboard

## Features

### Current Features:

- ✅ Multi-wallet support (Xverse, Leather, OKX, Unisat, etc.)
- ✅ Automatic authentication on wallet connection
- ✅ **Real Bitcoin balance fetching** from connected wallet address
- ✅ **Real transaction history** from the blockchain
- ✅ Beautiful, responsive modal UI with dark mode
- ✅ Wallet disconnect handling
- ✅ Live Bitcoin price conversion to USD
- ✅ Transaction parsing (deposits, payments, etc.)
- ✅ Address truncation and display
- ✅ Refresh functionality for real-time data

### Planned Features:

- 🔄 Sign Bitcoin transactions
- 🔄 Sign messages for authentication (SIWB - Sign In With Bitcoin)
- 🔄 Send Bitcoin transactions directly from wallet
- 🔄 Lightning Network integration
- 🔄 Bridge Bitcoin to L2s and earn yield
- 🔄 Ordinals and Runes support

## API Reference

### useBitcoinWallet Hook

```typescript
import { useBitcoinWallet } from "@/services/BitcoinWalletProvider";

function MyComponent() {
  const { openModal, closeModal, disconnect } = useBitcoinWallet();

  return <button onClick={openModal}>Connect Bitcoin Wallet</button>;
}
```

### Methods:

- `openModal()` - Opens the wallet connection modal
- `closeModal()` - Closes the modal
- `disconnect()` - Disconnects the current wallet

### Store Actions

```typescript
import useAppStore from "@/store/useAppStore";

const {
  loginWithBitcoinWallet,
  fetchBitcoinWalletData,
  user,
  balance,
  transactions,
} = useAppStore();

// Called automatically when wallet connects
loginWithBitcoinWallet({
  address: "bc1q...",
  walletType: "xverse",
});

// Manually refresh Bitcoin wallet data
await fetchBitcoinWalletData();
```

### Xverse API Service

The app uses the [Xverse API](https://docs.xverse.app/api) to fetch real Bitcoin data:

```typescript
import * as xverseApi from "@/services/xverseApiService";

// Get address balance (in satoshis)
const balance = await xverseApi.getAddressBalance("bc1q...");

// Get transaction history
const activity = await xverseApi.getAddressActivity("bc1q...", 20, 0);

// Get current Bitcoin price
const btcPrice = await xverseApi.getBitcoinPrice();

// Utility functions
const btc = xverseApi.satoshisToBTC(100000000); // 1.0 BTC
const sats = xverseApi.btcToSatoshis(0.5); // 50000000 sats
```

## Troubleshooting

### Modal doesn't open

- Ensure you have a valid Project ID in `.env.local`
- Check browser console for errors
- Verify all packages are installed correctly

### Wallet not connecting

- Ensure the wallet extension is installed
- Check that the wallet is unlocked
- Try refreshing the page and reconnecting

### TypeScript errors

- Run `npm install` to ensure all dependencies are installed
- Check that `@reown/appkit` and `@reown/appkit-adapter-bitcoin` are installed

## Resources

- [Reown AppKit Documentation](https://docs.reown.com/appkit/react/core/installation)
- [Reown Dashboard](https://dashboard.reown.com)
- [Xverse Wallet](https://www.xverse.app/)
- [Bitcoin Developer Documentation](https://developer.bitcoin.org/)

## Support

If you encounter any issues, please:

1. Check the browser console for errors
2. Verify your Reown Project ID is correct
3. Ensure wallet extensions are installed and unlocked
4. Check that you're using a supported network (mainnet/testnet)
