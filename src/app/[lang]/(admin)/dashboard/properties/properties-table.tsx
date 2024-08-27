'use client';

import RejectPropertyModal, { IRejectInput } from '@/app/[lang]/(admin)/dashboard/properties/reject-property-modal';
import { PropertyDashboardDictionary } from '@/app/[lang]/dictionaries';
import TablePagination from '@/components/table-pagination';
import { initDataTable } from '@/constants/init-data';
import usePagination from '@/hooks/usePagination';
import { IProperty, PropertyStatus } from '@/interfaces/property';
import { ITable } from '@/interfaces/table';
import { formatCurrency, formatDateTime, getPropertyStatusColor, toSkipTake } from '@/lib/utils';
import { getAllNotDeletedProperties, updateApprovalProperties } from '@/services/property-service';
import { Button, Flex, Space, TableProps, Tag, Tooltip } from 'antd';
import { Check, Eye, Filter, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

type IPropertiesTable = ITable<IProperty>;

const DISABLED_REJECT_STATUS = ['INACTIVE', 'UNAVAILABLE', 'REJECTED'] as PropertyStatus[];
const DISABLED_APPROVE_STATUS = ['INACTIVE', 'UNAVAILABLE', 'ACTIVE'] as PropertyStatus[];

const PropertiesTable = ({ propertiesDashboardDict }: { propertiesDashboardDict: PropertyDashboardDictionary }) => {
    const [data, setData] = useState<IPropertiesTable>(initDataTable);
    const [loading, setLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState(false);
    const [isOpenRejectModal, setIsOpenRejectModal] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<IProperty | null>(null);

    const { page, pageSize } = usePagination();

    const handleApprove = useCallback(
        async (property_id: string) => {
            try {
                await updateApprovalProperties([property_id], 'ACTIVE');
                setData((prev) => ({
                    ...prev,
                    data: prev.data.map((property) =>
                        property.property_id === property_id ? { ...property, status: 'ACTIVE' } : property,
                    ),
                }));

                toast.success(propertiesDashboardDict['message-approve-success']);
            } catch (error) {
                console.error(error);
                toast.error(propertiesDashboardDict['message-approve-fail']);
            }
        },
        [propertiesDashboardDict],
    );

    const handleReject = useCallback((property: IProperty) => {
        setSelectedProperty(property);
        setIsOpenRejectModal(true);
    }, []);

    const handleConfirmReject = useCallback(
        async ({ property_id, reason }: IRejectInput) => {
            try {
                await updateApprovalProperties([property_id], 'REJECTED', reason);
                setData((prev) => ({
                    ...prev,
                    data: prev.data.map((property) =>
                        property.property_id === property_id ? { ...property, status: 'REJECTED' } : property,
                    ),
                }));

                toast.success(propertiesDashboardDict['message-reject-success']);
            } catch (error) {
                console.error(error);
                toast.error(propertiesDashboardDict['message-reject-fail']);
            }
        },
        [propertiesDashboardDict],
    );

    const columns: TableProps<IProperty>['columns'] = useMemo(
        () => [
            {
                title: '#',
                dataIndex: 'property_id',
                width: 50,
                render: (_: any, __: any, index: number) => index + 1,
            },
            {
                title: propertiesDashboardDict.title,
                dataIndex: 'title',
                width: 170,
                render: (value: string) => (
                    <Tooltip title={value}>
                        <span className="line-clamp-3">{value}</span>
                    </Tooltip>
                ),
            },
            {
                title: propertiesDashboardDict.description,
                dataIndex: 'description',
                width: 250,
                render: (value: string) => (
                    <Tooltip title={value}>
                        <span className="line-clamp-3">{value}</span>
                    </Tooltip>
                ),
            },
            {
                title: propertiesDashboardDict.address,
                dataIndex: ['address', 'street'],
                width: 170,
            },
            {
                title: propertiesDashboardDict.ward,
                dataIndex: ['address', 'ward'],
                width: 120,
            },
            {
                title: propertiesDashboardDict.district,
                dataIndex: ['address', 'district'],
                width: 120,
            },
            {
                title: propertiesDashboardDict.city,
                dataIndex: ['address', 'city'],
                width: 120,
            },
            {
                title: propertiesDashboardDict['id-owner'],
                width: 150,
                render: (record: IProperty) => `${record.owner.user_id} - ${record.owner.name}`,
            },
            {
                title: propertiesDashboardDict.deposit,
                dataIndex: 'deposit',
                align: 'right',
                width: 130,
                render: (value) => formatCurrency(value, true),
            },
            {
                title: propertiesDashboardDict.prices,
                dataIndex: 'prices',
                align: 'right',
                width: 130,
                render: (value) => formatCurrency(value, true),
            },
            {
                title: propertiesDashboardDict.status,
                dataIndex: 'status',
                width: 100,
                render: (status: PropertyStatus) => <Tag color={getPropertyStatusColor(status)}>{status}</Tag>,
            },
            {
                title: propertiesDashboardDict.created_at,
                dataIndex: 'created_at',
                width: 170,
                render: formatDateTime,
            },
            {
                title: propertiesDashboardDict.updated_at,
                dataIndex: 'updated_at',
                width: 170,
                render: formatDateTime,
            },
            {
                title: propertiesDashboardDict.actions,
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
                            onClick={() => handleApprove(property.property_id)}
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
        [handleApprove, handleReject, propertiesDashboardDict],
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
                rowKey={(record) => record.property_id}
                columns={columns}
                dataSource={data.data}
                pagination={data.pageInfo}
            />
            {selectedProperty && (
                <RejectPropertyModal
                    cancelText={propertiesDashboardDict['reject-modal-cancel']}
                    okText={propertiesDashboardDict['reject-modal-ok']}
                    reasonLabel={propertiesDashboardDict['reject-reason-label']}
                    reasonPlaceholder={propertiesDashboardDict['reject-reason-placeholder']}
                    reasonRequiredMessage={propertiesDashboardDict['reject-reason-required']}
                    title={propertiesDashboardDict['reject-modal-title']}
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
