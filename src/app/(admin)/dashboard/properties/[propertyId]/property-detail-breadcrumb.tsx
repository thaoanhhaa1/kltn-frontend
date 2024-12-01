'use client';

import useBreadcrumb from '@/context/breadcrumb';
import { DASHBOARD, DASHBOARD_PROPERTIES } from '@/path';
import { useEffect } from 'react';

const PropertyDetailBreadcrumb = () => {
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb([
            {
                title: 'Dashboard',
                link: DASHBOARD,
            },
            {
                title: 'Bất động sản',
                link: DASHBOARD_PROPERTIES,
            },
            {
                title: 'Chi tiết bất động sản',
            },
        ]);
    }, [setBreadcrumb]);

    return null;
};

export default PropertyDetailBreadcrumb;
