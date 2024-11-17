import PaymentTransaction from '@/app/(base)/payments/payment-transaction';
import Extension from '@/components/extension';
import Text from '@/components/text';
import Title from '@/components/title';
import { Card } from '@/components/ui/card';
import { ITransaction } from '@/interfaces/transaction';
import { formatCurrency, formatDate, getLocalTime, getTransactionColor, getTransactionStatusText } from '@/lib/utils';
import { Flex, Tag } from 'antd';
import dayjs from 'dayjs';
import { ReceiptText } from 'lucide-react';
import Markdown from 'react-markdown';

const Payment = ({ transaction }: { transaction: ITransaction }) => {
    return (
        <Card className="p-4">
            <Flex align="center" gap={16}>
                <ReceiptText size={30} className="text-antd-primary" />
                <div>
                    <Title level={5}>{transaction.title}</Title>
                    {transaction.description && (
                        <Text>
                            <Markdown>{transaction.description}</Markdown>
                        </Text>
                    )}
                    {transaction.transactionHash && (
                        <div>
                            <Text>Mã giao dịch: </Text>
                            <Text
                                strong
                                style={{
                                    wordBreak: 'break-all',
                                }}
                                copyable={{
                                    text: transaction.transactionHash,
                                    tooltips: ['Sao chép mã giao dịch', 'Đã sao chép'],
                                }}
                            >
                                {transaction.transactionHash}
                            </Text>
                        </div>
                    )}
                    <Flex gap={4}>
                        <Text>Số tiền cần thanh toán:</Text>
                        <Text strong>{formatCurrency(transaction.amount, true)}</Text>
                    </Flex>
                    <Flex gap={4}>
                        <Text>Thời gian tạo:</Text>
                        <Text strong>{formatDate(getLocalTime(transaction.createdAt))}</Text>
                    </Flex>
                    {transaction.endDate && transaction.status === 'PENDING' && (
                        <div>
                            <Text>Hạn thanh toán:</Text>
                            &nbsp;
                            <Text strong>{dayjs(getLocalTime(transaction.endDate)).format('00:00:00 DD/MM/YYYY')}</Text>
                            &nbsp;
                            <Text>
                                (Còn lại:&nbsp;
                                <strong>{dayjs(transaction.endDate).diff(dayjs(), 'day')} ngày</strong>)
                            </Text>
                        </div>
                    )}
                    <Flex
                        style={{
                            marginTop: 8,
                        }}
                        align="center"
                        justify="space-between"
                    >
                        <Tag color={getTransactionColor(transaction.status)}>
                            {getTransactionStatusText(transaction.status)}
                        </Tag>
                        {transaction.status === 'PENDING' && (
                            <Flex gap={8}>
                                <Extension
                                    endDate={new Date(transaction.endDate!)}
                                    contractId={transaction.contractId}
                                    transactionId={transaction.id}
                                    type="EXTEND_PAYMENT"
                                />
                                <PaymentTransaction
                                    message={transaction.description}
                                    isDeposit={!transaction.toId}
                                    transactionId={transaction.id}
                                    contractId={transaction.contractId}
                                />
                            </Flex>
                        )}
                    </Flex>
                </div>
            </Flex>
        </Card>
    );
};

export default Payment;
