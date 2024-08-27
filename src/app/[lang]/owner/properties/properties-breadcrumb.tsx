'use client';

import { OwnerSidebarDictionary } from '@/app/[lang]/dictionaries';
import useBreadcrumb from '@/context/breadcrumb';
import { OWNER } from '@/path';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

const PropertiesBreadcrumb = ({ sidebarDict }: { sidebarDict: OwnerSidebarDictionary }) => {
    const { lang } = useParams();
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb([
            {
                title: sidebarDict.owner,
                link: `/${lang}${OWNER}`,
            },
            {
                title: sidebarDict.properties,
            },
        ]);
    }, [lang, setBreadcrumb, sidebarDict.owner, sidebarDict.properties]);

    return null;
};

export default PropertiesBreadcrumb;
