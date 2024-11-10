import PriceInput from '@/components/input/price-input';
import { priorityReportOptions, typeReportOptions } from '@/constants/init-data';
import { datePickerProps } from '@/constants/init-props';
import { IReport } from '@/interfaces/report';
import { createReportByRenter } from '@/services/report-service';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Flex, Form, Image, Input, Row, Select, Upload, UploadFile } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { UploadChangeParam } from 'antd/es/upload';
import dayjs from 'dayjs';
import { Dispatch, SetStateAction, useState } from 'react';
import { toast } from 'react-toastify';

export interface IAddReportForRenter {
    type: string;
    priority: string;
    title: string;
    description: string;
    proposed: string;
    resolvedAt: string;
    compensation: number;
    evidences: UploadChangeParam<UploadFile<any>>;
}

const AddReport = ({
    contractId,
    setReports,
    onCancel,
}: {
    contractId: string;
    setReports: Dispatch<SetStateAction<IReport[]>>;
    onCancel: () => void;
}) => {
    const [form] = useForm<IAddReportForRenter>();
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [loading, setLoading] = useState(false);

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
            formData.append('type', value.type);
            formData.append('priority', value.priority);
            formData.append('title', value.title);
            formData.append('description', value.description);
            formData.append('proposed', value.proposed);
            formData.append('resolvedAt', dayjs(value.resolvedAt).format('DD/MM/YYYY'));
            formData.append('compensation', String(value.compensation || 0));
            formData.append('contractId', contractId);

            const res = await createReportByRenter(formData);

            toast.success('Gửi báo cáo thành công');
            onCancel();
            setReports((prev) => [res, ...prev]);
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

    return (
        <Form layout="vertical" onFinish={handleAddReport} form={form}>
            <Row gutter={[12, 12]}>
                <Col span={12}>
                    <Form.Item
                        name="type"
                        label="Loại báo cáo"
                        rules={[{ required: true, message: 'Chọn loại báo cáo' }]}
                    >
                        <Select options={typeReportOptions} placeholder="Chọn loại báo cáo" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="priority" label="Mức độ" rules={[{ required: true, message: 'Chọn mức độ' }]}>
                        <Select options={priorityReportOptions} placeholder="Chọn mức độ" />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Nhập tiêu đề' }]}>
                        <Input placeholder="Tóm tắt vấn đề" />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="description"
                        label="Mô tả chi tiết"
                        rules={[{ required: true, message: 'Nhập mô tả chi tiết' }]}
                    >
                        <Input.TextArea placeholder="Mô tả chi tiết về sự cố hoặc vi phạm..." />
                    </Form.Item>
                </Col>
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
                            {form.getFieldValue('evidences')?.length >= 5 ? null : uploadButton}
                        </Upload>
                    </Form.Item>
                </Col>
            </Row>
            <Flex justify="flex-end" gap={12}>
                <Button onClick={onCancel}>Hủy</Button>
                <Button loading={loading} htmlType="submit" type="primary">
                    Gửi báo cáo
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
    );
};

const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Đăng tải</div>
    </button>
);

export default AddReport;
