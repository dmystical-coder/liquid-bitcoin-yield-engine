# Frontend Development Guide: Project "Liquid BTC"

## 1. Core Vision & Product Philosophy

You are building the front-facing interface for a Bitcoin Neobank powered by Starknet DeFi. The application's core mission is to provide a seamless, intuitive, and secure experience for users to earn yield on their Bitcoin and spend it instantly via the Lightning Network.

### Guiding Principles:

- **Abstraction is Key**: The user should never need to understand "Starknet," "bridging," or "gas fees." The app speaks only in terms of BTC, USD, and APY.
- **Progressive Revelation**: The app must be incredibly simple for a novice but offer powerful features for a crypto-native user. We achieve this by presenting a clean, simple default interface and tucking advanced options into a "More" section.
- **Feel of a FinTech App, Not a dApp**: The entire UX/UI, from animations to navigation, should feel like a modern neobank (e.g., Cash App, Revolut), not a typical Web3 dApp. This means fast, fluid, and focused on the user's financial tasks.
- **Security via Simplicity**: The UI must inspire trust. Actions are confirmed with familiar methods (passkeys, wallet signatures), and clarity is prioritized over density of information.

## 2. Design System & Visual Identity

To ensure a "top protocol" feel, a strict and consistent design system must be followed.

### 2.1. Color Palette (Dark Mode First)

- **Background (Primary)**: `rgb(10, 10, 15)` - A very dark, slightly blue-tinted charcoal.
- **Surface (Cards/Modals)**: `rgb(25, 25, 35)` - A slightly lighter charcoal for elevated surfaces.
- **Text (Primary)**: `rgb(245, 245, 255)` - A soft off-white.
- **Text (Secondary)**: `rgb(160, 160, 175)` - A muted grey for sub-headings and less important info.
- **Action/Primary**: `rgb(0, 122, 255)` - A vibrant, clear blue for primary buttons and highlights.
- **Action/Hover**: `rgb(20, 142, 255)` - A slightly lighter blue for hover states.
- **Success**: `rgb(48, 209, 88)` - A bright, clear green.
- **Error**: `rgb(255, 69, 58)` - A strong, clear red.

### 2.2. Typography

**Font**: Use the "Inter" font family, imported from Google Fonts.

- **Display Large (Balance)**: 48px, Semi-Bold
- **Display Small (USD Balance)**: 24px, Regular
- **Heading 1**: 28px, Bold
- **Body (Primary)**: 16px, Regular
- **Body (Secondary/Small)**: 14px, Medium
- **Button Text**: 16px, Semi-Bold

### 2.3. Spacing & Layout

- **Base Unit**: 8px. All margins, paddings, and gaps should be multiples of this unit (e.g., 8px, 16px, 24px, 32px).
- **Layout**: The application will be a single-page application (SPA). The main view will be contained within a centered, mobile-first container with a max-width of 480px. It must be fully responsive.
- **Borders & Radius**: Use a border radius of 16px for all major containers, modals, and cards. Use 12px for buttons and inputs. All borders should be a subtle `1px solid rgb(45, 45, 55)`.

### 2.4. Iconography

Use the `lucide-react` library for all icons. Ensure icons are consistently sized (e.g., 20px) and have a `strokeWidth` of 1.5.

## 3. Tech Stack & Architecture

- **Framework**: React (using Vite for setup).
- **Styling**: Tailwind CSS. Use Shadcn UI library.
- **State Management**: Zustand. It's simple, powerful, and avoids boilerplate.
- **Animations**: Framer Motion. For all transitions and micro-interactions.
- **Routing**: No complex router needed. We will manage views/modals via state.
- **QR Code Scanning**: Use the `react-qr-reader` library.

## 4. Component Library (Atomic Design)

Build these reusable components first. They are the foundation of the application.

### Button.jsx

- **Props**: `variant` ('primary', 'secondary'), `onClick`, `children`, `isLoading` (shows a spinner), `disabled`.
- **Style**: Must match the design system. Apply smooth transitions and a subtle scale effect on hover/press using Framer Motion.

### Input.jsx

- **Props**: `value`, `onChange`, `placeholder`, `label`, `adornment` (e.g., a "MAX" button inside the input).
- **Style**: Clean, with a clear focus state (highlighted border).

### Modal.jsx

- **Props**: `isOpen`, `onClose`, `children`, `title`.
- **Behavior**: Should animate in from the bottom of the screen (slide up) and have a semi-transparent backdrop. Use Framer Motion's AnimatePresence.

### BalanceDisplay.jsx

- **Props**: `btcAmount`, `usdAmount`, `showAPY`, `apy`.
- **Style**: Uses the "Display Large" and "Display Small" typography. The numbers should subtly animate on change.

### TransactionRow.jsx

- **Props**: `type` ('deposit', 'withdrawal', 'payment', 'yield'), `amountBtc`, `date`, `status`.
- **Style**: An icon on the left corresponding to the type, details in the middle, and amount on the right.

### BottomNav.jsx

A fixed component at the bottom of the screen.

- Contains four icon buttons: Home, Pay, Add Funds, More.
- **Props**: `activeTab`, `onTabChange`.

### StrategyCard.jsx

- **Props**: `title`, `apyRange`, `description`, `isActive`, `onSelect`.
- **Style**: A selectable card with a clear visual state for when it's active (e.g., a colored border).

## 5. Screen & View Breakdown

This describes how to assemble the components into the application's views.

### 5.1. OnboardingScreen.jsx

- **State**: This is the default view if `user.isAuthenticated` is false.
- **Layout**: Vertically and horizontally centered content.
- **Components**:
  - App Logo
  - H1: "The Bitcoin Account that Earns and Spends."
  - A div containing three Button components for Google, Apple, and Passkey login.
  - A small text link below: "Or, connect your Bitcoin wallet".

### 5.2. DashboardScreen.jsx

- **State**: The main view when `user.isAuthenticated` is true.
- **Layout**:
  - Top section: BalanceDisplay component.
  - Middle section: "Recent Activity" title followed by a list of TransactionRow components. This list should be scrollable.
  - Bottom: The BottomNav component is fixed to the bottom of the viewport.
- **Logic**: Fetches balance and transaction data from the Zustand store.

### 5.3. PayModal.jsx (View)

- **State**: A full-screen modal triggered when the "Pay" tab in BottomNav is clicked.
- **Layout**:
  - A header with a "Close" button.
  - The `react-qr-reader` component taking up most of the view.
  - An input field below to paste an invoice manually.
- **Logic**: On a successful scan, it should transition to a confirmation view within the modal before executing the payment.

### 5.4. AddFundsModal.jsx (View)

- **State**: A modal triggered when the "Add Funds" tab is clicked.
- **Layout & Logic (Conditional)**:
  - The modal's content depends on `user.authMethod`.
  - If `authMethod` is 'social' or 'passkey':
    - Show a title: "Deposit Bitcoin".
    - Display a large, clear QR code.
    - Display the full BTC address with a "Copy" button.
  - If `authMethod` is 'xverse':
    - Show a title: "Deposit from Xverse".
    - Display the user's connected Xverse BTC balance.
    - Two Button components: [ Deposit via Lightning ⚡️ ] and [ Deposit On-Chain ].

### 5.5. MoreScreen.jsx (View)

- **State**: A view triggered when the "More" tab is clicked.
- **Layout**: A simple menu list.
- **Components**:
  - List items for "Profile", "Security", etc.
  - One key list item: "Yield Strategies".
- **Logic**: Clicking "Yield Strategies" will open the YieldStrategiesModal.

### 5.6. YieldStrategiesModal.jsx (View)

- **State**: A modal opened from the MoreScreen.
- **Layout**:
  - A title: "Select Your Yield Strategy".
  - A vertical stack of three StrategyCard components.
- **Logic**: Manages the selection state and calls the API to update the user's strategy. Requires a final confirmation step.

## 6. State Management (stores/useAppStore.js)

Use Zustand to create a single store for the application's global state.

```javascript
import { create } from 'zustand';

const useAppStore = create((set) => ({
  // 1. User State
  user: {
    isAuthenticated: false,
    address: null,
    authMethod: null, // 'social', 'passkey', 'xverse'
  },

  // 2. Financial State
  balance: {
    btc: 0,
    usd: 0,
  },
  yieldInfo: {
    apy: 0,
    currentStrategy: 'Standard', // 'Standard', 'Turbo', 'Maxi'
  },
  transactions: [], // { type, amountBtc, date, status }

  // 3. UI State
  activeTab: 'Home',
  isPayModalOpen: false,
  isAddFundsModalOpen: false,
  isMoreScreenOpen: false,
  // ... etc for other modals

  // 4. Actions (Async functions that interact with services)
  login: async (method, credentials) => {
    // ... calls apiService.login
    set({ user: { isAuthenticated: true, ... } });
  },
  logout: () => {
    set({ user: { isAuthenticated: false, ... } });
  },
  fetchDashboardData: async () => {
    // ... calls apiService.getBalance and apiService.getTransactions
    // ... updates balance and transactions state
  },
  initiatePayment: async (invoice) => {
    // ... calls apiService.payLightningInvoice
  },
  // ... more actions for changing strategy, etc.
}));

export default useAppStore;
```

## 7. Mock API Service (services/apiService.js)

To enable parallel development, create a mock API service that returns realistic, delayed data. This allows the entire UI to be built and tested without a live backend.

```javascript
// Example mock function
const MOCK_DELAY = 1000;

export const getBalance = async (userId) => {
  await new Promise((res) => setTimeout(res, MOCK_DELAY));
  return {
    btc: 1.05432,
    usd: 63259.2,
    apy: 6.5,
  };
};

export const getTransactions = async (userId) => {
  // ... return a mock array of transactions
};

// ... define all other necessary API functions
```

## Summary

This guide provides a complete blueprint. The AI agent should begin by configuring the Design System, build the atomic components, assemble the screens, and finally wire everything together with the Zustand state management store and mock API service.
