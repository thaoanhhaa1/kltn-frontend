'use client';

import useBreadcrumb from '@/context/breadcrumb';
import { DASHBOARD } from '@/path';
import { useEffect } from 'react';

const AttributesBreadcrumb = () => {
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb([
            {
                title: 'Dashboard',
                link: DASHBOARD,
            },
            {
                title: 'Tiện ích',
            },
        ]);
    }, [setBreadcrumb]);

    return null;
};

export default AttributesBreadcrumb;
