'use client';

import Notification from '@/components/notification/notification';
import Title from '@/components/title';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IPagination } from '@/interfaces/pagination';
import { getNotifications, readAllNotifications, updateNotificationStatus } from '@/services/notification-service';
import { useNotificationStore } from '@/stores/notification-store';
import { Badge, Button as ButtonAntD, Empty, Flex, Spin } from 'antd';
import { Bell, CheckCheck } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export function Notifications({ count: countProp }: { count: number }) {
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
    const [readAllLoading, setReadAllLoading] = useState(false);

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
        if (!open) {
            setReadNotificationsIds([]);
            updateNotificationStatus(readNotificationsIds, 'READ').then();

            return;
        }
    };

    const handleReadAllNotifications = () => {
        readAllNotifications()
            .then()
            .catch((error) => console.error(error));
        readAllNotificationsStore();
    };

    useEffect(() => {
        fetchNotifications({ take: 10, skip: 0 });
        setCount(countProp);
    }, [countProp, fetchNotifications, setCount]);

    return (
        <DropdownMenu onOpenChange={handleToggleNotifications}>
            <DropdownMenuTrigger asChild>
                <Badge count={count ?? countProp}>
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
                <ScrollArea className="h-[300px] w-[320px] max-w-xs">
                    {notifications.data.map((notification) => (
                        <Notification key={notification.id} notification={notification} />
                    ))}
                    <Flex justify="center">{loading && <Spin />}</Flex>
                    {!loading && !notifications.data.length && <Empty description="Không có thông báo nào" />}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
