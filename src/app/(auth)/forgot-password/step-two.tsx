'use client';

import { Button, ButtonLoading } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import CustomError, { EntryError } from '@/lib/error';
import { SIGN_IN } from '@/path';
import { ForgotPasswordInput, forgotPasswordSchema } from '@/schemas/user.schema';
import { forgotPassword } from '@/services/user-service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Flex } from 'antd';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const StepTwo = ({ email, setStep }: { email: string; setStep: Dispatch<SetStateAction<number>> }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: email,
            otp: '',
            password: '',
        },
    });

    async function onSubmit(values: ForgotPasswordInput) {
        setLoading(true);

        try {
            await forgotPassword(values);

            toast.success('Mật khẩu của bạn đã được cập nhật');
            router.push(SIGN_IN);
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

    const handleBack = () => {
        setStep((prev) => prev - 1);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <Flex justify="space-between" align="center">
                    <Button variant="outline" onClick={handleBack}>
                        Quay lại
                    </Button>
                    <ButtonLoading loading={loading} type="submit">
                        Cập nhật mật khẩu
                    </ButtonLoading>
                </Flex>
            </form>
        </Form>
    );
};

export default StepTwo;
