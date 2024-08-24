import { envConfig } from '@/config/envConfig';
import http from '@/lib/http';

export interface IAddress {
    _id: string;
    name: string;
    parent_id: string | null | undefined;
}

export const getCities = async (): Promise<IAddress[]> => {
    return http.get<IAddress[]>('/cities', {
        baseUrl: envConfig.NEXT_PUBLIC_ADDRESS_ENDPOINT,
    });
};

export const getDistricts = async (cityId: string): Promise<IAddress[]> => {
    return http.get<IAddress[]>(`/districts?cityId=${cityId}`, {
        baseUrl: envConfig.NEXT_PUBLIC_ADDRESS_ENDPOINT,
    });
};

export const getWards = async (districtId: string): Promise<IAddress[]> => {
    return http.get<IAddress[]>(`/wards?districtId=${districtId}`, {
        baseUrl: envConfig.NEXT_PUBLIC_ADDRESS_ENDPOINT,
    });
};
