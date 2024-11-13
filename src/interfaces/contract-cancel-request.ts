import { IBaseUserEmbed } from '@/interfaces/user';

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
    reason: string | null;
    deleted: boolean;
    updatedAt: string;
    status: ContractCancelRequestStatus;
}

export interface IContractCancelRequestDetail extends IContractCancelRequest {
    userRequest: IBaseUserEmbed;
}

export interface ICreateContractCancelRequest {
    contractId: string;
    cancelDate: string;
    reason?: string;
    signature: string;
}

export interface IUpdateContractCancelRequestStatus {
    requestId: number;
    status: Exclude<ContractCancelRequestStatus, 'PENDING'>;
}
