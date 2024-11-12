'use client';

import CancelModal from '@/app/(base)/contracts/cancel-modal';
import AddContractModal from '@/app/owner/contracts/add-contract-modal';
import ButtonLink from '@/components/button/button-link';
import CancelBeforeDeposit from '@/components/contracts/cancel-before-deposit';
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
import { getContractsByOwner } from '@/services/contract-service';
import { Button, Flex, Space, TableProps, Tag, Tooltip } from 'antd';
import { Eye, Plus, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

const ContractsTable = () => {
    const [contracts, setContracts] = useState<ITable<IContract>>(initDataTable);
    const [loading, setLoading] = useState(true);
    const [cancelContract, setCancelContract] = useState<IContract | null>(null);
    const { page, pageSize } = usePagination();
    const [showAddModal, setShowAddModal] = useState(false);

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
                title: 'Người thuê',
                dataIndex: ['renter', 'name'],
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

    const handleShowAddModal = () => {
        setShowAddModal(true);
    };

    const getContracts = useCallback(async ({ page = 1, pageSize = 10 }: { page?: number; pageSize?: number }) => {
        setLoading(true);

        try {
            const pagination = toSkipTake(page, pageSize);

            const res = await getContractsByOwner(pagination);

            setContracts(res);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const refresh = () => {
        getContracts({
            page: 1,
            pageSize,
        });
    };

    useEffect(() => {
        getContracts({
            page,
            pageSize,
        });
    }, [getContracts, page, pageSize]);

    return (
        <>
            <Flex gap="small" justify="flex-end" wrap className="my-4">
                <Button icon={<Plus className="w-5 h-5" />} onClick={handleShowAddModal} />
            </Flex>
            <AddContractModal open={showAddModal} setOpen={setShowAddModal} refresh={refresh} />
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
        </>
    );
};

export default ContractsTable;
