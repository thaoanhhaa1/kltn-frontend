'use client';

import useBreadcrumb from '@/context/breadcrumb';
import { useEffect } from 'react';

const OwnerPage = () => {
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb([
            {
                title: 'Owner',
            },
        ]);
    }, [setBreadcrumb]);

    return <div>Owner Page</div>;
};

export default OwnerPage;
