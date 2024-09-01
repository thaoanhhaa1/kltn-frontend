'use client';

import useBreadcrumb from '@/context/breadcrumb';
import { OWNER } from '@/path';
import { useEffect } from 'react';

const PropertiesBreadcrumb = () => {
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb([
            {
                title: 'Chủ nhà',
                link: OWNER,
            },
            {
                title: 'Bất động sản',
            },
        ]);
    }, [setBreadcrumb]);

    return null;
};

export default PropertiesBreadcrumb;
