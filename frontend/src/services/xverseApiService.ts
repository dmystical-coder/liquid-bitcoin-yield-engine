// Xverse API Service for fetching real Bitcoin wallet data
// Documentation: https://docs.xverse.app/api

const XVERSE_API_BASE_URL = 'https://api.xverse.app';
const XVERSE_API_KEY = import.meta.env.VITE_XVERSE_API_KEY; // Optional - for higher rate limits

interface XverseBalance {
    address: string;
    total_balance: number;
    total_sent: number;
    total_received: number;
    confirmed_balance: number;
    unconfirmed_balance: number;
}

interface XverseTransaction {
    txid: string;
    block_height: number;
    block_time: number;
    fee: number;
    size: number;
    value: number;
    vin: Array<{
        txid: string;
        vout: number;
        prevout: {
            scriptpubkey_address: string;
            value: number;
        };
    }>;
    vout: Array<{
        scriptpubkey_address: string;
        value: number;
    }>;
}

interface XverseActivityResponse {
    limit: number;
    offset: number;
    total: number;
    results: XverseTransaction[];
}

/**
 * Fetch Bitcoin balance for an address
 * @param address - Bitcoin address
 * @returns Balance information
 */
export async function getAddressBalance(address: string): Promise<XverseBalance> {
    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (XVERSE_API_KEY) {
            headers['x-api-key'] = XVERSE_API_KEY;
        }

        const response = await fetch(
            `${XVERSE_API_BASE_URL}/v1/address/${address}/balance`,
            { headers }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch balance: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching address balance:', error);
        throw error;
    }
}

/**
 * Fetch transaction history for an address
 * @param address - Bitcoin address
 * @param limit - Number of transactions to fetch (default: 20)
 * @param offset - Offset for pagination (default: 0)
 * @returns Transaction history
 */
export async function getAddressActivity(
    address: string,
    limit: number = 20,
    offset: number = 0
): Promise<XverseActivityResponse> {
    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (XVERSE_API_KEY) {
            headers['x-api-key'] = XVERSE_API_KEY;
        }

        const response = await fetch(
            `${XVERSE_API_BASE_URL}/v1/address/${address}/activity?limit=${limit}&offset=${offset}`,
            { headers }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch activity: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching address activity:', error);
        throw error;
    }
}

/**
 * Fetch UTXOs for an address
 * @param address - Bitcoin address
 * @returns Array of UTXOs
 */
export async function getAddressUtxos(address: string): Promise<any[]> {
    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (XVERSE_API_KEY) {
            headers['x-api-key'] = XVERSE_API_KEY;
        }

        const response = await fetch(
            `${XVERSE_API_BASE_URL}/v1/address/${address}/utxo`,
            { headers }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch UTXOs: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching address UTXOs:', error);
        throw error;
    }
}

/**
 * Get Bitcoin price in USD
 * @returns Current BTC price in USD
 */
export async function getBitcoinPrice(): Promise<number> {
    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (XVERSE_API_KEY) {
            headers['x-api-key'] = XVERSE_API_KEY;
        }

        const response = await fetch(
            `${XVERSE_API_BASE_URL}/v1/bitcoin-price`,
            { headers }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch Bitcoin price: ${response.statusText}`);
        }

        const data = await response.json();
        return data.usd || 60000; // Fallback to $60k if not available
    } catch (error) {
        console.error('Error fetching Bitcoin price:', error);
        return 60000; // Fallback price
    }
}

/**
 * Convert satoshis to BTC
 * @param satoshis - Amount in satoshis
 * @returns Amount in BTC
 */
export function satoshisToBTC(satoshis: number): number {
    return satoshis / 100000000;
}

/**
 * Convert BTC to satoshis
 * @param btc - Amount in BTC
 * @returns Amount in satoshis
 */
export function btcToSatoshis(btc: number): number {
    return Math.floor(btc * 100000000);
}

/**
 * Format timestamp to human-readable date
 * @param timestamp - Unix timestamp
 * @returns Formatted date string
 */
export function formatTransactionDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);

    if (diffInHours < 24) {
        return 'Today, ' + date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    } else if (diffInHours < 48) {
        return 'Yesterday, ' + date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    } else {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }
}

/**
 * Determine transaction type and amount for a given address
 * @param tx - Transaction data
 * @param userAddress - User's Bitcoin address
 * @returns Transaction info with type and amount
 */
export function parseTransaction(tx: XverseTransaction, userAddress: string): {
    type: 'deposit' | 'withdrawal' | 'payment' | 'yield';
    amountBtc: number;
    date: string;
    status: 'completed' | 'pending' | 'failed';
    txid: string;
} {
    // Check if address is in inputs (sending) or outputs (receiving)
    const isReceiving = tx.vout.some(output =>
        output.scriptpubkey_address === userAddress
    );
    const isSending = tx.vin.some(input =>
        input.prevout.scriptpubkey_address === userAddress
    );

    let amountSats = 0;

    if (isReceiving && !isSending) {
        // Pure receive
        amountSats = tx.vout
            .filter(output => output.scriptpubkey_address === userAddress)
            .reduce((sum, output) => sum + output.value, 0);
    } else if (isSending && !isReceiving) {
        // Pure send
        amountSats = -tx.vin
            .filter(input => input.prevout.scriptpubkey_address === userAddress)
            .reduce((sum, input) => sum + input.prevout.value, 0);
        // Add back change
        amountSats += tx.vout
            .filter(output => output.scriptpubkey_address === userAddress)
            .reduce((sum, output) => sum + output.value, 0);
    } else {
        // Self-transfer or complex transaction
        const sent = tx.vin
            .filter(input => input.prevout.scriptpubkey_address === userAddress)
            .reduce((sum, input) => sum + input.prevout.value, 0);
        const received = tx.vout
            .filter(output => output.scriptpubkey_address === userAddress)
            .reduce((sum, output) => sum + output.value, 0);
        amountSats = received - sent;
    }

    const amountBtc = satoshisToBTC(Math.abs(amountSats));
    const type = amountSats > 0 ? 'deposit' : 'payment';
    const status = tx.block_height > 0 ? 'completed' : 'pending';

    return {
        type,
        amountBtc: amountSats > 0 ? amountBtc : -amountBtc,
        date: formatTransactionDate(tx.block_time),
        status,
        txid: tx.txid
    };
}

export type { XverseBalance, XverseTransaction, XverseActivityResponse };

