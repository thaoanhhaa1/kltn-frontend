'use client';

import { OwnerSidebarDictionary } from '@/app/[lang]/dictionaries';
import useBreadcrumb from '@/context/breadcrumb';
import { OWNER } from '@/path';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

const AddPropertyBreadcrumb = ({ sidebarDict }: { sidebarDict: OwnerSidebarDictionary }) => {
    const { lang } = useParams();
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb([
            {
                title: sidebarDict.owner,
                link: `/${lang}${OWNER}`,
            },
            {
                title: sidebarDict.post,
            },
        ]);
    }, [lang, setBreadcrumb, sidebarDict.owner, sidebarDict.post]);

    return null;
};

export default AddPropertyBreadcrumb;
