'use client';

import ContractModal from '@/app/owner/rental-requests/contract-modal';
import TablePagination from '@/components/table-pagination';
import { initDataTable } from '@/constants/init-data';
import usePagination from '@/hooks/usePagination';
import { IRentalRequest } from '@/interfaces/rentalRequest';
import { ITable } from '@/interfaces/table';
import {
    formatCurrency,
    formatDate,
    formatDateTime,
    getRentalRequestColor,
    getRentalRequestStatusText,
    toSkipTake,
} from '@/lib/utils';
import { IUpdateRentalRequestStatus } from '@/schemas/rental-request.schema';
import { ownerGetAllRentalRequests, ownerUpdateRentalRequestStatus } from '@/services/rental-request-service';
import { Button, Space, TableProps, Tag } from 'antd';
import { Check, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

const RentalRequestsTable = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ITable<IRentalRequest>>(initDataTable);
    const { page, pageSize } = usePagination();
    const [selectedRentalRequest, setSelectedRentalRequest] = useState<IRentalRequest | undefined>();

    const fetchRentalRequests = useCallback(async () => {
        setLoading(true);

        try {
            const pagination = toSkipTake(page, pageSize);
            const res = await ownerGetAllRentalRequests(pagination);

            setData(res);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, [page, pageSize]);

    const handleUpdateStatus = useCallback(
        async (params: IUpdateRentalRequestStatus) => {
            try {
                await ownerUpdateRentalRequestStatus(params);

                toast.success('Cập nhật trạng thái thành công');
                await fetchRentalRequests();
            } catch (error) {
                console.log(error);
                toast.error('Có lỗi xảy ra');
            }
        },
        [fetchRentalRequests],
    );

    const handlePreAccept = useCallback((rentalRequest: IRentalRequest) => {
        setSelectedRentalRequest(rentalRequest);
    }, []);

    const columns: TableProps<IRentalRequest>['columns'] = useMemo(
        () => [
            {
                title: '#',
                dataIndex: 'propertyId',
                width: 50,
                render: (_: any, __: any, index: number) => index + 1,
            },
            {
                title: 'Tiêu đề',
                dataIndex: ['property', 'title'],
                width: 250,
            },
            {
                align: 'right',
                title: 'Giá thuê',
                dataIndex: 'rentalPrice',
                width: 150,
                render: (value) => formatCurrency(value, true),
            },
            {
                align: 'right',
                title: 'Tiền cọc',
                dataIndex: 'rentalDeposit',
                width: 150,
                render: (value) => formatCurrency(value, true),
            },
            {
                title: 'Ngày bắt đầu',
                dataIndex: 'rentalStartDate',
                width: 130,
                render: (value) => formatDate(value),
            },
            {
                title: 'Ngày kết thúc',
                dataIndex: 'rentalEndDate',
                width: 130,
                render: (value) => formatDate(value),
            },
            {
                title: 'Trạng thái',
                dataIndex: 'status',
                width: 100,
                render: (value) => <Tag color={getRentalRequestColor(value)}>{getRentalRequestStatusText(value)}</Tag>,
            },
            {
                title: 'Ngày tạo',
                dataIndex: 'createdAt',
                width: 180,
                render: (value) => formatDateTime(value),
            },
            {
                title: 'Ngày cập nhật',
                dataIndex: 'updatedAt',
                width: 180,
                render: (value) => formatDateTime(value),
            },
            {
                title: 'Hành động',
                fixed: 'right',
                align: 'center',
                width: 110,
                render: (rentalRequest: IRentalRequest) => (
                    <Space>
                        <Button
                            disabled={rentalRequest.status !== 'PENDING'}
                            type="link"
                            icon={<Check className="w-5 h-5" />}
                            onClick={() => handlePreAccept(rentalRequest)}
                        />
                        <Button
                            disabled={rentalRequest.status !== 'PENDING'}
                            type="text"
                            danger
                            icon={<X className="w-5 h-5" />}
                            onClick={() =>
                                handleUpdateStatus({
                                    slug: rentalRequest.property.slug,
                                    status: 'REJECTED',
                                })
                            }
                        />
                    </Space>
                ),
            },
        ],
        [handlePreAccept, handleUpdateStatus],
    );

    useEffect(() => {
        fetchRentalRequests();
    }, [fetchRentalRequests]);

    return (
        <>
            <TablePagination
                loading={loading}
                rowKey={(record) => record.requestId}
                columns={columns}
                dataSource={data.data}
                pagination={data.pageInfo}
            />
            <ContractModal
                open={!!selectedRentalRequest}
                onClose={() => setSelectedRentalRequest(undefined)}
                rentalRequest={selectedRentalRequest}
                fetchRentalRequests={fetchRentalRequests}
            />
        </>
    );
};

export default RentalRequestsTable;
