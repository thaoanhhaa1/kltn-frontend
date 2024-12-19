'use client';

import Title from '@/components/title';
import { ITransactionDetail } from '@/interfaces/transaction';
import { formatCurrency, formatEth } from '@/lib/utils';
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
                            Thanh toán tiền thuê tháng 12
                        </Title>
                        <Flex justify="space-between" align="center">
                            <p>
                                <b>Người gửi:</b> TRƯƠNG VĂN THÔNG
                            </p>
                            <p>
                                <b>Người nhận:</b> VÕ THỊ VŨ
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
                        <Price title="Phí" price={transaction.fee} priceEth={transaction.feeEth || 0} />
                        <Price
                            title="Tổng tiền"
                            price={transaction.amount + transaction.fee}
                            priceEth={transaction.feeEth + transaction.amountEth}
                        />
                        <hr />
                        <p>
                            <b>Loại giao dịch:</b> Thanh toán thuê nhà
                        </p>
                        <p>
                            <b>Ngày tạo:</b> 19:41:29 14/12/2024
                        </p>
                        <p>
                            <b>Mô tả:</b> Thanh toán tiền thuê tháng 12 cho hợp đồng
                            <b> e2c1aa90-a125-4980-b211-be60aa5a4678</b>
                        </p>
                        <p>
                            <b>Mã giao dịch (Hash):</b>{' '}
                            <a href="#">0xad060c5620bb6e4e8f287e27ab5c0be0b8f224f9e9b76cfd8ad1cf2209d277e</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Invoice;
