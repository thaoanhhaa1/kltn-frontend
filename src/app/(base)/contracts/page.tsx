'use client';

import CancelModal from '@/app/(base)/contracts/cancel-modal';
import ButtonLink from '@/components/button/button-link';
import CancelBeforeDeposit from '@/components/contracts/cancel-before-deposit';
import Forbidden from '@/components/forbidden';
import TablePagination from '@/components/table-pagination';
import { initDataTable } from '@/constants/init-data';
import usePagination from '@/hooks/usePagination';
import { ContractStatus, IContract } from '@/interfaces/contract';
import { ITable } from '@/interfaces/table';
import {
    formatCurrency,
    formatDate,
    formatDateTime,
    getContractColor,
    getContractStatusText,
    toSkipTake,
} from '@/lib/utils';
import { RENTAL_CONTRACTS } from '@/path';
import { getContractsByRenter } from '@/services/contract-service';
import { useUserStore } from '@/stores/user-store';
import { Button, Space, TableProps, Tag, Tooltip, Typography } from 'antd';
import { Eye, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

const ContractsPage = () => {
    const { user } = useUserStore();
    const [contracts, setContracts] = useState<ITable<IContract>>(initDataTable);
    const [loading, setLoading] = useState(true);
    const [cancelContract, setCancelContract] = useState<IContract | null>(null);
    const { page, pageSize } = usePagination();

    const handleClickCancel = (contract: IContract) => {
        setCancelContract(contract);
    };

    const columns: TableProps<IContract>['columns'] = useMemo(
        () => [
            {
                title: '#',
                dataIndex: 'contractId',
                width: 50,
                render: (_: any, __: any, index: number) => (page - 1) * pageSize + index + 1,
            },
            {
                title: 'Tiêu đề',
                dataIndex: ['property', 'title'],
                width: 250,
            },
            {
                title: 'Chủ nhà',
                dataIndex: ['owner', 'name'],
                width: 200,
            },
            {
                title: 'Ngày bắt đầu',
                dataIndex: 'startDate',
                width: 170,
                render: formatDate,
            },
            {
                title: 'Ngày kết thúc',
                dataIndex: 'endDateActual',
                width: 170,
                render: formatDate,
            },
            {
                title: 'Giá',
                dataIndex: 'monthlyRent',
                width: 170,
                align: 'right',
                render: (value) => formatCurrency(value, true),
            },
            {
                title: 'Tiền cọc',
                dataIndex: 'depositAmount',
                width: 170,
                align: 'right',
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
                dataIndex: 'createdAt',
                width: 170,
                render: formatDateTime,
            },
            {
                title: 'Ngày cập nhật',
                dataIndex: 'updatedAt',
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
                            <ButtonLink href={`${RENTAL_CONTRACTS}/${contract.contractId}`}>
                                <Eye className="w-5 h-5" />
                            </ButtonLink>
                        </Tooltip>
                        {(contract.status === 'WAITING' && (
                            <CancelBeforeDeposit contractId={contract.contractId} setContracts={setContracts} />
                        )) || (
                            <Tooltip title="Huỷ hợp đồng">
                                <Button
                                    disabled={contract.status === 'ENDED' || contract.status === 'CANCELLED'}
                                    type="text"
                                    danger
                                    icon={<X className="w-5 h-5" />}
                                    onClick={() => handleClickCancel(contract)}
                                />
                            </Tooltip>
                        )}
                    </Space>
                ),
            },
        ],
        [page, pageSize],
    );

    const handleCloseCancelContract = () => {
        setCancelContract(null);
    };

    const fetchData = useCallback(async (page: number, pageSize: number) => {
        setLoading(true);

        try {
            const pagination = toSkipTake(page, pageSize);
            const res = await getContractsByRenter(pagination);

            setContracts(res);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(page, pageSize);
    }, [fetchData, page, pageSize]);

    if (!user?.userTypes.includes('renter')) return <Forbidden />;

    return (
        <div className="mt-5">
            <Typography.Title
                style={{
                    textAlign: 'center',
                }}
                level={3}
            >
                Hợp đồng của tôi
            </Typography.Title>
            <TablePagination
                loading={loading}
                rowKey={(record) => record.contractId}
                columns={columns}
                dataSource={contracts.data}
                pagination={contracts.pageInfo}
                // rowSelection={{
                //     fixed: true,
                //     type: 'checkbox',
                //     selectedRowKeys,
                //     getCheckboxProps,
                //     onChange: setSelectedRowKeys,
                // }}
            />
            <CancelModal contract={cancelContract} onClose={handleCloseCancelContract} setContracts={setContracts} />
        </div>
    );
};

export default ContractsPage;
