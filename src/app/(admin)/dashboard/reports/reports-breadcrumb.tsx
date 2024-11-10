'use client';

import useBreadcrumb from '@/context/breadcrumb';
import { DASHBOARD } from '@/path';
import { useEffect } from 'react';

const ReportsBreadcrumb = () => {
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb([
            {
                title: 'Dashboard',
                link: DASHBOARD,
            },
            {
                title: 'Báo cáo',
            },
        ]);
    }, [setBreadcrumb]);

    return null;
};

export default ReportsBreadcrumb;
