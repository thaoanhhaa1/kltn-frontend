'use client';

import useSignMessageCustom from '@/hooks/useSignMessageCustom';
import { deposit, rentPayment } from '@/services/transaction-service';
import { Button } from 'antd';
import { useState } from 'react';
import { toast } from 'react-toastify';

const PaymentTransaction = ({
    isDeposit,
    contractId,
    transactionId,
    message,
    fetchTransactions,
}: {
    message: string;
    contractId: string;
    isDeposit: boolean;
    transactionId: number;
    fetchTransactions: () => void;
}) => {
    const [loading, setLoading] = useState(false);
    const { handleSign } = useSignMessageCustom();

    const handlePayment = async () => {
        setLoading(true);

        try {
            const signature = await handleSign({ message });

            const data = {
                contractId,
                transactionId,
                signature,
            };

            if (isDeposit) await deposit(data);
            else await rentPayment(data);

            toast.success('Thanh toán thành công');
            fetchTransactions();
        } catch (error) {
            console.error(error);
            toast.error((error as any).message || 'Thanh toán thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button type="primary" ghost loading={loading} onClick={handlePayment}>
            Thanh toán
        </Button>
    );
};

export default PaymentTransaction;
