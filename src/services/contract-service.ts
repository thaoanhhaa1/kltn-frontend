import {
    IContract,
    IContractDetail,
    ICreateContractRequest,
    IGenerateContract,
    IGenerateContractRes,
    IGetContractsByOwner,
    IGetContractsByRenter,
} from '@/interfaces/contract';
import { IProperty } from '@/interfaces/property';
import { ITable } from '@/interfaces/table';
import { IBaseUser } from '@/interfaces/user';
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

export const getContractsByRenter = (data: IGetContractsByRenter) => {
    return http.get<ITable<IContract>>(`${ENDPOINT}/renter`, {
        params: data,
    });
};

export const getContractsByOwner = (data: IGetContractsByOwner) => {
    return http.get<ITable<IContract>>(`${ENDPOINT}/owner`, {
        params: data,
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

export const getPropertiesByOwnerService = () => {
    return http.get<IProperty[]>(`${ENDPOINT}/owner/property/cbb`);
};

export const getUsersByOwnerService = () => {
    return http.get<IBaseUser[]>(`${ENDPOINT}/owner/user/cbb`);
};

export const getPropertiesByRenterService = () => {
    return http.get<IProperty[]>(`${ENDPOINT}/renter/property/cbb`);
};

export const getUsersByRenterService = () => {
    return http.get<IBaseUser[]>(`${ENDPOINT}/renter/user/cbb`);
};
