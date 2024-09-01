import ManageLayout from '@/components/manage-layout';
import { DASHBOARD, DASHBOARD_ANALYTICS, DASHBOARD_PROPERTIES, DASHBOARD_SETTINGS, DASHBOARD_USERS } from '@/path';
import { DashboardIcon } from '@radix-ui/react-icons';
import { House, LineChart, Settings, Users2 } from 'lucide-react';

export default async function BaseLayout({ children }: { children: React.ReactNode }) {
    const topNavList = [
        {
            link: DASHBOARD,
            title: 'Dashboard',
            icon: <DashboardIcon className="w-5 h-5" />,
        },
        {
            link: DASHBOARD_PROPERTIES,
            title: 'Bất động sản',
            icon: <House className="w-5 h-5" />,
        },
        {
            link: DASHBOARD_USERS,
            title: 'Người dùng',
            icon: <Users2 className="w-5 h-5" />,
        },
        {
            link: DASHBOARD_ANALYTICS,
            title: 'Thống kê',
            icon: <LineChart className="w-5 h-5" />,
        },
    ];

    const bottomNavList = [
        {
            link: DASHBOARD_SETTINGS,
            title: 'Cài đặt',
            icon: <Settings className="w-5 h-5" />,
        },
    ];

    return (
        <ManageLayout topNavList={topNavList} bottomNavList={bottomNavList}>
            {children}
        </ManageLayout>
    );
}
