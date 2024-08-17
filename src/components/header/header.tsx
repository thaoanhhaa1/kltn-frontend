import { HeaderDictionary, ModeDictionary } from '@/app/[lang]/dictionaries';
import HeaderRight from '@/components/header/header-right';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { IUser } from '@/interfaces/user';
import http from '@/lib/http';
import { HOME } from '@/path';
import { Menu } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';

const Header = async ({
    headerDict,
    modeDict,
    params: { lang },
}: {
    headerDict: HeaderDictionary;
    modeDict: ModeDictionary;
    params: {
        lang: string;
    };
}) => {
    let user: IUser | undefined;

    try {
        const cookiesStore = cookies();
        const accessToken = cookiesStore.get('accessToken')?.value || '';

        const res: IUser = await http.get('/user-service/users/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        user = res;
    } catch (error) {}

    return (
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Logo lang={lang} />
                <Link
                    href={`/${lang}${HOME}`}
                    className="text-nowrap text-foreground transition-colors hover:text-foreground"
                >
                    {headerDict.home}
                </Link>
                <Link href="#" className="text-nowrap text-muted-foreground transition-colors hover:text-foreground">
                    {headerDict.rent}
                </Link>
                <Link href="#" className="text-nowrap text-muted-foreground transition-colors hover:text-foreground">
                    {headerDict.chart}
                </Link>
            </nav>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="grid gap-6 text-lg font-medium">
                        <Logo lang={lang} />
                        <Link href={`/${lang}${HOME}`} className="hover:text-foreground">
                            {headerDict.home}
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-foreground">
                            {headerDict.rent}
                        </Link>
                        <Link href="#" className="text-muted-foreground hover:text-foreground">
                            {headerDict.chart}
                        </Link>
                    </nav>
                </SheetContent>
            </Sheet>
            <HeaderRight headerDict={headerDict} modeDict={modeDict} user={user} params={{ lang }} />
        </header>
    );
};

export default Header;
