import { IPagination } from '@/interfaces/pagination';
import { IGenerateContractRequest, IGenerateContractResponse, IRentalRequest } from '@/interfaces/rentalRequest';
import { ITable } from '@/interfaces/table';
import http from '@/lib/http';
import { convertObjectToParams } from '@/lib/utils';
import { ICreateRentalRequest, IUpdateRentalRequestStatus } from '@/schemas/rental-request.schema';

const ENDPOINT = '/contract-service/rental-requests';

export const createRentalRequest = (params: ICreateRentalRequest) => {
    return http.post(`${ENDPOINT}`, params);
};

export const renterGetAllRentalRequests = (accessToken: string) => {
    return http.get<ITable<IRentalRequest>>(`${ENDPOINT}/renter`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

export const renterUpdateRentalRequestStatus = (params: IUpdateRentalRequestStatus) => {
    return http.patch(`${ENDPOINT}/renter/status`, params);
};

export const ownerUpdateRentalRequestStatus = (params: IUpdateRentalRequestStatus) => {
    return http.patch(`${ENDPOINT}/owner/status`, params);
};

export const ownerGetAllRentalRequests = (params: IPagination) => {
    const queryParams = convertObjectToParams(params);

    return http.get<ITable<IRentalRequest>>(`${ENDPOINT}/owner?${queryParams}`);
};

export const generateContract = (params: IGenerateContractRequest) => {
    return http.post<IGenerateContractResponse>(`${ENDPOINT}/generate-contract`, params);
};
