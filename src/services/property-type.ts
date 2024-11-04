import { IPropertyType, IPropertyTypeDetail } from '@/interfaces/property-type';
import http from '@/lib/http';

const ENDPOINT = '/estate-manager-service/property-types';

export const getPropertyTypes = () => {
    return http.get<Array<IPropertyType>>(ENDPOINT);
};

export const getPropertyTypesByAdmin = (accessToken: string) => {
    return http.get<Array<IPropertyTypeDetail>>(`${ENDPOINT}/all`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

export const createPropertyType = ({ name }: { name: string }) => {
    return http.post<IPropertyTypeDetail>(ENDPOINT, { name });
};

export const updatePropertyType = (propertyType: IPropertyType) => {
    return http.put<IPropertyTypeDetail>(`${ENDPOINT}/${propertyType.id}`, propertyType);
};

export const deletePropertyType = (propertyTypeId: string) => {
    return http.delete<IPropertyTypeDetail>(`${ENDPOINT}/${propertyTypeId}`, {});
};
