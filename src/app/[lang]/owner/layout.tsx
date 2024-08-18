import { getDictionary } from '@/app/[lang]/dictionaries';
import ManageLayout from '@/components/manage-layout';
import { INavItem } from '@/components/sidebar/nav-item';
import { ADD_PROPERTY, OWNER, OWNER_PROPERTIES, OWNER_USERS } from '@/path';
import { Home, PieChart, PlusCircle, Users } from 'lucide-react';
import { ReactNode } from 'react';

const Layout = async ({
    children,
    params: { lang },
}: {
    children: ReactNode;
    params: {
        lang: string;
    };
}) => {
    const dict = await getDictionary(lang);
    const modeDict = dict.mode;
    const headerDict = dict.header;
    const sidebarDict = dict['owner-sidebar'];

    const topNavList: INavItem[] = [
        {
            title: sidebarDict.overview,
            link: `/${lang}${OWNER}`,
            icon: <PieChart className="w-5 h-5" />,
        },
        {
            title: sidebarDict.properties,
            link: `/${lang}${OWNER_PROPERTIES}`,
            icon: <Home className="w-5 h-5" />,
        },
        {
            title: sidebarDict.post,
            link: `/${lang}${ADD_PROPERTY}`,
            icon: <PlusCircle className="w-5 h-5" />,
        },
        {
            title: sidebarDict.users,
            link: `/${lang}${OWNER_USERS}`,
            icon: <Users className="w-5 h-5" />,
        },
    ];

    return (
        <ManageLayout headerDict={headerDict} modeDict={modeDict} params={{ lang }} topNavList={topNavList}>
            {children}
        </ManageLayout>
    );
};

export default Layout;
