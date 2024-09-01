'use client';

import useBreadcrumb from '@/context/breadcrumb';
import { DASHBOARD } from '@/path';
import { useEffect } from 'react';

const PropertiesBreadcrumb = () => {
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb([
            {
                title: 'Dashboard',
                link: DASHBOARD,
            },
            {
                title: 'Bất động sản',
            },
        ]);
    }, [setBreadcrumb]);

    return null;
};

export default PropertiesBreadcrumb;
