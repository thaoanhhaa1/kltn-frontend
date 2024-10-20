export type ContractExtensionRequestType = 'EXTEND_CONTRACT' | 'EXTEND_PAYMENT';
export type ContractExtensionRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface ICreateExtensionRequest {
    contractId: string;
    type: ContractExtensionRequestType;
    extensionDate: string;
    transactionId: number | null;
    reason: string | null;
}

export interface IUpdateExtensionRequestStatus {
    id: number;
    status: ContractExtensionRequestStatus;
    contractId: string;
}

export interface IGetExtensionRequestByContractId {
    contractId: string;
    accessToken: string;
}

export interface IExtensionRequest {
    id: number;
    contractId: string;
    transactionId: number;
    type: ContractExtensionRequestType;
    status: ContractExtensionRequestStatus;
    date: string;
    extensionDate: string;
    reason: string | null;
    createdAt: string;
    updatedAt: string;
}
