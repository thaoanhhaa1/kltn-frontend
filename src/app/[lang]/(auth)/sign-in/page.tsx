import SignInForm from '@/app/[lang]/(auth)/sign-in/sign-in-form';
import { getDictionary } from '@/app/[lang]/dictionaries';
import GoogleIcon from '@/components/svgs/google-icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GitHubLogoIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

const SignInPage = async ({
    params: { lang },
}: {
    params: {
        lang: string;
    };
}) => {
    const dict = await getDictionary(lang);
    const loginDict = dict.auth.login;

    return (
        <div className="min-h-screen flex justify-center items-center px-2">
            <Card className="mx-auto w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-2xl">{loginDict.title}</CardTitle>
                    <CardDescription>{loginDict.description}</CardDescription>
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
                            <span className="text-sm text-muted-foreground">{loginDict.separator}</span>
                            <hr className="flex-1 border-gray-300" />
                        </div>
                        <SignInForm loginDict={loginDict} />
                    </div>
                    <div className="mt-4 text-sm flex flex-wrap justify-center xs:justify-between items-center gap-4">
                        <span>
                            {loginDict["don't_have_account"]}{' '}
                            <Link href="/sign-up" className="underline">
                                {loginDict.register}
                            </Link>
                        </span>
                        <Link href="#" className="underline">
                            {loginDict.forgot}
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SignInPage;
