# Quick Start Guide

Get up and running with Liquid BTC in under 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Installation

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

   This will install all required packages including:

   - React 19
   - Vite
   - Tailwind CSS v4
   - Zustand (state management)
   - Framer Motion (animations)
   - Lucide React (icons)
   - QRCode.react (QR generation)
   - And more...

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**

   Visit `http://localhost:5173` (or the port shown in your terminal)

## First Steps

### 1. Onboarding Screen

When you first open the app, you'll see the onboarding screen with login options:

- Continue with Google
- Continue with Apple
- Continue with Passkey
- Connect Bitcoin Wallet

Click any of these to simulate logging in (mock authentication).

### 2. Dashboard

After "logging in," you'll see:

- Your BTC balance (mock data: ~1.05 BTC)
- USD equivalent
- Current APY
- Recent transaction history
- Bottom navigation bar

### 3. Try the Features

#### Pay with Lightning

1. Click the "Pay" button in the bottom nav
2. A modal opens with QR scanner placeholder
3. You can paste a Lightning invoice
4. Click "Pay Invoice" to simulate a payment

#### Add Funds

1. Click the "Add" button in the bottom nav
2. See a QR code for deposits
3. Copy the Bitcoin address
4. (In production, send BTC to this address)

#### Change Yield Strategy

1. Click "More" in the bottom nav
2. Click "Yield Strategies"
3. Choose from:
   - **Standard**: 4-6% APY (low risk)
   - **Turbo**: 8-12% APY (balanced)
   - **Maxi**: 15-25% APY (high risk)
4. Confirm your selection

## Project Structure

```
src/
├── components/     → Reusable UI components
├── screens/        → Main app screens
├── modals/         → Modal dialogs
├── store/          → Zustand state management
├── services/       → API service (currently mocked)
├── types/          → TypeScript definitions
└── lib/            → Utility functions
```

## Mock Data vs Real Data

Currently, the app uses **mock data** for development:

- **Balance**: 1.05432 BTC
- **Transactions**: 5 sample transactions
- **APY**: 6.5%
- **Deposit Address**: bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh

To connect to a real backend:

1. Update `src/services/apiService.ts`
2. Replace mock functions with real API calls
3. Configure your backend URL
4. Update authentication flow

## Common Commands

```bash
# Development
npm run dev          # Start dev server with hot reload

# Building
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
```

## Customization

### Change Colors

Edit `src/index.css`:

```css
--color-bg-primary: rgb(10, 10, 15);
--color-action-primary: rgb(0, 122, 255);
/* ... more colors */
```

### Modify Mock Data

Edit `src/services/apiService.ts`:

```typescript
export const getBalance = async (userId: string) => {
  return {
    btc: 1.05432, // ← Change this
    usd: 63259.2, // ← And this
    apy: 6.5, // ← And this
  };
};
```

### Add New Components

1. Create file in `src/components/`
2. Follow the design system (see README.md)
3. Use Framer Motion for animations
4. Import and use in your screens

## Design System Quick Reference

### Colors (CSS classes)

- `.bg-primary` - Background (dark)
- `.bg-surface` - Cards/modals
- `.text-primary` - Main text
- `.text-secondary` - Muted text
- `.text-action` - Blue (links, buttons)
- `.text-success` - Green
- `.text-error` - Red

### Typography (CSS classes)

- `.display-large` - 48px (balances)
- `.display-small` - 24px (USD amounts)
- `.heading-1` - 28px (titles)
- `.body-primary` - 16px (main text)
- `.body-secondary` - 14px (small text)
- `.button-text` - 16px (buttons)

### Spacing

Use Tailwind's spacing with 8px increments:

- `gap-2` = 16px
- `gap-3` = 24px
- `gap-4` = 32px
- `gap-6` = 48px

## Troubleshooting

### Port already in use

```bash
# Kill the process using port 5173
lsof -ti:5173 | xargs kill -9
# Or specify a different port
npm run dev -- --port 3000
```

### Module not found errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors

```bash
# Clear TypeScript cache
rm -rf node_modules/.vite
npm run dev
```

### Styling not working

- Make sure Tailwind CSS is properly configured
- Check that `@import "tailwindcss"` is in `src/index.css`
- Clear browser cache and hard reload

## Next Steps

1. **Explore the Code**: Browse through `src/` to understand the structure
2. **Customize the Design**: Modify colors and styles to match your brand
3. **Add Features**: Build new components and screens
4. **Connect Backend**: Replace mock API with real endpoints
5. **Deploy**: Build and deploy to your favorite hosting platform

## Need Help?

- Check the main [README.md](./README.md) for detailed documentation
- Review component files for usage examples
- Look at the mock API service for data structure examples

## Production Checklist

Before deploying to production:

- [ ] Connect to real backend API
- [ ] Implement actual authentication (OAuth, Passkeys)
- [ ] Add proper error handling
- [ ] Set up analytics
- [ ] Configure environment variables
- [ ] Add loading states
- [ ] Test on mobile devices
- [ ] Optimize images and assets
- [ ] Enable HTTPS
- [ ] Add proper SEO meta tags
- [ ] Set up monitoring/logging
- [ ] Implement rate limiting
- [ ] Add security headers

---

**Happy Building! 🚀**
