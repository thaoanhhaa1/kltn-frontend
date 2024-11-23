import { OWNER, RENTER } from '@/constants/account-type';
import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().min(1, { message: 'Email là bắt buộc' }).email({ message: 'Email không hợp lệ' }),
    password: z
        .string()
        .min(1, { message: 'Mật khẩu là bắt buộc' })
        .min(6, { message: 'Mật khẩu phải dài ít nhất 6 ký tự' })
        .regex(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/, {
            message: 'Mật khẩu phải chứa ít nhất một chữ cái, một số',
        }),
    userType: z.enum([RENTER, OWNER], { message: 'Loại tài khoản không hợp lệ' }),
    name: z.string().min(1, { message: 'Tên là bắt buộc' }),
    otp: z.string().min(1, { message: 'OTP là bắt buộc' }).length(6, { message: 'OTP phải dài 6 ký tự' }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z.string().min(1, { message: 'Email là bắt buộc' }).email({ message: 'Email không hợp lệ' }),
    password: z
        .string()
        .min(1, { message: 'Mật khẩu là bắt buộc' })
        .min(6, { message: 'Mật khẩu phải dài ít nhất 6 ký tự' })
        .regex(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/, {
            message: 'Mật khẩu phải chứa ít nhất một chữ cái, một số',
        }),
});

export type LoginInput = z.infer<typeof loginSchema>;

export interface IAuthResponse {
    token: {
        accessToken: {
            expiresIn: number;
            token: string;
        };
        refreshToken: {
            expiresIn: number;
            token: string;
        };
    };
}
