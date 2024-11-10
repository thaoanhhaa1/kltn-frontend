'use client';

import Item from '@/app/(base)/reports/[reportId]/item';
import UploadButton from '@/components/button/upload-button';
import PriceInput from '@/components/input/price-input';
import { datePickerProps } from '@/constants/init-props';
import { adminResolveReport } from '@/services/report-service';
import { useUserStore } from '@/stores/user-store';
import { Button, Card, Col, DatePicker, Flex, Form, Image, Input, Radio, Row, Upload, UploadFile } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { UploadChangeParam } from 'antd/es/upload';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

export interface IAdminResolveReport {
    choose: string;
    proposed: string;
    resolvedAt: string;
    compensation: number;
    evidences: UploadChangeParam<UploadFile<any>>;
}

const AdminHandleReport = ({ reportId }: { reportId: number }) => {
    const { user } = useUserStore();
    const [form] = useForm<IAdminResolveReport>();
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [choose, setChoose] = useState('');
    const router = useRouter();

    const handleAddReport = async (value: IAdminResolveReport) => {
        setLoading(true);

        try {
            const formData = new FormData();
            value.evidences?.fileList?.length &&
                value.evidences.fileList.forEach((file) => {
                    if (file.originFileObj) {
                        formData.append('evidences', file.originFileObj);
                    }
                });
            formData.append('proposed', value.proposed);
            formData.append('resolvedAt', dayjs(value.resolvedAt).format('DD/MM/YYYY'));
            formData.append('compensation', String(value.compensation || 0));
            formData.append('reportId', String(reportId));
            formData.append('choose', value.choose);

            await adminResolveReport(formData);

            toast.success('Xác nhận quyết định thành công');
            router.refresh();
        } catch (error) {
            toast.error((error as Error).message || 'Có lỗi xảy ra khi xác nhận quyết định');
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = (file: UploadFile) => {
        if (!file.thumbUrl) return;

        setPreviewImage(file.url || file.thumbUrl);
        setPreviewOpen(true);
    };

    const handleChangeChoose = (e: any) => {
        setChoose(e.target.value);
    };

    if (user?.userTypes.includes('admin'))
        return (
            <Item title="Quyết định xử lý">
                <Card>
                    <Form layout="vertical" onFinish={handleAddReport} form={form}>
                        <Row gutter={[12, 12]}>
                            <Col span={24}>
                                <Form.Item
                                    name="choose"
                                    label="Phương án xử lý"
                                    rules={[{ required: true, message: 'Chọn phương án xử lý' }]}
                                >
                                    <Radio.Group
                                        style={{
                                            width: '100%',
                                        }}
                                        onChange={handleChangeChoose}
                                    >
                                        <Row gutter={[12, 12]}>
                                            <Col span={12}>
                                                <Radio value="renter">Chấp nhận đề xuất người thuê</Radio>
                                            </Col>
                                            <Col span={12}>
                                                <Radio value="owner">Chấp nhận đề xuất chủ nhà</Radio>
                                            </Col>
                                            <Col span={12}>
                                                <Radio value="admin">Đề xuất phương án khác</Radio>
                                            </Col>
                                        </Row>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            {choose === 'admin' && (
                                <>
                                    <Col span={24}>
                                        <Form.Item
                                            name="proposed"
                                            label="Đề xuất xử lý"
                                            rules={[{ required: true, message: 'Nhập đề xuất xử lý' }]}
                                        >
                                            <Input.TextArea placeholder="Đề xuất phương án xử lý..." />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Ngày giải quyết"
                                            name="resolvedAt"
                                            rules={[{ required: true, message: 'Chọn ngày giải quyết' }]}
                                        >
                                            <DatePicker
                                                {...datePickerProps}
                                                placeholder="Ngày giải quyết"
                                                minDate={dayjs().add(1, 'day')} // FIXME: Uncomment this line
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="Tiền bồi thường" name="compensation">
                                            <PriceInput placeholder="Nhập số tiền bồi thường..." />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            label="Ảnh, video minh chứng"
                                            name="evidences"
                                            style={{
                                                marginBottom: 0,
                                            }}
                                        >
                                            <Upload
                                                // defaultFileList={
                                                //     review?.medias.map(
                                                //         (media) =>
                                                //             ({
                                                //                 uid: media,
                                                //                 status: 'done',
                                                //                 url: media,
                                                //             } as UploadFile),
                                                //     ) || []
                                                // }
                                                multiple
                                                listType="picture-card"
                                                onPreview={handlePreview}
                                                maxCount={5}
                                                accept="image/*,video/*"
                                            >
                                                {form.getFieldValue('evidences')?.length >= 5 ? null : <UploadButton />}
                                            </Upload>
                                        </Form.Item>
                                    </Col>
                                </>
                            )}
                        </Row>
                        <Flex justify="flex-end" gap={12}>
                            <Button loading={loading} htmlType="submit" type="primary">
                                Xác nhận quyết định
                            </Button>
                        </Flex>
                        {previewImage && (
                            <Image
                                alt="preview"
                                wrapperStyle={{ display: 'none' }}
                                preview={{
                                    visible: previewOpen,
                                    onVisibleChange: (visible) => setPreviewOpen(visible),
                                    afterOpenChange: (visible) => !visible && setPreviewImage(''),
                                }}
                                src={previewImage}
                            />
                        )}
                    </Form>
                </Card>
            </Item>
        );

    return null;
};

export default AdminHandleReport;
