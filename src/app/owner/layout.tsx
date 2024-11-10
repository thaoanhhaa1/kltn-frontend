import { Report } from '@/assets/svgs/icons';
import LoadChat from '@/components/chat/load-chat';
import Forbidden from '@/components/forbidden';
import LoadFavorite from '@/components/load-favorite';
import ManageLayout from '@/components/manage-layout';
import LoadNotification from '@/components/notification/load-notification';
import { INavItem } from '@/components/sidebar/nav-item';
import { IPayloadJWT } from '@/interfaces/jwt';
import { ADD_PROPERTY, OWNER, OWNER_PROPERTIES, OWNER_REPORTS, OWNER_REQUESTS, OWNER_USERS } from '@/path';
import { jwtDecode } from 'jwt-decode';
import { Home, HousePlus, PieChart, PlusCircle, Users } from 'lucide-react';
import { cookies } from 'next/headers';
import { ReactNode } from 'react';

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
    {
        title: 'Báo cáo',
        link: OWNER_REPORTS,
        icon: <Report className="w-5 h-5" />,
    },
];

const Layout = async ({ children }: { children: ReactNode }) => {
    const cookiesStore = cookies();
    const accessToken = cookiesStore.get('accessToken')?.value;

    if (!accessToken) {
        return <div>Unauthorized</div>;
    }

    try {
        const payload: IPayloadJWT = jwtDecode(accessToken);

        if (!payload.userTypes.includes('owner')) {
            return <Forbidden />;
        }
    } catch (error) {
        return <div>Unauthorized</div>;
    }

    return (
        <>
            <ManageLayout topNavList={topNavList}>{children}</ManageLayout>
            <LoadChat />
            <LoadNotification />
            <LoadFavorite />
        </>
    );
};

export default Layout;
