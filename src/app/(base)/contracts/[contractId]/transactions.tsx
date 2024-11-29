'use client';

import HistoryTransaction from '@/app/(base)/user/wallet/history-transaction';
import useBoolean from '@/hooks/useBoolean';
import { ITransactionDetail } from '@/interfaces/transaction';
import { getTransactionsByContract } from '@/services/transaction-service';
import { Button, Drawer, Empty, Flex, Spin } from 'antd';
import { useEffect, useState } from 'react';

const Transactions = ({ contractId }: { contractId: string }) => {
    const { value, setTrue, setFalse } = useBoolean(false);
    const [transactions, setTransactions] = useState<Array<ITransactionDetail>>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const res = await getTransactionsByContract(contractId);

                setTransactions(res);
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [contractId]);

    return (
        <>
            <Button onClick={setTrue}>Lịch sử giao dịch</Button>
            <Drawer title="Lịch sử giao dịch" onClose={setFalse} open={value} size="large">
                {loading && (
                    <Flex justify="center">
                        <Spin size="large" />
                    </Flex>
                )}
                {!loading && transactions.length === 0 && <Empty description="Không có dữ liệu" />}
                <Flex vertical gap={12}>
                    {transactions.map((transaction) => (
                        <HistoryTransaction key={transaction.id} transaction={transaction} />
                    ))}
                </Flex>
            </Drawer>
        </>
    );
};

export default Transactions;
