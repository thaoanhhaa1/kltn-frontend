import { IAttributeCbb } from '@/interfaces/attribute';
import http from '@/lib/http';

export const getAllAttributesCbb = async () => {
    return http.get<Array<IAttributeCbb>>('/estate-manager-service/attributes/cbb');
};
