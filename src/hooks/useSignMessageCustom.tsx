import { useUserStore } from '@/stores/user-store';
import { Connector, useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';

const useSignMessageCustom = () => {
    const { signMessageAsync } = useSignMessage();
    const { connectAsync, connectors } = useConnect();
    const { disconnectAsync } = useDisconnect();
    const { address } = useAccount();
    const { user } = useUserStore();

    const handleSign = async ({ message }: { message: string }) => {
        try {
            const connector: Connector = connectors.find((c) => c.id === 'metaMaskSDK')!;
            let add = address;

            if (address !== user?.walletAddress) {
                await disconnectAsync();
                const res = await connectAsync({ connector });

                if (res) add = res.accounts?.[0] || '';
            }

            if (user?.walletAddress !== add) throw new Error('Địa chỉ ví không khớp');

            const res = await signMessageAsync({
                message,
                account: address,
            });

            return res;
        } catch (error) {
            const { code, name } = error as any;

            if (code === 4001 || name === 'ConnectorAccountNotFoundError') {
                throw new Error('Có lỗi xảy ra khi ký xác thực, vui lòng thử lại');
            }

            throw error;
        }
    };

    return { handleSign };
};

export default useSignMessageCustom;
