import {
    IAttribute,
    IAttributeCbb,
    ICreateAttribute,
    IGetAllAttributes,
    IUpdateAttribute,
} from '@/interfaces/attribute';
import http from '@/lib/http';

const ENDPOINT = '/estate-manager-service/attributes';

export const getAllAttributesCbb = () => {
    return http.get<Array<IAttributeCbb>>(`${ENDPOINT}/cbb`);
};

export const getAllAttributes = (params: IGetAllAttributes) => {
    return http.get<Array<IAttribute>>(ENDPOINT, {
        params,
    });
};

export const deleteAttribute = (id: string) => {
    return http.delete(`${ENDPOINT}/${id}`, {});
};

export const createAttribute = (data: ICreateAttribute) => {
    return http.post<IAttribute>(ENDPOINT, data);
};

export const updateAttribute = ({ id, ...data }: IUpdateAttribute) => {
    return http.put<IAttribute>(`${ENDPOINT}/${id}`, data);
};
