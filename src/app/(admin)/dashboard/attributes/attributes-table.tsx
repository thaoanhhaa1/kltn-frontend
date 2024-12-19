'use client';

import TableFilter from '@/components/table-filter';
import TablePagination from '@/components/table-pagination';
import { initAttribute, types } from '@/constants/attribute';
import { IAttribute } from '@/interfaces/attribute';
import { formatDateTime, getAttributeTypeColor } from '@/lib/utils';
import { DASHBOARD_ATTRIBUTES } from '@/path';
import { createAttribute, deleteAttribute, getAllAttributes, updateAttribute } from '@/services/attribute-service';
import { Button, Col, Flex, Form, Input, Select, Space, TableProps, Tag } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { Edit2, Filter, Plus, Save, Trash, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

const attributeOptions = Object.keys(types).map((key) => ({ label: types[key as keyof typeof types], value: key }));

export interface IFilterAttribute {}

const AttributesTable = () => {
    const [attributes, setAttributes] = useState<Array<IAttribute>>([]);
    const [loading, setLoading] = useState(false);
    const [editIndex, setEditIndex] = useState<number>(-1);
    const [isAdd, setIsAdd] = useState(false);
    const router = useRouter();
    const [form] = useForm();
    const [activeFilter, setActiveFilter] = useState(false);
    const [attributeLoading, setAttributeLoading] = useState(false);
    const [filterForm] = useForm();

    const handleToggleAdd = () => {
        if (isAdd) {
            setAttributes((prev) => prev.slice(1));
        } else {
            form.resetFields();
            setAttributes((prev) => [initAttribute, ...prev]);
        }

        setIsAdd((prev) => !prev);
    };

    const handleEdit = useCallback((index: number) => {
        setEditIndex(index);
    }, []);

    const handleDelete = useCallback(
        async (id: string) => {
            try {
                await deleteAttribute(id);

                toast.success('Xóa tiện ích thành công');
                router.refresh();
            } catch (error) {
                toast.error((error as any).message || 'Xóa tiện ích thất bại');
            }
        },
        [router],
    );

    const handleCancel = useCallback(() => {
        setEditIndex(-1);
        setIsAdd(false);

        if (isAdd) attributes.shift();
    }, [attributes, isAdd]);

    const handleSave = useCallback(async () => {
        await form.validateFields();
        try {
            setLoading(true);
            const values = await form.getFieldsValue();

            await (isAdd ? createAttribute(values) : updateAttribute({ id: attributes[editIndex].id, ...values }));

            setEditIndex(-1);
            setIsAdd(false);
            toast.success(isAdd ? 'Thêm tiện ích thành công' : 'Cập nhật tiện ích thành công');
            router.refresh();
        } catch (error) {
            toast.error((error as any).message || isAdd ? 'Thêm tiện ích thất bại' : 'Cập nhật tiện ích thất bại');
        } finally {
            setLoading(false);
        }
    }, [attributes, editIndex, form, isAdd, router]);

    const columns: TableProps<IAttribute>['columns'] = useMemo(
        () => [
            {
                title: 'ID',
                dataIndex: 'id',
                width: 50,
                sorter: (a, b) => a.id.localeCompare(b.id),
                render: (value) => value || '-',
            },
            {
                title: 'Tên tiện ích',
                dataIndex: 'name',
                width: 250,
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
                                        message: 'Tên tiện ích không được để trống',
                                    },
                                ]}
                            >
                                <Input placeholder="Tên tiện ích" />
                            </Form.Item>
                        );

                    return <span>{value}</span>;
                },
            },
            {
                title: 'Loại tiện ích',
                dataIndex: 'type',
                width: 150,
                sorter: (a, b) => a.type.localeCompare(b.type),
                render: (type: string, _, index) => {
                    if ((isAdd && index === 0) || editIndex === index)
                        return (
                            <Form.Item
                                name="type"
                                initialValue={isAdd ? undefined : type}
                                style={{
                                    margin: 0,
                                }}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Loại tiện ích không được để trống',
                                    },
                                ]}
                            >
                                <Select options={attributeOptions} placeholder="Loại tiện ích" />
                            </Form.Item>
                        );

                    return (
                        <Tag key={type} color={getAttributeTypeColor(type)} className="uppercase">
                            {types[type as keyof typeof types]}
                        </Tag>
                    );
                },
            },
            {
                title: 'Ngày tạo',
                dataIndex: 'createdAt',
                width: 170,
                sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
                render: (value) => (value ? formatDateTime(value) : '-'),
            },
            {
                title: 'Ngày cập nhật',
                dataIndex: 'updatedAt',
                width: 170,
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

    const fetchAttributes = useCallback(async () => {
        setAttributeLoading(true);

        try {
            const attributes = await getAllAttributes({
                ...filterForm.getFieldsValue(),
            });

            setAttributes(attributes);
        } catch (error) {
        } finally {
            setAttributeLoading(false);
        }
    }, [filterForm]);

    const handleToggleFilter = () => {
        setActiveFilter((prev) => !prev);
    };

    const handleFilter = (values: IFilterAttribute) => {
        fetchAttributes();
        router.push(DASHBOARD_ATTRIBUTES);
    };

    const handleReset = useCallback(() => {
        form.resetFields();
        fetchAttributes();
        router.push(DASHBOARD_ATTRIBUTES);
    }, [fetchAttributes, form, router]);

    useEffect(() => {
        fetchAttributes();
    }, [fetchAttributes]);

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
                <TableFilter<IFilterAttribute> onFinish={handleFilter} onReset={handleReset} form={filterForm}>
                    <Col span={8}>
                        <Form.Item name="id" label="ID">
                            <Input allowClear placeholder="Nhập ID" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="name" label="Tiện ích">
                            <Input allowClear placeholder="Nhập họ tên tiện ích" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="type" label="Loại tiện ích">
                            <Select options={attributeOptions} placeholder="Chọn loại tiện ích" allowClear />
                        </Form.Item>
                    </Col>
                </TableFilter>
            )}
            <Form form={form}>
                <TablePagination
                    loading={loading || attributeLoading}
                    rowKey={(record) => record.id}
                    columns={columns}
                    dataSource={attributes}
                />
            </Form>
        </>
    );
};

export default AttributesTable;
