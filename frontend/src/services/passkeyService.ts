import { startAuthentication, startRegistration } from '@simplewebauthn/browser';

const API_BASE = (import.meta as any).env?.VITE_API_URL || '/api';

export interface PasskeySession {
    uid: string;
    session: string; // opaque session token from backend
}

export async function passkeyLogin(): Promise<PasskeySession> {
    // Try authentication first
    const optsRes = await fetch(`${API_BASE}/webauthn/auth/options`, { method: 'POST' });
    if (optsRes.status === 404) {
        // No user/cred yet: register
        return registerNewPasskey();
    }
    if (!optsRes.ok) throw new Error('Failed to get auth options');
    const options = await optsRes.json();
    const assertion = await startAuthentication(options);
    const verifyRes = await fetch(`${API_BASE}/webauthn/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assertion),
    });
    if (!verifyRes.ok) throw new Error('Passkey authentication failed');
    return verifyRes.json();
}

export async function registerNewPasskey(): Promise<PasskeySession> {
    const optsRes = await fetch(`${API_BASE}/webauthn/register/options`, { method: 'POST' });
    if (!optsRes.ok) throw new Error('Failed to get registration options');
    const options = await optsRes.json();
    const attestation = await startRegistration(options);
    const verifyRes = await fetch(`${API_BASE}/webauthn/register/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attestation),
    });
    if (!verifyRes.ok) throw new Error('Passkey registration failed');
    return verifyRes.json();
}
