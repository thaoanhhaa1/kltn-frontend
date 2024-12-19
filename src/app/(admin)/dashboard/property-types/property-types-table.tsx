'use client';

import TableFilter from '@/components/table-filter';
import { initAttribute } from '@/constants/attribute';
import { IPropertyTypeDetail } from '@/interfaces/property-type';
import { formatDateTime } from '@/lib/utils';
import { DASHBOARD_TYPES } from '@/path';
import {
    createPropertyType,
    deletePropertyType,
    getPropertyTypesByAdmin,
    updatePropertyType,
} from '@/services/property-type';
import { Button, Col, Flex, Form, Input, Space, Table, TableProps } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { Edit2, Filter, Plus, Save, Trash, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

interface IFilterPropertyType {}

const PropertyTypesTable = () => {
    const [types, setTypes] = useState<Array<IPropertyTypeDetail>>([]);
    const [loading, setLoading] = useState(false);
    const [editIndex, setEditIndex] = useState<number>(-1);
    const [isAdd, setIsAdd] = useState(false);
    const router = useRouter();
    const [form] = useForm();
    const [filterForm] = useForm();
    const [activeFilter, setActiveFilter] = useState(false);

    const handleToggleAdd = () => {
        if (isAdd) {
            setTypes((prev) => prev.slice(1));
        } else {
            form.resetFields();
            setTypes((prev) => [initAttribute, ...prev]);
        }

        setIsAdd((prev) => !prev);
    };

    const handleEdit = useCallback((index: number) => {
        setEditIndex(index);
    }, []);

    const handleDelete = useCallback(
        async (id: string) => {
            try {
                await deletePropertyType(id);

                toast.success('Xóa loại bất động sản thành công');
                router.refresh();
            } catch (error) {
                toast.error((error as any).message || 'Xóa loại bất động sản thất bại');
            }
        },
        [router],
    );

    const handleCancel = useCallback(() => {
        setEditIndex(-1);
        setIsAdd(false);

        if (isAdd) types.shift();
    }, [types, isAdd]);

    const handleSave = useCallback(async () => {
        await form.validateFields();

        try {
            setLoading(true);
            const values = await form.getFieldsValue();

            await (isAdd ? createPropertyType(values) : updatePropertyType({ id: types[editIndex].id, ...values }));

            setEditIndex(-1);
            setIsAdd(false);
            toast.success(isAdd ? 'Thêm loại bất động sản thành công' : 'Cập nhật loại bất động sản thành công');
            router.refresh();
        } catch (error) {
            toast.error(
                (error as any).message || isAdd
                    ? 'Thêm loại bất động sản thất bại'
                    : 'Cập nhật loại bất động sản thất bại',
            );
        } finally {
            setLoading(false);
        }
    }, [types, editIndex, form, isAdd, router]);

    const columns: TableProps<IPropertyTypeDetail>['columns'] = useMemo(
        () => [
            {
                title: 'ID',
                dataIndex: 'id',
                width: 50,
                sorter: (a, b) => a.id.localeCompare(b.id),
                render: (value) => value || '-',
            },
            {
                title: 'Loại bất động sản',
                dataIndex: 'name',
                width: 150,
                sorter: (a, b) => a.name.localeCompare(b.name),
                render: (value, _, index) => {
                    if ((isAdd && index === 0) || editIndex === index)
                        return (
                            <Form.Item
                                name="name"
                                initialValue={isAdd ? undefined : value}
                                style={{
                                    margin: 0,
                                }}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Loại bất động sản không được để trống',
                                    },
                                ]}
                            >
                                <Input placeholder="Loại bất động sản" />
                            </Form.Item>
                        );

                    return <span>{value}</span>;
                },
            },
            {
                title: 'Ngày tạo',
                dataIndex: 'createdAt',
                width: 150,
                sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
                render: (value) => (value ? formatDateTime(value) : '-'),
            },
            {
                title: 'Ngày cập nhật',
                dataIndex: 'updatedAt',
                width: 150,
                sorter: (a, b) => a.updatedAt.localeCompare(b.updatedAt),
                render: (value) => (value ? formatDateTime(value) : '-'),
            },
            {
                title: 'Hành động',
                fixed: 'right',
                width: 110,
                render: (_, record, index) => (
                    <Space>
                        {(isAdd && index === 0) || editIndex === index ? (
                            <>
                                <Button type="text" icon={<Save className="w-5 h-5" />} onClick={handleSave} />
                                <Button danger type="text" icon={<X className="w-5 h-5" />} onClick={handleCancel} />
                            </>
                        ) : (
                            <>
                                <Button
                                    type="text"
                                    icon={<Edit2 className="w-5 h-5" />}
                                    onClick={() => handleEdit(index)}
                                />
                                <Button
                                    danger
                                    type="text"
                                    icon={<Trash className="w-5 h-5" />}
                                    onClick={() => handleDelete(record.id)}
                                />
                            </>
                        )}
                    </Space>
                ),
            },
        ],
        [editIndex, handleCancel, handleDelete, handleEdit, handleSave, isAdd],
    );

    const fetchTypes = useCallback(async () => {
        setLoading(true);

        try {
            const data = await getPropertyTypesByAdmin({
                ...filterForm.getFieldsValue(),
            });
            setTypes(data);
        } catch (error) {
            toast.error((error as any).message || 'Lấy danh sách loại bất động sản thất bại');
        } finally {
            setLoading(false);
        }
    }, [filterForm]);

    const handleToggleFilter = () => {
        setActiveFilter((prev) => !prev);
    };

    const handleFilter = () => {
        fetchTypes();
        router.push(DASHBOARD_TYPES);
    };

    const handleReset = useCallback(() => {
        form.resetFields();
        fetchTypes();
        router.push(DASHBOARD_TYPES);
    }, [fetchTypes, form, router]);

    useEffect(() => {
        fetchTypes();
    }, [fetchTypes]);

    return (
        <>
            <Flex gap="small" justify="flex-end" wrap className="my-4">
                <Button
                    type={activeFilter ? 'primary' : 'default'}
                    icon={<Filter className="w-5 h-5" />}
                    onClick={handleToggleFilter}
                />
                <Button
                    type={isAdd ? 'primary' : 'default'}
                    icon={<Plus className="w-5 h-5" />}
                    onClick={handleToggleAdd}
                />
            </Flex>
            {activeFilter && (
                <TableFilter<IFilterPropertyType> onFinish={handleFilter} onReset={handleReset} form={filterForm}>
                    <Col span={12}>
                        <Form.Item name="id" label="ID">
                            <Input allowClear placeholder="Nhập ID" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="name" label="Tiện ích">
                            <Input allowClear placeholder="Nhập loại bất động sản" />
                        </Form.Item>
                    </Col>
                </TableFilter>
            )}
            <Form form={form}>
                <Table loading={loading} rowKey={(record) => record.id} columns={columns} dataSource={types} />
            </Form>
        </>
    );
};

export default PropertyTypesTable;
