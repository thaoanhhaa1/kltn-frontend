'use client';

import { PropertyDashboardDictionary, PropertyOwnerDictionary } from '@/app/[lang]/dictionaries';
import TablePagination from '@/components/table-pagination';
import { initDataTable } from '@/constants/init-data';
import usePagination from '@/hooks/usePagination';
import { IProperty, PropertyStatus } from '@/interfaces/property';
import { ITable } from '@/interfaces/table';
import { formatCurrency, formatDateTime, getPropertyStatusColor, toSkipTake } from '@/lib/utils';
import { getAllNotDeletedPropertiesByOwnerId, updateVisibleProperties } from '@/services/property-service';
import { Button, Flex, Space, TableProps, Tag, Tooltip } from 'antd';
import { Eye } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

type IPropertiesTable = ITable<IProperty>;

const PropertiesTable = ({
    propertiesDashboardDict,
    propertyOwnerDict,
}: {
    propertiesDashboardDict: PropertyDashboardDictionary;
    propertyOwnerDict: PropertyOwnerDictionary;
}) => {
    const [data, setData] = useState<IPropertiesTable>(initDataTable);
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const { page, pageSize } = usePagination();

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
                title: propertiesDashboardDict.deposit,
                dataIndex: 'deposit',
                align: 'right',
                width: 130,
                render: formatCurrency,
            },
            {
                title: propertiesDashboardDict.prices,
                dataIndex: 'prices',
                align: 'right',
                width: 130,
                render: formatCurrency,
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
                render: () => (
                    <Space>
                        <Button type="text" icon={<Eye className="w-5 h-5" />} />
                    </Space>
                ),
            },
        ],
        [propertiesDashboardDict],
    );

    const getCheckboxProps = useCallback((record: IProperty) => {
        return {
            disabled: ['UNAVAILABLE', 'PENDING'].includes(record.status),
            name: record.property_id,
        };
    }, []);

    const handleUpdateProperties = useCallback((properties: Array<IProperty>) => {
        setData((prev) => {
            const oldProperties = prev.data;

            const newProperties = oldProperties.map((property) => {
                const newProperty = properties.find((p) => p.property_id === property.property_id);

                if (newProperty) {
                    return newProperty;
                }

                return property;
            });

            return {
                ...prev,
                data: newProperties,
            };
        });
    }, []);

    const handleActiveProperties = useCallback(async () => {
        const res = await updateVisibleProperties(selectedRowKeys as string[], 'ACTIVE');

        handleUpdateProperties(res);
        setSelectedRowKeys([]);
    }, [handleUpdateProperties, selectedRowKeys]);

    const handleInactiveProperties = useCallback(async () => {
        const res = await updateVisibleProperties(selectedRowKeys as string[], 'INACTIVE');

        handleUpdateProperties(res);
        setSelectedRowKeys([]);
    }, [handleUpdateProperties, selectedRowKeys]);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);

            try {
                const res = await getAllNotDeletedPropertiesByOwnerId(toSkipTake(page, pageSize));

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
                <Button disabled={!selectedRowKeys.length} type="primary" onClick={handleActiveProperties}>
                    {propertyOwnerDict.active}
                </Button>
                <Button disabled={!selectedRowKeys.length} type="primary" onClick={handleInactiveProperties}>
                    {propertyOwnerDict.inactive}
                </Button>
            </Flex>
            <TablePagination
                loading={loading}
                rowKey={(record) => record.property_id}
                columns={columns}
                dataSource={data.data}
                pagination={data.pageInfo}
                rowSelection={{
                    fixed: true,
                    type: 'checkbox',
                    selectedRowKeys,
                    getCheckboxProps,
                    onChange: setSelectedRowKeys,
                }}
            />
        </>
    );
};

export default PropertiesTable;
