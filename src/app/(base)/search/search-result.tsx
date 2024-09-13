'use client';

import HorizontalProperty from '@/components/property/horizontal-property';
import HorizontalPropertySkeleton from '@/components/property/horizontal-property-skeleton';
import SkeletonRender from '@/components/skeleton-render';
import { DEFAULT_SORT_PROPERTY, sortPropertyOptions } from '@/constants/init-data';
import usePagination from '@/hooks/usePagination';
import { IProperty } from '@/interfaces/property';
import { convertObjectToParams, formatCurrency, toSkipTake } from '@/lib/utils';
import { searchProperties } from '@/services/property-service';
import { Flex, Pagination, Select, Typography } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const SearchResult = ({ count }: { count: number }) => {
    const router = useRouter();
    const [properties, setProperties] = useState<IProperty[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const { page, pageSize } = usePagination();
    const searchParams = useSearchParams();
    const q = searchParams.get('q');
    const min_price = searchParams.get('min_price');
    const max_price = searchParams.get('max_price');
    const amenities = JSON.stringify(searchParams.getAll('amenities[]'));
    const bedroom = searchParams.get('bedroom');
    const bathroom = searchParams.get('bathroom');
    const furniture = searchParams.get('furniture');
    const city = searchParams.get('city');
    const district = searchParams.get('district');
    const ward = searchParams.get('ward');
    const sort = searchParams.get('sort');

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
        if (min_price) searchParams.min_price = min_price;
        if (max_price) searchParams.max_price = max_price;
        if (amenitiesArr.length) searchParams['amenities[]'] = amenitiesArr;
        if (bedroom) searchParams.bedroom = bedroom;
        if (bathroom) searchParams.bathroom = bathroom;
        if (furniture) searchParams.furniture = furniture;
        if (city) searchParams.city = city;
        if (district) searchParams.district = district;
        if (ward) searchParams.ward = ward;
        if (sort) searchParams.sort = sort;

        return searchParams;
    }, [amenities, bathroom, bedroom, city, district, furniture, max_price, min_price, page, pageSize, q, sort, ward]);

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
            <Flex className="mb-4 mt-6" justify="flex-end">
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
            </Flex>
            <Flex gap={24} vertical>
                {loading ||
                    properties.map((property) => <HorizontalProperty property={property} key={property.propertyId} />)}
            </Flex>
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
