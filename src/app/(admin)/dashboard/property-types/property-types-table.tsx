'use client';

import { initAttribute } from '@/constants/attribute';
import { IPropertyTypeDetail } from '@/interfaces/property-type';
import { formatDateTime } from '@/lib/utils';
import { createPropertyType, deletePropertyType, updatePropertyType } from '@/services/property-type';
import { Button, Flex, Form, Input, Space, Table, TableProps } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { Edit2, Plus, Save, Trash, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

const PropertyTypesTable = ({ types }: { types: Array<IPropertyTypeDetail> }) => {
    const [data, setData] = useState<Array<IPropertyTypeDetail>>(types);
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

        if (isAdd) data.shift();
    }, [data, isAdd]);

    const handleSave = useCallback(async () => {
        await form.validateFields();

        try {
            setLoading(true);
            const values = await form.getFieldsValue();

            await (isAdd ? createPropertyType(values) : updatePropertyType({ id: data[editIndex].id, ...values }));

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
    }, [data, editIndex, form, isAdd, router]);

    const columns: TableProps<IPropertyTypeDetail>['columns'] = useMemo(
        () => [
            {
                title: 'ID',
                dataIndex: 'id',
                width: 50,
                render: (value) => value || '-',
            },
            {
                title: 'Loại bất động sản',
                dataIndex: 'name',
                width: 150,
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
                render: (value) => (value ? formatDateTime(value) : '-'),
            },
            {
                title: 'Ngày cập nhật',
                dataIndex: 'updatedAt',
                width: 150,
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
        setData(types);
    }, [types]);

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

export default PropertyTypesTable;
