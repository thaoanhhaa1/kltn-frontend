'use client';

import { Button } from 'antd';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const BackButton = () => {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    return (
        <Button type="text" onClick={handleBack}>
            <ChevronLeft className="w-5 h-5" />
        </Button>
    );
};

export default BackButton;
