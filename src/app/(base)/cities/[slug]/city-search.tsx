'use client';

import HorizontalProperty from '@/components/property/horizontal-property';
import HorizontalPropertySkeleton from '@/components/property/horizontal-property-skeleton';
import SkeletonRender from '@/components/skeleton-render';
import usePagination from '@/hooks/usePagination';
import { IProperty } from '@/interfaces/property';
import { convertObjectToParams } from '@/lib/utils';
import { searchProperties } from '@/services/property-service';
import { Empty, Pagination } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const CitySearch = ({ city }: { city: string }) => {
    const router = useRouter();
    const [properties, setProperties] = useState<IProperty[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const { page, pageSize } = usePagination(20);

    const handlePageChange = (page: number) => {
        router.push(`?${convertObjectToParams({ page, pageSize })}`);
    };

    const handlePageSizeChange = (pageSize: number) => {
        router.push(`?${convertObjectToParams({ page: 1, pageSize })}`);
    };

    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);

            try {
                const res = await searchProperties(`skip=${(page - 1) * pageSize}&take=${pageSize}&city=${city}`);

                setProperties(res.data);
                setTotal(res.pageInfo.total);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, [city, page, pageSize]);

    return (
        <div>
            <div className={'gap-6 grid grid-cols-1'}>
                {loading ||
                    properties.map((property) => <HorizontalProperty property={property} key={property.propertyId} />)}
            </div>
            {!loading && properties.length === 0 && <Empty description={`Không tìm thấy bất động sản nào ở ${city}`} />}
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

export default CitySearch;
