# Liquid BTC - Bitcoin Neobank Frontend

A modern, beautiful Bitcoin neobank interface that allows users to earn yield on their Bitcoin and spend it instantly via the Lightning Network.

## 🌟 Features

- **Modern UI/UX**: Sleek, dark-mode-first design inspired by leading fintech apps
- **Multiple Authentication Methods**: Social login, Passkeys, and Bitcoin wallet connection
- **Real-time Balance Display**: See your BTC balance and USD equivalent with live APY
- **Lightning Payments**: Scan QR codes or paste invoices to pay instantly
- **Flexible Deposit Options**: Receive Bitcoin via QR code or connect Xverse wallet
- **Yield Strategies**: Choose from Standard, Turbo, or Maxi yield strategies
- **Transaction History**: Track all deposits, withdrawals, payments, and yield earnings
- **Smooth Animations**: Powered by Framer Motion for delightful interactions

## 🚀 Tech Stack

- **React 19** with TypeScript
- **Vite** for lightning-fast development
- **Tailwind CSS v4** for styling
- **Zustand** for state management
- **Framer Motion** for animations
- **Lucide React** for icons
- **QRCode.react** for QR code generation
- **React QR Reader** for QR code scanning

## 📦 Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview production build:

```bash
npm run preview
```

## 🎨 Design System

The application follows a strict design system:

### Colors (Dark Mode)

- **Background Primary**: `rgb(10, 10, 15)` - Deep charcoal
- **Surface**: `rgb(25, 25, 35)` - Elevated surface
- **Text Primary**: `rgb(245, 245, 255)` - Soft white
- **Text Secondary**: `rgb(160, 160, 175)` - Muted grey
- **Action/Primary**: `rgb(0, 122, 255)` - Vibrant blue
- **Success**: `rgb(48, 209, 88)` - Bright green
- **Error**: `rgb(255, 69, 58)` - Clear red

### Typography

- **Font Family**: Inter (via Google Fonts)
- **Display Large**: 48px, Semi-Bold (balance display)
- **Display Small**: 24px, Regular (USD balance)
- **Heading 1**: 28px, Bold
- **Body Primary**: 16px, Regular
- **Body Secondary**: 14px, Medium
- **Button Text**: 16px, Semi-Bold

### Spacing

- Base unit: 8px
- All spacing follows 8px increments (8, 16, 24, 32, 48px)

### Borders & Radius

- Major containers: 16px border radius
- Buttons & inputs: 12px border radius
- Borders: 1px solid `rgb(45, 45, 55)`

## 📁 Project Structure

```
src/
├── components/          # Reusable atomic components
│   ├── BalanceDisplay.tsx
│   ├── BottomNav.tsx
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── StrategyCard.tsx
│   └── TransactionRow.tsx
├── screens/            # Main screen components
│   ├── DashboardScreen.tsx
│   ├── MoreScreen.tsx
│   └── OnboardingScreen.tsx
├── modals/             # Modal components
│   ├── AddFundsModal.tsx
│   ├── PayModal.tsx
│   └── YieldStrategiesModal.tsx
├── store/              # State management
│   └── useAppStore.ts
├── services/           # API services
│   └── apiService.ts
├── lib/                # Utilities
│   └── utils.ts
├── App.tsx             # Main app component
└── index.css           # Global styles
```

## 🔧 Key Components

### Atomic Components

#### Button

```tsx
<Button variant="primary" onClick={handleClick} isLoading={loading}>
  Click Me
</Button>
```

#### Input

```tsx
<Input
  value={value}
  onChange={setValue}
  placeholder="Enter amount"
  label="Amount (BTC)"
/>
```

#### Modal

```tsx
<Modal isOpen={isOpen} onClose={onClose} title="Modal Title">
  <p>Modal content goes here</p>
</Modal>
```

### Screens

- **OnboardingScreen**: Login/signup with multiple auth methods
- **DashboardScreen**: Main view with balance and transactions
- **MoreScreen**: Settings and additional options

### Modals

- **PayModal**: Lightning payment interface with QR scanner
- **AddFundsModal**: Deposit Bitcoin via QR or Xverse
- **YieldStrategiesModal**: Choose yield strategy (Standard/Turbo/Maxi)

## 🔄 State Management

The app uses Zustand for simple, powerful state management:

```typescript
const useAppStore = create((set) => ({
  // User state
  user: { isAuthenticated: false, address: null, authMethod: null },

  // Financial state
  balance: { btc: 0, usd: 0 },
  yieldInfo: { apy: 0, currentStrategy: "Standard" },
  transactions: [],

  // UI state
  activeTab: "Home",
  isPayModalOpen: false,
  // ... more state

  // Actions
  login: async (method, credentials) => {
    /* ... */
  },
  fetchDashboardData: async () => {
    /* ... */
  },
  // ... more actions
}));
```

## 🎭 Mock API

The app includes a fully functional mock API service for development:

- Simulates network delays (1 second)
- Returns realistic mock data
- Supports all CRUD operations
- Easy to swap with real API

## 🚧 Future Enhancements

- [ ] Real backend integration
- [ ] Actual QR code scanning implementation
- [ ] Bitcoin wallet integrations (Xverse, Leather, etc.)
- [ ] Push notifications for transactions
- [ ] Multi-language support
- [ ] Light mode theme
- [ ] Advanced analytics dashboard
- [ ] Recurring payment setup
- [ ] Export transaction history

## 📱 Responsive Design

The application is fully responsive with a mobile-first approach:

- Max width: 480px (centered on larger screens)
- Touch-friendly tap targets
- Optimized for iOS and Android
- Progressive Web App ready

## 🔐 Security Considerations

- Never stores private keys
- Uses secure authentication methods (Passkeys, OAuth)
- All API calls should use HTTPS in production
- Implements proper session management
- Rate limiting on sensitive operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is part of the Liquid Bitcoin Yield Engine initiative.

## 🙏 Acknowledgments

Built with inspiration from leading fintech and neobank apps:

- Cash App
- Revolut
- Strike
- River Financial

---

**Note**: This is a frontend-only implementation with mock data. Backend integration is required for production use.
