'use client';

import Payment from '@/app/(base)/payments/payment';
import PriceInput from '@/components/input/price-input';
import TableFilter from '@/components/table-filter';
import { IProperty } from '@/interfaces/property';
import { ITransaction, TransactionStatus, TransactionType } from '@/interfaces/transaction';
import { IBaseUser } from '@/interfaces/user';
import { getPropertiesByRenterService, getUsersByRenterService } from '@/services/contract-service';
import { getTransactionsByRenter } from '@/services/transaction-service';
import { Button, Col, Empty, Flex, Form, Input, Row, Select, Spin } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { Filter } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

export interface IFilterPayment {
    contractId?: string;
    propertyTitle?: string;
    ownerName?: string;
    amount?: number;
    endDate?: string;
    type?: TransactionType;
    status?: TransactionStatus;
}

const propertyFilterOption = (input: string, option: IProperty | undefined) =>
    (option?.title ?? '').toLowerCase().includes(input.toLowerCase());

const userFilterOption = (input: string, option: any) =>
    (option?.name ?? '').toLowerCase().includes(input.toLowerCase());

const Payments = () => {
    const [transactions, setTransactions] = useState<Array<ITransaction>>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeFilter, setActiveFilter] = useState<boolean>(false);
    const [form] = useForm();
    const [owners, setOwners] = useState<Array<IBaseUser>>([]);
    const [properties, setProperties] = useState<Array<IProperty>>([]);
    const [ownerLoading, setOwnerLoading] = useState<boolean>(true);
    const [propertyLoading, setPropertyLoading] = useState<boolean>(true);

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        setTransactions([]);

        try {
            const transactions = await getTransactionsByRenter({
                ...form.getFieldsValue(),
            });

            setTransactions(transactions);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    }, [form]);

    const handleToggleFilter = () => {
        setActiveFilter((prev) => !prev);
    };

    const handleFilter = () => {
        fetchTransactions();
    };

    const handleReset = () => {
        form.resetFields();
        fetchTransactions();
    };

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    useEffect(() => {
        const fetchOwnerCbb = async () => {
            try {
                const owners = await getUsersByRenterService();

                console.log(owners.map((owner) => ({ ...owner, name: owner.name + ' - ' + owner.email })));

                setOwners(owners.map((owner) => ({ ...owner, name: owner.name + ' - ' + owner.email })));
            } catch (error) {
            } finally {
                setOwnerLoading(false);
            }
        };

        const fetchPropertyCbb = async () => {
            try {
                const properties = await getPropertiesByRenterService();

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
                <Button
                    type={activeFilter ? 'primary' : 'default'}
                    className="ml-auto"
                    icon={<Filter className="w-5 h-5" />}
                    onClick={handleToggleFilter}
                />
            </Flex>
            {activeFilter && (
                <TableFilter<IFilterPayment> onFinish={handleFilter} onReset={handleReset} form={form}>
                    <Col span={8}>
                        <Form.Item label="Mã hợp đồng" name="contractId">
                            <Input allowClear placeholder="Nhập mã hợp đồng" />
                        </Form.Item>
                    </Col>
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
                        <Form.Item label="Số tiền" name="amount">
                            <PriceInput placeholder="Nhập số tiền" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="Loại" name="type">
                            <Select
                                allowClear
                                placeholder="Chọn loại"
                                options={[
                                    {
                                        label: 'Tiền cọc',
                                        value: 'DEPOSIT',
                                    },
                                    {
                                        label: 'Tiền thuê',
                                        value: 'RENT',
                                    },
                                ]}
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
                                        label: 'Chờ thanh toán',
                                        value: 'PENDING',
                                    },
                                    {
                                        label: 'Thành công',
                                        value: 'COMPLETED',
                                    },
                                    {
                                        label: 'Đã hủy',
                                        value: 'CANCELLED',
                                    },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                </TableFilter>
            )}
            {/* <div className="flex justify-end my-3">
                <Segmented<string>
                    options={[
                        'Tất cả',
                        getTransactionStatusText('PENDING'),
                        getTransactionStatusText('COMPLETED'),
                        getTransactionStatusText('CANCELLED'),
                    ]}
                    onChange={handleChangeSegmented}
                />
            </div> */}
            <Row gutter={[12, 12]}>
                {transactions.map((transaction) => (
                    <Col key={transaction.id} span={12}>
                        <Payment transaction={transaction} fetchTransactions={fetchTransactions} />
                    </Col>
                ))}
            </Row>
            {!loading && (
                <Flex justify="center">
                    {transactions.length === 0 && <Empty description="Không có giao dịch nào" />}
                </Flex>
            )}
            {loading && (
                <Flex justify="center">
                    <Spin size="large" />
                </Flex>
            )}
        </div>
    );
};

export default Payments;
