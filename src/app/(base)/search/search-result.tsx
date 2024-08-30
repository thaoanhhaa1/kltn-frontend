'use client';

import HorizontalProperty from '@/components/property/horizontal-property';
import { DEFAULT_SORT_PROPERTY, sortPropertyOptions } from '@/constants/init-data';
import usePagination from '@/hooks/usePagination';
import { IProperty } from '@/interfaces/property';
import { convertObjectToParams, formatCurrency, toSkipTake } from '@/lib/utils';
import { searchProperties } from '@/services/property-service';
import { Flex, Select, Typography } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

// TODO Skeleton loading
const SearchResult = ({ count }: { count: number }) => {
    const router = useRouter();
    const [properties, setProperties] = useState<IProperty[]>([]);
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);

            try {
                const res = await searchProperties(convertObjectToParams(getSearchParams()));

                setProperties(res);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, [getSearchParams]);

    return (
        <div>
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
                {properties.map((property) => (
                    <HorizontalProperty property={property} key={property.property_id} />
                ))}
            </Flex>
        </div>
    );
};

export default SearchResult;
