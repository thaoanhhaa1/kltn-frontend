'use client';

import TablePagination from '@/components/table-pagination';
import { initDataTable } from '@/constants/init-data';
import usePagination from '@/hooks/usePagination';
import { ITable } from '@/interfaces/table';
import { IUser } from '@/interfaces/user';
import { formatDateTime, getRoleColor, getUserStatusColor, toSkipTake } from '@/lib/utils';
import { getAllUsers } from '@/services/user-service';
import { Role } from '@/types/role';
import { UserStatus } from '@/types/user-status';
import { Button, Space, TableProps, Tag } from 'antd';
import { Edit2, Trash } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type IUsersTable = ITable<IUser>;

const UsersTable = () => {
    const [users, setUsers] = useState<IUsersTable>(initDataTable);
    const [loading, setLoading] = useState(false);
    const { page, pageSize } = usePagination();

    const columns: TableProps<IUser>['columns'] = useMemo(
        () => [
            {
                title: 'ID',
                dataIndex: 'user_id',
                width: 50,
            },
            {
                title: 'Họ và tên',
                dataIndex: 'name',
                width: 150,
            },
            {
                title: 'Email',
                dataIndex: 'email',
                width: 200,
            },
            {
                title: 'Số điện thoại',
                dataIndex: 'phone_number',
                width: 150,
            },
            {
                title: 'Loại người dùng',
                dataIndex: 'user_types',
                width: 150,
                render: (user_types: Role[]) =>
                    user_types.map((userType) => (
                        <Tag key={userType} color={getRoleColor(userType)} className="uppercase">
                            {userType}
                        </Tag>
                    )),
            },
            {
                title: 'Trạng thái',
                dataIndex: 'status',
                width: 100,
                render: (status: UserStatus) => (
                    <Tag bordered={false} color={getUserStatusColor(status)}>
                        {status}
                    </Tag>
                ),
            },
            {
                title: 'Ngày tạo',
                dataIndex: 'created_at',
                width: 170,
                render: formatDateTime,
            },
            {
                title: 'Ngày cập nhật',
                dataIndex: 'updated_at',
                width: 170,
                render: formatDateTime,
            },
            {
                title: 'Hành động',
                fixed: 'right',
                width: 110,
                render: () => (
                    <Space>
                        <Button type="text" icon={<Edit2 className="w-5 h-5" />} />
                        <Button danger type="text" icon={<Trash className="w-5 h-5" />} />
                    </Space>
                ),
            },
        ],
        [],
    );

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const res = await getAllUsers(toSkipTake(page, pageSize));

                setUsers(res);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [page, pageSize]);

    return (
        <TablePagination
            loading={loading}
            rowKey={(record) => record.user_id.toString()}
            columns={columns}
            dataSource={users.data}
            pagination={users.pageInfo}
        />
    );
};

export default UsersTable;
