export interface ICreateContractRequest {
    ownerId: string;
    renterId: string;
    propertyId: string;
    startDate: string;
    endDate: string;
    contractTerms: string;
    monthlyRent: number;
    depositAmount: number;
}

export interface IContract {
    contractId: string;
    ownerId: string;
    renterId: string;
    propertyId: string;
    startDate: string;
    endDate: string;
    deleted: boolean;
    status: ContractStatus;
    createdAt: string;
    updatedAt: string;
    monthlyRent: number;
    depositAmount: number;
    contractTerms: string;
    transactionHashContract: string;
}

export type ContractStatus =
    | 'WAITING'
    | 'DEPOSITED'
    | 'ONGOING'
    | 'ENDED'
    | 'OVERDUE'
    | 'CANCELLED'
    | 'PENDING_CANCELLATION'
    | 'UNILATERAL_CANCELLATION'
    | 'APPROVED_CANCELLATION'
    | 'REJECTED_CANCELLATION';
