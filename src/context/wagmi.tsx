'use client';

import { config, metadata, projectId } from '@/config/wagmiConfig';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { ReactNode } from 'react';
import { State, WagmiProvider } from 'wagmi';

// Setup queryClient
const queryClient = new QueryClient();

if (!projectId) throw new Error('Project ID is not defined');

// Create modal
createWeb3Modal({
    metadata,
    wagmiConfig: config,
    projectId,
});

export default function AppKitProvider({ children, initialState }: { children: ReactNode; initialState?: State }) {
    return (
        <WagmiProvider config={config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    );
}
