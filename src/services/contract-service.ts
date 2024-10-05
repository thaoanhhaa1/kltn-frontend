import { IContract, IContractDetail, ICreateContractRequest } from '@/interfaces/contract';
import { IPagination } from '@/interfaces/pagination';
import { ITable } from '@/interfaces/table';
import http from '@/lib/http';

const ENDPOINT = '/contract-service/contracts';

export const createContract = ({
    contractTerms,
    depositAmount,
    endDate,
    monthlyRent,
    ownerId,
    propertyId,
    renterId,
    startDate,
}: ICreateContractRequest) => {
    return http.post(ENDPOINT, {
        ownerId,
        renterId,
        propertyId,
        startDate,
        endDate,
        contractTerms,
        monthlyRent,
        depositAmount,
    });
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
