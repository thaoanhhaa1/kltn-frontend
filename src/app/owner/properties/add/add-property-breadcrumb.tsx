'use client';

import useBreadcrumb from '@/context/breadcrumb';
import { OWNER } from '@/path';
import { useEffect } from 'react';

const AddPropertyBreadcrumb = () => {
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb([
            {
                title: 'Chủ nhà',
                link: OWNER,
            },
            {
                title: 'Đăng tin',
            },
        ]);
    }, [setBreadcrumb]);

    return null;
};

export default AddPropertyBreadcrumb;
