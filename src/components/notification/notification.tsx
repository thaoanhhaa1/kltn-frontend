'use client';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { INotification, NotificationType } from '@/interfaces/notification';
import { cn, convertDateToTimeAgo } from '@/lib/utils';
import {
    DASHBOARD_PROPERTIES,
    OWNER_CONTRACTS,
    OWNER_PROPERTIES,
    OWNER_REQUESTS,
    RENTAL_CONTRACTS,
    RENTAL_REQUESTS,
    RENTER_PAYMENTS,
    REPORTS,
} from '@/path';
import { updateNotificationStatus } from '@/services/notification-service';
import { useNotificationStore } from '@/stores/notification-store';
import { Typography } from 'antd';
import Link from 'next/link';
import { useMemo } from 'react';
import Markdown from 'react-markdown';

const getLink = (type: NotificationType) => {
    switch (type) {
        case 'RENTAL_REQUEST':
            return OWNER_REQUESTS;
        case 'RENTER_RENTAL_REQUEST':
            return RENTAL_REQUESTS;
        case 'ADMIN_PROPERTY':
            return DASHBOARD_PROPERTIES;
        case 'OWNER_DETAIL_PROPERTY':
            return OWNER_PROPERTIES;
        case 'RENTAL_REQUEST':
            return OWNER_REQUESTS;
        case 'RENTER_CONTRACT':
            return RENTAL_CONTRACTS;
        case 'RENTER_PAYMENT':
            return RENTER_PAYMENTS;
        case 'OWNER_CONTRACT':
            return OWNER_CONTRACTS;
        default:
            return '/';
    }
};

const Notification = ({ notification, onClose }: { notification: INotification; onClose: () => void }) => {
    const { readNotification } = useNotificationStore();
    const url = useMemo(() => {
        if (notification.type === 'CONTRACT_DETAIL') return `${RENTAL_CONTRACTS}/${notification.docId}`;
        if (notification.type === 'REPORT') return `${REPORTS}/${notification.docId}`;

        return getLink(notification.type);
    }, [notification.docId, notification.type]);
    const time = useMemo(() => convertDateToTimeAgo(new Date(notification.createdAt)), [notification.createdAt]);

    const handleClick = () => {
        if (notification.status === 'RECEIVED') {
            readNotification(notification.id);
            updateNotificationStatus([notification.id], 'READ').then();
        }

        onClose();
    };

    return (
        <DropdownMenuItem className={cn(notification.status === 'RECEIVED' && 'bg-antd-primary bg-opacity-5')}>
            <Link onClick={handleClick} href={url}>
                <Typography.Title level={5}>{notification.title}</Typography.Title>
                <Markdown className="!m-0">{notification.body}</Markdown>
                <Typography.Text type="secondary">{time}</Typography.Text>
            </Link>
        </DropdownMenuItem>
    );
};

export default Notification;
