'use client';

import { Button } from '@/components/ui/button';
import { FAVORITE } from '@/path';
import { useFavoriteStore } from '@/stores/favorite-store';
import { Badge } from 'antd';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

const HeartButton = () => {
    const { count } = useFavoriteStore();
    const router = useRouter();

    const handleClick = () => router.push(FAVORITE);

    return (
        <Badge count={count}>
            <Button variant="outline" size="icon" onClick={handleClick}>
                <Heart className="w-5 h-5" />
            </Button>
        </Badge>
    );
};

export default HeartButton;
