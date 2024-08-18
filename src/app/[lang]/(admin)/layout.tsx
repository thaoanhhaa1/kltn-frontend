import { getDictionary } from '@/app/[lang]/dictionaries';
import ManageLayout from '@/components/manage-layout';
import { DashboardIcon } from '@radix-ui/react-icons';
import { House, LineChart, Settings, Users2 } from 'lucide-react';

export default async function BaseLayout({
    children,
    params: { lang },
}: {
    children: React.ReactNode;
    params: {
        lang: string;
    };
}) {
    const dict = await getDictionary(lang);
    const modeDict = dict.mode;
    const sidebarDict = dict.sidebar;
    const headerDict = dict.header;
    const topNavList = [
        {
            link: `/${lang}/dashboard`,
            title: sidebarDict.dashboard,
            icon: <DashboardIcon className="w-5 h-5" />,
        },
        {
            link: `/${lang}/dashboard/properties`,
            title: sidebarDict.properties,
            icon: <House className="w-5 h-5" />,
        },
        {
            link: `/${lang}/dashboard/users`,
            title: sidebarDict.users,
            icon: <Users2 className="w-5 h-5" />,
        },
        {
            link: `/${lang}/dashboard/analytics`,
            title: sidebarDict.analytics,
            icon: <LineChart className="w-5 h-5" />,
        },
    ];

    const bottomNavList = [
        {
            link: `/${lang}/dashboard/settings`,
            title: sidebarDict.settings,
            icon: <Settings className="w-5 h-5" />,
        },
    ];

    return (
        <ManageLayout
            headerDict={headerDict}
            modeDict={modeDict}
            params={{ lang }}
            topNavList={topNavList}
            bottomNavList={bottomNavList}
        >
            {children}
        </ManageLayout>
    );
}
