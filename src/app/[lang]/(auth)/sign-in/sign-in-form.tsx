'use client';

import { LoginDictionary } from '@/app/[lang]/dictionaries';
import { ButtonLoading } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import CustomError, { EntryError } from '@/lib/error';
import http from '@/lib/http';
import { LoginInput, loginSchema } from '@/schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const SignInForm = ({ loginDict }: { loginDict: LoginDictionary }) => {
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
            const res = await http.post('/user-service/auth/login', values);

            await http.post('/api/auth/token', res, {
                baseUrl: '',
            });

            router.push('/');
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
                            <FormLabel>{loginDict.email}</FormLabel>
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
                            <FormLabel>{loginDict.password}</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder={loginDict.password_placeholder} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <ButtonLoading loading={loading} type="submit" className="w-full">
                    {loginDict.submit}
                </ButtonLoading>
            </form>
        </Form>
    );
};

export default SignInForm;
