'use client';

import useBreadcrumb from '@/context/breadcrumb';
import { DASHBOARD } from '@/path';
import { useEffect } from 'react';

const PropertyTypesBreadcrumb = () => {
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb([
            {
                title: 'Dashboard',
                link: DASHBOARD,
            },
            {
                title: 'Loại bất động sản',
            },
        ]);
    }, [setBreadcrumb]);

    return null;
};

export default PropertyTypesBreadcrumb;
