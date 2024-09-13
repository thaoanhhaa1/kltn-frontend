'use client';

import { IProperty } from '@/interfaces/property';
import { Form, Modal, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { Dispatch, SetStateAction, useState } from 'react';

export interface IRejectInput {
    reason: string;
    propertyId: string;
    status: 'REJECTED';
}

const RejectPropertyModal = ({
    property,
    open,
    setOpen,
    onReject,
}: {
    property: Pick<IProperty, 'propertyId' | 'title'>;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    onReject: (values: IRejectInput) => Promise<void>;
}) => {
    const [form] = useForm<IRejectInput>();
    const [loading, setLoading] = useState(false);

    const handleCancel = () => setOpen(false);

    const handleOk = async () => {
        setLoading(true);

        try {
            const values = await form.validateFields();
            await onReject({ ...values, propertyId: property.propertyId });
            setOpen(false);
            form.resetFields();
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            confirmLoading={loading}
            open={open}
            centered
            title="Từ chối bất động sản"
            okText="Từ chối"
            cancelText="Hủy"
            onCancel={handleCancel}
            onOk={handleOk}
            okType="danger"
        >
            <Typography.Title level={4}>{property.title}</Typography.Title>
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Lý do từ chối"
                    name="reason"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập lý do từ chối',
                        },
                    ]}
                >
                    <TextArea
                        autoSize={{
                            maxRows: 3,
                            minRows: 3,
                        }}
                        placeholder="Nhập lý do từ chối"
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default RejectPropertyModal;
