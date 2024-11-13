'use client';

import HorizontalProperty from '@/components/property/horizontal-property';
import HorizontalPropertySkeleton from '@/components/property/horizontal-property-skeleton';
import SkeletonRender from '@/components/skeleton-render';
import { DEFAULT_SORT_PROPERTY, sortPropertyOptions } from '@/constants/init-data';
import useBoolean from '@/hooks/useBoolean';
import usePagination from '@/hooks/usePagination';
import { IProperty } from '@/interfaces/property';
import { cn, convertObjectToParams, formatCurrency, toSkipTake } from '@/lib/utils';
import { searchProperties } from '@/services/property-service';
import { Button, Flex, Pagination, Select, Typography } from 'antd';
import { Grid } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const SearchResult = ({ count }: { count: number }) => {
    const router = useRouter();
    const [properties, setProperties] = useState<IProperty[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const { value: isGrid, toggle } = useBoolean(false);

    const { page, pageSize } = usePagination(20);
    const searchParams = useSearchParams();
    const q = searchParams.get('q');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const amenities = JSON.stringify(searchParams.getAll('amenities[]'));
    const bedroom = searchParams.get('bedroom');
    const bathroom = searchParams.get('bathroom');
    const furniture = searchParams.get('furniture');
    const city = searchParams.get('city');
    const district = searchParams.get('district');
    const ward = searchParams.get('ward');
    const sort = searchParams.get('sort');
    const type = searchParams.get('type');

    const getSearchParams = useCallback(() => {
        const { skip, take } = toSkipTake(page, pageSize);

        const searchParams: {
            [key: string]: any;
        } = {
            skip,
            take,
        };

        const amenitiesArr = JSON.parse(amenities);

        if (q) searchParams.q = q;
        if (minPrice) searchParams.minPrice = minPrice;
        if (maxPrice) searchParams.maxPrice = maxPrice;
        if (amenitiesArr.length) searchParams['amenities[]'] = amenitiesArr;
        if (bedroom) searchParams.bedroom = bedroom;
        if (bathroom) searchParams.bathroom = bathroom;
        if (furniture) searchParams.furniture = furniture;
        if (city) searchParams.city = city;
        if (district) searchParams.district = district;
        if (ward) searchParams.ward = ward;
        if (sort) searchParams.sort = sort;
        if (type) searchParams.type = type;

        return searchParams;
    }, [
        amenities,
        bathroom,
        bedroom,
        city,
        district,
        furniture,
        maxPrice,
        minPrice,
        page,
        pageSize,
        q,
        sort,
        type,
        ward,
    ]);

    const handleChangeSort = (value: string) => {
        const { skip, take, ...searchParams } = getSearchParams();

        router.push(`?${convertObjectToParams({ ...searchParams, sort: value, page: 1, pageSize })}`);
    };

    const handlePageChange = (page: number) => {
        const { skip, take, ...searchParams } = getSearchParams();

        router.push(`?${convertObjectToParams({ ...searchParams, page, pageSize })}`);
    };

    const handlePageSizeChange = (pageSize: number) => {
        const { skip, take, ...searchParams } = getSearchParams();

        router.push(`?${convertObjectToParams({ ...searchParams, page: 1, pageSize })}`);
    };

    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);

            try {
                const res = await searchProperties(convertObjectToParams(getSearchParams()));

                setProperties(res.data);
                setTotal(res.pageInfo.total);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, [getSearchParams]);

    return (
        <div className="pb-10">
            <div className="mt-6">
                <Typography.Title level={3}>Các tin đăng bất động sản</Typography.Title>
                <Typography.Text type="secondary">Hiện có {formatCurrency(count, false)} bất động sản</Typography.Text>
            </div>
            <Flex className="mb-4 mt-6" justify="flex-end" gap={8}>
                <Select
                    value={sort || DEFAULT_SORT_PROPERTY}
                    variant="filled"
                    defaultValue={DEFAULT_SORT_PROPERTY}
                    style={{
                        width: '220px',
                    }}
                    options={sortPropertyOptions}
                    onChange={handleChangeSort}
                />
                <Button
                    color="primary"
                    icon={<Grid className="w-5 h-5" />}
                    variant={isGrid ? 'outlined' : undefined}
                    onClick={toggle}
                />
            </Flex>
            <div className={cn('gap-6 grid', isGrid ? 'grid-cols-2' : 'grid-cols-1')}>
                {loading ||
                    properties.map((property) => <HorizontalProperty property={property} key={property.propertyId} />)}
            </div>
            {loading && <SkeletonRender controller={HorizontalPropertySkeleton} className="gap-6 mt-6" vertical />}
            <Pagination
                style={{
                    marginTop: '40px',
                }}
                hideOnSinglePage
                align="center"
                current={page}
                pageSize={pageSize}
                total={total}
                onChange={handlePageChange}
                onShowSizeChange={handlePageSizeChange}
            />
        </div>
    );
};

export default SearchResult;
