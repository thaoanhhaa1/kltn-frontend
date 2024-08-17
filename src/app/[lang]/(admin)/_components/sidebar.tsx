import NavItem from '@/app/[lang]/(admin)/_components/nav-item';
import { SidebarDictionary } from '@/app/[lang]/dictionaries';
import Logo from '@/components/logo';
import { DASHBOARD, DASHBOARD_ANALYTICS, DASHBOARD_PROPERTIES, DASHBOARD_SETTINGS, DASHBOARD_USERS } from '@/path';
import { DashboardIcon } from '@radix-ui/react-icons';
import { House, LineChart, Settings, Users2 } from 'lucide-react';

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
                <Logo lang={lang} />
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
