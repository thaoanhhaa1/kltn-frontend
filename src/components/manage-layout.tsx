import Header from '@/components/manage-header/header';
import { INavItem } from '@/components/sidebar/nav-item';
import Sidebar from '@/components/sidebar/sidebar';
import { BreadcrumbProvider } from '@/context/breadcrumb';
import { ReactNode, useMemo } from 'react';

const ManageLayout = ({
    topNavList,
    bottomNavList,
    children,
}: {
    topNavList: INavItem[];
    bottomNavList?: INavItem[];
    children: ReactNode;
}) => {
    const navList = useMemo(() => [...topNavList, ...(bottomNavList || [])], [topNavList, bottomNavList]);

    return (
        <main className="flex min-h-screen w-full flex-col bg-muted/40">
            <Sidebar topNavList={topNavList} bottomNavList={bottomNavList} />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <BreadcrumbProvider>
                    <Header navList={navList} />
                    <div className="p-4 sm:px-6 sm:py-0 md:gap-8">{children}</div>
                </BreadcrumbProvider>
            </div>
        </main>
    );
};

export default ManageLayout;
