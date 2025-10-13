import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
    generateRegistrationOptions,
    generateAuthenticationOptions,
    verifyRegistrationResponse,
    verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import base64url from 'base64url';

dotenv.config();

const serviceAccountPath = path.resolve(__dirname, process.env.SERVICE_ACCOUNT_KEY_PATH as string);
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const RP_ID = process.env.RP_ID || 'localhost';
const ORIGIN = process.env.ORIGIN || 'http://localhost:5173';

// In-memory stores (replace with a DB in production)
type PasskeyCred = {
    credentialID: string;
    credentialPublicKey: string; // base64url
    counter: number;
};

type UserRecord = {
    uid: string;
    displayName: string;
    passkeys: PasskeyCred[];
};

const users = new Map<string, UserRecord>();
const challenges = new Map<string, { type: 'register' | 'auth'; challenge: string; uid: string }>();
const sessions = new Map<string, { uid: string; createdAt: number }>();
const managedAccounts = new Map<string, { address: string }>();

app.post('/login', async (req, res) => {
    const { method, idToken } = req.body;

    if (method === 'social' && idToken) {
        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const uid = decodedToken.uid;

            // Here you would typically find or create a user in your database
            // For this example, we'll just return a mock user object

            console.log('Verified user with UID:', uid);

            res.json({
                success: true,
                user: {
                    id: uid,
                    // A real implementation would generate or retrieve a real address
                    address: '0x' + Buffer.from(uid).toString('hex').slice(0, 40),
                    authMethod: 'social',
                },
            });
        } catch (error) {
            console.error('Error verifying token:', error);
            res.status(401).json({ success: false, message: 'Authentication failed' });
        }
    } else {
        // Handle other login methods (passkey, xverse) here if needed
        // For now, returning a mock response for them
        res.json({
            success: true,
            user: {
                id: 'mock-user-id',
                address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
                authMethod: method,
            },
        });
    }
});

// WebAuthn registration options
app.post('/webauthn/register/options', async (req, res) => {
    const uid = uuidv4();
    const user: UserRecord = { uid, displayName: `user-${uid.slice(0, 6)}`, passkeys: [] };
    users.set(uid, user);
    const options = await generateRegistrationOptions({
        rpID: RP_ID,
        rpName: 'Liquid BTC Yield',
        userID: Buffer.from(uid),
        userName: user.displayName,
        attestationType: 'none',
        authenticatorSelection: { residentKey: 'preferred', userVerification: 'preferred' },
        excludeCredentials: [],
    });
    challenges.set(uid, { type: 'register', challenge: options.challenge, uid });
    res.json({ ...options, user: { id: uid, name: user.displayName } });
});

// WebAuthn registration verify
app.post('/webauthn/register/verify', async (req, res) => {
    try {
        const body = req.body;
        const uid = body?.response?.clientDataJSON ? body.response.clientDataJSON : undefined;
        // We don't get uid from clientDataJSON; instead, we stored the last created user
        const last = Array.from(challenges.values()).reverse().find((c) => c.type === 'register');
        if (!last) return res.status(400).json({ message: 'No outstanding challenge' });
        const expectedChallenge = last.challenge;
        const verification = await verifyRegistrationResponse({
            response: body,
            expectedChallenge,
            expectedOrigin: ORIGIN,
            expectedRPID: RP_ID,
        });
        if (!verification.verified || !verification.registrationInfo) {
            return res.status(400).json({ message: 'Verification failed' });
        }
        const info = verification.registrationInfo;
        const user = users.get(last.uid);
        if (!user) return res.status(400).json({ message: 'User not found' });
        user.passkeys.push({
            credentialID: info.credentialID,
            credentialPublicKey: base64url.encode(Buffer.from(info.credentialPublicKey)),
            counter: info.counter,
        });
        const session = uuidv4();
        sessions.set(session, { uid: user.uid, createdAt: Date.now() });
        res.json({ uid: user.uid, session });
    } catch (e) {
        console.error('register verify error', e);
        res.status(500).json({ message: 'Internal error' });
    }
});

// WebAuthn authentication options
app.post('/webauthn/auth/options', async (req, res) => {
    const anyUser = Array.from(users.values())[0];
    if (!anyUser || anyUser.passkeys.length === 0) return res.status(404).json({ message: 'No users' });
    const options = await generateAuthenticationOptions({
        rpID: RP_ID,
        userVerification: 'preferred',
        allowCredentials: anyUser.passkeys.map((pk) => ({ id: pk.credentialID, type: 'public-key' })),
    });
    challenges.set(anyUser.uid, { type: 'auth', challenge: options.challenge, uid: anyUser.uid });
    res.json(options);
});

// WebAuthn authentication verify
app.post('/webauthn/auth/verify', async (req, res) => {
    try {
        const body = req.body;
        const anyUser = Array.from(users.values())[0];
        if (!anyUser) return res.status(400).json({ message: 'No user' });
        const expectedChallenge = challenges.get(anyUser.uid)?.challenge;
        if (!expectedChallenge) return res.status(400).json({ message: 'No challenge' });
        const verification = await verifyAuthenticationResponse({
            response: body,
            expectedChallenge,
            expectedOrigin: ORIGIN,
            expectedRPID: RP_ID,
            authenticator: anyUser.passkeys[0] as any,
        });
        if (!verification.verified) return res.status(400).json({ message: 'Verification failed' });
        const session = uuidv4();
        sessions.set(session, { uid: anyUser.uid, createdAt: Date.now() });
        res.json({ uid: anyUser.uid, session });
    } catch (e) {
        console.error('auth verify error', e);
        res.status(500).json({ message: 'Internal error' });
    }
});

// Provision or get a managed AA account (stub)
app.post('/aa/provision', async (req, res) => {
    const { session } = req.body as { session: string };
    if (!session || !sessions.has(session)) return res.status(401).json({ message: 'Unauthorized' });
    const { uid } = sessions.get(session)!;
    if (!managedAccounts.has(uid)) {
        // Create a deterministic mock address from uid
        const address = '0x' + Buffer.from(uid).toString('hex').slice(0, 64).padEnd(64, '0');
        managedAccounts.set(uid, { address });
    }
    res.json({ address: managedAccounts.get(uid)!.address });
});

// Paymaster sponsorship (stub)
app.post('/paymaster/sponsor', async (req, res) => {
    // In production, call AVNU paymaster to sponsor the userOp
    res.json({ txHash: '0x' + uuidv4().replace(/-/g, '') });
});

// BTC->USDC gas reservation (stub)
app.post('/gas/reserve', async (req, res) => {
    const { sats } = req.body as { sats: number };
    const usd = (sats / 1e8) * 60000; // rough BTCUSD
    const usdc = Math.ceil(usd * 1e6); // 6 decimals
    res.json({ reservationId: uuidv4(), usdcAmount: usdc.toString() });
});

// Bridge: request a BTC deposit address that will bridge to Starknet USDC for a given Starknet address
app.post('/bridge/deposit-address', async (req, res) => {
    const { userId, starknetAddress } = req.body as { userId: string; starknetAddress?: string };
    if (!userId) return res.status(400).json({ message: 'userId required' });

    try {
        // For now, use a managed account address if no starknetAddress provided
        const targetAddress = starknetAddress || managedAccounts.get(userId)?.address;
        if (!targetAddress) {
            return res.status(400).json({ message: 'No Starknet address available' });
        }

        // TODO: Replace with real Atomiq integration once dependencies are installed
        // const { address, swapId } = await atomiqBridge.getDepositAddress(targetAddress);
        // res.json({ depositAddress: address, reservationId: swapId, target: targetAddress });

        // Temporary fallback - return a unique address per user
        const depositAddress = `bc1q${Buffer.from(userId).toString('hex').slice(0, 56).padEnd(56, '0')}`;
        const reservationId = uuidv4();
        res.json({ depositAddress, reservationId, target: targetAddress });

    } catch (error) {
        console.error('Bridge deposit address error:', error);
        res.status(500).json({ message: 'Failed to generate deposit address' });
    }
});

// Bridge: get a quote from sats -> USDC on Starknet
app.post('/bridge/quote', async (req, res) => {
    const { sats } = req.body as { sats: number };
    if (!sats || sats <= 0) return res.status(400).json({ message: 'sats must be > 0' });

    try {
        // TODO: Replace with real Atomiq integration once dependencies are installed
        // const quote = await atomiqBridge.getBTCtoUSDCQuote(sats);
        // res.json({ sats, ...quote });

        // Temporary fallback calculation
        const btc = sats / 1e8;
        const usd = btc * 60000; // rough estimate
        const usdc = Math.floor(usd * 1e6); // 6 decimals
        res.json({ sats, usdcAmount: usdc.toString(), rateUsdPerBtc: 60000, fees: (sats * 0.005).toString() });

    } catch (error) {
        console.error('Bridge quote error:', error);
        res.status(500).json({ message: 'Failed to get quote' });
    }
});

// Bridge: check bridging status
app.get('/bridge/status/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // TODO: Replace with real Atomiq integration once dependencies are installed
        // const status = await atomiqBridge.getSwapStatus(id);
        // res.json({ reservationId: id, ...status });

        // Temporary fallback
        res.json({ reservationId: id, status: 'pending' });

    } catch (error) {
        console.error('Bridge status error:', error);
        res.status(500).json({ message: 'Failed to get status' });
    }
});

// Add other endpoints here (getBalance, getTransactions, etc.)
// For now, they are mocked on the frontend.

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});

