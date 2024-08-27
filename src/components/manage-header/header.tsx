import { HeaderDictionary, ModeDictionary } from '@/app/[lang]/dictionaries';
import Logo from '@/components/logo';
import HeaderBreadcrumb from '@/components/manage-header/header-breadcrumb';
import HeaderItem from '@/components/manage-header/header-item';
import { ModeToggle } from '@/components/mode-toggle';
import MyAccount from '@/components/my-account';
import { INavItem } from '@/components/sidebar/nav-item';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { IUser } from '@/interfaces/user';
import http from '@/lib/http';
import { PanelLeft } from 'lucide-react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const Header = async ({
    modeDict,
    headerDict,
    navList,
    params: { lang },
}: {
    modeDict: ModeDictionary;
    headerDict: HeaderDictionary;
    navList: INavItem[];
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

    if (!user) redirect(`/${lang}/sign-in`);

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Sheet>
                <SheetTrigger asChild>
                    <Button size="icon" variant="outline" className="sm:hidden">
                        <PanelLeft className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="sm:max-w-xs">
                    <SheetTitle></SheetTitle>
                    <nav className="grid gap-6 text-lg font-medium">
                        <Logo lang={lang} />
                        {navList.map((navItem) => (
                            <HeaderItem
                                key={navItem.title}
                                link={navItem.link}
                                title={navItem.title}
                                icon={navItem.icon}
                            />
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
            <HeaderBreadcrumb />
            <div className="ml-auto flex gap-4">
                <ModeToggle modeDict={modeDict} />
                {user && <MyAccount headerDict={headerDict} user={user} />}
            </div>
        </header>
    );
};

export default Header;
