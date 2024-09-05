import { envConfig } from '@/config/envConfig';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { cookieStorage, createStorage } from 'wagmi';
import { sepolia } from 'wagmi/chains';

// Get projectId from https://cloud.walletconnect.com
export const projectId = envConfig.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) throw new Error('Project ID is not defined');

export const metadata = {
    name: envConfig.NEXT_PUBLIC_WAGMI_NAME,
    description: envConfig.NEXT_PUBLIC_WAGMI_DESCRIPTION,
    url: envConfig.NEXT_PUBLIC_WAGMI_URL,
    icons: envConfig.NEXT_PUBLIC_WAGMI_ICONS,
};

// Create wagmiConfig
const chains = [sepolia] as const;

export const config = defaultWagmiConfig({
    chains,
    projectId,
    metadata,
    ssr: true,
    storage: createStorage({
        storage: cookieStorage,
    }),
});
