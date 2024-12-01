'use client';

import ContractModal from '@/app/owner/rental-requests/contract-modal';
import TableFilter from '@/components/table-filter';
import TablePagination from '@/components/table-pagination';
import { initDataTable, rentalRequestStatusOptions } from '@/constants/init-data';
import usePagination from '@/hooks/usePagination';
import { IProperty } from '@/interfaces/property';
import { IRentalRequest } from '@/interfaces/rentalRequest';
import { ITable } from '@/interfaces/table';
import { IUser } from '@/interfaces/user';
import {
    formatCurrency,
    formatDate,
    formatDateTime,
    getRentalRequestColor,
    getRentalRequestStatusText,
    toSkipTake,
} from '@/lib/utils';
import { IUpdateRentalRequestStatus } from '@/schemas/rental-request.schema';
import { getAllPropertiesCbbForOwner } from '@/services/property-service';
import {
    ownerGetAllRentalRequests,
    ownerGetRenterRequests,
    ownerUpdateRentalRequestStatus,
} from '@/services/rental-request-service';
import { Button, Col, Flex, Form, Select, Space, TableProps, Tag } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { Check, Filter, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

interface IFilterRentalRequest {
    title?: string;
}

type IUserOption = IUser & { label: string };

const userFilterOption = (input: string, option: any) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

const userFieldNames = {
    value: 'userId',
};

const propertyFilterOption = (input: string, option: IProperty | undefined) =>
    (option?.title ?? '').toLowerCase().includes(input.toLowerCase());

const propertyFieldNames = {
    label: 'title',
    value: 'propertyId',
};

const RentalRequestsTable = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ITable<IRentalRequest>>(initDataTable);
    const { page, pageSize } = usePagination();
    const [selectedRentalRequest, setSelectedRentalRequest] = useState<IRentalRequest | undefined>();
    const [activeFilter, setActiveFilter] = useState(false);
    const [form] = useForm<IFilterRentalRequest>();
    const [renters, setRenters] = useState<IUserOption[]>([]);
    const [renterLoading, setRenterLoading] = useState(false);
    const [properties, setProperties] = useState<IProperty[]>([]);
    const [propertyLoading, setPropertyLoading] = useState(false);

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

    const handleToggleFilter = () => {
        setActiveFilter(!activeFilter);
    };

    const handleFilter = useCallback(
        async (values: IFilterRentalRequest) => {
            setLoading(true);
            try {
                const pagination = toSkipTake(1, pageSize);
                const res = await ownerGetAllRentalRequests({
                    ...pagination,
                    ...values,
                });
                setData(res);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        },
        [pageSize],
    );

    const handleReset = useCallback(() => {
        form.resetFields();
        fetchRentalRequests();
    }, [fetchRentalRequests, form]);

    const columns: TableProps<IRentalRequest>['columns'] = useMemo(
        () => [
            {
                title: '#',
                dataIndex: 'propertyId',
                width: 50,
                render: (_: any, __: any, index: number) => index + 1 + pageSize * (page - 1),
            },
            {
                title: 'Tiêu đề',
                dataIndex: ['property', 'title'],
                width: 300,
            },
            {
                title: 'Người thuê',
                dataIndex: ['renter', 'name'],
                width: 200,
            },
            {
                title: 'Email',
                dataIndex: ['renter', 'email'],
                width: 200,
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
                                    requestId: rentalRequest.requestId,
                                    status: 'REJECTED',
                                })
                            }
                        />
                    </Space>
                ),
            },
        ],
        [handlePreAccept, handleUpdateStatus, page, pageSize],
    );

    useEffect(() => {
        fetchRentalRequests();
    }, [fetchRentalRequests]);

    useEffect(() => {
        const fetchRenters = async () => {
            try {
                setRenterLoading(true);

                const renters = await ownerGetRenterRequests();

                setRenters(
                    renters.map((item) => ({
                        ...item,
                        label: `${item.name} - ${item.email}`,
                    })),
                );
            } catch (error) {
            } finally {
                setRenterLoading(false);
            }
        };

        const fetchProperties = async () => {
            try {
                setPropertyLoading(true);

                const properties = await getAllPropertiesCbbForOwner();

                setProperties(properties);
            } catch (error) {
            } finally {
                setPropertyLoading(false);
            }
        };

        fetchRenters();
        fetchProperties();
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
                <TableFilter<IFilterRentalRequest> onFinish={handleFilter} onReset={handleReset} form={form}>
                    <Col span={8}>
                        <Form.Item name="propertyId" label="Bất động sản">
                            <Select
                                showSearch
                                filterOption={propertyFilterOption}
                                loading={propertyLoading}
                                placeholder="Chọn bất động sản"
                                options={properties}
                                fieldNames={propertyFieldNames}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Người thuê" name="renterId">
                            <Select
                                showSearch
                                filterOption={userFilterOption}
                                loading={renterLoading}
                                placeholder="Chọn người thuê"
                                options={renters}
                                fieldNames={userFieldNames}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Trạng thái" name="status">
                            <Select placeholder="Chọn trạng thái" options={rentalRequestStatusOptions} />
                        </Form.Item>
                    </Col>
                </TableFilter>
            )}
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
