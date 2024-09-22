'use client';

import CustomError from '@/lib/error';
import { updateWalletAddress } from '@/services/user-service';
import { Button, Flex, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Connector, useConnect, useDisconnect } from 'wagmi';

const ConnectWallet = () => {
    const router = useRouter();
    const { connectors, connectAsync } = useConnect();
    const { disconnect } = useDisconnect();

    const handleConnect = async (connector: Connector) => {
        console.log('Attempting to connect with connector:', connector);
        try {
            disconnect();
            const res = await connectAsync({ connector });

            const walletAddress = res?.accounts[0];

            if (!walletAddress) return;

            await updateWalletAddress(walletAddress);

            toast.success('Kết nối ví thành công');
            router.refresh();
        } catch (error) {
            console.log(error);

            if (error instanceof CustomError) return toast.error(error.message || 'Kết nối ví thất bại');

            toast.error('Kết nối ví thất bại');
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
