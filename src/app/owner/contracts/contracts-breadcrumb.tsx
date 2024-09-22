'use client';

import useBreadcrumb from '@/context/breadcrumb';
import { OWNER } from '@/path';
import { useEffect } from 'react';

const ContractsBreadcrumb = () => {
    const { setBreadcrumb } = useBreadcrumb();

    useEffect(() => {
        setBreadcrumb([
            {
                title: 'Chủ nhà',
                link: OWNER,
            },
            {
                title: 'Quản lý hợp đồng',
            },
        ]);
    }, [setBreadcrumb]);

    return null;
};

export default ContractsBreadcrumb;
