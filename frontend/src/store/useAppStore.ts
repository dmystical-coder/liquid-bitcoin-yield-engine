import { create } from 'zustand';
import * as api from '../services/apiService';
import type { Transaction } from '../services/apiService';
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from '../services/firebase';
import { passkeyLogin } from '@/services/passkeyService';
import { connectBrowserWallet, provisionManagedAccount } from '@/services/starknetService';
import { demoService, type DashboardData, type Transaction as DemoTransaction, type YieldStrategy } from '../services/demoService';
import * as xverseApi from '../services/xverseApiService';

interface User {
    isAuthenticated: boolean;
    address: string | null;
    authMethod: 'social' | 'passkey' | 'xverse' | null;
    walletType?: 'managed' | 'xverse' | 'unisat';
    id?: string;
}

interface Balance {
    btc: number;
    usd: number;
}

interface YieldInfo {
    apy: number;
    currentStrategy: 'Standard' | 'Turbo' | 'Maxi';
}

interface AppState {
    // User State
    user: User;

    // Financial State
    balance: Balance;
    yieldInfo: YieldInfo;
    transactions: Transaction[];
    depositAddress: string | null;
    xverseBalance: number | null;

    // Demo Data
    dashboardData: DashboardData | null;
    availableStrategies: YieldStrategy[];
    recentDemoTransactions: DemoTransaction[];

    // UI State
    activeTab: string;
    isPayModalOpen: boolean;
    isAddFundsModalOpen: boolean;
    isMoreScreenOpen: boolean;
    isYieldStrategiesModalOpen: boolean;
    isLinkWalletModalOpen: boolean;

    // Loading States
    isLoading: boolean;

    // Actions
    login: (method: 'social' | 'passkey' | 'xverse', credentials?: any) => Promise<void>;
    loginWithBitcoinWallet: (walletInfo: { address: string; walletType: string }) => Promise<void>;
    linkWebWallet: () => Promise<void>;
    logout: () => void;
    fetchDashboardData: () => Promise<void>;
    fetchBitcoinWalletData: () => Promise<void>;
    initiatePayment: (invoice: string) => Promise<void>;
    updateStrategy: (strategy: 'Standard' | 'Turbo' | 'Maxi') => Promise<void>;
    fetchDepositAddress: () => Promise<void>;
    fetchXverseBalance: () => Promise<void>;

    // Demo Actions
    fetchDemoData: () => void;
    depositToYieldStrategy: (strategyId: string, amount: string) => Promise<void>;
    withdrawFromYieldStrategy: (strategyId: string, amount: string) => Promise<void>;
    makeLightningPayment: (amount: string, description: string) => Promise<void>;
    bridgeBitcoin: (amount: string) => Promise<void>;
    claimYieldRewards: (protocol: string) => Promise<void>;

    // UI Actions
    setActiveTab: (tab: string) => void;
    setPayModalOpen: (isOpen: boolean) => void;
    setAddFundsModalOpen: (isOpen: boolean) => void;
    setMoreScreenOpen: (isOpen: boolean) => void;
    setYieldStrategiesModalOpen: (isOpen: boolean) => void;
    setLinkWalletModalOpen: (isOpen: boolean) => void;
}

const useAppStore = create<AppState>((set, get) => ({
    // Initial State
    user: {
        isAuthenticated: false,
        address: null,
        authMethod: null,
    },

    balance: {
        btc: 0,
        usd: 0,
    },

    yieldInfo: {
        apy: 0,
        currentStrategy: 'Standard',
    },

    transactions: [],
    depositAddress: null,
    xverseBalance: null,

    // Demo Data
    dashboardData: null,
    availableStrategies: [],
    recentDemoTransactions: [],

    activeTab: 'Home',
    isPayModalOpen: false,
    isAddFundsModalOpen: false,
    isMoreScreenOpen: false,
    isYieldStrategiesModalOpen: false,
    isLinkWalletModalOpen: false,

    isLoading: false,

    // Actions
    login: async (method, credentials) => {
        set({ isLoading: true });
        try {
            if (method === 'social') {
                // OAuth via Firebase
                const result = await signInWithPopup(auth, googleProvider);
                const idToken = await result.user.getIdToken();
                // Verify session on backend
                await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ method: 'social', idToken }) });
                // Prefer a browser wallet (ArgentX/Braavos); fallback to managed AA
                const browser = await connectBrowserWallet();
                const linked = browser || await provisionManagedAccount(idToken);
                set({
                    user: {
                        isAuthenticated: true,
                        address: linked.address,
                        authMethod: method,
                        walletType: linked.walletType ?? 'managed',
                        id: result.user.uid,
                    },
                });
            } else if (method === 'passkey') {
                // WebAuthn passkey login/registration
                const session = await passkeyLogin();
                const browser = await connectBrowserWallet();
                const linked = browser || await provisionManagedAccount(session.session);
                set({
                    user: {
                        isAuthenticated: true,
                        address: linked.address,
                        authMethod: method,
                        walletType: linked.walletType ?? 'managed',
                        id: session.uid,
                    },
                });
            } else {
                // xverse or other fallbacks
                const response = await api.login(method, credentials);
                set({
                    user: {
                        isAuthenticated: true,
                        address: response.user.address,
                        authMethod: method,
                        walletType: undefined,
                        id: response.user.id,
                    },
                });
            }

            // Fetch initial data after login
            get().fetchDashboardData();
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    loginWithBitcoinWallet: async (walletInfo) => {
        set({
            user: {
                isAuthenticated: true,
                address: walletInfo.address,
                authMethod: 'xverse',
                walletType: walletInfo.walletType as 'managed' | 'xverse' | 'unisat',
                id: walletInfo.address, // Use address as ID for now
            },
        });

        // Fetch real Bitcoin wallet data
        await get().fetchBitcoinWalletData();
    },

    linkWebWallet: async () => {
        try {
            const linked = await (await import('@/services/starknetService')).connectWebWallet();
            if (linked) {
                set({ user: { ...get().user, address: linked.address, walletType: linked.walletType }, isLinkWalletModalOpen: false });
            }
        } catch (e) {
            console.error('Link wallet failed:', e);
        }
    },

    logout: () => {
        set({
            user: {
                isAuthenticated: false,
                address: null,
                authMethod: null,
            },
            balance: { btc: 0, usd: 0 },
            yieldInfo: { apy: 0, currentStrategy: 'Standard' },
            transactions: [],
            depositAddress: null,
            xverseBalance: null,
        });
    },

    fetchDashboardData: async () => {
        const userId = get().user.id;
        const authMethod = get().user.authMethod;

        if (!userId) return;

        // If Bitcoin wallet, fetch real data from Xverse API
        if (authMethod === 'xverse') {
            await get().fetchBitcoinWalletData();
            return;
        }

        try {
            const [balanceData, transactionsData] = await Promise.all([
                api.getBalance(userId),
                api.getTransactions(userId),
            ]);

            set({
                balance: {
                    btc: balanceData.btc,
                    usd: balanceData.usd,
                },
                yieldInfo: {
                    apy: balanceData.apy,
                    currentStrategy: get().yieldInfo.currentStrategy,
                },
                transactions: transactionsData,
            });

            // Also fetch demo data for enhanced experience
            get().fetchDemoData();
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            // Fallback to demo data only
            get().fetchDemoData();
        }
    },

    fetchBitcoinWalletData: async () => {
        const address = get().user.address;
        if (!address) return;

        set({ isLoading: true });

        try {
            // Fetch balance and transactions from Xverse API
            const [balanceData, activityData, btcPrice] = await Promise.all([
                xverseApi.getAddressBalance(address),
                xverseApi.getAddressActivity(address, 20, 0),
                xverseApi.getBitcoinPrice(),
            ]);

            // Convert satoshis to BTC
            const btcBalance = xverseApi.satoshisToBTC(balanceData.confirmed_balance);
            const usdBalance = btcBalance * btcPrice;

            // Parse transactions
            const transactions: Transaction[] = activityData.results.map(tx => {
                const parsed = xverseApi.parseTransaction(tx, address);
                return {
                    type: parsed.type,
                    amountBtc: parsed.amountBtc,
                    date: parsed.date,
                    status: parsed.status,
                };
            });

            set({
                balance: {
                    btc: btcBalance,
                    usd: usdBalance,
                },
                yieldInfo: {
                    apy: 0, // No yield for pure Bitcoin wallet yet
                    currentStrategy: 'Standard',
                },
                transactions,
                isLoading: false,
            });

            // Also fetch demo data for enhanced experience (yield strategies, etc.)
            get().fetchDemoData();
        } catch (error) {
            console.error('Failed to fetch Bitcoin wallet data:', error);
            set({ isLoading: false });
            // Fallback to demo data
            get().fetchDemoData();
        }
    },

    initiatePayment: async (invoice) => {
        set({ isLoading: true });
        try {
            await api.payLightningInvoice(invoice);
            // Refresh balance and transactions after payment
            get().fetchDashboardData();
            set({ isPayModalOpen: false });
        } catch (error) {
            console.error('Payment failed:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    updateStrategy: async (strategy) => {
        const userId = get().user.id;
        if (!userId) return;

        set({ isLoading: true });
        try {
            await api.updateYieldStrategy(userId, strategy);
            set({
                yieldInfo: {
                    ...get().yieldInfo,
                    currentStrategy: strategy,
                },
                isYieldStrategiesModalOpen: false,
            });
        } catch (error) {
            console.error('Failed to update strategy:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    fetchDepositAddress: async () => {
        const userId = get().user.id;
        if (!userId) return;

        try {
            const address = await api.getDepositAddress(userId);
            set({ depositAddress: address });
        } catch (error) {
            console.error('Failed to fetch deposit address:', error);
        }
    },

    fetchXverseBalance: async () => {
        try {
            const balance = await api.getXverseBalance();
            set({ xverseBalance: balance });
        } catch (error) {
            console.error('Failed to fetch Xverse balance:', error);
        }
    },

    // Demo Actions
    fetchDemoData: () => {
        const data = demoService.getDashboardData();
        const strategies = demoService.getYieldStrategies();
        set({
            dashboardData: data,
            availableStrategies: strategies,
            recentDemoTransactions: data.recentTransactions
        });
    },

    depositToYieldStrategy: async (strategyId: string, amount: string) => {
        set({ isLoading: true });
        try {
            const transaction = await demoService.depositToStrategy(strategyId, amount);
            const currentTransactions = get().recentDemoTransactions;
            set({
                recentDemoTransactions: [transaction, ...currentTransactions],
                isLoading: false
            });

            // Refresh dashboard data after deposit
            setTimeout(() => get().fetchDemoData(), 3500); // After confirmation
        } catch (error) {
            console.error('Deposit failed:', error);
            set({ isLoading: false });
        }
    },

    withdrawFromYieldStrategy: async (strategyId: string, amount: string) => {
        set({ isLoading: true });
        try {
            const transaction = await demoService.withdrawFromStrategy(strategyId, amount);
            const currentTransactions = get().recentDemoTransactions;
            set({
                recentDemoTransactions: [transaction, ...currentTransactions],
                isLoading: false
            });

            // Refresh dashboard data after withdrawal
            setTimeout(() => get().fetchDemoData(), 4500);
        } catch (error) {
            console.error('Withdrawal failed:', error);
            set({ isLoading: false });
        }
    },

    makeLightningPayment: async (amount: string, description: string) => {
        set({ isLoading: true });
        try {
            const transaction = await demoService.makeLightningPayment(amount, description);
            const currentTransactions = get().recentDemoTransactions;
            set({
                recentDemoTransactions: [transaction, ...currentTransactions],
                isLoading: false
            });

            // Update balances after payment
            setTimeout(() => get().fetchDemoData(), 1500);
        } catch (error) {
            console.error('Lightning payment failed:', error);
            set({ isLoading: false });
        }
    },

    bridgeBitcoin: async (amount: string) => {
        set({ isLoading: true });
        try {
            const depositAddress = 'bc1q' + Math.random().toString(36).substr(2, 56);
            const transaction = await demoService.bridgeBTC(amount, depositAddress);
            const currentTransactions = get().recentDemoTransactions;
            set({
                recentDemoTransactions: [transaction, ...currentTransactions],
                depositAddress,
                isLoading: false
            });

            // Update balances after bridge completion
            setTimeout(() => get().fetchDemoData(), 11000);
        } catch (error) {
            console.error('Bridge failed:', error);
            set({ isLoading: false });
        }
    },

    claimYieldRewards: async (protocol: string) => {
        set({ isLoading: true });
        try {
            const transaction = await demoService.claimRewards(protocol);
            const currentTransactions = get().recentDemoTransactions;
            set({
                recentDemoTransactions: [transaction, ...currentTransactions],
                isLoading: false
            });

            // Refresh data after claim
            setTimeout(() => get().fetchDemoData(), 2500);
        } catch (error) {
            console.error('Claim failed:', error);
            set({ isLoading: false });
        }
    },

    // UI Actions
    setActiveTab: (tab) => set({ activeTab: tab }),
    setPayModalOpen: (isOpen) => set({ isPayModalOpen: isOpen }),
    setAddFundsModalOpen: (isOpen) => set({ isAddFundsModalOpen: isOpen }),
    setMoreScreenOpen: (isOpen) => set({ isMoreScreenOpen: isOpen }),
    setYieldStrategiesModalOpen: (isOpen) => set({ isYieldStrategiesModalOpen: isOpen }),
    setLinkWalletModalOpen: (isOpen) => set({ isLinkWalletModalOpen: isOpen }),
}));

export default useAppStore;

