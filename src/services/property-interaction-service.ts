import { IPagination } from '@/interfaces/pagination';
import {
    ICreatePropertyInteraction,
    IDeletePropertyInteraction,
    IPropertyInteraction,
    IUpdatePropertyInteraction,
} from '@/interfaces/property-interaction';
import { IResponse } from '@/interfaces/response';
import { ITable } from '@/interfaces/table';
import http from '@/lib/http';

const ENDPOINT = '/estate-manager-service/property-interactions';

export const createPropertyInteraction = (data: ICreatePropertyInteraction) => {
    return http.post<IPropertyInteraction>(ENDPOINT, data);
};

export const updatePropertyInteraction = ({ interactionId, ...data }: IUpdatePropertyInteraction) => {
    return http.put<IPropertyInteraction>(`${ENDPOINT}/${interactionId}`, data);
};

export const deletePropertyInteraction = ({ interactionId }: IDeletePropertyInteraction) => {
    return http.delete<IPropertyInteraction>(`${ENDPOINT}/${interactionId}`, {});
};

export const getPropertyInteractions = () => {
    return http.get<IPropertyInteraction[]>(ENDPOINT);
};

export const getFavoriteBySlug = (slug: string) => {
    return http.get<IPropertyInteraction>(`${ENDPOINT}/slug/${slug}`);
};

export const countFavorites = (accessToken: string) => {
    return http.get<IResponse<number>>(`${ENDPOINT}/favorites/count`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

export const getFavorites = (pagination: IPagination) => {
    return http.get<ITable<IPropertyInteraction>>(`${ENDPOINT}/favorites`, {
        params: pagination,
    });
};
