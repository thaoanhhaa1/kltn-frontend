'use client';

import { Divider, Empty, Flex, Skeleton, Typography } from 'antd';
import { useBalance } from 'wagmi';

const WalletManage = ({ address }: { address: `0x${string}` }) => {
    const { data } = useBalance({
        address,
    });

    return (
        <div>
            <div className="mt-6">
                <Typography.Title
                    style={{
                        textAlign: 'center',
                    }}
                    level={3}
                >
                    Quản lý ví
                </Typography.Title>
            </div>
            {data ? (
                <Typography.Title
                    style={{
                        textAlign: 'center',
                    }}
                    level={1}
                >
                    {Number(data?.value) / Math.pow(10, data?.decimals)}
                    &nbsp;
                    {data?.symbol}
                </Typography.Title>
            ) : (
                <Flex justify="center">
                    <Skeleton.Input
                        rootClassName="mb-[19px]"
                        style={{
                            height: '46px',
                            width: '100px',
                        }}
                    />
                </Flex>
            )}
            <Flex justify="center" align="center" gap={4}>
                <Typography.Title
                    level={5}
                    style={{
                        margin: 0,
                    }}
                >
                    Địa chỉ ví:
                </Typography.Title>
                <Typography.Text>{address}</Typography.Text>
            </Flex>
            <Divider />
            <Typography.Title
                level={5}
                style={{
                    margin: 0,
                }}
            >
                Lịch sử giao dịch
            </Typography.Title>
            <Empty description={false} />
        </div>
    );
};

export default WalletManage;
