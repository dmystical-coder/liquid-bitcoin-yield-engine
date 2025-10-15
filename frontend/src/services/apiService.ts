// Mock API Service for development
const MOCK_DELAY = 1000;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface Transaction {
    type: 'deposit' | 'withdrawal' | 'payment' | 'yield';
    amountBtc: number;
    date: string;
    status: 'completed' | 'pending' | 'failed';
}

export interface Balance {
    btc: number;
    usd: number;
    apy: number;
}

export interface YieldStrategy {
    name: string;
    apyRange: string;
    description: string;
}

// Mock user authentication
export const login = async (method: string, _credentials?: any): Promise<any> => {
    await delay(MOCK_DELAY);
    return {
        success: true,
        user: {
            id: '1',
            address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
            authMethod: method,
        },
    };
};

// Get user balance
export const getBalance = async (_userId: string): Promise<Balance> => {
    await delay(MOCK_DELAY);
    return {
        btc: 1.05432,
        usd: 63259.2,
        apy: 6.5,
    };
};

// Get user transactions
export const getTransactions = async (_userId: string): Promise<Transaction[]> => {
    await delay(MOCK_DELAY);
    return [
        {
            type: 'yield',
            amountBtc: 0.00234,
            date: 'Today, 2:30 PM',
            status: 'completed',
        },
        {
            type: 'payment',
            amountBtc: -0.00150,
            date: 'Yesterday, 5:15 PM',
            status: 'completed',
        },
        {
            type: 'deposit',
            amountBtc: 0.50000,
            date: 'Oct 1, 10:00 AM',
            status: 'completed',
        },
        {
            type: 'withdrawal',
            amountBtc: -0.25000,
            date: 'Sep 28, 3:45 PM',
            status: 'completed',
        },
        {
            type: 'yield',
            amountBtc: 0.00189,
            date: 'Sep 27, 12:00 PM',
            status: 'completed',
        },
    ];
};

// Pay Lightning invoice
export const payLightningInvoice = async (_invoice: string): Promise<any> => {
    await delay(MOCK_DELAY);
    return {
        success: true,
        txId: 'mock_tx_' + Date.now(),
        amountBtc: 0.001,
    };
};

// Get deposit address
export const getDepositAddress = async (userId: string): Promise<string> => {
    // Ask backend bridge for a BTC deposit address that maps to user Starknet account
    const res = await fetch('/api/bridge/deposit-address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
    });
    if (!res.ok) throw new Error('Failed to fetch deposit address');
    const data = await res.json();
    return data.depositAddress as string;
};

export const getBridgeQuote = async (sats: number): Promise<{ usdcAmount: string; rateUsdPerBtc: number }> => {
    const res = await fetch('/api/bridge/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sats })
    });
    if (!res.ok) throw new Error('Failed to fetch bridge quote');
    return res.json();
};

// Get available yield strategies
export const getYieldStrategies = async (): Promise<YieldStrategy[]> => {
    await delay(MOCK_DELAY);
    return [
        {
            name: 'Standard',
            apyRange: '4-6% APY',
            description: 'Low risk, steady returns. Your BTC is deployed to the safest DeFi protocols.',
        },
        {
            name: 'Turbo',
            apyRange: '8-12% APY',
            description: 'Balanced risk and reward. Mix of established and emerging protocols.',
        },
        {
            name: 'Maxi',
            apyRange: '15-25% APY',
            description: 'Higher risk, maximum yield. For experienced users who understand DeFi risks.',
        },
    ];
};

// Update yield strategy
export const updateYieldStrategy = async (_userId: string, strategy: string): Promise<any> => {
    await delay(MOCK_DELAY);
    return {
        success: true,
        strategy,
    };
};

// Get user's Xverse balance (if connected)
export const getXverseBalance = async (): Promise<number> => {
    await delay(MOCK_DELAY);
    return 0.5432;
};

// Deposit from Xverse
export const depositFromXverse = async (amount: number, _method: 'lightning' | 'onchain'): Promise<any> => {
    await delay(MOCK_DELAY);
    return {
        success: true,
        txId: 'mock_deposit_' + Date.now(),
        amount,
    };
};

