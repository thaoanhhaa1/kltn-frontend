'use client';

import { ButtonLoading } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { OWNER, RENTER } from '@/constants/account-type';
import CustomError, { EntryError } from '@/lib/error';
import { HOME } from '@/path';
import { RegisterInput, registerSchema } from '@/schemas/auth.schema';
import { otpSchema } from '@/schemas/otp.schema';
import { register, saveToken, sendRegisterOTP } from '@/services/auth-service';
import { zodResolver } from '@hookform/resolvers/zod';
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const SignUpForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const accountTypes = useMemo(
        () => [
            {
                label: 'Người thuê',
                value: RENTER,
            },
            {
                label: 'Chủ nhà',
                value: OWNER,
            },
        ],
        [],
    );

    const form = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            otp: '',
            userType: RENTER, // FIXME
        },
    });

    async function onSubmit(values: RegisterInput) {
        try {
            setLoading(true);
            const res = await register(values);

            await saveToken(res);

            router.push(HOME);
            router.refresh();
        } catch (error) {
            if (error instanceof EntryError) {
                error.details.forEach((detail) => {
                    form.setError(detail.field as keyof typeof values, {
                        message: detail.error,
                    });
                });
            } else if (error instanceof CustomError) {
                toast.error(error.message);
            } else {
                toast.error('Lỗi không xác định');
            }
        } finally {
            setLoading(false);
        }
    }

    const handleGetOtp = async () => {
        const email = form.getValues('email');

        const res = otpSchema.safeParse({ email });

        if (res.success) {
            try {
                await sendRegisterOTP(email);
                toast.success('Mã OTP đã được gửi thành công');
            } catch (error) {
                if (error instanceof EntryError) {
                    error.details.forEach((detail) => {
                        form.setError(detail.field as keyof typeof res.data, {
                            message: detail.error,
                        });
                    });
                } else if (error instanceof CustomError) {
                    toast.error(error.message);
                } else {
                    toast.error('Lỗi không xác định');
                }
            }
        } else {
            form.setError('email', {
                message: res.error.errors[0].message,
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Họ và tên</FormLabel>
                            <FormControl>
                                <Input placeholder="Nhập họ tên của bạn" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="m@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mật khẩu</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Nhập mật khẩu của bạn" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="userType"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                            <FormLabel>Loại tài khoản</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex items-center gap-2 !mt-0"
                                >
                                    {accountTypes.map((item) => (
                                        <FormItem key={item.value} className="flex items-center gap-2">
                                            <FormControl>
                                                <RadioGroupItem value={item.value} />
                                            </FormControl>
                                            <FormLabel className="font-normal !mt-0">{item.label}</FormLabel>
                                        </FormItem>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className={`flex gap-4 ${form.formState.errors.otp ? 'items-center' : 'items-end'}`}>
                    <div className="flex-1">
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>OTP</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nhập mã OTP" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <ButtonLoading type="button" onClick={handleGetOtp} variant="secondary">
                        Lấy mã OTP
                    </ButtonLoading>
                </div>
                <ButtonLoading loading={loading} type="submit" className="w-full">
                    Đăng ký
                </ButtonLoading>
            </form>
        </Form>
    );
};

export default SignUpForm;
