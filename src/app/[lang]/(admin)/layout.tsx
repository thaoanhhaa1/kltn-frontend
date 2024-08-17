import Header from '@/app/[lang]/(admin)/_components/header';
import Sidebar from '@/app/[lang]/(admin)/_components/sidebar';
import { getDictionary } from '@/app/[lang]/dictionaries';
import { BreadcrumbProvider } from '@/context/breadcrumb';

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

    return (
        <main className="flex min-h-screen w-full flex-col bg-muted/40">
            <Sidebar sidebarDict={sidebarDict} params={{ lang }} />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <BreadcrumbProvider>
                    <Header params={{ lang }} modeDict={modeDict} headerDict={headerDict} sidebarDict={sidebarDict} />
                    <div className="p-4 sm:px-6 sm:py-0 md:gap-8">{children}</div>
                </BreadcrumbProvider>
            </div>
        </main>
    );
}
