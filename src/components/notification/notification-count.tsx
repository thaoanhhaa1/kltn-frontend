'use client';

import { useNotificationStore } from '@/stores/notification-store';
import { useEffect } from 'react';

const NotificationCount = ({ count }: { count: number }) => {
    const { setCount } = useNotificationStore();

    useEffect(() => {
        setCount(count);
    }, [count, setCount]);

    return null;
};

export default NotificationCount;
