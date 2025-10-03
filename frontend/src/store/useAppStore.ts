import { create } from 'zustand';
import * as api from '../services/apiService';
import type { Transaction } from '../services/apiService';

interface User {
    isAuthenticated: boolean;
    address: string | null;
    authMethod: 'social' | 'passkey' | 'xverse' | null;
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

    // UI State
    activeTab: string;
    isPayModalOpen: boolean;
    isAddFundsModalOpen: boolean;
    isMoreScreenOpen: boolean;
    isYieldStrategiesModalOpen: boolean;

    // Loading States
    isLoading: boolean;

    // Actions
    login: (method: 'social' | 'passkey' | 'xverse', credentials?: any) => Promise<void>;
    logout: () => void;
    fetchDashboardData: () => Promise<void>;
    initiatePayment: (invoice: string) => Promise<void>;
    updateStrategy: (strategy: 'Standard' | 'Turbo' | 'Maxi') => Promise<void>;
    fetchDepositAddress: () => Promise<void>;
    fetchXverseBalance: () => Promise<void>;

    // UI Actions
    setActiveTab: (tab: string) => void;
    setPayModalOpen: (isOpen: boolean) => void;
    setAddFundsModalOpen: (isOpen: boolean) => void;
    setMoreScreenOpen: (isOpen: boolean) => void;
    setYieldStrategiesModalOpen: (isOpen: boolean) => void;
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

    activeTab: 'Home',
    isPayModalOpen: false,
    isAddFundsModalOpen: false,
    isMoreScreenOpen: false,
    isYieldStrategiesModalOpen: false,

    isLoading: false,

    // Actions
    login: async (method, credentials) => {
        set({ isLoading: true });
        try {
            const response = await api.login(method, credentials);
            set({
                user: {
                    isAuthenticated: true,
                    address: response.user.address,
                    authMethod: method,
                    id: response.user.id,
                },
            });

            // Fetch initial data after login
            get().fetchDashboardData();
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            set({ isLoading: false });
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
        if (!userId) return;

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
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
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

    // UI Actions
    setActiveTab: (tab) => set({ activeTab: tab }),
    setPayModalOpen: (isOpen) => set({ isPayModalOpen: isOpen }),
    setAddFundsModalOpen: (isOpen) => set({ isAddFundsModalOpen: isOpen }),
    setMoreScreenOpen: (isOpen) => set({ isMoreScreenOpen: isOpen }),
    setYieldStrategiesModalOpen: (isOpen) => set({ isYieldStrategiesModalOpen: isOpen }),
}));

export default useAppStore;

