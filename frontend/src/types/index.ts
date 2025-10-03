// Type definitions for the application

export type AuthMethod = 'social' | 'passkey' | 'xverse';

export type TransactionType = 'deposit' | 'withdrawal' | 'payment' | 'yield';

export type TransactionStatus = 'completed' | 'pending' | 'failed';

export type YieldStrategyName = 'Standard' | 'Turbo' | 'Maxi';

export interface User {
    isAuthenticated: boolean;
    address: string | null;
    authMethod: AuthMethod | null;
    id?: string;
}

export interface Balance {
    btc: number;
    usd: number;
}

export interface YieldInfo {
    apy: number;
    currentStrategy: YieldStrategyName;
}

export interface Transaction {
    type: TransactionType;
    amountBtc: number;
    date: string;
    status: TransactionStatus;
}

export interface YieldStrategy {
    name: YieldStrategyName;
    apyRange: string;
    description: string;
}

export interface LoginResponse {
    success: boolean;
    user: {
        id: string;
        address: string;
        authMethod: AuthMethod;
    };
}

export interface PaymentResponse {
    success: boolean;
    txId: string;
    amountBtc: number;
}

export interface DepositResponse {
    success: boolean;
    txId: string;
    amount: number;
}

