'use client';

import Title from '@/components/title';
import { ITransactionDetail } from '@/interfaces/transaction';
import { formatCurrency, formatDateTime, formatEth, getTransactionTypeText } from '@/lib/utils';
import { useUserStore } from '@/stores/user-store';
import { Button, Flex } from 'antd';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import React from 'react';

const Price = ({ price, priceEth, title }: { title: string; price: number; priceEth: number }) => {
    return (
        <Flex justify="space-between" align="center">
            <Flex>
                <div className="w-[60px]">{title}</div> :{' '}
                <div className="w-[100px] text-right">{formatCurrency(price)} đ</div>
            </Flex>
            <span>{formatEth(priceEth)}</span>
        </Flex>
    );
};

const Invoice = ({ transaction }: { transaction: ITransactionDetail }) => {
    const pdfRef = React.useRef<HTMLDivElement>(null);
    const { user } = useUserStore();
    const isFromMe = transaction.fromId === user?.userId;
    const fee = isFromMe ? transaction.fee || 0 : 0;
    const feeEth = isFromMe ? transaction.feeEth || 0 : 0;

    const generatePDF = () => {
        const input = pdfRef.current;

        if (!input) {
            return;
        }

        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'PNG', 10, 10, 190, 160); // Kích thước khung hình
            pdf.save('thanh-toan-thue.pdf');
        });
    };

    return (
        <div>
            <Button
                onClick={generatePDF}
                style={{
                    zIndex: 1,
                }}
            >
                Tải hóa đơn
            </Button>
            <div className="absolute opacity-0 top-0 left-0">
                <div style={{ padding: '20px' }}>
                    <div
                        ref={pdfRef}
                        style={{ border: '1px solid #ccc', padding: '20px', width: '500px', textAlign: 'left' }}
                    >
                        <Title
                            level={4}
                            style={{
                                textAlign: 'center',
                            }}
                        >
                            {transaction.title}
                        </Title>
                        <Flex justify="space-between" align="center">
                            <p>
                                <b>Người gửi:</b> {transaction.from?.name || 'Smart Contract'}
                            </p>
                            <p>
                                <b>Người nhận:</b> {transaction.to?.name || 'Smart Contract'}
                            </p>
                        </Flex>
                        <hr />
                        <Title
                            style={{
                                textAlign: 'left',
                            }}
                            level={5}
                        >
                            Thông tin thanh toán
                        </Title>
                        <Price title="Số tiền" price={transaction.amount} priceEth={transaction.amountEth || 0} />
                        <Price title="Phí" price={fee} priceEth={feeEth || 0} />
                        <Price
                            title="Tổng tiền"
                            price={transaction.amount + fee}
                            priceEth={feeEth + transaction.amountEth}
                        />
                        <hr />
                        <p>
                            <b>Loại giao dịch:</b> {getTransactionTypeText(transaction.type)}
                        </p>
                        <p>
                            <b>Ngày tạo:</b> {formatDateTime(transaction.createdAt)}
                        </p>
                        <p>
                            <b>Mô tả:</b> {transaction.description}
                        </p>
                        <p>
                            <b>Mã giao dịch (Hash):</b> <a href="#">{transaction.transactionHash}</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Invoice;
