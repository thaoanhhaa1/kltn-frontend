'use client';

import { SidebarDictionary } from '@/app/[lang]/dictionaries';
import useBreadcrumb from '@/context/breadcrumb';
import { DASHBOARD } from '@/path';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

const PropertiesBreadcrumb = ({ sidebarDict }: { sidebarDict: SidebarDictionary }) => {
    const { lang } = useParams();
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb([
            {
                title: sidebarDict.dashboard,
                link: `/${lang}${DASHBOARD}`,
            },
            {
                title: sidebarDict.properties,
            },
        ]);
    }, [lang, setBreadcrumb, sidebarDict.dashboard, sidebarDict.properties]);

    return null;
};

export default PropertiesBreadcrumb;
