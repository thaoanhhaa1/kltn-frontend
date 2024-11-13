'use client';

import { updateWalletAddress } from '@/services/user-service';
import { Button, Flex, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Connector, useConnect, useDisconnect } from 'wagmi';

const ConnectWallet = () => {
    const router = useRouter();
    const { connectors, connectAsync } = useConnect();
    const { disconnectAsync } = useDisconnect();

    const handleConnect = async (connector: Connector) => {
        console.log('Attempting to connect with connector:', connector);
        try {
            await disconnectAsync();
            const res = await connectAsync({ connector });

            const walletAddress = res?.accounts[0];

            if (!walletAddress) return;

            await updateWalletAddress(walletAddress);

            toast.success('Kết nối ví thành công');
            router.refresh();
        } catch (error) {
            console.log(error);
            const errorAny = error as any;

            if (errorAny?.name === 'UserRejectedRequestError') toast.error('Người dùng từ chối yêu cầu');
            else toast.error(errorAny.message || 'Kết nối ví thất bại');
        }
    };

    return (
        <div className="mt-6">
            <Typography.Title
                style={{
                    textAlign: 'center',
                }}
                level={3}
            >
                Quản lý ví
            </Typography.Title>

            <Flex justify="center">
                {connectors
                    .filter((item) => {
                        console.log('Connector ID:', item.id);
                        return item.id === 'metaMaskSDK';
                    })
                    .map((connector) => (
                        <Button type="primary" ghost key={connector.uid} onClick={() => handleConnect(connector)}>
                            Kết nối với MetaMask
                        </Button>
                    ))}
            </Flex>
        </div>
    );
};

export default ConnectWallet;
