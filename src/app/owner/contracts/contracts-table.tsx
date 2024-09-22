'use client';

import CancelModal from '@/app/(base)/contracts/cancel-modal';
import TablePagination from '@/components/table-pagination';
import { ContractStatus, IContract } from '@/interfaces/contract';
import { formatCurrency, formatDate, formatDateTime, getContractColor, getContractStatusText } from '@/lib/utils';
import { getContractsByOwner } from '@/services/contract-service';
import { Button, Space, TableProps, Tag, Tooltip } from 'antd';
import { Eye, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const ContractsTable = () => {
    const [contracts, setContracts] = useState<IContract[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancelContract, setCancelContract] = useState<IContract | null>(null);

    const handleClickCancel = (contract: IContract) => {
        setCancelContract(contract);
    };

    const columns: TableProps<IContract>['columns'] = useMemo(
        () => [
            {
                title: '#',
                dataIndex: 'contract_id',
                width: 50,
                render: (_: any, __: any, index: number) => index + 1,
            },
            {
                title: 'Tiêu đề',
                dataIndex: ['property', 'title'],
                width: 250,
            },
            {
                title: 'Người thuê',
                dataIndex: ['renter', 'name'],
                width: 170,
            },
            {
                title: 'Ngày bắt đầu',
                dataIndex: 'start_date',
                width: 170,
                render: formatDate,
            },
            {
                title: 'Ngày kết thúc',
                dataIndex: 'end_date',
                width: 170,
                render: formatDate,
            },
            {
                title: 'Giá',
                dataIndex: 'monthly_rent',
                width: 170,
                render: (value) => formatCurrency(value, true),
            },
            {
                title: 'Tiền cọc',
                dataIndex: 'deposit_amount',
                width: 170,
                render: (value) => formatCurrency(value, true),
            },
            {
                title: 'Trạng thái',
                dataIndex: 'status',
                width: 170,
                render: (status: ContractStatus) => {
                    return <Tag color={getContractColor(status)}>{getContractStatusText(status)}</Tag>;
                },
            },
            {
                title: 'Ngày tạo',
                dataIndex: 'created_at',
                width: 170,
                render: formatDateTime,
            },
            {
                title: 'Ngày cập nhật',
                dataIndex: 'updated_at',
                width: 170,
                render: formatDateTime,
            },
            {
                title: 'Hành động',
                fixed: 'right',
                align: 'center',
                width: 110,
                render: (contract: IContract) => (
                    <Space>
                        <Tooltip title="Xem chi tiết">
                            <Button type="text" icon={<Eye className="w-5 h-5" />} />
                        </Tooltip>
                        <Tooltip title="Huỷ hợp đồng">
                            <Button
                                disabled={contract.status === 'ENDED' || contract.status === 'CANCELLED'}
                                type="text"
                                danger
                                icon={<X className="w-5 h-5" />}
                                onClick={() => handleClickCancel(contract)}
                            />
                        </Tooltip>
                    </Space>
                ),
            },
        ],
        [],
    );

    const handleCloseCancelContract = () => {
        setCancelContract(null);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const res = await getContractsByOwner();
                console.log('🚀 ~ fetchData ~ res:', res);

                setContracts(res);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <TablePagination
                loading={loading}
                rowKey={(record) => record.contract_id}
                columns={columns}
                dataSource={contracts}
                // pagination={data.pageInfo}
                // rowSelection={{
                //     fixed: true,
                //     type: 'checkbox',
                //     selectedRowKeys,
                //     getCheckboxProps,
                //     onChange: setSelectedRowKeys,
                // }}
            />
            <CancelModal contract={cancelContract} onClose={handleCloseCancelContract} />
        </>
    );
};

export default ContractsTable;
