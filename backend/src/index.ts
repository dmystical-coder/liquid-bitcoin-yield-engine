import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';

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

// Add other endpoints here (getBalance, getTransactions, etc.)
// For now, they are mocked on the frontend.

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});

