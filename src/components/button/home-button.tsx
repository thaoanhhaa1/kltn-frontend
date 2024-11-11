'use client';

import { HOME } from '@/path';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';

const HomeButton = () => {
    const router = useRouter();

    const handleClick = () => {
        router.push(HOME);
    };

    return (
        <Button type="primary" onClick={handleClick}>
            Trang chủ
        </Button>
    );
};

export default HomeButton;
