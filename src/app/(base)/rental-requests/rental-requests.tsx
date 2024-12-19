'use client';

import RentalRequest from '@/app/(base)/rental-requests/rental-request';
import PriceInput from '@/components/input/price-input';
import TableFilter from '@/components/table-filter';
import Text from '@/components/text';
import { initDataTable } from '@/constants/init-data';
import { datePickerProps } from '@/constants/init-props';
import { IProperty } from '@/interfaces/property';
import { IRentalRequest } from '@/interfaces/rentalRequest';
import { ITable } from '@/interfaces/table';
import { IBaseUser } from '@/interfaces/user';
import {
    getOwnerCbbForRenterService,
    getPropertyCbbForRenterService,
    renterGetAllRentalRequests,
} from '@/services/rental-request-service';
import { Button, Col, DatePicker, Empty, Flex, Form, Select, Spin } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { Filter } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

export interface IFilterRentalRequest {}

const propertyFilterOption = (input: string, option: IProperty | undefined) =>
    (option?.title ?? '').toLowerCase().includes(input.toLowerCase());

const userFilterOption = (input: string, option: any) =>
    (option?.name ?? '').toLowerCase().includes(input.toLowerCase());

const sortOptions = [
    {
        label: 'Giá thuê tăng dần',
        value: 'price_asc',
    },
    {
        label: 'Giá thuê giảm dần',
        value: 'price_desc',
    },
    {
        label: 'Tiền cọc tăng dần',
        value: 'deposit_asc',
    },
    {
        label: 'Tiền cọc giảm dần',
        value: 'deposit_desc',
    },
    {
        label: 'Ngày gửi yêu cầu tăng dần',
        value: 'start_date_asc',
    },
    {
        label: 'Ngày gửi yêu cầu giảm dần',
        value: 'start_date_desc',
    },
];

const RentalRequests = () => {
    const [rentalRequests, setRentalRequests] = useState<ITable<IRentalRequest>>(initDataTable);
    const [loading, setLoading] = useState(false);
    const [owners, setOwners] = useState<IBaseUser[]>([]);
    const [properties, setProperties] = useState<IProperty[]>([]);
    const [ownerLoading, setOwnerLoading] = useState<boolean>(true);
    const [propertyLoading, setPropertyLoading] = useState<boolean>(true);
    const [activeFilter, setActiveFilter] = useState<boolean>(false);
    const [form] = useForm();
    const [sort, setSort] = useState<string | undefined>(undefined);

    const fetchRentalRequests = useCallback(
        async (data: any) => {
            setLoading(true);

            try {
                const filterData = {
                    ...data,
                    ...form.getFieldsValue(),
                    startDate: data.startDate?.format('YYYY-MM-DD'),
                    endDate: data.endDate?.format('YYYY-MM-DD'),
                    ...(sort ? { sort: sort } : {}),
                };

                const result = await renterGetAllRentalRequests(filterData);

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
        },
        [form, sort],
    );

    const next = () => {
        fetchRentalRequests({ take: 10, skip: rentalRequests.data.length });
    };

    const handleToggleFilter = () => {
        setActiveFilter((prev) => !prev);
    };

    const handleFilter = () => {
        setRentalRequests(initDataTable);
        fetchRentalRequests({
            ...form.getFieldsValue(),
            take: 10,
            skip: 0,
        });
    };

    const handleReset = () => {
        form.resetFields();
        setRentalRequests(initDataTable);
        fetchRentalRequests({ take: 10, skip: 0 });
    };

    const handleChangeSort = useCallback((value: string) => {
        setSort(value);
        setRentalRequests(initDataTable);
        // fetchRentalRequests({
        //     take: 10,
        //     skip: 0,
        // });
    }, []);

    useEffect(() => {
        fetchRentalRequests({
            skip: 0,
            take: 10,
        });
    }, [fetchRentalRequests]);

    useEffect(() => {
        const fetchOwnerCbb = async () => {
            try {
                const owners = await getOwnerCbbForRenterService();

                console.log(owners.map((owner) => ({ ...owner, name: owner.name + ' - ' + owner.email })));

                setOwners(owners.map((owner) => ({ ...owner, name: owner.name + ' - ' + owner.email })));
            } catch (error) {
            } finally {
                setOwnerLoading(false);
            }
        };

        const fetchPropertyCbb = async () => {
            try {
                const properties = await getPropertyCbbForRenterService();

                setProperties(properties);
            } catch (error) {
            } finally {
                setPropertyLoading(false);
            }
        };

        fetchOwnerCbb();
        fetchPropertyCbb();
    }, []);

    return (
        <div>
            <Flex gap="small" justify="flex-end" wrap className="my-4">
                <Flex gap={4} align="center" justify="flex-end">
                    <Text>Sắp xếp theo:</Text>
                    <Select
                        allowClear
                        style={{
                            minWidth: 215,
                        }}
                        value={sort}
                        onChange={handleChangeSort}
                        placeholder="Chọn cách sắp xếp"
                        options={sortOptions}
                    />
                </Flex>
                <Button
                    type={activeFilter ? 'primary' : 'default'}
                    icon={<Filter className="w-5 h-5" />}
                    onClick={handleToggleFilter}
                />
            </Flex>
            {activeFilter && (
                <TableFilter<IFilterRentalRequest> onFinish={handleFilter} onReset={handleReset} form={form}>
                    <Col span={8}>
                        <Form.Item label="Bất động sản" name="propertyId">
                            <Select
                                placeholder="Chọn bất động sản"
                                options={properties}
                                fieldNames={{ label: 'title', value: 'propertyId' }}
                                loading={propertyLoading}
                                allowClear
                                showSearch
                                filterOption={propertyFilterOption}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Chủ nhà" name="ownerId">
                            <Select
                                allowClear
                                showSearch
                                filterOption={userFilterOption}
                                placeholder="Chọn chủ nhà"
                                options={owners}
                                loading={ownerLoading}
                                fieldNames={{ label: 'name', value: 'userId' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Trạng thái" name="status">
                            <Select
                                allowClear
                                placeholder="Chọn trạng thái"
                                options={[
                                    {
                                        label: 'Chờ xác nhận',
                                        value: 'PENDING',
                                    },
                                    {
                                        label: 'Đã xác nhận',
                                        value: 'APPROVED',
                                    },
                                    {
                                        label: 'Đã từ chối',
                                        value: 'REJECTED',
                                    },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Tiền thuê" name="amount">
                            <PriceInput placeholder="Nhập số tiền thuê" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Tiền cọc" name="deposit">
                            <PriceInput placeholder="Nhập số tiền cọc" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Ngày bắt đầu" name="startDate">
                            <DatePicker {...datePickerProps} placeholder="Ngày bắt đầu" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="Ngày kết thúc" name="endDate">
                            <DatePicker {...datePickerProps} placeholder="Ngày kết thúc" />
                        </Form.Item>
                    </Col>
                </TableFilter>
            )}
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
