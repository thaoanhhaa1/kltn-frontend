'use client';

import CancelModal from '@/app/(base)/contracts/cancel-modal';
import ButtonLink from '@/components/button/button-link';
import CancelBeforeDeposit from '@/components/contracts/cancel-before-deposit';
import PriceInput from '@/components/input/price-input';
import TableFilter from '@/components/table-filter';
import TablePagination from '@/components/table-pagination';
import { contractStatusOptions, initDataTable } from '@/constants/init-data';
import { datePickerProps } from '@/constants/init-props';
import usePagination from '@/hooks/usePagination';
import { ContractStatus, IContract, IGetContractsByRenter } from '@/interfaces/contract';
import { IProperty } from '@/interfaces/property';
import { ITable } from '@/interfaces/table';
import { IBaseUser } from '@/interfaces/user';
import {
    formatCurrency,
    formatDate,
    formatDateTime,
    getContractColor,
    getContractStatusText,
    toSkipTake,
} from '@/lib/utils';
import { RENTAL_CONTRACTS } from '@/path';
import {
    getContractsByRenter,
    getPropertiesByRenterService,
    getUsersByRenterService,
} from '@/services/contract-service';
import { Button, Col, DatePicker, Flex, Form, Input, Select, Space, TableProps, Tag, Tooltip } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { Eye, Filter, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

const propertyFilterOption = (input: string, option: IProperty | undefined) =>
    (option?.title ?? '').toLowerCase().includes(input.toLowerCase());

const propertyFieldNames = {
    label: 'title',
    value: 'propertyId',
};

const userFilterOption = (input: string, option: any) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

const userFieldNames = {
    value: 'userId',
};

type IUserOption = IBaseUser & { label: string };

const Contracts = () => {
    const [contracts, setContracts] = useState<ITable<IContract>>(initDataTable);
    const [loading, setLoading] = useState(true);
    const [cancelContract, setCancelContract] = useState<IContract | null>(null);
    const { page, pageSize } = usePagination();
    const [activeFilter, setActiveFilter] = useState<boolean>(false);
    const [form] = useForm<IGetContractsByRenter>();
    const [properties, setProperties] = useState<IProperty[]>([]);
    const [propertiesLoading, setPropertiesLoading] = useState(false);
    const [users, setUsers] = useState<IUserOption[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const router = useRouter();

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
                title: 'Mã hợp đồng',
                dataIndex: 'contractId',
                width: 200,
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

    const fetchData = useCallback(async (data: IGetContractsByRenter) => {
        setLoading(true);

        try {
            const res = await getContractsByRenter({
                ...data,
                startDate: data.startDate && formatDate(data.startDate),
                endDate: data.endDate && formatDate(data.endDate),
            });

            setContracts(res);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleToggleFilter = () => setActiveFilter((prev) => !prev);

    const handleFilter = () => {
        if (page === 1) fetchData({ ...form.getFieldsValue(), ...toSkipTake(1, pageSize) });
        else router.replace(`${RENTAL_CONTRACTS}?page=1&pageSize=${pageSize}`);
    };

    const handleReset = () => {
        form.resetFields();

        if (page === 1) fetchData({ take: pageSize, skip: 0 });
        else router.replace(`${RENTAL_CONTRACTS}?page=1&pageSize=${pageSize}`);
    };

    useEffect(() => {
        const pagination = toSkipTake(page, pageSize);

        fetchData({
            ...pagination,
            ...form.getFieldsValue(),
        });
    }, [fetchData, form, page, pageSize]);

    useEffect(() => {
        const fetchProperties = async () => {
            setPropertiesLoading(true);

            try {
                const properties = await getPropertiesByRenterService();

                setProperties(properties);
            } catch (error) {
            } finally {
                setPropertiesLoading(false);
            }
        };

        const fetchUsers = async () => {
            setUsersLoading(true);

            try {
                const users = await getUsersByRenterService();

                setUsers(users.map((user) => ({ ...user, label: `${user.name} - ${user.email}` })));
            } catch (error) {
            } finally {
                setUsersLoading(false);
            }
        };

        fetchProperties();
        fetchUsers();
    }, []);

    return (
        <>
            <Flex gap="small" justify="flex-end" wrap className="my-4">
                <Button
                    type={activeFilter ? 'primary' : 'default'}
                    className="ml-auto"
                    icon={<Filter className="w-5 h-5" />}
                    onClick={handleToggleFilter}
                />
            </Flex>
            {activeFilter && (
                <TableFilter<IGetContractsByRenter> onFinish={handleFilter} onReset={handleReset} form={form}>
                    <Col span={8}>
                        <Form.Item label="Mã hợp đồng" name="contractId">
                            <Input allowClear placeholder="Nhập mã hợp đồng" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Ngày bắt đầu" name="startDate">
                            <DatePicker {...datePickerProps} placeholder="Ngày bắt đầu" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Ngày kết thúc" name="endDate">
                            <DatePicker {...datePickerProps} placeholder="Ngày kết thúc" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Bất động sản" name="propertyId">
                            <Select
                                allowClear
                                showSearch
                                filterOption={propertyFilterOption}
                                loading={propertiesLoading}
                                placeholder="Chọn bất động sản"
                                options={properties}
                                fieldNames={propertyFieldNames}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Chủ nhà" name="ownerId">
                            <Select
                                allowClear
                                showSearch
                                filterOption={userFilterOption}
                                loading={usersLoading}
                                placeholder="Chọn chủ nhà"
                                options={users}
                                fieldNames={userFieldNames}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Giá thuê" name="monthlyRent">
                            <PriceInput placeholder="Nhập giá thuê" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Tiền cọc" name="depositAmount">
                            <PriceInput placeholder="Nhập tiền cọc" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Trạng thái" name="status">
                            <Select placeholder="Chọn trạng thái" options={contractStatusOptions} />
                        </Form.Item>
                    </Col>
                </TableFilter>
            )}
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

export default Contracts;
