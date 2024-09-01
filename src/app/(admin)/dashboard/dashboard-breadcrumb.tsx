'use client';

import useBreadcrumb from '@/context/breadcrumb';
import { useEffect } from 'react';

const DashboardBreadcrumb = () => {
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb([
            {
                title: 'Dashboard',
            },
        ]);
    }, [setBreadcrumb]);

    return null;
};

export default DashboardBreadcrumb;
