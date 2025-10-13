import type { ReactNode } from 'react';

// Simple wrapper component - no longer needs Starknet provider since we use Sats Connect directly
export default function StarknetProvider({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
