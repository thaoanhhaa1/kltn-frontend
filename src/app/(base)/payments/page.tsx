import Header from '@/app/(base)/payments/header';
import Payment from '@/app/(base)/payments/payment';
import Forbidden from '@/components/forbidden';
import { ITransaction } from '@/interfaces/transaction';
import { getTransactionsByRenter } from '@/services/transaction-service';
import { Col, Row } from 'antd';
import { cookies } from 'next/headers';

const PaymentsPage = async () => {
    const cookiesStore = cookies();
    const accessToken = cookiesStore.get('accessToken')?.value;

    if (!accessToken) return <Forbidden />;

    let transactions: Array<ITransaction> = [];

    try {
        transactions = await getTransactionsByRenter(accessToken);
    } catch (error) {
        console.error(error);
    }

    return (
        <div className="mt-5">
            <Header />
            <Row gutter={12}>
                {transactions.map((transaction) => (
                    <Col key={transaction.id} span={12}>
                        <Payment transaction={transaction} />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default PaymentsPage;
