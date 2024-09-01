'use client';

import useBreadcrumb from '@/context/breadcrumb';
import { DASHBOARD } from '@/path';
import { useEffect } from 'react';

const UsersBreadcrumb = () => {
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb([
            {
                title: 'Dashboard',
                link: DASHBOARD,
            },
            {
                title: 'Người dùng',
            },
        ]);
    }, [setBreadcrumb]);

    return null;
};

export default UsersBreadcrumb;
