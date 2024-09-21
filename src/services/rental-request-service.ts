import { IPagination } from '@/interfaces/pagination';
import { IGenerateContractRequest, IGenerateContractResponse, IRentalRequest } from '@/interfaces/rentalRequest';
import { ITable } from '@/interfaces/table';
import http from '@/lib/http';
import { convertObjectToParams } from '@/lib/utils';
import { ICreateRentalRequest, IUpdateRentalRequestStatus } from '@/schemas/rental-request.schema';

export const createRentalRequest = (params: ICreateRentalRequest) => {
    return http.post('/estate-manager-service/rental-requests', params);
};

export const renterGetAllRentalRequests = (accessToken: string) => {
    return http.get<ITable<IRentalRequest>>('/estate-manager-service/rental-requests/renter', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

export const renterUpdateRentalRequestStatus = (params: IUpdateRentalRequestStatus) => {
    return http.patch('/estate-manager-service/rental-requests/renter/status', params);
};

export const ownerUpdateRentalRequestStatus = (params: IUpdateRentalRequestStatus) => {
    return http.patch('/estate-manager-service/rental-requests/owner/status', params);
};

export const ownerGetAllRentalRequests = (params: IPagination) => {
    const queryParams = convertObjectToParams(params);

    return http.get<ITable<IRentalRequest>>(`/estate-manager-service/rental-requests/owner?${queryParams}`);
};

export const generateContract = (params: IGenerateContractRequest) => {
    return http.post<IGenerateContractResponse>('/estate-manager-service/rental-requests/generate-contract', params);
};
