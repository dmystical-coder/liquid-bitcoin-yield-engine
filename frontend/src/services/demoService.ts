// Demo Service for Comprehensive DeFi Protocol Simulation
// Simulates realistic interactions with Vesu, Nostra, Ekubo, and other Starknet protocols

export interface YieldStrategy {
    id: string;
    name: string;
    protocol: string;
    apy: number;
    tvl: string;
    riskLevel: 'low' | 'medium' | 'high';
    description: string;
    minimumDeposit: number; // in USDC
    lockPeriod?: string;
    rewards?: string[];
}

export interface Transaction {
    id: string;
    type: 'deposit' | 'withdraw' | 'yield_claim' | 'lightning_payment' | 'bridge' | 'swap';
    amount: string;
    token: string;
    protocol?: string;
    status: 'pending' | 'confirmed' | 'failed';
    timestamp: number;
    txHash?: string;
    blockNumber?: number;
    gasUsed?: string;
    description: string;
    metadata?: Record<string, any>;
}

export interface ProtocolPosition {
    protocol: string;
    strategy: string;
    deposited: string; // USDC amount
    earned: string; // Yield earned
    apy: number;
    lastUpdate: number;
}

export interface DashboardData {
    totalBalance: string; // Total portfolio value in USDC
    btcBalance: string; // BTC balance
    usdcBalance: string; // Available USDC
    totalYieldEarned: string; // Total yield earned
    positions: ProtocolPosition[];
    recentTransactions: Transaction[];
    yieldStrategies: YieldStrategy[];
}

class DemoService {
    private positions: ProtocolPosition[] = [];
    private transactions: Transaction[] = [];

    // Realistic yield strategies based on actual Starknet DeFi protocols
    private yieldStrategies: YieldStrategy[] = [
        {
            id: 'vesu-usdc-lending',
            name: 'USDC Lending',
            protocol: 'Vesu',
            apy: 8.5,
            tvl: '$12.3M',
            riskLevel: 'low',
            description: 'Lend USDC to earn stable yield from borrowers on Vesu protocol',
            minimumDeposit: 10,
            rewards: ['VESU tokens', 'Protocol fees']
        },
        {
            id: 'nostra-stable-farm',
            name: 'Stable LP Farming',
            protocol: 'Nostra',
            apy: 12.8,
            tvl: '$8.7M',
            riskLevel: 'medium',
            description: 'Provide liquidity to USDC/USDT pool and farm NSTR rewards',
            minimumDeposit: 50,
            lockPeriod: '7 days',
            rewards: ['NSTR tokens', 'Trading fees']
        },
        {
            id: 'ekubo-concentrated',
            name: 'Concentrated Liquidity',
            protocol: 'Ekubo',
            apy: 15.2,
            tvl: '$5.2M',
            riskLevel: 'high',
            description: 'Active liquidity management in USDC/ETH concentrated range',
            minimumDeposit: 100,
            rewards: ['Trading fees', 'EKU rewards']
        },
        {
            id: 'zklend-supply',
            name: 'Supply & Borrow',
            protocol: 'zkLend',
            apy: 6.3,
            tvl: '$18.5M',
            riskLevel: 'low',
            description: 'Supply USDC and borrow against it for leveraged strategies',
            minimumDeposit: 25,
            rewards: ['ZEND tokens']
        },
        {
            id: 'myswap-autocompound',
            name: 'Auto-compound LP',
            protocol: 'MySwap',
            apy: 11.4,
            tvl: '$3.8M',
            riskLevel: 'medium',
            description: 'Auto-compounding USDC/STRK liquidity pool position',
            minimumDeposit: 75,
            rewards: ['MYSWAP tokens', 'Compounded fees']
        }
    ];

    constructor() {
        this.initializeDemoData();
    }

    private initializeDemoData() {
        // Create some initial positions for demo
        this.positions = [
            {
                protocol: 'Vesu',
                strategy: 'USDC Lending',
                deposited: '2500.00',
                earned: '34.22',
                apy: 8.5,
                lastUpdate: Date.now() - 86400000 * 3 // 3 days ago
            },
            {
                protocol: 'Nostra',
                strategy: 'Stable LP Farming',
                deposited: '1200.00',
                earned: '18.95',
                apy: 12.8,
                lastUpdate: Date.now() - 86400000 * 1 // 1 day ago
            }
        ];

        // Create realistic transaction history
        this.transactions = [
            {
                id: 'tx_001',
                type: 'bridge',
                amount: '0.05834',
                token: 'BTC',
                status: 'confirmed',
                timestamp: Date.now() - 86400000 * 5,
                txHash: '0x1a2b3c4d5e6f789abcdef123456789',
                blockNumber: 123456,
                gasUsed: '0.0023',
                description: 'Bridge BTC to Starknet via Atomiq',
                metadata: { fromAddress: 'bc1q...xyz', toAddress: '0x...abc', usdcReceived: '3800.00' }
            },
            {
                id: 'tx_002',
                type: 'deposit',
                amount: '2500.00',
                token: 'USDC',
                protocol: 'Vesu',
                status: 'confirmed',
                timestamp: Date.now() - 86400000 * 4,
                txHash: '0x2b3c4d5e6f789abcdef123456789ab',
                description: 'Deposit USDC to Vesu lending pool',
            },
            {
                id: 'tx_003',
                type: 'deposit',
                amount: '1200.00',
                token: 'USDC',
                protocol: 'Nostra',
                status: 'confirmed',
                timestamp: Date.now() - 86400000 * 2,
                txHash: '0x3c4d5e6f789abcdef123456789abc1',
                description: 'Add liquidity to Nostra USDC/USDT pool',
            },
            {
                id: 'tx_004',
                type: 'lightning_payment',
                amount: '0.00012',
                token: 'BTC',
                status: 'confirmed',
                timestamp: Date.now() - 86400000 * 1,
                description: 'Lightning payment to coffee shop',
                metadata: { invoice: 'lnbc...', preimage: '...' }
            },
            {
                id: 'tx_005',
                type: 'yield_claim',
                amount: '12.34',
                token: 'USDC',
                protocol: 'Vesu',
                status: 'pending',
                timestamp: Date.now() - 3600000,
                description: 'Claim accrued lending yield from Vesu',
            }
        ];
    }

    // Simulate deposit to a yield strategy
    async depositToStrategy(strategyId: string, amount: string): Promise<Transaction> {
        const strategy = this.yieldStrategies.find(s => s.id === strategyId);
        if (!strategy) throw new Error('Strategy not found');

        const transaction: Transaction = {
            id: `tx_${Date.now()}`,
            type: 'deposit',
            amount,
            token: 'USDC',
            protocol: strategy.protocol,
            status: 'pending',
            timestamp: Date.now(),
            description: `Deposit ${amount} USDC to ${strategy.name}`,
        };

        this.transactions.unshift(transaction);

        // Simulate network confirmation after delay
        setTimeout(() => {
            transaction.status = 'confirmed';
            transaction.txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
            transaction.blockNumber = Math.floor(Math.random() * 1000000);
            transaction.gasUsed = (Math.random() * 0.01 + 0.001).toFixed(6);

            // Add or update position
            const existingPosition = this.positions.find(p =>
                p.protocol === strategy.protocol && p.strategy === strategy.name
            );

            if (existingPosition) {
                const newDeposited = parseFloat(existingPosition.deposited) + parseFloat(amount);
                existingPosition.deposited = newDeposited.toFixed(2);
            } else {
                this.positions.push({
                    protocol: strategy.protocol,
                    strategy: strategy.name,
                    deposited: amount,
                    earned: '0.00',
                    apy: strategy.apy,
                    lastUpdate: Date.now()
                });
            }
        }, 3000); // 3 second confirmation

        return transaction;
    }

    // Simulate withdrawal from strategy
    async withdrawFromStrategy(strategyId: string, amount: string): Promise<Transaction> {
        const strategy = this.yieldStrategies.find(s => s.id === strategyId);
        if (!strategy) throw new Error('Strategy not found');

        const transaction: Transaction = {
            id: `tx_${Date.now()}`,
            type: 'withdraw',
            amount,
            token: 'USDC',
            protocol: strategy.protocol,
            status: 'pending',
            timestamp: Date.now(),
            description: `Withdraw ${amount} USDC from ${strategy.name}`,
        };

        this.transactions.unshift(transaction);

        // Simulate confirmation
        setTimeout(() => {
            transaction.status = 'confirmed';
            transaction.txHash = `0x${Math.random().toString(16).substr(2, 64)}`;

            // Update position
            const position = this.positions.find(p =>
                p.protocol === strategy.protocol && p.strategy === strategy.name
            );
            if (position) {
                const newDeposited = Math.max(0, parseFloat(position.deposited) - parseFloat(amount));
                position.deposited = newDeposited.toFixed(2);
            }
        }, 4000); // 4 second withdrawal

        return transaction;
    }

    // Simulate Lightning payment
    async makeLightningPayment(amount: string, description: string): Promise<Transaction> {
        const transaction: Transaction = {
            id: `tx_${Date.now()}`,
            type: 'lightning_payment',
            amount,
            token: 'BTC',
            status: 'pending',
            timestamp: Date.now(),
            description,
            metadata: {
                invoice: `lnbc${Math.random().toString(36).substr(2, 20)}`,
                route: ['Node A', 'Node B', 'Destination']
            }
        };

        this.transactions.unshift(transaction);

        // Lightning is fast - 1 second confirmation
        setTimeout(() => {
            transaction.status = 'confirmed';
            transaction.metadata!.preimage = Math.random().toString(16).substr(2, 64);
        }, 1000);

        return transaction;
    }

    // Simulate BTC bridge deposit
    async bridgeBTC(btcAmount: string, depositAddress: string): Promise<Transaction> {
        const usdcAmount = (parseFloat(btcAmount) * 65000).toFixed(2); // Mock BTC price

        const transaction: Transaction = {
            id: `tx_${Date.now()}`,
            type: 'bridge',
            amount: btcAmount,
            token: 'BTC',
            status: 'pending',
            timestamp: Date.now(),
            description: `Bridge ${btcAmount} BTC to Starknet USDC`,
            metadata: {
                depositAddress,
                expectedUSDC: usdcAmount,
                bridgeProvider: 'Atomiq'
            }
        };

        this.transactions.unshift(transaction);

        // Bridge takes longer - 10 second simulation
        setTimeout(() => {
            transaction.status = 'confirmed';
            transaction.txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
            transaction.metadata!.actualUSDC = usdcAmount;
        }, 10000);

        return transaction;
    }

    // Get current dashboard data with live yield calculations
    getDashboardData(): DashboardData {
        // Calculate live yields
        const now = Date.now();
        this.positions.forEach(position => {
            const timeDiff = now - position.lastUpdate;
            const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
            const yieldAccrued = parseFloat(position.deposited) * (position.apy / 100) * (daysDiff / 365);
            position.earned = (parseFloat(position.earned) + yieldAccrued).toFixed(2);
            position.lastUpdate = now;
        });

        const totalDeposited = this.positions.reduce((sum, p) => sum + parseFloat(p.deposited), 0);
        const totalEarned = this.positions.reduce((sum, p) => sum + parseFloat(p.earned), 0);
        const totalBalance = totalDeposited + totalEarned;

        return {
            totalBalance: totalBalance.toFixed(2),
            btcBalance: '0.08734', // Mock BTC balance
            usdcBalance: '127.45', // Mock available USDC
            totalYieldEarned: totalEarned.toFixed(2),
            positions: this.positions,
            recentTransactions: this.transactions.slice(0, 10),
            yieldStrategies: this.yieldStrategies
        };
    }

    // Simulate protocol-specific actions
    async claimRewards(protocol: string): Promise<Transaction> {
        const position = this.positions.find(p => p.protocol === protocol);
        if (!position) throw new Error('No position found');

        const rewards = parseFloat(position.earned);
        const transaction: Transaction = {
            id: `tx_${Date.now()}`,
            type: 'yield_claim',
            amount: rewards.toFixed(2),
            token: 'USDC',
            protocol,
            status: 'pending',
            timestamp: Date.now(),
            description: `Claim ${rewards.toFixed(2)} USDC rewards from ${protocol}`,
        };

        this.transactions.unshift(transaction);

        setTimeout(() => {
            transaction.status = 'confirmed';
            transaction.txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
            position.earned = '0.00'; // Reset after claim
        }, 2000);

        return transaction;
    }

    // Get yield strategies
    getYieldStrategies(): YieldStrategy[] {
        return this.yieldStrategies;
    }

    // Get transaction by ID
    getTransaction(id: string): Transaction | undefined {
        return this.transactions.find(t => t.id === id);
    }

    // Simulate gas estimation
    async estimateGas(operation: string): Promise<{ gasLimit: string; gasFee: string }> {
        const gasEstimates: Record<string, { gasLimit: string; gasFee: string }> = {
            'deposit': { gasLimit: '85000', gasFee: '0.0034' },
            'withdraw': { gasLimit: '95000', gasFee: '0.0038' },
            'claim': { gasLimit: '65000', gasFee: '0.0026' },
            'swap': { gasLimit: '120000', gasFee: '0.0048' },
            'bridge': { gasLimit: '150000', gasFee: '0.006' }
        };

        return gasEstimates[operation] || { gasLimit: '100000', gasFee: '0.004' };
    }
}

export const demoService = new DemoService();