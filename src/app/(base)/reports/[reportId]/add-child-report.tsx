import PriceInput from '@/components/input/price-input';
import { datePickerProps } from '@/constants/init-props';
import { ownerProposeReport } from '@/services/report-service';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Flex, Form, Image, Input, Modal, Row, Upload, UploadFile } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { UploadChangeParam } from 'antd/es/upload';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';

export interface IAddReportForRenter {
    proposed: string;
    resolvedAt: string;
    compensation: number;
    evidences: UploadChangeParam<UploadFile<any>>;
}

const AddChildReport = ({
    open = false,
    isModal = false,
    reportId,
    okText = 'Gửi đề xuất',
    onCancel,
    onOK = () => {},
}: {
    open?: boolean;
    isModal?: boolean;
    reportId: number | null;
    okText?: string;
    onCancel: () => void;
    onOK?: () => void;
}) => {
    const [form] = useForm<IAddReportForRenter>();
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const Container = isModal ? Modal : 'div';
    const style = useMemo(() => (isModal ? { maxWidth: '800px', paddingInline: '8px' } : {}), [isModal]);

    const handleAddReport = async (value: IAddReportForRenter) => {
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

            await ownerProposeReport(formData);

            toast.success('Gửi báo cáo thành công');
            onCancel();
            onOK();
            router.refresh();
        } catch (error) {
            toast.error((error as Error).message || 'Có lỗi xảy ra khi gửi báo cáo');
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = (file: UploadFile) => {
        if (!file.thumbUrl) return;

        setPreviewImage(file.url || file.thumbUrl);
        setPreviewOpen(true);
    };

    if (reportId === null) return null;

    return (
        <Container open={open} width="100%" centered style={style} closable onCancel={onCancel} footer={null}>
            <Form layout="vertical" onFinish={handleAddReport} form={form}>
                <Row gutter={[12, 12]}>
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
                                multiple
                                listType="picture-card"
                                onPreview={handlePreview}
                                maxCount={5}
                                accept="image/*,video/*"
                            >
                                {form.getFieldValue('evidences')?.length >= 5 ? null : uploadButton}
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
                <Flex justify="flex-end" gap={12}>
                    <Button onClick={onCancel}>Hủy</Button>
                    <Button loading={loading} htmlType="submit" type="primary">
                        {okText}
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
        </Container>
    );
};

const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Đăng tải</div>
    </button>
);

export default AddChildReport;
