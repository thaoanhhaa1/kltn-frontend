'use client';

import { ButtonLoading } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import CustomError, { EntryError } from '@/lib/error';
import { HOME } from '@/path';
import { LoginInput, loginSchema } from '@/schemas/auth.schema';
import { login, saveToken } from '@/services/auth-service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const SignInForm = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: LoginInput) {
        try {
            setLoading(true);
            const res = await login(values);

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
                toast({
                    variant: 'destructive',
                    title: error.name,
                    description: error.message,
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Lỗi không xác định',
                    description: 'Vui lòng thử lại sau',
                });
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                                <Input type="password" placeholder="Nhật mật khẩu của bạn" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <ButtonLoading loading={loading} type="submit" className="w-full">
                    Đăng nhập
                </ButtonLoading>
            </form>
        </Form>
    );
};

export default SignInForm;
