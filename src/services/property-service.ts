import { IPagination } from '@/interfaces/pagination';
import {
    ApprovalStatus,
    ICountAvailableProperties,
    IFiterProperty,
    IGetNotDeletedProperties,
    IProperty,
    PropertyStatus,
    SuggestSearch,
    VisibleStatus,
} from '@/interfaces/property';
import { ITable } from '@/interfaces/table';
import http from '@/lib/http';
import { convertObjectToParams } from '@/lib/utils';

export const getAllNotDeletedProperties = async (params: IGetNotDeletedProperties): Promise<ITable<IProperty>> => {
    return http.get<ITable<IProperty>>(`/estate-manager-service/properties/all`, {
        params,
    });
};

export const getAllNotDeletedPropertiesByOwnerId = async (
    params: IPagination & IFiterProperty,
): Promise<ITable<IProperty>> => {
    const search = convertObjectToParams(params);

    return http.get<ITable<IProperty>>(`/estate-manager-service/properties/owner?${search}`);
};

export const updateVisibleProperties = async (propertyIds: string[], status: VisibleStatus) => {
    return http.post<Array<IProperty>>('/estate-manager-service/properties/visible', {
        properties: propertyIds,
        status,
    });
};

export const updateApprovalProperties = async (propertyIds: string[], status: ApprovalStatus, reason?: string) => {
    return http.post<Array<IProperty>>('/estate-manager-service/properties/approval', {
        properties: propertyIds,
        status,
        reason,
    });
};

export const createProperty = async (formData: FormData) => {
    return http.post<IProperty>('/estate-manager-service/properties', formData);
};

export const softDeleteProperty = async (propertyId: string) => {
    return http.delete<IProperty>(`/estate-manager-service/properties/${propertyId}`, {});
};

export const getPropertyStatus = () => http.get<Array<PropertyStatus>>('/estate-manager-service/properties/status');

export const searchProperties = (searchParams: string) =>
    http.get<ITable<IProperty>>(`/estate-manager-service/properties/search?${searchParams}`);

export const countAvailableProperties = () =>
    http.get<ICountAvailableProperties>('/estate-manager-service/properties/count');

export const getPropertyBySlug = (slug: string) =>
    http.get<IProperty>(`/estate-manager-service/properties/slug/${slug}`);

export const getPropertyById = (id: string, accessToken: string) => {
    return http.get<IProperty>(`/estate-manager-service/properties/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

export const updateProperty = (propertyId: string, formData: FormData) => {
    return http.put<IProperty>(`/estate-manager-service/properties/${propertyId}`, formData);
};

export const getAllPropertiesCbbForOwner = () => {
    return http.get<IProperty[]>('/estate-manager-service/properties/owner/cbb');
};

export const getNotDeletedPropertyService = (propertyId: string, accessToken: string) => {
    return http.get<IProperty>(`/estate-manager-service/properties/${propertyId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

export const suggestSearch = (query: string) => {
    return http.get<Array<SuggestSearch>>(`/estate-manager-service/properties/suggest-search?query=${query}`);
};

export const suggest = (accessToken: string) => {
    return http.get<Array<IProperty>>('/estate-manager-service/properties/suggest', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};
