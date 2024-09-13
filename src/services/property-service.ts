import { IPagination } from '@/interfaces/pagination';
import {
    ApprovalStatus,
    ICountAvailableProperties,
    IFiterProperty,
    IProperty,
    PropertyStatus,
    VisibleStatus,
} from '@/interfaces/property';
import { ITable } from '@/interfaces/table';
import http from '@/lib/http';
import { convertObjectToParams } from '@/lib/utils';

export const getAllNotDeletedProperties = async (params: IPagination): Promise<ITable<IProperty>> => {
    const search = new URLSearchParams({
        skip: String(params.skip),
        take: String(params.take),
    }).toString();

    return http.get<ITable<IProperty>>(`/estate-manager-service/properties/all?${search}`);
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
