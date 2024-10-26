'use client';

import { useFavoriteStore } from '@/stores/favorite-store';
import { useEffect } from 'react';

const SaveFavorite = ({ count }: { count: number }) => {
    const { setCount } = useFavoriteStore();

    useEffect(() => {
        setCount(count);
    }, [count, setCount]);

    return null;
};

export default SaveFavorite;
