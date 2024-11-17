import { envConfig } from '@/config/envConfig';
import { IAddressToLngLat, ILngLatToAddressRes } from '@/interfaces/goong';
import http from '@/lib/http';

const GOONG_API_KEY = envConfig.NEXT_PUBLIC_GOONG_API_KEY;

export const lngLatToAddressService = async (lngLat: [number, number]) => {
    const res = await http.get<ILngLatToAddressRes>(`https://rsapi.goong.io/geocode`, {
        baseUrl: '',
        params: {
            latlng: lngLat.join(','),
            api_key: GOONG_API_KEY,
        },
    });

    return res;
};

export const addressToLngLatService = async (address: string) => {
    const res = await http.get<IAddressToLngLat>(`https://rsapi.goong.io/geocode`, {
        baseUrl: '',
        params: {
            address,
            api_key: GOONG_API_KEY,
        },
    });

    return res;
};
