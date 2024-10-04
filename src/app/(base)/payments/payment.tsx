'use client';

import PaymentTransaction from '@/app/(base)/payments/payment-transaction';
import { Card } from '@/components/ui/card';
import { ITransaction } from '@/interfaces/transaction';
import { formatCurrency, formatDate, formatDateTime, getTransactionColor, getTransactionStatusText } from '@/lib/utils';
import { Flex, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { ReceiptText } from 'lucide-react';
import Markdown from 'react-markdown';

const Payment = ({ transaction }: { transaction: ITransaction }) => {
    return (
        <Card className="p-4">
            <Flex align="center" gap={16}>
                <ReceiptText size={30} className="text-antd-primary" />
                <div>
                    <Typography.Title level={5}>{transaction.title}</Typography.Title>
                    {transaction.description && (
                        <Typography.Text>
                            <Markdown>{transaction.description}</Markdown>
                        </Typography.Text>
                    )}
                    {transaction.transactionHash && (
                        <div>
                            <Typography.Text>Mã giao dịch:</Typography.Text>
                            &nbsp;
                            <Typography.Text
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
                            </Typography.Text>
                        </div>
                    )}
                    <Flex gap={4}>
                        <Typography.Text>Số tiền cần thanh toán:</Typography.Text>
                        <Typography.Text strong>{formatCurrency(transaction.amount, true)}</Typography.Text>
                    </Flex>
                    <Flex gap={4}>
                        <Typography.Text>Thời gian tạo:</Typography.Text>
                        <Typography.Text strong>{formatDate(transaction.createdAt)}</Typography.Text>
                    </Flex>
                    {transaction.endDate && transaction.status === 'PENDING' && (
                        <div>
                            <Typography.Text>Hạn thanh toán:</Typography.Text>
                            &nbsp;
                            <Typography.Text strong>{formatDateTime(transaction.endDate)}</Typography.Text>
                            &nbsp;
                            <Typography.Text>
                                (Còn lại:&nbsp;
                                <strong>{dayjs(transaction.endDate).diff(dayjs(), 'day')} ngày</strong>)
                            </Typography.Text>
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
                            <PaymentTransaction
                                isDeposit={!transaction.toId}
                                transactionId={transaction.id}
                                contractId={transaction.contractId}
                            />
                        )}
                    </Flex>
                </div>
            </Flex>
        </Card>
    );
};

export default Payment;
