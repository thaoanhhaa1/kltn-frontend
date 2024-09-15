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

export interface IGenerateContractRequest {
    propertyId: string;
    renterId: string;
    requestId: string;
}

export interface IGenerateContractResponse {
    contractContent: string;
    ownerId: string;
    renterId: string;
    propertyId: string;
    startDate: string;
    endDate: string;
    monthlyRent: number;
    depositAmount: number;
}
