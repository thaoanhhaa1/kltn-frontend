import { z } from 'zod';

export const passwordSchema = z
    .string()
    .min(1, { message: 'Vui lòng nhập mật khẩu' })
    .min(6, { message: 'Mật khẩu phải chứa ít nhất 6 ký tự' })
    .regex(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/, {
        message: 'Mật khẩu phải chứa ít nhất 1 chữ cái và 1 số',
    });

export const phoneNumberSchema = z
    .string()
    .min(10, { message: 'Số điện thoại phải có 10 chữ số' })
    .regex(/^0\d{9}$/, { message: 'Số điện thoại không hợp lệ' })
    .optional();

export const nameOfUserSchema = z.string().min(1, { message: 'Name is required' });

export const emailSchema = z
    .string()
    .min(1, { message: 'Vui lòng nhập email' })
    .email({ message: 'Email không hợp lệ' });

export const userTypeSchema = z.enum(['renter', 'owner'], { message: 'Vui lòng chọn loại tài khoản' });

export const otpSchema = z
    .string()
    .min(1, { message: 'Vui lòng nhập mã OTP' })
    .length(6, { message: 'Mã OTP phải có 6 ký tự' });
