'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import { INotification, NotificationType } from '@/interfaces/notification';
import { cn, convertDateToTimeAgo } from '@/lib/utils';
import { OWNER_REQUESTS, RENTAL_REQUESTS } from '@/path';
import { useNotificationStore } from '@/stores/notification-store';
import { Typography } from 'antd';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

const getLink = (type: NotificationType) => {
    switch (type) {
        case 'RENTAL_REQUEST':
            return OWNER_REQUESTS;
        case 'RENTER_RENTAL_REQUEST':
            return RENTAL_REQUESTS;
        default:
            return '/';
    }
};

const Notification = ({ notification }: { notification: INotification }) => {
    const { updateStatus } = useNotificationStore();
    const elementRef = useRef(null);
    const isInView = useIntersectionObserver(elementRef);

    useEffect(() => {
        if (isInView && notification.status === 'RECEIVED') {
            updateStatus(notification.id, 'READ');
        }
    }, [isInView, notification.id, notification.status, updateStatus]);

    return (
        <DropdownMenuItem
            ref={elementRef}
            className={cn(notification.status === 'RECEIVED' && 'bg-antd-primary bg-opacity-5')}
        >
            <Link href={getLink(notification.type)}>
                <Typography.Title level={5}>{notification.title}</Typography.Title>
                <Typography.Text>{notification.body}</Typography.Text>
                <br />
                <Typography.Text type="secondary">
                    {convertDateToTimeAgo(new Date(notification.createdAt))}
                </Typography.Text>
            </Link>
        </DropdownMenuItem>
    );
};

export default Notification;
