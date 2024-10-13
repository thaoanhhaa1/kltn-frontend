import { Card } from '@/components/ui/card';
import { IHistoryTransaction } from '@/interfaces/transaction';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { useUserStore } from '@/stores/user-store';
import { Flex, Typography } from 'antd';
import Image from 'next/image';

const dropMoneyImage = '/drop-in-value.png';
const riseMoneyImage = '/rise-in-value.png';

const HistoryTransaction = ({ transaction }: { transaction: IHistoryTransaction }) => {
    const { user } = useUserStore();
    const isIncome = transaction.toId === user?.userId;

    return (
        <Card className="p-4">
            <Flex gap={12} align="center">
                <Flex
                    style={{
                        width: 48,
                        height: 48,
                    }}
                >
                    <Image
                        src={isIncome ? riseMoneyImage : dropMoneyImage}
                        alt={transaction.title}
                        width={48}
                        height={48}
                        className="w-12 aspect-square object-cover"
                    />
                </Flex>
                <div className="flex-1">
                    <Typography.Title level={5}>{transaction.title}</Typography.Title>
                    <Typography.Text type="secondary">{formatDateTime(transaction.updatedAt)}</Typography.Text>
                    <Flex justify="space-between" align="center">
                        <Typography.Text type={isIncome ? 'success' : 'danger'}>
                            Số tiền:&nbsp;
                            {isIncome ? '+' : '-'}
                            <strong>
                                {formatCurrency(transaction.amount + (isIncome ? 0 : transaction.fee || 0), true)}
                            </strong>
                        </Typography.Text>
                        <Typography.Title
                            style={{
                                margin: 0,
                            }}
                            level={4}
                            type={isIncome ? 'success' : 'danger'}
                        >
                            {isIncome ? '+' : '-'}
                            {((transaction.amountEth || 0) + (isIncome ? 0 : transaction.feeEth || 0))?.toFixed(4)} ETH
                        </Typography.Title>
                    </Flex>
                </div>
            </Flex>
        </Card>
    );
};

export default HistoryTransaction;
