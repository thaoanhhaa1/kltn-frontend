import NavItem from '@/app/[lang]/(admin)/_components/nav-item';
import { SidebarDictionary } from '@/app/[lang]/dictionaries';
import { envConfig } from '@/config/envConfig';
import { DASHBOARD, DASHBOARD_ANALYTICS, DASHBOARD_PROPERTIES, DASHBOARD_SETTINGS, DASHBOARD_USERS } from '@/path';
import { DashboardIcon } from '@radix-ui/react-icons';
import { House, LineChart, Package2, Settings, Users2 } from 'lucide-react';
import Link from 'next/link';

const Sidebar = ({
    sidebarDict,
    params: { lang },
}: {
    sidebarDict: SidebarDictionary;
    params: {
        lang: string;
    };
}) => {
    return (
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
                <Link
                    href={`/${lang}${DASHBOARD}`}
                    className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                >
                    <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
                    <span className="sr-only">{envConfig.NEXT_PUBLIC_WEB_NAME}</span>
                </Link>
                <NavItem
                    link={`/${lang}${DASHBOARD}`}
                    title={sidebarDict.dashboard}
                    icon={<DashboardIcon className="w-5 h-5" />}
                />
                <NavItem
                    link={`/${lang}${DASHBOARD_PROPERTIES}`}
                    title={sidebarDict.properties}
                    icon={<House className="w-5 h-5" />}
                />
                <NavItem
                    link={`/${lang}${DASHBOARD_USERS}`}
                    title={sidebarDict.users}
                    icon={<Users2 className="w-5 h-5" />}
                />
                <NavItem
                    link={`/${lang}${DASHBOARD_ANALYTICS}`}
                    title={sidebarDict.analytics}
                    icon={<LineChart className="w-5 h-5" />}
                />
            </nav>
            <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
                <NavItem
                    link={`/${lang}${DASHBOARD_SETTINGS}`}
                    title={sidebarDict.settings}
                    icon={<Settings className="w-5 h-5" />}
                />
            </nav>
        </aside>
    );
};

export default Sidebar;
