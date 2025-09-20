# Liquid Bitcoin Yield Engine

**Built for the Starknet Resolve Hackathon.**

**Tracks:** Bitcoin Unleashed, Mobile-First dApps, Next-Gen Payments

A mobile-first dApp that brings one-click DeFi yield to native Bitcoin, powered by Starknet's Account Abstraction and the Lightning Network.

## The Problem

The vast majority of Bitcoin sits idle, locked out of the productive DeFi ecosystem. Moving BTC to a yield-bearing protocol is a high-friction process involving:

- Multiple swaps and bridges
- Managing complex seed phrases for different chains
- Paying for gas with non-native tokens (like ETH or STRK)
- A significant cognitive load that alienates non-crypto-native users

## The Solution

The Liquid Bitcoin Yield Engine is a "one-click" shuttle that abstracts away all the complexity. We provide a Bitcoin-native interface where users can deposit BTC (from L1 or Lightning) and immediately start earning yield from top-tier Starknet protocols. When they need liquidity, they can withdraw instantly back to the Lightning Network.

**No seed phrases. No gas fees. No network switching. Just Bitcoin in, and higher-value Bitcoin out.**

## Key Features

- **Bitcoin-Native Experience:** The entire UI is focused on BTC. Users see their balance and APY in BTC terms, with all Starknet complexity hidden.
- **Seedless Onboarding:** Utilizes WebAuthn (passkeys) and social logins to create a secure Starknet smart account (AA) behind the scenes.
- **Truly Gasless Transactions:** Gas fees are sponsored via an AVNU paymaster, paid for by a tiny, automatically-reserved portion of the user's deposit converted to USDC.
- **Instant Liquidity:** Combines deep DeFi yield on Starknet with instant withdrawal capabilities through the Atomiq SDK's direct Lightning integration.
- **Automated Strategy:** Smart contracts automatically route user funds to trusted, high-yield protocols like Vesu and Troves.

## System Architecture

The system is a monorepo containing three core components:

- **React Native Mobile App:** The user-facing application for onboarding, deposits, and withdrawals.
- **Node.js Backend:** An orchestration layer that manages user sessions, interacts with the Atomiq SDK, and calls the on-chain contracts.
- **Cairo Smart Contracts:** The on-chain logic (BitcoinDAppProxy) that manages user funds and routes them to yield protocols.

For a detailed breakdown, please see the Technical Specification Document.

## Tech Stack

- **Mobile:** React Native, TypeScript, Zustand
- **Backend:** Node.js, Express, TypeScript
- **Smart Contracts:** Cairo, Scarb, Starknet Foundry
- **Cross-Chain:** Atomiq SDK
- **Account Abstraction:** Starknet.js, WebAuthn
- **Gas Abstraction:** AVNU Paymaster
- **Yield Sources:** Vesu Protocol, Troves

## 🏁 Getting Started: Local Setup

Follow these steps to get the project running locally.

### Prerequisites

- Node.js (v18 or higher)
- Git
- React Native Environment Setup
- Starknet Foundry & Scarb

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd liquid-bitcoin-yield-engine
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory. An example is provided.

```bash
cp .env.example .env
```

Now, open the `.env` file and fill in the required API keys and node provider URLs.

### 3. Install Dependencies

You'll need to install dependencies for both the backend and the mobile app.

```bash
# Install backend dependencies
cd backend
npm install

# Install mobile dependencies
cd ../mobile
npm install
```

### 4. Run the Application

**Compile Contracts:**

```bash
cd contracts
scarb build
```

**Start the Backend Server:**

```bash
cd ../backend
npm run dev
```

**Launch the Mobile App:**

```bash
cd ../mobile
npm run android  # or npm run ios
```

## 📂 Project Structure

```
.
├── contracts/      # Cairo smart contracts managed by Scarb
├── backend/        # Node.js orchestration server
├── mobile/         # React Native mobile application
├── .gitignore      # Git ignore configuration
└── README.md       # You are here!
```
