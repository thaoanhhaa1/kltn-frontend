import ChatButton from '@/components/header/chat-button';
import Logo from '@/components/logo';
import HeaderBreadcrumb from '@/components/manage-header/header-breadcrumb';
import HeaderItem from '@/components/manage-header/header-item';
import MyAccount from '@/components/my-account';
import { Notifications } from '@/components/notification/notifications';
import SaveUser from '@/components/save-user';
import { INavItem } from '@/components/sidebar/nav-item';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { IUser } from '@/interfaces/user';
import { SIGN_IN } from '@/path';
import { getMe } from '@/services/user-service';
import { PanelLeft } from 'lucide-react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const Header = async ({ navList }: { navList: INavItem[] }) => {
    let user: IUser | undefined;

    try {
        const cookiesStore = cookies();
        const accessToken = cookiesStore.get('accessToken')?.value || '';

        const res: IUser = await getMe(accessToken);

        user = res;
    } catch (error) {}

    if (!user) redirect(SIGN_IN);

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
                        <Logo />
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
                <ChatButton />
                <Notifications />
                {/* <ModeToggle /> */}
                {user && <MyAccount user={user} />}
            </div>
            <SaveUser user={user} />
        </header>
    );
};

export default Header;
