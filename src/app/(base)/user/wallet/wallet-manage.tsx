'use client';

import HistoryTransaction from '@/app/(base)/user/wallet/history-transaction';
import { envConfig } from '@/config/envConfig';
import { initDataTable } from '@/constants/init-data';
import { ITable } from '@/interfaces/table';
import { ITransactionDetail, ITransactionType } from '@/interfaces/transaction';
import { getHistoryTransactions } from '@/services/transaction-service';
import { Divider, Empty, Flex, Skeleton, Spin, Tabs, Typography } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
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
    const [transactions, setTransactions] = useState<ITable<ITransactionDetail>>(initDataTable);
    const [loading, setLoading] = useState<boolean>(true);
    const [type, setType] = useState<ITransactionType>('ALL');
    const { data, isLoading } = useBalance({
        address,
        chainId: envConfig.NEXT_PUBLIC_CHAIN_ID,
    });
    const balance = useMemo(() => {
        const balance = (Number(data?.value) / Math.pow(10, data?.decimals ?? 1)).toString();
        const [integer, decimal] = balance.split('.');

        return `${integer}.${(decimal || '').slice(0, 4).padEnd(4, '0')}`;
    }, [data?.decimals, data?.value]);

    const fetchTransactions = useCallback(
        async (take: number, skip: number) => {
            setLoading(true);

            try {
                const data = await getHistoryTransactions({
                    skip,
                    take,
                    type,
                });

                setTransactions((prev) => {
                    const lastOld = prev.data.at(-1);
                    const lastNew = data.data.at(-1);

                    if (lastOld && lastNew && lastOld.id === lastNew.id) return prev;

                    if (skip === 0) return data;

                    return {
                        ...data,
                        data: [...prev.data, ...data.data],
                    };
                });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        },
        [type],
    );

    const handleChangeType = (type: string) => {
        setType(type as ITransactionType);
    };

    const next = () => {
        fetchTransactions(10, transactions.data.length);
    };

    useEffect(() => {
        fetchTransactions(10, 0);
    }, [fetchTransactions]);

    useEffect(() => {
        setTransactions(initDataTable);
    }, [type]);

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
                    {balance}
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
            <InfiniteScroll
                dataLength={transactions.data.length} //This is important field to render the next data
                next={next}
                hasMore={transactions.pageInfo.current * transactions.pageInfo.pageSize < transactions.pageInfo.total}
                loader={null}
            >
                <Flex
                    vertical
                    style={{
                        marginTop: 16,
                    }}
                    gap={12}
                >
                    {transactions.data.map((transaction, index) => (
                        <HistoryTransaction key={index} transaction={transaction} />
                    ))}
                </Flex>
            </InfiniteScroll>
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
            {!loading && transactions.data.length === 0 && <Empty description={false} />}
        </div>
    );
};

export default WalletManage;
