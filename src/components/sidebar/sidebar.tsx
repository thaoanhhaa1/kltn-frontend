import Logo from '@/components/logo';
import NavItem, { INavItem } from '@/components/sidebar/nav-item';

const Sidebar = ({ bottomNavList, topNavList }: { topNavList: INavItem[]; bottomNavList?: INavItem[] }) => {
    return (
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
                <Logo />
                {topNavList.map((navItem) => (
                    <NavItem key={navItem.title} link={navItem.link} title={navItem.title} icon={navItem.icon} />
                ))}
            </nav>
            {bottomNavList && (
                <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
                    {bottomNavList.map((navItem) => (
                        <NavItem key={navItem.title} link={navItem.link} title={navItem.title} icon={navItem.icon} />
                    ))}
                </nav>
            )}
        </aside>
    );
};

export default Sidebar;
