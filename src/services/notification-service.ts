import { INotification, NotificationStatus } from '@/interfaces/notification';
import { IPagination } from '@/interfaces/pagination';
import { IResponse } from '@/interfaces/response';
import { ITable } from '@/interfaces/table';
import http from '@/lib/http';

const ENDPOINT = '/estate-manager-service/notifications';

export const countNotifications = (accessToken: string) => {
    return http.get<IResponse<number>>(`${ENDPOINT}/count`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

export const getNotifications = (pagination: IPagination) => {
    return http.get<ITable<INotification>>(`${ENDPOINT}`, {
        params: pagination,
    });
};

export const updateNotificationStatus = (notificationIds: Array<string>, status: NotificationStatus) => {
    return http.post<IResponse<null>>(`${ENDPOINT}/update-status`, {
        status,
        notificationIds,
    });
};

export const readAllNotifications = () => {
    return http.post<IResponse<null>>(`${ENDPOINT}/read-all`, {});
};
