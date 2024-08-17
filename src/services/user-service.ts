import { IPagination } from '@/interfaces/pagination';
import { ITable } from '@/interfaces/table';
import { IUser } from '@/interfaces/user';
import http from '@/lib/http';

export const getAllUsers = async (params: IPagination): Promise<ITable<IUser>> => {
    const search = new URLSearchParams({
        skip: String(params.skip),
        take: String(params.take),
    }).toString();

    return http.get<ITable<IUser>>(`/user-service/users?${search}`);
};
