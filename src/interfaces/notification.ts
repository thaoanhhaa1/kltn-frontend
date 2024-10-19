export interface INotification {
    id: string;
    title: string;
    body: string;
    status: NotificationStatus;
    createdAt: string;
    updatedAt: string;
    from?: string;
    to: string;
    toRole: string | null;
    docId: string;
    type: NotificationType;
}

export type NotificationType =
    | 'RENTER_RENTAL_REQUEST'
    | 'RENTAL_REQUEST'
    | 'PROPERTY'
    | 'REVIEW'
    | 'OWNER_DETAIL_PROPERTY'
    | 'OWNER_CONTRACT'
    | 'RENTER_CONTRACT'
    | 'CONTRACT_DETAIL'
    | 'RENTER_PAYMENT'
    | 'OWNER_PROPERTY'
    | 'ADMIN_PROPERTY';
export type NotificationStatus = 'RECEIVED' | 'READ' | 'DELETED';
