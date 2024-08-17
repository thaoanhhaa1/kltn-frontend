'use client';

import { SidebarDictionary } from '@/app/[lang]/dictionaries';
import useBreadcrumb from '@/context/breadcrumb';
import { DASHBOARD } from '@/path';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

const UsersBreadcrumb = ({ sidebarDict }: { sidebarDict: SidebarDictionary }) => {
    const { lang } = useParams();
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb([
            {
                title: sidebarDict.dashboard,
                link: `/${lang}${DASHBOARD}`,
            },
            {
                title: sidebarDict.users,
            },
        ]);
    }, [lang, setBreadcrumb, sidebarDict.dashboard, sidebarDict.users]);

    return null;
};

export default UsersBreadcrumb;
