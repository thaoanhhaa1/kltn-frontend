'use client';

import { PropertyDashboardDictionary, PropertyOwnerDictionary } from '@/app/[lang]/dictionaries';
import { IAddressName } from '@/app/[lang]/owner/properties/add/add-property-form';
import TableFilter from '@/components/table-filter';
import TablePagination from '@/components/table-pagination';
import { initDataTable } from '@/constants/init-data';
import { inputNumberProps, selectProps } from '@/constants/init-props';
import usePagination from '@/hooks/usePagination';
import { IFiterProperty, IProperty, PropertyStatus } from '@/interfaces/property';
import { ITable } from '@/interfaces/table';
import { formatCurrency, formatDateTime, getPropertyStatusColor, toSkipTake } from '@/lib/utils';
import { getCities, getDistricts, getWards, IAddress } from '@/services/address-service';
import {
    getAllNotDeletedPropertiesByOwnerId,
    getPropertyStatus,
    softDeleteProperty,
    updateVisibleProperties,
} from '@/services/property-service';
import { Button, Col, Flex, Form, Input, InputNumber, Popconfirm, Select, Space, TableProps, Tag, Tooltip } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { BaseOptionType, DefaultOptionType, SelectValue } from 'antd/es/select';
import { Eye, Filter, Trash } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { QuestionCircleOutlined } from '@ant-design/icons';

type IPropertiesTable = ITable<IProperty>;

const PropertiesTable = ({
    propertiesDashboardDict,
    propertyOwnerDict,
}: {
    propertiesDashboardDict: PropertyDashboardDictionary;
    propertyOwnerDict: PropertyOwnerDictionary;
}) => {
    const [form] = useForm<IFiterProperty>();
    const [data, setData] = useState<IPropertiesTable>(initDataTable);
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [cities, setCities] = useState<Array<IAddress>>([]);
    const [cityLoading, setCityLoading] = useState<boolean>(false);
    const [districts, setDistricts] = useState<Array<IAddress>>([]);
    const [distinctLoading, setDistinctLoading] = useState<boolean>(false);
    const [wards, setWards] = useState<Array<IAddress>>([]);
    const [wardLoading, setWardLoading] = useState<boolean>(false);
    const [addressName, setAddressName] = useState<IAddressName>({
        city: '',
        district: '',
        ward: '',
    });
    const [statuses, setStatuses] = useState<(BaseOptionType | DefaultOptionType)[]>([]);
    const [statusLoading, setStatusLoading] = useState<boolean>(false);
    const [activeFilter, setActiveFilter] = useState<boolean>(false);

    const { page, pageSize } = usePagination();

    const getProperties = useCallback(
        async ({
            page,
            pageSize,
            ...filter
        }: {
            page: number;
            pageSize: number;
        } & IFiterProperty) => {
            setLoading(true);

            try {
                const res = await getAllNotDeletedPropertiesByOwnerId({
                    ...toSkipTake(page, pageSize),
                    ...filter,
                });

                setData(res);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const handleSoftDeleteProperties = useCallback(
        async (propertyId: string) => {
            try {
                await softDeleteProperty(propertyId);

                getProperties({
                    page: 1,
                    pageSize,
                });
                toast.success(propertyOwnerDict['message-delete-success']);
            } catch (error) {
                console.log(error);
                toast.error(propertyOwnerDict['message-delete-fail']);
            }
        },
        [getProperties, pageSize, propertyOwnerDict],
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
                        <Popconfirm
                            title={propertyOwnerDict['pop-delete-title']}
                            description={propertyOwnerDict['pop-delete-content']}
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                            onConfirm={() => handleSoftDeleteProperties(property.property_id)}
                            okText={propertyOwnerDict['pop-delete-confirm']}
                            cancelText={propertyOwnerDict['pop-delete-cancel']}
                            okType="danger"
                        >
                            <Button
                                disabled={property.status === 'UNAVAILABLE'}
                                type="text"
                                danger
                                icon={<Trash className="w-5 h-5" />}
                            />
                        </Popconfirm>
                    </Space>
                ),
            },
        ],
        [
            handleSoftDeleteProperties,
            propertiesDashboardDict.actions,
            propertiesDashboardDict.address,
            propertiesDashboardDict.city,
            propertiesDashboardDict.created_at,
            propertiesDashboardDict.deposit,
            propertiesDashboardDict.description,
            propertiesDashboardDict.district,
            propertiesDashboardDict.prices,
            propertiesDashboardDict.status,
            propertiesDashboardDict.title,
            propertiesDashboardDict.updated_at,
            propertiesDashboardDict.ward,
            propertyOwnerDict,
        ],
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
        try {
            const res = await updateVisibleProperties(selectedRowKeys as string[], 'ACTIVE');

            handleUpdateProperties(res);
            setSelectedRowKeys([]);
            toast.success(propertyOwnerDict['message-active-success']);
        } catch (error) {
            toast.error(propertyOwnerDict['message-active-fail']);
        }
    }, [handleUpdateProperties, propertyOwnerDict, selectedRowKeys]);

    const handleInactiveProperties = useCallback(async () => {
        try {
            const res = await updateVisibleProperties(selectedRowKeys as string[], 'INACTIVE');

            handleUpdateProperties(res);
            setSelectedRowKeys([]);
            toast.success(propertyOwnerDict['message-inactive-success']);
        } catch (error) {
            toast.error(propertyOwnerDict['message-inactive-fail']);
        }
    }, [handleUpdateProperties, propertyOwnerDict, selectedRowKeys]);

    const handleFilter = useCallback(
        (data: IFiterProperty) => {
            getProperties({
                page: 1,
                pageSize,
                ...data,
                ...addressName,
            });
        },
        [addressName, getProperties, pageSize],
    );

    const handleReset = useCallback(() => {
        setAddressName({
            city: '',
            district: '',
            ward: '',
        });

        getProperties({
            page: 1,
            pageSize,
        });
    }, [getProperties, pageSize]);

    const handleCityChange = async (cityId: string) => {
        form.setFieldsValue({
            district: undefined,
            ward: undefined,
        });

        const city = cities.find((city) => city._id === form.getFieldValue('city'));

        setAddressName({
            city: city?.name || '',
            district: '',
            ward: '',
        });

        setDistinctLoading(true);

        const districts = await getDistricts(cityId);

        setDistricts(districts);
        setDistinctLoading(false);
    };

    const handleDistrictChange = async (districtId: string) => {
        form.setFieldsValue({
            ward: undefined,
        });

        const city = cities.find((city) => city._id === form.getFieldValue('city'));
        const district = districts.find((district) => district._id === form.getFieldValue('district'));

        setAddressName({
            city: city?.name || '',
            district: district?.name || '',
            ward: '',
        });

        setWardLoading(true);

        const wards = await getWards(districtId);

        setWards(wards);
        setWardLoading(false);
    };

    const handleWardChange = (wardId: string) => {
        const city = cities.find((city) => city._id === form.getFieldValue('city'));
        const district = districts.find((district) => district._id === form.getFieldValue('district'));
        const ward = wards.find((ward) => ward._id === wardId);

        setAddressName({
            city: city?.name || '',
            district: district?.name || '',
            ward: ward?.name || '',
        });
    };

    const handleToggleFilter = () => setActiveFilter((prev) => !prev);

    useEffect(() => {
        const fetchCities = async () => {
            setCityLoading(true);
            const cities = await getCities();
            setCities(cities);

            setCityLoading(false);
        };

        const fetchStatuses = async () => {
            setStatusLoading(true);
            try {
                const statuses = await getPropertyStatus();

                setStatuses(statuses.map((item) => ({ label: item, value: item })));
            } catch (error) {
                console.error(error);
            } finally {
                setStatusLoading(false);
            }
        };

        fetchCities();
        fetchStatuses();
    }, []);

    useEffect(() => {
        getProperties({
            page,
            pageSize,
        });
    }, [getProperties, page, pageSize]);

    return (
        <>
            <Flex gap="small" wrap className="my-4">
                <Button disabled={!selectedRowKeys.length} type="primary" onClick={handleActiveProperties}>
                    {propertyOwnerDict.active}
                </Button>
                <Button disabled={!selectedRowKeys.length} type="primary" onClick={handleInactiveProperties}>
                    {propertyOwnerDict.inactive}
                </Button>
                <Button
                    type={activeFilter ? 'primary' : 'default'}
                    className="ml-auto"
                    icon={<Filter className="w-5 h-5" />}
                    onClick={handleToggleFilter}
                />
            </Flex>
            {activeFilter && (
                <TableFilter<IFiterProperty> onFinish={handleFilter} onReset={handleReset} form={form}>
                    <Col span={8}>
                        <Form.Item name="title" label={propertiesDashboardDict.title}>
                            <Input allowClear placeholder={propertyOwnerDict['title-placeholder']} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="deposit_from" label={propertyOwnerDict['deposit-from']}>
                            <InputNumber
                                addonAfter="VND"
                                {...inputNumberProps}
                                max={Number.MAX_SAFE_INTEGER}
                                placeholder={propertyOwnerDict['deposit-from-placeholder']}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="deposit_to" label={propertyOwnerDict['deposit-to']}>
                            <InputNumber
                                addonAfter="VND"
                                {...inputNumberProps}
                                max={Number.MAX_SAFE_INTEGER}
                                placeholder={propertyOwnerDict['deposit-to-placeholder']}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="price_from" label={propertyOwnerDict['price-from']}>
                            <InputNumber
                                addonAfter="VND"
                                {...inputNumberProps}
                                max={Number.MAX_SAFE_INTEGER}
                                placeholder={propertyOwnerDict['price-from-placeholder']}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="price_to" label={propertyOwnerDict['price-to']}>
                            <InputNumber
                                addonAfter="VND"
                                {...inputNumberProps}
                                max={Number.MAX_SAFE_INTEGER}
                                placeholder={propertyOwnerDict['price-to-placeholder']}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="status" label={propertiesDashboardDict.status}>
                            <Select
                                options={statuses}
                                loading={statusLoading}
                                placeholder={propertyOwnerDict['status-placeholder']}
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="city" label={propertiesDashboardDict.city}>
                            <Select
                                loading={cityLoading}
                                options={cities}
                                {...selectProps}
                                onChange={handleCityChange}
                                placeholder={propertyOwnerDict['city-placeholder']}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="district" label={propertiesDashboardDict.district}>
                            <Select
                                loading={distinctLoading}
                                options={districts}
                                {...selectProps}
                                onChange={handleDistrictChange}
                                placeholder={propertyOwnerDict['district-placeholder']}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="ward" label={propertiesDashboardDict.ward}>
                            <Select
                                loading={wardLoading}
                                options={wards}
                                {...selectProps}
                                onChange={handleWardChange}
                                placeholder={propertyOwnerDict['ward-placeholder']}
                            />
                        </Form.Item>
                    </Col>
                </TableFilter>
            )}
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
