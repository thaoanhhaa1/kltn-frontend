import { IPagination } from '@/interfaces/pagination';
import { IProperty } from '@/interfaces/property';
import { ITable } from '@/interfaces/table';
import http from '@/lib/http';

export const getAllNotDeletedProperties = async (params: IPagination): Promise<ITable<IProperty>> => {
    const search = new URLSearchParams({
        skip: String(params.skip),
        take: String(params.take),
    }).toString();

    return http.get<ITable<IProperty>>(`/property-service/properties/all?${search}`);
};
