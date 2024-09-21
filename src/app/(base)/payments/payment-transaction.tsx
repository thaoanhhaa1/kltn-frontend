'use client';

import { deposit, rentPayment } from '@/services/transaction-service';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

const PaymentTransaction = ({
    isDeposit,
    contractId,
    transactionId,
}: {
    contractId: string;
    isDeposit: boolean;
    transactionId: number;
}) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);

        try {
            const data = {
                contractId,
                transactionId,
            };

            if (isDeposit) await deposit(data);
            else await rentPayment(data);

            toast.success('Thanh toán thành công');
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error('Thanh toán thất bại');
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
