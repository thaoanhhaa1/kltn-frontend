'use client';

import TableFilter from '@/components/table-filter';
import TablePagination from '@/components/table-pagination';
import { initDataTable, userStatusOptions, userTypeOptions } from '@/constants/init-data';
import usePagination from '@/hooks/usePagination';
import { ITable } from '@/interfaces/table';
import { IUser } from '@/interfaces/user';
import {
    formatDateTime,
    getRoleColor,
    getRoleText,
    getUserStatusColor,
    getUserStatusText,
    toSkipTake,
} from '@/lib/utils';
import { DASHBOARD_USERS } from '@/path';
import { activeUser, blockUser, getAllUsers } from '@/services/user-service';
import { Role } from '@/types/role';
import { UserStatus } from '@/types/user-status';
import { Button, Col, Flex, Form, Input, Select, TablePaginationConfig, TableProps, Tag, Tooltip } from 'antd';
import { FilterValue, SorterResult, SortOrder } from 'antd/es/table/interface';
import { Check, CircleMinus, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

type IUsersTable = ITable<IUser>;

export interface IFilterUser {}

const UsersTable = () => {
    const [users, setUsers] = useState<IUsersTable>(initDataTable);
    const [loading, setLoading] = useState(false);
    const { page, pageSize } = usePagination();
    const [activeFilter, setActiveFilter] = useState(false);
    const [form] = Form.useForm();
    const router = useRouter();
    const [tableParams, setTableParams] = useState<{
        sortField?: string;
        sortOrder?: SortOrder;
    }>({});

    const handleBlockUser = useCallback(async (userId: string) => {
        setLoading(true);

        try {
            const user = await blockUser(userId);

            toast.success(`Đã chặn người dùng ${user.name}`);
            setUsers((prev) => ({
                ...prev,
                data: prev.data.map((u) => (u.userId === user.userId ? user : u)),
            }));
        } catch (error) {
            console.error(error);

            toast.error('Đã xảy ra lỗi, vui lòng thử lại sau');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleActiveUser = useCallback(async (userId: string) => {
        setLoading(true);

        try {
            const user = await activeUser(userId);

            toast.success(`Đã bỏ chặn người dùng ${user.name}`);
            setUsers((prev) => ({
                ...prev,
                data: prev.data.map((u) => (u.userId === user.userId ? user : u)),
            }));
        } catch (error) {
            console.error(error);

            toast.error('Đã xảy ra lỗi, vui lòng thử lại sau');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleToggleFilter = useCallback(() => {
        setActiveFilter((prev) => !prev);
    }, []);

    const columns: TableProps<IUser>['columns'] = useMemo(
        () => [
            {
                title: 'ID',
                dataIndex: 'userId',
                width: 50,
            },
            {
                title: 'Họ và tên',
                dataIndex: 'name',
                width: 200,
                sorter: true,
            },
            {
                title: 'Email',
                dataIndex: 'email',
                width: 200,
                sorter: true,
            },
            {
                title: 'Số điện thoại',
                dataIndex: 'phoneNumber',
                width: 150,
                sorter: true,
            },
            {
                title: 'Loại người dùng',
                dataIndex: 'userTypes',
                width: 170,
                sorter: true,
                render: (userTypes: Role[]) =>
                    userTypes.map((userType) => (
                        <Tag key={userType} color={getRoleColor(userType)} className="uppercase">
                            {getRoleText(userType)}
                        </Tag>
                    )),
            },
            {
                title: 'Trạng thái',
                dataIndex: 'status',
                width: 100,
                sorter: true,
                render: (status: UserStatus) => (
                    <Tag bordered={false} color={getUserStatusColor(status)}>
                        {getUserStatusText(status)}
                    </Tag>
                ),
            },
            {
                title: 'Ngày tạo',
                dataIndex: 'createdAt',
                width: 170,
                sorter: true,
                render: formatDateTime,
            },
            {
                title: 'Ngày cập nhật',
                dataIndex: 'updatedAt',
                width: 170,
                sorter: true,
                render: formatDateTime,
            },
            {
                title: 'Hành động',
                fixed: 'right',
                width: 110,
                render: (_, record) => (
                    <Flex justify="center">
                        {/* <Button type="text" icon={<Edit2 className="w-5 h-5" />} /> */}
                        <Tooltip title="Bỏ chặn người dùng">
                            <Button
                                variant="text"
                                color="primary"
                                icon={<Check className="w-5 h-5" />}
                                onClick={() => handleActiveUser(record.userId)}
                                disabled={record.status !== 'BLOCKED'}
                            />
                        </Tooltip>
                        <Tooltip title="Chặn người dùng">
                            <Button
                                danger
                                type="text"
                                icon={<CircleMinus className="w-5 h-5" />}
                                onClick={() => handleBlockUser(record.userId)}
                                disabled={record.status === 'BLOCKED'}
                            />
                        </Tooltip>
                    </Flex>
                ),
            },
        ],
        [handleActiveUser, handleBlockUser],
    );

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAllUsers({
                ...toSkipTake(page, pageSize),
                ...form.getFieldsValue(),
                ...tableParams,
            });

            setUsers(res);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [form, page, pageSize, tableParams]);

    const handleFilter = useCallback(() => {
        if (page === 1) {
            fetchUsers();
        } else {
            router.push(`${DASHBOARD_USERS}`);
        }
    }, [fetchUsers, page, router]);

    const handleReset = useCallback(() => {
        form.resetFields();

        if (page === 1) {
            fetchUsers();
        } else {
            router.push(`${DASHBOARD_USERS}`);
        }
    }, [fetchUsers, form, page, router]);

    const handleTableChange = (
        pagination: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        sorter: SorterResult<IUser> | SorterResult<IUser>[],
    ) => {
        if (Array.isArray(sorter)) return;
        setTableParams({
            sortField: Array.isArray(sorter.field) ? sorter.field.at(-1) : sorter.field,
            sortOrder: sorter.order,
        });
    };

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

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
                <TableFilter<IFilterUser> onFinish={handleFilter} onReset={handleReset} form={form}>
                    <Col span={8}>
                        <Form.Item name="userId" label="ID">
                            <Input allowClear placeholder="Nhập ID" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="name" label="Họ và tên">
                            <Input allowClear placeholder="Nhập họ và tên" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="email" label="Email">
                            <Input allowClear placeholder="Nhập email" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="phoneNumber" label="Số điện thoại">
                            <Input allowClear placeholder="Nhập số điện thoại" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="type" label="Loại người dùng">
                            <Select options={userTypeOptions} placeholder="Chọn loại người dùng" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="status" label="Trạng thái">
                            <Select options={userStatusOptions} placeholder="Chọn trạng thái" />
                        </Form.Item>
                    </Col>
                </TableFilter>
            )}
            <TablePagination
                loading={loading}
                rowKey={(record) => record.userId.toString()}
                columns={columns}
                dataSource={users.data}
                pagination={users.pageInfo}
                onChange={handleTableChange}
            />
        </>
    );
};

export default UsersTable;
