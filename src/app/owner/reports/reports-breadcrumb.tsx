'use client';

import useBreadcrumb from '@/context/breadcrumb';
import { OWNER } from '@/path';
import { useEffect } from 'react';

const ReportsBreadcrumb = () => {
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb([
            {
                title: 'Chủ nhà',
                link: OWNER,
            },
            {
                title: 'Báo cáo',
            },
        ]);
    }, [setBreadcrumb]);

    return null;
};

export default ReportsBreadcrumb;
