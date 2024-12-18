import { IContractCancelRequest } from '@/interfaces/contract-cancel-request';
import { IPagination } from '@/interfaces/pagination';
import { IProperty } from '@/interfaces/property';
import { IBaseUser } from '@/interfaces/user';

export interface ICreateContractRequest {
    ownerId: string;
    renterId: string;
    propertyId: string;
    startDate: string;
    endDate: string;
    contractTerms: string;
    monthlyRent: number;
    depositAmount: number;
    signature: string;
}

export interface IContract {
    contractId: string;
    ownerId: string;
    renterId: string;
    propertyId: string;
    startDate: string;
    endDate: string;
    endDateActual: string;
    deleted: boolean;
    status: ContractStatus;
    createdAt: string;
    updatedAt: string;
    monthlyRent: number;
    depositAmount: number;
    contractTerms: string;
    transactionHashContract: string;
}

export interface IContractDetail extends IContract {
    owner: IBaseUser;
    renter: IBaseUser;
    cancellationRequests: Array<IContractCancelRequest>;
    property: IProperty;
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

export interface IGenerateContract {
    renterId: string;
    propertyId: string;
    rentalPrice: number;
    rentalDeposit: number;
    rentalStartDate: string;
    rentalEndDate: string;
}

export interface IGenerateContractRes {
    contractContent: string;
    ownerId: string;
    renterId: string;
    propertyId: string;
    startDate: string;
    endDate: string;
    monthlyRent: number;
    depositAmount: number;
}

export type IGetContractsTable = IPagination & {
    contractId?: string;
    title?: string;
    startDate?: string;
    endDate?: string;
    monthlyRent?: number;
    depositAmount?: number;
    status?: ContractStatus;
    propertyId?: string;
};

export type IGetContractsByOwner = IGetContractsTable & {
    renterId?: string;
};

export type IGetContractsByRenter = IGetContractsTable & {
    ownerId?: string;
    sort?: {
        field: string;
        order: 'asc' | 'desc';
    };
};
