'use client';

import Notification from '@/components/notification/notification';
import Title from '@/components/title';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { IPagination } from '@/interfaces/pagination';
import { getNotifications, readAllNotifications, updateNotificationStatus } from '@/services/notification-service';
import { useNotificationStore } from '@/stores/notification-store';
import { Badge, Button as ButtonAntD, Empty, Flex, Spin } from 'antd';
import { Bell, CheckCheck } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

export function Notifications() {
    const {
        loading,
        notifications,
        count,
        readNotificationsIds,
        setReadNotificationsIds,
        setCount,
        setLoading,
        setNotifications,
        readAllNotifications: readAllNotificationsStore,
    } = useNotificationStore();
    const [readAllLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const fetchNotifications = useCallback(
        async (pagination: IPagination) => {
            setLoading(true);

            try {
                const res = await getNotifications(pagination);

                setNotifications(res);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        },
        [setLoading, setNotifications],
    );

    const handleToggleNotifications = (open: boolean) => {
        setOpen(open);
        if (!open) {
            setReadNotificationsIds([]);
            updateNotificationStatus(readNotificationsIds, 'READ').then();

            return;
        }
    };

    const close = () => {
        setOpen(false);
    };

    const handleReadAllNotifications = () => {
        readAllNotifications()
            .then()
            .catch((error) => console.error(error));
        readAllNotificationsStore();
    };

    const next = () => {
        fetchNotifications({ take: 10, skip: notifications.data.length });
    };

    useEffect(() => {
        if (Number.isInteger(count)) return;
        fetchNotifications({ take: 10, skip: 0 });
    }, [count, fetchNotifications, setCount]);

    return (
        <DropdownMenu open={open} onOpenChange={handleToggleNotifications}>
            <DropdownMenuTrigger asChild>
                <Badge count={count}>
                    <Button variant="outline" size="icon">
                        <Bell className="w-5 h-5" />
                    </Button>
                </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <Flex
                    style={{
                        paddingInline: '8px',
                    }}
                    align="center"
                    justify="space-between"
                >
                    <Title level={4}>Thông báo</Title>
                    {count ? (
                        <ButtonAntD
                            loading={readAllLoading}
                            onClick={handleReadAllNotifications}
                            type="text"
                            icon={<CheckCheck className="w-4 h-4" />}
                        >
                            Đánh dấu đã đọc ({count})
                        </ButtonAntD>
                    ) : null}
                </Flex>
                <InfiniteScroll
                    className="w-[320px] max-w-xs"
                    dataLength={notifications.data.length} //This is important field to render the next data
                    next={next}
                    hasMore={
                        notifications.pageInfo.current * notifications.pageInfo.pageSize < notifications.pageInfo.total
                    }
                    loader={<Flex justify="center">{loading && <Spin />}</Flex>}
                    height={300}
                >
                    {notifications.data.map((notification) => (
                        <Notification key={notification.id} notification={notification} onClose={close} />
                    ))}
                </InfiniteScroll>
                {!loading && !notifications.data.length && <Empty description="Không có thông báo nào" />}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
