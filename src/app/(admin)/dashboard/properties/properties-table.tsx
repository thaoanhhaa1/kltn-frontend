'use client';

import RejectPropertyModal, { IRejectInput } from '@/app/(admin)/dashboard/properties/reject-property-modal';
import { IAddressName } from '@/app/owner/properties/add/add-property-form';
import AntButtonLink from '@/components/button/ant-button-link';
import TableFilter from '@/components/table-filter';
import TablePagination from '@/components/table-pagination';
import { initDataTable, propertyStatusOptions } from '@/constants/init-data';
import { selectProps } from '@/constants/init-props';
import usePagination from '@/hooks/usePagination';
import { IGetNotDeletedProperties, IProperty, PropertyStatus } from '@/interfaces/property';
import { ITable } from '@/interfaces/table';
import { formatCurrency, formatDateTime, getPropertyStatusColor, getPropertyStatusText, toSkipTake } from '@/lib/utils';
import { DASHBOARD_PROPERTIES } from '@/path';
import { getCities, getDistricts, getWards, IAddress } from '@/services/address-service';
import { getAllNotDeletedProperties, updateApprovalProperties } from '@/services/property-service';
import { Button, Col, Flex, Form, Input, Select, Space, TableProps, Tag, Tooltip } from 'antd';
import { useForm } from 'antd/es/form/Form';
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
    const [form] = useForm<IGetNotDeletedProperties>();
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
                render: (_: any, __: any, index: number) => index + 1 + pageSize * (page - 1),
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
                        <AntButtonLink
                            href={`${DASHBOARD_PROPERTIES}/${property.propertyId}`}
                            type="text"
                            icon={<Eye className="w-5 h-5" />}
                        />
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
        [handleApprove, handleReject, page, pageSize],
    );

    const fetchProperties = useCallback(async (data: IGetNotDeletedProperties) => {
        setLoading(true);

        try {
            const res = await getAllNotDeletedProperties(data);

            setData(res);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleToggleFilter = () => setActiveFilter((prev) => !prev);

    const handleFilter = useCallback(
        (values: IGetNotDeletedProperties) => {
            const data = toSkipTake(page, pageSize);

            fetchProperties({
                ...values,
                ...data,
                ...addressName,
            });
        },
        [addressName, fetchProperties, page, pageSize],
    );

    const handleReset = useCallback(() => {
        form.resetFields();
        setAddressName({
            city: '',
            district: '',
            ward: '',
        } as IAddressName);
        fetchProperties({
            skip: 0,
            take: pageSize,
        });
    }, [fetchProperties, form, pageSize]);

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

    useEffect(() => {
        const data = toSkipTake(page, pageSize);

        fetchProperties(data);
    }, [fetchProperties, page, pageSize]);

    useEffect(() => {
        const fetchCities = async () => {
            setCityLoading(true);

            try {
                const cities = await getCities();
                setCities(cities);
            } catch (error) {
                console.error(error);
            } finally {
                setCityLoading(false);
            }
        };

        fetchCities();
    }, []);

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
            {activeFilter && (
                <TableFilter<IGetNotDeletedProperties> onFinish={handleFilter} onReset={handleReset} form={form}>
                    <Col span={8}>
                        <Form.Item name="title" label="Tiêu đề">
                            <Input allowClear placeholder="Nhập tiêu đề" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="ownerName" label="Chủ nhà">
                            <Input allowClear placeholder="Nhập họ tên chủ nhà" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="status" label="Trạng thái">
                            <Select options={propertyStatusOptions} placeholder="Chọn trạng thái" allowClear />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="city" label="Tỉnh, thành phố">
                            <Select
                                loading={cityLoading}
                                options={cities}
                                {...selectProps}
                                onChange={handleCityChange}
                                placeholder="Chọn tỉnh, thành phố"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="district" label="Quận, huyện">
                            <Select
                                loading={distinctLoading}
                                options={districts}
                                {...selectProps}
                                onChange={handleDistrictChange}
                                placeholder="Chọn quận, huyện"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="ward" label="Phường, xã">
                            <Select
                                loading={wardLoading}
                                options={wards}
                                {...selectProps}
                                onChange={handleWardChange}
                                placeholder="Chọn phường, xã"
                            />
                        </Form.Item>
                    </Col>
                </TableFilter>
            )}
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
