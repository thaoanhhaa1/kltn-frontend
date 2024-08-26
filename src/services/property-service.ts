import { IPagination } from '@/interfaces/pagination';
import { IFiterProperty, IProperty, PropertyStatus } from '@/interfaces/property';
import { ITable } from '@/interfaces/table';
import http from '@/lib/http';
import { convertObjectToParams } from '@/lib/utils';

export const getAllNotDeletedProperties = async (params: IPagination): Promise<ITable<IProperty>> => {
    const search = new URLSearchParams({
        skip: String(params.skip),
        take: String(params.take),
    }).toString();

    return http.get<ITable<IProperty>>(`/property-service/properties/all?${search}`);
};

export const getAllNotDeletedPropertiesByOwnerId = async (
    params: IPagination & IFiterProperty,
): Promise<ITable<IProperty>> => {
    const search = convertObjectToParams(params);

    return http.get<ITable<IProperty>>(`/property-service/properties/owner?${search}`);
};

export const updateVisibleProperties = async (propertyIds: string[], status: PropertyStatus) => {
    return http.post<Array<IProperty>>('/property-service/properties/visible', {
        properties: propertyIds,
        status,
    });
};

export const createProperty = async (formData: FormData) => {
    return http.post<IProperty>('/property-service/properties', formData);
};

export const softDeleteProperty = async (propertyId: string) => {
    return http.delete<IProperty>(`/property-service/properties/${propertyId}`, {});
};

export const getPropertyStatus = () => http.get<Array<PropertyStatus>>('/property-service/properties/status');
