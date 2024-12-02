'use client';

import { initAttribute, types } from '@/constants/attribute';
import { IAttribute } from '@/interfaces/attribute';
import { formatDateTime, getAttributeTypeColor } from '@/lib/utils';
import { createAttribute, deleteAttribute, updateAttribute } from '@/services/attribute-service';
import { Button, Flex, Form, Input, Select, Space, Table, TableProps, Tag } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { Edit2, Plus, Save, Trash, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

const attributeOptions = Object.keys(types).map((key) => ({ label: types[key as keyof typeof types], value: key }));

const AttributesTable = ({ attributes }: { attributes: Array<IAttribute> }) => {
    const [data, setData] = useState<Array<IAttribute>>(attributes);
    const [loading, setLoading] = useState(false);
    const [editIndex, setEditIndex] = useState<number>(-1);
    const [isAdd, setIsAdd] = useState(false);
    const router = useRouter();
    const [form] = useForm();

    const handleToggleAdd = () => {
        if (isAdd) {
            data.shift();
        } else {
            form.resetFields();
            setData((prev) => [initAttribute, ...prev]);
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

        if (isAdd) data.shift();
    }, [data, isAdd]);

    const handleSave = useCallback(async () => {
        await form.validateFields();
        try {
            setLoading(true);
            const values = await form.getFieldsValue();

            await (isAdd ? createAttribute(values) : updateAttribute({ id: data[editIndex].id, ...values }));

            setEditIndex(-1);
            setIsAdd(false);
            toast.success(isAdd ? 'Thêm tiện ích thành công' : 'Cập nhật tiện ích thành công');
            router.refresh();
        } catch (error) {
            toast.error((error as any).message || isAdd ? 'Thêm tiện ích thất bại' : 'Cập nhật tiện ích thất bại');
        } finally {
            setLoading(false);
        }
    }, [data, editIndex, form, isAdd, router]);

    const columns: TableProps<IAttribute>['columns'] = useMemo(
        () => [
            {
                title: 'ID',
                dataIndex: 'id',
                width: 50,
                render: (value) => value || '-',
            },
            {
                title: 'Tên tiện ích',
                dataIndex: 'name',
                width: 250,
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
                title: 'Loai tiện ích',
                dataIndex: 'type',
                width: 150,
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
                render: (value) => (value ? formatDateTime(value) : '-'),
            },
            {
                title: 'Ngày cập nhật',
                dataIndex: 'updatedAt',
                width: 170,
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

    useEffect(() => {
        setData(attributes);
    }, [attributes]);

    return (
        <>
            <Flex gap="small" wrap className="my-4">
                <Button
                    type={isAdd ? 'primary' : 'default'}
                    className="ml-auto"
                    icon={<Plus className="w-5 h-5" />}
                    onClick={handleToggleAdd}
                />
            </Flex>
            <Form form={form}>
                <Table loading={loading} rowKey={(record) => record.id} columns={columns} dataSource={data} />
            </Form>
        </>
    );
};

export default AttributesTable;
