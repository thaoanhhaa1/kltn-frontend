'use client';

import useBreadcrumb from '@/context/breadcrumb';
import { useEffect } from 'react';

const OwnerBreadcrumb = () => {
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb([
            {
                title: 'Chủ nhà',
            },
        ]);
    }, [setBreadcrumb]);

    return null;
};

export default OwnerBreadcrumb;
