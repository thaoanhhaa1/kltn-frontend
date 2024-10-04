export type ContractCancelRequestStatus =
    | 'PENDING'
    | 'APPROVED'
    | 'REJECTED'
    | 'CANCELLED'
    | 'CONTINUE'
    | 'UNILATERAL_CANCELLATION';

export interface IContractCancelRequest {
    id: number;
    contractId: string;
    requestedBy: string;
    requestedAt: string;
    cancelDate: string;
    reason: null;
    deleted: boolean;
    updatedAt: string;
    status: string;
}

export interface ICreateContractCancelRequest {
    contractId: string;
    cancelDate: string;
    reason?: string;
}

export interface IUpdateContractCancelRequestStatus {
    requestId: number;
    status: Exclude<ContractCancelRequestStatus, 'PENDING'>;
}
