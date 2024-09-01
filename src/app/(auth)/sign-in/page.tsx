import SignInForm from '@/app/(auth)/sign-in/sign-in-form';
import GoogleIcon from '@/components/svgs/google-icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FORGOT_PASSWORD, SIGN_UP } from '@/path';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

const SignInPage = async () => {
    return (
        <div className="min-h-screen flex justify-center items-center px-2">
            <Card className="mx-auto w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-2xl">Đăng nhập</CardTitle>
                    <CardDescription>Vui lòng nhập thông tin đăng nhập của bạn.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="flex gap-6">
                            <Button variant="outline" className="flex-1">
                                <GitHubLogoIcon className="mr-2 h-4 w-4" />
                                Github
                            </Button>
                            <Button variant="outline" className="flex-1">
                                <GoogleIcon className="mr-2 h-4 w-4" />
                                Google
                            </Button>
                        </div>
                        {/* Separate */}
                        <div className="flex items-center gap-2">
                            <hr className="flex-1 border-gray-300" />
                            <span className="text-sm text-muted-foreground">Hoặc</span>
                            <hr className="flex-1 border-gray-300" />
                        </div>
                        <SignInForm />
                    </div>
                    <div className="mt-4 text-sm flex flex-wrap justify-center xs:justify-between items-center gap-4">
                        <span>
                            Chưa có tài khoản?{' '}
                            <Link href={SIGN_UP} className="underline">
                                Đăng ký ngay
                            </Link>
                        </span>
                        <Link href={FORGOT_PASSWORD} className="underline">
                            Quên mật khẩu?
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SignInPage;
