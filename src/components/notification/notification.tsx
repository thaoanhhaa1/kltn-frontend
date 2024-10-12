'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { INotification, NotificationType } from '@/interfaces/notification';
import { cn, convertDateToTimeAgo } from '@/lib/utils';
import { OWNER_REQUESTS, RENTAL_REQUESTS } from '@/path';
import { updateNotificationStatus } from '@/services/notification-service';
import { useNotificationStore } from '@/stores/notification-store';
import { Typography } from 'antd';
import Link from 'next/link';
import Markdown from 'react-markdown';

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
    const { readNotification } = useNotificationStore();

    const handleClick = () => {
        if (notification.status === 'RECEIVED') {
            readNotification(notification.id);
            updateNotificationStatus([notification.id], 'READ').then();
        }
    };

    return (
        <DropdownMenuItem className={cn(notification.status === 'RECEIVED' && 'bg-antd-primary bg-opacity-5')}>
            <Link onClick={handleClick} href={getLink(notification.type)}>
                <Typography.Title level={5}>{notification.title}</Typography.Title>
                <Markdown className="!m-0">{notification.body}</Markdown>
                <Typography.Text type="secondary">
                    {convertDateToTimeAgo(new Date(notification.createdAt))}
                </Typography.Text>
            </Link>
        </DropdownMenuItem>
    );
};

export default Notification;
