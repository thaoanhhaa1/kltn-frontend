'use client';

import { IProperty } from '@/interfaces/property';
import { Form, Modal, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { Dispatch, SetStateAction, useState } from 'react';

export interface IRejectInput {
    reason: string;
    property_id: string;
    status: 'REJECTED';
}

const RejectPropertyModal = ({
    cancelText,
    okText,
    reasonLabel,
    reasonPlaceholder,
    reasonRequiredMessage,
    title,
    property,
    open,
    setOpen,
    onReject,
}: {
    title: string;
    reasonLabel: string;
    reasonPlaceholder: string;
    reasonRequiredMessage: string;
    okText: string;
    cancelText: string;
    property: Pick<IProperty, 'property_id' | 'title'>;
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
            await onReject({ ...values, property_id: property.property_id });
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
            title={title}
            okText={okText}
            cancelText={cancelText}
            onCancel={handleCancel}
            onOk={handleOk}
            okType="danger"
        >
            <Typography.Title level={4}>{property.title}</Typography.Title>
            <Form form={form} layout="vertical">
                <Form.Item
                    label={reasonLabel}
                    name="reason"
                    rules={[
                        {
                            required: true,
                            message: reasonRequiredMessage,
                        },
                    ]}
                >
                    <TextArea
                        autoSize={{
                            maxRows: 3,
                            minRows: 3,
                        }}
                        placeholder={reasonPlaceholder}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default RejectPropertyModal;
