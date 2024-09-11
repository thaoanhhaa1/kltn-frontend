import http from '@/lib/http';
import { ICreateRentalRequest } from '@/schemas/rental-request.schema';

export const createRentalRequest = (params: ICreateRentalRequest) => {
    return http.post('/estate-manager-service/rental-requests', params);
};
