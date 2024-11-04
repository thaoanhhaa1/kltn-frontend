'use client';

import useBreadcrumb from '@/context/breadcrumb';
import { OWNER, OWNER_PROPERTIES } from '@/path';
import { useEffect } from 'react';

const UpdatePropertyBreadcrumb = () => {
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb([
            {
                title: 'Chủ nhà',
                link: OWNER,
            },
            {
                title: 'Bất động sản',
                link: OWNER_PROPERTIES,
            },
            {
                title: 'Cập nhật bất động sản',
            },
        ]);
    }, [setBreadcrumb]);

    return null;
};

export default UpdatePropertyBreadcrumb;
