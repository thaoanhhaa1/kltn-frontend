import SignUpForm from '@/app/(auth)/sign-up/sign-up-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SIGN_IN } from '@/path';
import Link from 'next/link';

const SignInPage = async () => {
    return (
        <div className="min-h-screen flex justify-center items-center px-2">
            <Card className="mx-auto w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-2xl">Đăng ký</CardTitle>
                    <CardDescription>Nhập thông tin của bạn để tạo tài khoản.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        {/* <div className="flex gap-6">
                            <Button variant="outline" className="flex-1">
                                <GitHubLogoIcon className="mr-2 h-4 w-4" />
                                Github
                            </Button>
                            <Button variant="outline" className="flex-1">
                                <GoogleIcon className="mr-2 h-4 w-4" />
                                Google
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <hr className="flex-1 border-gray-300" />
                            <span className="text-sm text-muted-foreground">Hoặc</span>
                            <hr className="flex-1 border-gray-300" />
                        </div> */}
                        <SignUpForm />
                    </div>
                    <div className="mt-4 text-sm text-center">
                        Đã có tài khoản?{' '}
                        <Link href={SIGN_IN} className="underline">
                            Đăng nhập ngay
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SignInPage;
