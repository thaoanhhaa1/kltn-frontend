'use client';

import Payment from '@/app/(base)/payments/payment';
import { ITransaction } from '@/interfaces/transaction';
import { getTransactionStatusCode, getTransactionStatusText } from '@/lib/utils';
import { getTransactionsByRenter } from '@/services/transaction-service';
import { Col, Empty, Flex, Row, Segmented, Spin } from 'antd';
import { useCallback, useEffect, useState } from 'react';

const Payments = () => {
    const [segmented, setSegmented] = useState<string>('Tất cả');
    const [transactions, setTransactions] = useState<Array<ITransaction>>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const handleChangeSegmented = (value: string) => {
        setSegmented(value);
    };

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        setTransactions([]);

        try {
            const status = getTransactionStatusCode(segmented);

            const transactions = await getTransactionsByRenter(status);

            setTransactions(transactions);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    }, [segmented]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    return (
        <div>
            <div className="flex justify-end my-3">
                <Segmented<string>
                    options={[
                        'Tất cả',
                        getTransactionStatusText('PENDING'),
                        getTransactionStatusText('COMPLETED'),
                        getTransactionStatusText('CANCELLED'),
                    ]}
                    onChange={handleChangeSegmented}
                />
            </div>
            <Row gutter={[12, 12]}>
                {transactions.map((transaction) => (
                    <Col key={transaction.id} span={12}>
                        <Payment transaction={transaction} fetchTransactions={fetchTransactions} />
                    </Col>
                ))}
            </Row>
            {!loading && (
                <Flex justify="center">
                    {transactions.length === 0 && <Empty description="Không có giao dịch nào" />}
                </Flex>
            )}
            {loading && (
                <Flex justify="center">
                    <Spin size="large" />
                </Flex>
            )}
        </div>
    );
};

export default Payments;
