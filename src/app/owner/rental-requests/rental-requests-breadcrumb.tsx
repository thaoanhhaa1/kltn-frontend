'use client';

import useBreadcrumb from '@/context/breadcrumb';
import { OWNER } from '@/path';
import { useEffect } from 'react';

const RentalRequestsBreadcrumb = () => {
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb([
            {
                title: 'Chủ nhà',
                link: OWNER,
            },
            {
                title: 'Yêu cầu thuê nhà',
            },
        ]);
    }, [setBreadcrumb]);

    return null;
};

export default RentalRequestsBreadcrumb;
