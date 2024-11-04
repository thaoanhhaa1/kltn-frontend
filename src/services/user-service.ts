import { IPagination } from '@/interfaces/pagination';
import { ITable } from '@/interfaces/table';
import { IUser } from '@/interfaces/user';
import http from '@/lib/http';
import { ForgotPasswordInput, UpdatePasswordInput } from '@/schemas/user.schema';

const ENDPOINT = '/estate-manager-service/users';

export const getAllUsers = async (params: IPagination): Promise<ITable<IUser>> => {
    const search = new URLSearchParams({
        skip: String(params.skip),
        take: String(params.take),
    }).toString();

    return http.get<ITable<IUser>>(`${ENDPOINT}?${search}`);
};

export const getMe = async (accessToken: string): Promise<IUser> => {
    if (!accessToken) {
        throw new Error(`Access token is required`);
    }

    return http.get<IUser>(`${ENDPOINT}/me`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

export const updateMyInfo = async (data: FormData): Promise<IUser> => {
    return http.put<IUser>(`${ENDPOINT}`, data);
};

export const updateWalletAddress = async (walletAddress: string): Promise<void> => {
    return http.patch<void>(`${ENDPOINT}/wallet`, { walletAddress });
};

export const verifyUser = async (data: FormData): Promise<IUser> => {
    return http.post<IUser>(`${ENDPOINT}/verify`, data);
};

export const updatePassword = async (data: UpdatePasswordInput): Promise<void> => {
    return http.post<void>(`${ENDPOINT}/update-password`, data);
};

export const otpToUser = async (email: string): Promise<void> => {
    return http.post<void>(`${ENDPOINT}/otp`, { email });
};

export const forgotPassword = async (data: ForgotPasswordInput): Promise<void> => {
    return http.post<void>(`${ENDPOINT}/forgot-password`, data);
};

export const blockUser = (userId: string) => {
    return http.post<IUser>(`${ENDPOINT}/block`, {
        id: userId,
    });
};
