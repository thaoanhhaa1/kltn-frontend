'use client';

import PriceInput from '@/components/input/price-input';
import { datePickerProps, inputNumberProps } from '@/constants/init-props';
import { IProperty } from '@/interfaces/property';
import { createRentalRequest } from '@/services/rental-request-service';
import { Col, DatePicker, Form, InputNumber, Modal, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import dayjs, { Dayjs } from 'dayjs';
import { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'react-toastify';

interface IRentalRequest {
    rentalStartDate: Dayjs;
    rentalEndDate: Dayjs;
    rentalPrice: number;
    rentalDeposit: number;
}

const RentalRequestModal = ({
    property,
    open,
    setOpen,
}: {
    property: IProperty;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
    const [form] = useForm<IRentalRequest>();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [fromDate, setFromDate] = useState<Dayjs>();
    const [months, setMonths] = useState<number | null>(null);

    const handleChangeFromDate = (date: Dayjs) => {
        setFromDate(date);

        if (months && date) {
            form.setFieldValue('rentalEndDate', date.add(months, 'month'));
        }
    };

    const handleOk = async () => {
        try {
            await form.validateFields();

            setConfirmLoading(true);

            const { rentalEndDate, rentalStartDate, ...rest } = form.getFieldsValue();

            await createRentalRequest({
                ...rest,
                property: {
                    images: property.images,
                    title: property.title,
                    propertyId: property.propertyId,
                    slug: property.slug,
                },
                ownerId: property.owner.userId,
                rentalStartDate: rentalStartDate.format('DD/MM/YYYY'),
                rentalEndDate: rentalEndDate.format('DD/MM/YYYY'),
            });

            toast.success('Yêu cầu thuê nhà đã được gửi');
            setOpen(false);
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Có lỗi xảy ra');
            }
        } finally {
            setConfirmLoading(false);
        }
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleChangeMonths = (value: number | null) => {
        setMonths(value);

        if (fromDate && value) {
            form.setFieldValue('rentalEndDate', fromDate.add(value, 'month'));
        }
    };

    return (
        <Modal
            title={property.title}
            open={open}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
        >
            <Form layout="vertical" form={form}>
                <Row gutter={8}>
                    <Col span={8}>
                        <Form.Item
                            label="Ngày bắt đầu"
                            name="rentalStartDate"
                            rules={[{ required: true, message: 'Chọn ngày bắt đầu' }]}
                        >
                            <DatePicker
                                {...datePickerProps}
                                placeholder="Ngày bắt đầu"
                                minDate={dayjs().add(1, 'day')}
                                onChange={handleChangeFromDate}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item
                            label="Số tháng"
                            name="months"
                            rules={[{ required: true, message: 'Nhập số tháng thuê' }]}
                        >
                            <InputNumber
                                addonAfter="tháng"
                                {...inputNumberProps}
                                min={property.minDuration || 1}
                                max={12}
                                placeholder="Số tháng"
                                onChange={handleChangeMonths}
                            />
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item label="Ngày kết thúc" name="rentalEndDate">
                            <DatePicker {...datePickerProps} disabled={true} placeholder="Ngày kết thúc" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            initialValue={property.price}
                            label="Tiền cọc"
                            name="rentalPrice"
                            rules={[{ required: true, message: 'Nhập số tiền thuê' }]}
                        >
                            <PriceInput placeholder="Nhập tiền thuê" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            initialValue={property.deposit}
                            label="Tiền cọc"
                            name="rentalDeposit"
                            rules={[{ required: true, message: 'Nhập số tiền cọc' }]}
                        >
                            <PriceInput placeholder="Nhập tiền cọc" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default RentalRequestModal;
