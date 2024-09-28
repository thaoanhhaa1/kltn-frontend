import { envConfig } from '@/config/envConfig';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { cookieStorage, createStorage } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { metaMask } from 'wagmi/connectors';

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
    connectors: [metaMask()],
    chains: [
        (false && {
            // FIXME
            id: 1337,
            name: 'Localhost',
            nativeCurrency: {
                decimals: 18,
                symbol: 'ETH',
                name: 'Ethereum',
            },
            rpcUrls: {
                default: {
                    http: ['http://localhost:7545'],
                },
            },
        }) || {
            id: 1337,
            name: 'Staging',
            nativeCurrency: {
                decimals: 18,
                symbol: 'ETH',
                name: 'Ethereum',
            },
            rpcUrls: {
                default: {
                    http: ['http://103.252.136.170:8545'],
                },
            },
        },
        ...chains,
    ],
    projectId,
    metadata,
    ssr: true,
    storage: createStorage({
        storage: cookieStorage,
    }),
});
