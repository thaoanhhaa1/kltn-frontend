'use client';

import HistoryTransaction from '@/app/(base)/user/wallet/history-transaction';
import { IHistoryTransaction, ITransactionType } from '@/interfaces/transaction';
import { getHistoryTransactions } from '@/services/transaction-service';
import { Divider, Empty, Flex, Skeleton, Spin, Tabs, Typography } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useBalance } from 'wagmi';

const typeItems: Array<{
    key: ITransactionType;
    label: string;
}> = [
    {
        key: 'ALL',
        label: 'Tất cả',
    },
    {
        key: 'INCOME',
        label: 'Thu',
    },
    {
        key: 'OUTCOME',
        label: 'Chi',
    },
];

const WalletManage = ({ address }: { address: `0x${string}` }) => {
    const [transactions, setTransactions] = useState<Array<IHistoryTransaction>>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [type, setType] = useState<ITransactionType>('ALL');
    const { data, isLoading } = useBalance({
        address,
        chainId: 1337,
    });

    const fetchTransactions = useCallback(async () => {
        setLoading(true);

        try {
            const data = await getHistoryTransactions(type);

            setTransactions(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [type]);

    const handleChangeType = (type: string) => {
        setType(type as ITransactionType);
    };

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    return (
        <div className="pb-6">
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
            {isLoading ? (
                <Flex justify="center">
                    <Skeleton.Input
                        rootClassName="mb-[19px]"
                        style={{
                            height: '46px',
                            width: '100px',
                        }}
                    />
                </Flex>
            ) : (
                <Typography.Title
                    style={{
                        textAlign: 'center',
                    }}
                    level={1}
                >
                    {(Number(data?.value) / Math.pow(10, data?.decimals ?? 1)).toFixed(4)}
                    &nbsp;
                    {data?.symbol}
                </Typography.Title>
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
            <Tabs defaultActiveKey="ALL" items={typeItems} onChange={handleChangeType} />
            {!loading && transactions.length === 0 && <Empty description={false} />}
            <Flex
                vertical
                style={{
                    marginTop: 16,
                }}
                gap={12}
            >
                {transactions.map((transaction, index) => (
                    <HistoryTransaction key={index} transaction={transaction} />
                ))}
            </Flex>
            {loading && (
                <Flex
                    justify="center"
                    style={{
                        marginTop: 16,
                    }}
                >
                    <Spin size="large" />
                </Flex>
            )}
        </div>
    );
};

export default WalletManage;
