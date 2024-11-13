import { useUserStore } from '@/stores/user-store';
import { Connector, useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';

const useSignMessageCustom = () => {
    const { signMessageAsync } = useSignMessage();
    const { connectAsync, connectors } = useConnect();
    const { disconnectAsync } = useDisconnect();
    const { address } = useAccount();
    const { user } = useUserStore();

    const handleSign = async ({ message }: { message: string }) => {
        const connector: Connector = connectors.find((c) => c.id === 'metaMaskSDK')!;

        if (address !== user?.walletAddress) {
            await disconnectAsync();
            await connectAsync({ connector });
        }

        if (user?.walletAddress !== address) throw new Error('Địa chỉ ví không khớp');

        const res = await signMessageAsync({
            message,
            account: address,
        });

        return res;
    };

    return { handleSign };
};

export default useSignMessageCustom;
