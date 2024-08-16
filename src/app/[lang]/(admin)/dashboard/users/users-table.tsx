'use client';

import { UserDashboardDictionary } from '@/app/[lang]/dictionaries';
import TablePagination from '@/components/table-pagination';
import { IPagination } from '@/interfaces/pagination';
import { IUser } from '@/interfaces/user';
import http from '@/lib/http';
import { formatDateTime, getRoleColor, getUserStatusColor } from '@/lib/utils';
import { Role } from '@/types/role';
import { UserStatus } from '@/types/user-status';
import { Button, Space, TableProps, Tag } from 'antd';
import { Edit2, Trash } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo } from 'react';

interface IUsersTable {
    data: IUser[];
    pageInfo: IPagination;
}

const UsersTable = ({ userDashboardDict }: { userDashboardDict: UserDashboardDictionary }) => {
    const [users, setUsers] = React.useState<IUsersTable>({
        data: [],
        pageInfo: {
            current: 1,
            pageSize: 10,
            total: 0,
        },
    });
    const searchParams = useSearchParams();
    const page = Number(searchParams.get('page') || 1);
    const pageSize = Number(searchParams.get('pageSize') || 10);

    const columns: TableProps<IUser>['columns'] = useMemo(
        () => [
            {
                title: userDashboardDict.id,
                dataIndex: 'user_id',
                width: 50,
            },
            {
                title: userDashboardDict.name,
                dataIndex: 'name',
                width: 150,
            },
            {
                title: userDashboardDict.email,
                dataIndex: 'email',
                width: 200,
            },
            {
                title: userDashboardDict.phone,
                dataIndex: 'phone_number',
                width: 150,
            },
            {
                title: userDashboardDict['user-type'],
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
                title: userDashboardDict.status,
                dataIndex: 'status',
                width: 100,
                render: (status: UserStatus) => (
                    <Tag bordered={false} color={getUserStatusColor(status)}>
                        {status}
                    </Tag>
                ),
            },
            {
                title: userDashboardDict['created-at'],
                dataIndex: 'created_at',
                width: 170,
                render: formatDateTime,
            },
            {
                title: userDashboardDict['updated-at'],
                dataIndex: 'updated_at',
                width: 170,
                render: formatDateTime,
            },
            {
                title: userDashboardDict.actions,
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
        [userDashboardDict],
    );

    useEffect(() => {
        const fetch = async () => {
            try {
                const params = {
                    skip: String((page - 1) * pageSize),
                    take: String(pageSize),
                };
                const search = new URLSearchParams(params).toString();

                const res = await http.get<IUsersTable>(`/user-service/users?${search}`);

                setUsers(res);
            } catch (error) {
                console.error(error);
            }
        };

        fetch();
    }, [page, pageSize]);

    return (
        <TablePagination
            rowKey={(record) => record.user_id.toString()}
            columns={columns}
            dataSource={users.data}
            pagination={users.pageInfo}
        />
    );
};

export default UsersTable;
