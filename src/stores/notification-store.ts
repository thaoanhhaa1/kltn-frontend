import { initDataTable } from '@/constants/init-data';
import { INotification, NotificationStatus } from '@/interfaces/notification';
import { ITable } from '@/interfaces/table';
import { create } from 'zustand';

export interface INotificationStore {
    count?: number;
    notifications: ITable<INotification>;
    loading: boolean;
    readNotificationsIds: string[];
    setNotifications: (notifications: ITable<INotification>) => void;
    setLoading: (loading: boolean) => void;
    updateStatus: (id: string, status: NotificationStatus) => void;
    setCount: (count: number) => void;
    setReadNotificationsIds: (readNotificationsIds: string[]) => void;
    readNotification: (id: string) => void;
    readAllNotifications: () => void;
}

const useNotificationStore = create<INotificationStore>((set) => ({
    notifications: initDataTable,
    loading: false,
    readNotificationsIds: [],
    setNotifications: (notifications) =>
        set((state) => ({
            notifications: {
                data: [
                    ...state.notifications.data,
                    ...(state.notifications.data.at(-1)?.id === notifications.data.at(-1)?.id
                        ? []
                        : notifications.data),
                ],
                pageInfo: notifications.pageInfo,
            },
        })),
    setLoading: (loading) => set({ loading }),
    updateStatus: (id: string, status: NotificationStatus) =>
        set((state) => ({
            notifications: {
                data: state.notifications.data.map((notification) =>
                    notification.id === id ? { ...notification, status } : notification,
                ),
                pageInfo: state.notifications.pageInfo,
            },
            readNotificationsIds: [...state.readNotificationsIds, id],
        })),
    setCount: (count) => set({ count }),
    setReadNotificationsIds: (readNotificationsIds: string[]) => set({ readNotificationsIds }),
    readNotification: (id: string) =>
        set((state) => ({
            notifications: {
                data: state.notifications.data.map((notification) =>
                    notification.id === id ? { ...notification, status: 'READ' } : notification,
                ),
                pageInfo: state.notifications.pageInfo,
            },
        })),
    readAllNotifications: () =>
        set((prev) => ({
            notifications: {
                data: prev.notifications.data.map((notification) => ({
                    ...notification,
                    status: 'READ',
                })),
                pageInfo: prev.notifications.pageInfo,
            },
            count: 0,
        })),
}));

export { useNotificationStore };
