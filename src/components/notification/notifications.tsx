'use client';

import Notification from '@/components/notification/notification';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IPagination } from '@/interfaces/pagination';
import { getNotifications, updateNotificationStatus } from '@/services/notification-service';
import { useNotificationStore } from '@/stores/notification-store';
import { Badge, Flex, Spin } from 'antd';
import { Bell } from 'lucide-react';
import { useCallback, useEffect } from 'react';

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
    } = useNotificationStore();

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

        setCount(0);
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
                <ScrollArea className="h-[300px] w-[320px] max-w-xs">
                    {notifications.data.map((notification) => (
                        <Notification key={notification.id} notification={notification} />
                    ))}
                    <Flex justify="center">{loading && <Spin />}</Flex>
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
