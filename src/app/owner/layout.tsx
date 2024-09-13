import ManageLayout from '@/components/manage-layout';
import { INavItem } from '@/components/sidebar/nav-item';
import { ADD_PROPERTY, OWNER, OWNER_PROPERTIES, OWNER_REQUESTS, OWNER_USERS } from '@/path';
import { Home, HousePlus, PieChart, PlusCircle, Users } from 'lucide-react';
import { ReactNode } from 'react';

const Layout = async ({ children }: { children: ReactNode }) => {
    const topNavList: INavItem[] = [
        {
            title: 'Tổng quan',
            link: OWNER,
            icon: <PieChart className="w-5 h-5" />,
        },
        {
            title: 'Bất động sản',
            link: OWNER_PROPERTIES,
            icon: <Home className="w-5 h-5" />,
        },
        {
            title: 'Đăng tin',
            link: ADD_PROPERTY,
            icon: <PlusCircle className="w-5 h-5" />,
        },
        {
            title: 'Yêu cầu thuê nhà',
            link: OWNER_REQUESTS,
            icon: <HousePlus className="w-5 h-5" />,
        },
        {
            title: 'Người dùng',
            link: OWNER_USERS,
            icon: <Users className="w-5 h-5" />,
        },
    ];

    return <ManageLayout topNavList={topNavList}>{children}</ManageLayout>;
};

export default Layout;
