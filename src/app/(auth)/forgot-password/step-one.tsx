'use client';

import { ButtonLoading } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import CustomError, { EntryError } from '@/lib/error';
import { SIGN_IN } from '@/path';
import { ForgotPasswordStepOneInput, forgotPasswordStepOneSchema } from '@/schemas/user.schema';
import { otpToUser } from '@/services/user-service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Flex } from 'antd';
import Link from 'next/link';
import { Dispatch, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const StepOne = ({
    email,
    setEmail,
    setStep,
}: {
    email: string;
    setStep: Dispatch<SetStateAction<number>>;
    setEmail: Dispatch<SetStateAction<string>>;
}) => {
    const [loading, setLoading] = useState(false);

    const form = useForm<ForgotPasswordStepOneInput>({
        resolver: zodResolver(forgotPasswordStepOneSchema),
        defaultValues: {
            email,
        },
    });

    async function onSubmit(values: ForgotPasswordStepOneInput) {
        setLoading(true);

        try {
            await otpToUser(values.email);

            setStep((prev) => prev + 1);
            setEmail(values.email);
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
                <Flex justify="space-between" align="center">
                    <Link href={SIGN_IN} className="underline text-sm !text-[inherit]">
                        Đăng nhập
                    </Link>
                    <ButtonLoading loading={loading} type="submit">
                        Tiếp theo
                    </ButtonLoading>
                </Flex>
            </form>
        </Form>
    );
};

export default StepOne;
