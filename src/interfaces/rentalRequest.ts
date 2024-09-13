export interface IRentalRequest {
    property: {
        propertyId: string;
        title: string;
        images: string[];
        slug: string;
    };
    requestId: string;
    renterId: string;
    ownerId: string;
    status: RentalRequestStatus;
    rentalPrice: number;
    rentalDeposit: number;
    rentalStartDate: string;
    rentalEndDate: string;
    createdAt: string;
    updatedAt: string;
}

export type RentalRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
