import { INotification, NotificationStatus } from '@/interfaces/notification';
import { IPagination } from '@/interfaces/pagination';
import { IResponse } from '@/interfaces/response';
import { ITable } from '@/interfaces/table';
import http from '@/lib/http';

export const countNotifications = (accessToken: string) => {
    return http.get<IResponse<number>>('/estate-manager-service/notifications/count', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

export const getNotifications = (pagination: IPagination) => {
    return http.get<ITable<INotification>>('/estate-manager-service/notifications', {
        params: pagination,
    });
};

export const updateNotificationStatus = (notificationIds: Array<string>, status: NotificationStatus) => {
    return http.post<IResponse<null>>('/estate-manager-service/notifications/update-status', {
        status,
        notificationIds,
    });
};
