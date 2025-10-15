import { request } from 'sats-connect';

export type WalletType = 'xverse' | 'unisat' | 'managed';

export interface LinkedAccount {
    address: string;
    walletType: WalletType;
}

// Try to connect a Bitcoin wallet with Starknet support. If not present, return null.
export async function connectBrowserWallet(): Promise<LinkedAccount | null> {
    try {
        const response = await request('wallet_connect', {
            addresses: ['starknet'] as any, // Request only Starknet address for our Bitcoin-first app
            message: 'Connect your Bitcoin wallet to access Starknet DeFi features',
            network: 'Mainnet' as any
        });

        if (response.status === 'success') {
            const starknetAddress = response.result.addresses.find(
                (addr: any) => addr.purpose === 'starknet'
            );
            if (!starknetAddress) return null;

            return {
                address: starknetAddress.address,
                walletType: 'xverse' // Sats Connect primarily supports Xverse
            };
        }
        return null;
    } catch (e) {
        console.warn('Wallet connect cancelled or failed', e);
        return null;
    }
}// Explicit opt-in wallet connect via Sats Connect (use only on a dedicated "Link Wallet" action)
export async function connectWebWallet(): Promise<LinkedAccount | null> {
    try {
        const response = await request('wallet_connect', {
            addresses: ['payment', 'ordinals', 'starknet'] as any, // Full Bitcoin + Starknet support
            message: 'Link your Bitcoin wallet to unlock advanced features',
            network: 'Mainnet' as any
        });

        if (response.status === 'success') {
            const starknetAddress = response.result.addresses.find(
                (addr: any) => addr.purpose === 'starknet'
            );
            if (!starknetAddress) return null;

            return {
                address: starknetAddress.address,
                walletType: 'xverse'
            };
        }
        return null;
    } catch (e) {
        console.warn('Wallet connect cancelled or failed', e);
        return null;
    }
}

// Ask backend to provision or fetch a managed AA account controlled by passkey/OAuth.
export async function provisionManagedAccount(idTokenOrSession: string): Promise<LinkedAccount> {
    const res = await fetch('/api/aa/provision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session: idTokenOrSession })
    });
    if (!res.ok) throw new Error('AA provision failed');
    const data = await res.json();
    return { address: data.address, walletType: 'managed' };
}

// Prepare a user operation and request sponsorship via paymaster
export async function sponsorAndSendUserOp(params: { accountAddress: string; calldata: string[]; }): Promise<{ txHash: string }> {
    const res = await fetch('/api/paymaster/sponsor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('Sponsorship failed');
    return res.json();
}

// Reserve USDC gas paid from BTC
export async function reserveGasWithBtc(params: { sats: number }): Promise<{ reservationId: string; usdcAmount: string }> {
    const res = await fetch('/api/gas/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('Gas reservation failed');
    return res.json();
}
