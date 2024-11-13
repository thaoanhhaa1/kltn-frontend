import {
    IContract,
    IContractDetail,
    ICreateContractRequest,
    IGenerateContract,
    IGenerateContractRes,
} from '@/interfaces/contract';
import { IPagination } from '@/interfaces/pagination';
import { ITable } from '@/interfaces/table';
import http from '@/lib/http';

const ENDPOINT = '/contract-service/contracts';

export const createContractAndApproveRequest = async (
    params: ICreateContractRequest & {
        requestId: string;
    },
) => {
    return http.post(ENDPOINT, params);
};

export const createContract = (data: ICreateContractRequest) => {
    return http.post(ENDPOINT, data);
};

export const getContractsByRenter = (pagination: IPagination) => {
    return http.get<ITable<IContract>>(`${ENDPOINT}/renter`, {
        params: pagination,
    });
};

export const getContractsByOwner = (pagination: IPagination) => {
    return http.get<ITable<IContract>>(`${ENDPOINT}/owner`, {
        params: pagination,
    });
};

export const cancelContractBeforeDeposit = (contractId: string) => {
    return http.post<IContract>(`${ENDPOINT}/cancel-before-deposit`, {
        contractId,
    });
};

export const getContractDetail = (contractId: string, token: string) => {
    return http.get<IContractDetail>(`${ENDPOINT}/${contractId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const generateContractService = (data: IGenerateContract) => {
    return http.post<IGenerateContractRes>(`${ENDPOINT}/generate`, data);
};
