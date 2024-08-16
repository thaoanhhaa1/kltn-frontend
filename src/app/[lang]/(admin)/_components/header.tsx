import HeaderBreadcrumb from '@/app/[lang]/(admin)/_components/header-breadcrumb';
import HeaderItem from '@/app/[lang]/(admin)/_components/header-item';
import { HeaderDictionary, ModeDictionary, SidebarDictionary } from '@/app/[lang]/dictionaries';
import Logo from '@/components/logo';
import { ModeToggle } from '@/components/mode-toggle';
import MyAccount from '@/components/my-account';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { IUser } from '@/interfaces/user';
import http from '@/lib/http';
import { DASHBOARD, DASHBOARD_ANALYTICS, DASHBOARD_PROPERTIES, DASHBOARD_SETTINGS, DASHBOARD_USERS } from '@/path';
import { DashboardIcon } from '@radix-ui/react-icons';
import { House, LineChart, PanelLeft, Settings, Users2 } from 'lucide-react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const Header = async ({
    modeDict,
    headerDict,
    sidebarDict,
    params: { lang },
}: {
    modeDict: ModeDictionary;
    headerDict: HeaderDictionary;
    sidebarDict: SidebarDictionary;
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
                    <nav className="grid gap-6 text-lg font-medium">
                        <Logo lang={lang} />
                        <HeaderItem
                            icon={<DashboardIcon className="h-5 w-5" />}
                            link={`/${lang}${DASHBOARD}`}
                            title={sidebarDict.dashboard}
                        />
                        <HeaderItem
                            icon={<House className="h-5 w-5" />}
                            link={`/${lang}${DASHBOARD_PROPERTIES}`}
                            title={sidebarDict.properties}
                        />
                        <HeaderItem
                            icon={<Users2 className="h-5 w-5" />}
                            link={`/${lang}${DASHBOARD_USERS}`}
                            title={sidebarDict.users}
                        />
                        <HeaderItem
                            icon={<LineChart className="h-5 w-5" />}
                            link={`/${lang}${DASHBOARD_ANALYTICS}`}
                            title={sidebarDict.analytics}
                        />
                        <HeaderItem
                            icon={<Settings className="h-5 w-5" />}
                            link={`/${lang}${DASHBOARD_SETTINGS}`}
                            title={sidebarDict.settings}
                        />
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
