'use client';

import { AccountTypeDictionary, RegisterDictionary } from '@/app/[lang]/dictionaries';
import { ButtonLoading } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { OWNER, RENTER } from '@/constants/account-type';
import CustomError, { EntryError } from '@/lib/error';
import http from '@/lib/http';
import { RegisterInput, registerSchema } from '@/schemas/auth.schema';
import { otpSchema } from '@/schemas/otp.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

const SignUpForm = ({
    registerDict,
    accountTypesDict,
}: {
    registerDict: RegisterDictionary;
    accountTypesDict: AccountTypeDictionary;
}) => {
    const router = useRouter();
    const { lang } = useParams();
    const [loading, setLoading] = useState(false);
    const accountTypes = useMemo(
        () => [
            {
                label: accountTypesDict.renter,
                value: RENTER,
            },
            {
                label: accountTypesDict.owner,
                value: OWNER,
            },
        ],
        [accountTypesDict.owner, accountTypesDict.renter],
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
            const res = await http.post('/user-service/auth/register', values);

            await http.post('/api/auth/token', res, {
                baseUrl: '',
            });

            router.push(`/${lang}`);
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
                await http.post('/user-service/auth/register/otp', { email });
                toast({
                    title: 'Success',
                    description: 'OTP sent successfully',
                });
            } catch (error) {
                if (error instanceof EntryError) {
                    error.details.forEach((detail) => {
                        form.setError(detail.field as keyof typeof res.data, {
                            message: detail.error,
                        });
                    });
                } else if (error instanceof CustomError) {
                    toast({
                        variant: 'destructive',
                        title: 'Error',
                        description: error.message,
                    });
                } else {
                    toast({
                        variant: 'destructive',
                        title: 'Error',
                        description: 'Something went wrong',
                    });
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
                            <FormLabel>{registerDict.name}</FormLabel>
                            <FormControl>
                                <Input placeholder={registerDict.name_placeholder} {...field} />
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
                            <FormLabel>{registerDict.email}</FormLabel>
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
                            <FormLabel>{registerDict.password}</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder={registerDict.password_placeholder} {...field} />
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
                            <FormLabel>{registerDict.account_type}</FormLabel>
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
                                    <FormLabel>{registerDict.otp}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={registerDict.otp_placeholder} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <ButtonLoading type="button" onClick={handleGetOtp} variant="secondary">
                        {registerDict.get_otp}
                    </ButtonLoading>
                </div>
                <ButtonLoading loading={loading} type="submit" className="w-full">
                    {registerDict.submit}
                </ButtonLoading>
            </form>
        </Form>
    );
};

export default SignUpForm;
