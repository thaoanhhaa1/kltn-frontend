import { ITransactionDetail } from '@/interfaces/transaction';
import {
    formatCurrency,
    formatDateTime,
    formatEth,
    getTransactionColor,
    getTransactionStatusText,
    getTransactionTypeText,
    sumAmountCurrency,
} from '@/lib/utils';
import { Modal, Tag } from 'antd';
import { BookOpen, Clock, FileText, Users } from 'lucide-react';
import Markdown from 'react-markdown';

const TransactionDetailView = ({
    transaction,
    isIncome = false,
    open,
    onClose,
}: {
    transaction: ITransactionDetail;
    isIncome?: boolean;
    open: boolean;
    onClose: () => void;
}) => {
    return (
        <Modal
            open={open}
            width="100%"
            centered
            style={{
                maxWidth: '800px',
                paddingInline: '8px',
            }}
            closable
            onCancel={onClose}
            footer={null}
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{transaction.title}</h2>
                <Tag color={getTransactionColor(transaction.status)}>
                    {getTransactionStatusText(transaction.status)}
                </Tag>
            </div>

            {/* Thông tin người gửi và người nhận */}
            <div className="flex gap-4 mb-6 pb-4 border-b border-gray-200">
                {transaction.from && (
                    <div className="flex-1 flex items-center space-x-4">
                        <Users className="text-blue-500" />
                        <div className="flex-1">
                            <p className="text-gray-600">Người gửi</p>
                            <div className="flex justify-between items-center">
                                <p className="font-semibold">{transaction.from.name || 'SmartContract'}</p>
                            </div>
                        </div>
                    </div>
                )}
                {transaction.to && (
                    <div className="flex-1 flex items-center space-x-4">
                        <Users className="text-blue-500" />
                        <div className="flex-1">
                            <p className="text-gray-600">Người nhận</p>
                            <div className="flex justify-between items-center">
                                <p className="font-semibold">{transaction.to.name || 'SmartContract'}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Thông tin VND */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 flex items-center">Thông tin thanh toán</h3>
                    <div className="flex items-center space-x-3">
                        <div>
                            <p className="text-gray-600">Số tiền</p>
                            <p className="font-semibold text-green-600">{formatCurrency(transaction.amount, true)}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div>
                            <p className="text-gray-600">Phí</p>
                            <p className="font-semibold text-orange-600">
                                {formatCurrency(isIncome ? 0 : transaction.fee, true)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div>
                            <p className="text-gray-600">Tổng tiền</p>
                            <p className="font-semibold text-blue-700">
                                {formatCurrency(sumAmountCurrency(transaction.amount, transaction.fee, isIncome), true)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Thông tin ETH */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 flex items-center">&nbsp;</h3>
                    <div className="flex items-center space-x-3">
                        <div>
                            <p className="text-gray-600">&nbsp;</p>
                            <p className="font-semibold text-green-600">{formatEth(transaction.amountEth)}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div>
                            <p className="text-gray-600">&nbsp;</p>
                            <p className="font-semibold text-orange-600">
                                {formatEth(isIncome ? 0 : transaction.feeEth)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <div>
                            <p className="text-gray-600">&nbsp;</p>
                            <p className="font-semibold text-blue-700">
                                {formatEth(sumAmountCurrency(transaction.amountEth, transaction.feeEth, isIncome))}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Thông tin cơ bản */}
            <div className="mt-6 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                    <FileText className="text-blue-500" />
                    <div>
                        <p className="text-gray-600">Loại giao dịch</p>
                        <p className="font-semibold">{getTransactionTypeText(transaction.type)}</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <Clock className="text-blue-500" />
                    <div>
                        <p className="text-gray-600">Ngày tạo</p>
                        <p className="font-semibold">{formatDateTime(transaction.createdAt)}</p>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
                {transaction.description && (
                    <div className="flex items-center space-x-3 mb-3">
                        <BookOpen className="text-blue-500" />
                        <div>
                            <p className="text-gray-600">Mô tả</p>
                            <Markdown>{transaction.description}</Markdown>
                        </div>
                    </div>
                )}
                {transaction.transactionHash && (
                    <div className="bg-gray-50 p-3 rounded-md mt-3">
                        <p className="text-gray-600">Mã giao dịch (Hash)</p>
                        <a
                            href={`https://holesky.etherscan.io/tx/${transaction.transactionHash}`}
                            className="font-mono text-sm text-blue-700 truncate"
                            target="_blank"
                        >
                            {transaction.transactionHash}
                        </a>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default TransactionDetailView;
