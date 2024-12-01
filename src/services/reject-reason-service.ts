import { IRejectReason } from '@/interfaces/reject-reason';
import http from '@/lib/http';

const ENDPOINT = '/estate-manager-service/reject-reasons';

export const getRejectReasonsByPropertyId = (propertyId: string) => {
    return http.get<Array<IRejectReason>>(`${ENDPOINT}/${propertyId}`);
};

export const getRejectReasonsByPropertyIdService = async (propertyId: string, accessToken: string) => {
    return http.get<Array<IRejectReason>>(`${ENDPOINT}/${propertyId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};
