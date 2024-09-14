export interface INotification {
    id: string;
    title: string;
    body: string;
    status: NotificationStatus;
    createdAt: string;
    updatedAt: string;
    from?: string;
    to: string;
    type: NotificationType;
}

export type NotificationType = 'RENTAL_REQUEST' | 'PROPERTY' | 'REVIEW' | 'RENTER_RENTAL_REQUEST';
export type NotificationStatus = 'RECEIVED' | 'READ' | 'DELETED';
