import { IContract, ICreateContractRequest } from '@/interfaces/contract';
import http from '@/lib/http';

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
    return http.post('/contract-service/contracts', {
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

export const getContractsByRenter = () => {
    return http.get<Array<IContract>>('/contract-service/contracts/renter');
};

export const getContractsByOwner = () => {
    return http.get<Array<IContract>>('/contract-service/contracts/owner');
};

export const cancelContractBeforeDeposit = (contractId: string) => {
    return http.post<IContract>('/contract-service/contracts/cancel-before-deposit', {
        contractId,
    });
};
