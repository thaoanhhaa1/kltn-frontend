'use client';

import TablePagination from '@/components/table-pagination';
import { initDataTable } from '@/constants/init-data';
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
import { activeUser, blockUser, getAllUsers } from '@/services/user-service';
import { Role } from '@/types/role';
import { UserStatus } from '@/types/user-status';
import { Button, Flex, TableProps, Tag, Tooltip } from 'antd';
import { Check, CircleMinus } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

type IUsersTable = ITable<IUser>;

const UsersTable = () => {
    const [users, setUsers] = useState<IUsersTable>(initDataTable);
    const [loading, setLoading] = useState(false);
    const { page, pageSize } = usePagination();

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
            },
            {
                title: 'Email',
                dataIndex: 'email',
                width: 200,
            },
            {
                title: 'Số điện thoại',
                dataIndex: 'phoneNumber',
                width: 150,
            },
            {
                title: 'Loại người dùng',
                dataIndex: 'userTypes',
                width: 150,
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
            rowKey={(record) => record.userId.toString()}
            columns={columns}
            dataSource={users.data}
            pagination={users.pageInfo}
        />
    );
};

export default UsersTable;
