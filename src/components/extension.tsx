'use client';

import { ContractExtensionRequestType } from '@/interfaces/contract-extension-request';
import { getExtensionRequestTypeText } from '@/lib/utils';
import { createExtensionRequest } from '@/services/contract-extension-request-service';
import { Button, DatePicker, Form, Modal } from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';

const Extension = ({
    contractId,
    transactionId = null,
    endDate,
    type,
}: {
    contractId: string;
    transactionId?: number | null;
    endDate: Date;
    type: ContractExtensionRequestType;
}) => {
    const [open, setOpen] = useState(false);
    const [form] = useForm();
    const [loading, setLoading] = useState(false);
    const typeText = useMemo(() => getExtensionRequestTypeText(type).toLowerCase(), [type]);

    const handleOpenModal = () => setOpen(true);
    const handleCloseModal = () => setOpen(false);

    const validate = async () => {
        try {
            await form.validateFields();

            return true;
        } catch (error) {}

        return false;
    };

    const handleConfirm = async () => {
        setLoading(true);

        if (!(await validate())) return setLoading(false);

        try {
            const extensionDate = form.getFieldValue('extensionDate') as dayjs.Dayjs;

            await createExtensionRequest({
                contractId,
                extensionDate: extensionDate.add(1, 'day').format('YYYY-MM-DD'),
                reason: form.getFieldValue('reason'),
                transactionId,
                type,
            });

            toast.success(`Gửi yêu cầu ${typeText} thành công`);
            setOpen(false);
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || `${typeText} thất bại`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button onClick={handleOpenModal}>Gia hạn</Button>
            <Modal
                open={open}
                title={`G${typeText.substring(1)} ${transactionId || contractId}`}
                okText="Gia hạn"
                cancelText="Huỷ"
                onCancel={handleCloseModal}
                onOk={handleConfirm}
                confirmLoading={loading}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Ngày gia hạn"
                        name="extensionDate"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn ngày gia hạn',
                            },
                        ]}
                    >
                        <DatePicker
                            style={{
                                width: '100%',
                            }}
                            format="DD/MM/YYYY"
                            minDate={dayjs(endDate).add(1, 'day')}
                            maxDate={(transactionId && dayjs(endDate).add(5, 'days')) || undefined}
                            placeholder="Chọn ngày gia hạn"
                        />
                    </Form.Item>
                    <Form.Item label="Lý do" name="reason">
                        <TextArea placeholder="Nhập lý do gia hạn..." />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default Extension;
