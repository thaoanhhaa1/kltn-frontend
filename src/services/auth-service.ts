import { IAuthResponse } from '@/interfaces/auth';
import http from '@/lib/http';
import { LoginInput, RegisterInput } from '@/schemas/auth.schema';

export const login = (params: LoginInput): Promise<IAuthResponse> => {
    return http.post('/estate-manager-service/auth/login', params);
};

export const saveToken = (params: IAuthResponse) => {
    return http.post('/api/auth/token', params, {
        baseUrl: '',
    });
};

export const register = (params: RegisterInput) => {
    return http.post<IAuthResponse>('/estate-manager-service/auth/register', params);
};

export const sendRegisterOTP = (email: string) => {
    return http.post('/estate-manager-service/auth/register/otp', { email });
};

export const signOut = () => {
    return http.post('/api/auth/sign-out', null, {
        baseUrl: '',
    });
};
