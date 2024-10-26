'use client';

import HorizontalProperty from '@/components/property/horizontal-property';
import HorizontalPropertySkeleton from '@/components/property/horizontal-property-skeleton';
import SkeletonRender from '@/components/skeleton-render';
import { initDataTable } from '@/constants/init-data';
import usePagination from '@/hooks/usePagination';
import { IPropertyInteraction } from '@/interfaces/property-interaction';
import { ITable } from '@/interfaces/table';
import { toSkipTake } from '@/lib/utils';
import { getFavorites } from '@/services/property-interaction-service';
import { Empty, Flex, Pagination } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const FavoriteList = () => {
    const [favorites, setFavorites] = useState<ITable<IPropertyInteraction>>(initDataTable);
    const { page, pageSize } = usePagination();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const handleChangePage = (page: number) => router.push(`?page=${page}&pageSize=${pageSize}`);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);

            try {
                const pagination = toSkipTake(page, pageSize);

                const res = await getFavorites(pagination);

                setFavorites({
                    ...res,
                    data: res.data.map((favorite) => ({
                        ...favorite,
                        property: {
                            ...favorite.property,
                            isFavorite: true,
                        },
                    })),
                });
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [page, pageSize]);

    return (
        <Flex gap={24} vertical>
            {loading && <SkeletonRender className="gap-6" controller={HorizontalPropertySkeleton} vertical />}
            {favorites.data.map((favorite) => (
                <HorizontalProperty property={favorite.property} key={favorite.interactionId} />
            ))}
            {(favorites.data.length > 0 && (
                <Pagination
                    onChange={handleChangePage}
                    align="center"
                    defaultCurrent={1}
                    total={favorites.pageInfo.total}
                />
            )) || <Empty description="Không có bất kỳ bài viết nào" />}
        </Flex>
    );
};

export default FavoriteList;
