import { IRentalRequest } from '@/interfaces/rentalRequest';
import http from '@/lib/http';
import { ICreateRentalRequest, IUpdateRentalRequestStatus } from '@/schemas/rental-request.schema';

export const createRentalRequest = (params: ICreateRentalRequest) => {
    return http.post('/estate-manager-service/rental-requests', params);
};

export const renterGetAllRentalRequests = (accessToken: string) => {
    return http.get<Array<IRentalRequest>>('/estate-manager-service/rental-requests/renter', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

export const renterUpdateRentalRequestStatus = (params: IUpdateRentalRequestStatus) => {
    return http.patch('/estate-manager-service/rental-requests/renter/status', params);
};
