'use client';

import RentalRequest from '@/app/(base)/rental-requests/rental-request';
import { initDataTable } from '@/constants/init-data';
import { IRentalRequest } from '@/interfaces/rentalRequest';
import { ITable } from '@/interfaces/table';
import { getRentalRequestStatusCode, getRentalRequestStatusText } from '@/lib/utils';
import { IRenterGetAllRentalRequests } from '@/schemas/rental-request.schema';
import { renterGetAllRentalRequests } from '@/services/rental-request-service';
import { Empty, Flex, Segmented, Spin } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const RentalRequests = () => {
    const [rentalRequests, setRentalRequests] = useState<ITable<IRentalRequest>>(initDataTable);
    const [loading, setLoading] = useState(false);
    const [segmented, setSegmented] = useState<string>('');

    const fetchRentalRequests = useCallback(async (data: IRenterGetAllRentalRequests) => {
        setLoading(true);

        try {
            const result = await renterGetAllRentalRequests(data);

            setRentalRequests((rentalRequests) => {
                const lastOld = rentalRequests.data.at(-1);
                const lastNew = result.data.at(-1);

                if (lastOld && lastNew && lastOld.requestId === lastNew.requestId) return rentalRequests;

                if (data.skip === 0) return result;

                return {
                    ...result,
                    data: [...rentalRequests.data, ...result.data],
                };
            });
        } catch (error) {
            console.log('Error fetching rental requests', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const next = () => {
        const status = getRentalRequestStatusCode(segmented);

        fetchRentalRequests({ take: 10, skip: rentalRequests.data.length, status });
    };

    const handleChangeSegmented = (value: string) => {
        setSegmented(value);
        setRentalRequests(initDataTable);
    };

    useEffect(() => {
        const status = getRentalRequestStatusCode(segmented);

        fetchRentalRequests({
            skip: 0,
            take: 10,
            status,
        });
    }, [fetchRentalRequests, segmented]);

    return (
        <div>
            <div className="flex justify-end my-3">
                <Segmented<string>
                    options={[
                        'Tất cả',
                        getRentalRequestStatusText('PENDING'),
                        getRentalRequestStatusText('APPROVED'),
                        getRentalRequestStatusText('REJECTED'),
                    ]}
                    onChange={handleChangeSegmented}
                />
            </div>
            <InfiniteScroll
                dataLength={rentalRequests.data.length} //This is important field to render the next data
                next={next}
                hasMore={
                    rentalRequests.pageInfo.current * rentalRequests.pageInfo.pageSize < rentalRequests.pageInfo.total
                }
                loader={null}
            >
                <div className="grid grid-cols-2 gap-3">
                    {rentalRequests.data.map((rentalRequest) => (
                        <RentalRequest key={rentalRequest.requestId} rentalRequest={rentalRequest} />
                    ))}
                </div>
            </InfiniteScroll>
            <Flex justify="center">{loading && <Spin />}</Flex>
            {!loading && rentalRequests.pageInfo.total === 0 && <Empty description="Chưa có yêu cầu thuê nhà nào." />}
        </div>
    );
};

export default RentalRequests;
