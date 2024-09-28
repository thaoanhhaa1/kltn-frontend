import { IPropertyType } from '@/interfaces/propertyType';
import http from '@/lib/http';

export const getPropertyTypes = () => {
    return http.get<Array<IPropertyType>>('/estate-manager-service/property-types');
};