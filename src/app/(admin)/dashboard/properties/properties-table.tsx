'use client';

import RejectPropertyModal, { IRejectInput } from '@/app/(admin)/dashboard/properties/reject-property-modal';
import TablePagination from '@/components/table-pagination';
import { initDataTable } from '@/constants/init-data';
import usePagination from '@/hooks/usePagination';
import { IProperty, PropertyStatus } from '@/interfaces/property';
import { ITable } from '@/interfaces/table';
import { formatCurrency, formatDateTime, getPropertyStatusColor, getPropertyStatusText, toSkipTake } from '@/lib/utils';
import { getAllNotDeletedProperties, updateApprovalProperties } from '@/services/property-service';
import { Button, Flex, Space, TableProps, Tag, Tooltip } from 'antd';
import { Check, Eye, Filter, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

type IPropertiesTable = ITable<IProperty>;

const DISABLED_REJECT_STATUS = ['INACTIVE', 'UNAVAILABLE', 'REJECTED'] as PropertyStatus[];
const DISABLED_APPROVE_STATUS = ['INACTIVE', 'UNAVAILABLE', 'ACTIVE'] as PropertyStatus[];

const PropertiesTable = () => {
    const [data, setData] = useState<IPropertiesTable>(initDataTable);
    const [loading, setLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState(false);
    const [isOpenRejectModal, setIsOpenRejectModal] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<IProperty | null>(null);

    const { page, pageSize } = usePagination();

    const handleApprove = useCallback(async (propertyId: string) => {
        try {
            await updateApprovalProperties([propertyId], 'ACTIVE');
            setData((prev) => ({
                ...prev,
                data: prev.data.map((property) =>
                    property.propertyId === propertyId ? { ...property, status: 'ACTIVE' } : property,
                ),
            }));

            toast.success('Bất động sản đã được duyệt');
        } catch (error) {
            console.error(error);
            toast.error('Duyệt bất động sản thất bại');
        }
    }, []);

    const handleReject = useCallback((property: IProperty) => {
        setSelectedProperty(property);
        setIsOpenRejectModal(true);
    }, []);

    const handleConfirmReject = useCallback(async ({ propertyId, reason }: IRejectInput) => {
        try {
            await updateApprovalProperties([propertyId], 'REJECTED', reason);
            setData((prev) => ({
                ...prev,
                data: prev.data.map((property) =>
                    property.propertyId === propertyId ? { ...property, status: 'REJECTED' } : property,
                ),
            }));

            toast.success('Bất động sản đã bị từ chối');
        } catch (error) {
            console.error(error);
            toast.error('Từ chối bất động sản thất bại');
        }
    }, []);

    const columns: TableProps<IProperty>['columns'] = useMemo(
        () => [
            {
                title: '#',
                dataIndex: 'propertyId',
                width: 50,
                render: (_: any, __: any, index: number) => index + 1,
            },
            {
                title: 'Tiêu đề',
                dataIndex: 'title',
                width: 170,
                render: (value: string) => (
                    <Tooltip title={value}>
                        <span className="line-clamp-3">{value}</span>
                    </Tooltip>
                ),
            },
            {
                title: 'Mô tả',
                dataIndex: 'description',
                width: 250,
                render: (value: string) => (
                    <Tooltip title={value}>
                        <span className="line-clamp-3">{value}</span>
                    </Tooltip>
                ),
            },
            {
                title: 'Địa chỉ',
                dataIndex: ['address', 'street'],
                width: 170,
            },
            {
                title: 'Phường',
                dataIndex: ['address', 'ward'],
                width: 120,
            },
            {
                title: 'Quận',
                dataIndex: ['address', 'district'],
                width: 120,
            },
            {
                title: 'Thành phố',
                dataIndex: ['address', 'city'],
                width: 120,
            },
            {
                title: 'ID - Chủ sở hữu',
                width: 150,
                render: (record: IProperty) => `${record.owner.userId} - ${record.owner.name}`,
            },
            {
                title: 'Tiền cọc',
                dataIndex: 'deposit',
                align: 'right',
                width: 130,
                render: (value) => formatCurrency(value, true),
            },
            {
                title: 'Giá',
                dataIndex: 'price',
                align: 'right',
                width: 130,
                render: (value) => formatCurrency(value, true),
            },
            {
                title: 'Trạng thái',
                dataIndex: 'status',
                width: 100,
                render: (status: PropertyStatus) => (
                    <Tag color={getPropertyStatusColor(status)}>{getPropertyStatusText(status)}</Tag>
                ),
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
                render: (property: IProperty) => (
                    <Space>
                        <Button type="text" icon={<Eye className="w-5 h-5" />} />
                        <Button
                            disabled={DISABLED_APPROVE_STATUS.includes(property.status)}
                            type="link"
                            icon={<Check className="w-5 h-5" />}
                            onClick={() => handleApprove(property.propertyId)}
                        />
                        <Button
                            disabled={DISABLED_REJECT_STATUS.includes(property.status)}
                            type="text"
                            danger
                            icon={<X className="w-5 h-5" />}
                            onClick={() => handleReject(property)}
                        />
                    </Space>
                ),
            },
        ],
        [handleApprove, handleReject],
    );

    const handleToggleFilter = () => setActiveFilter((prev) => !prev);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);

            try {
                const res = await getAllNotDeletedProperties(toSkipTake(page, pageSize));

                setData(res);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [page, pageSize]);

    return (
        <>
            <Flex gap="small" wrap className="my-4">
                <Button
                    type={activeFilter ? 'primary' : 'default'}
                    className="ml-auto"
                    icon={<Filter className="w-5 h-5" />}
                    onClick={handleToggleFilter}
                />
            </Flex>
            <TablePagination
                loading={loading}
                rowKey={(record) => record.propertyId}
                columns={columns}
                dataSource={data.data}
                pagination={data.pageInfo}
            />
            {selectedProperty && (
                <RejectPropertyModal
                    open={isOpenRejectModal}
                    property={selectedProperty}
                    setOpen={setIsOpenRejectModal}
                    onReject={handleConfirmReject}
                />
            )}
        </>
    );
};

export default PropertiesTable;
