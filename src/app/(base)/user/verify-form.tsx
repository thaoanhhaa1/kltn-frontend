'use client';

import { verifyUser } from '@/services/user-service';
import { Button, Col, Flex, Form, Row, UploadProps } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { UploadChangeParam, UploadFile } from 'antd/es/upload';
import Dragger from 'antd/es/upload/Dragger';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

const VerifyForm = () => {
    const router = useRouter();
    const [form] = useForm();
    const [frontPreview, setFrontPreview] = useState<string | undefined>();
    const [backPreview, setBackPreview] = useState<string | undefined>();
    const [loading, setLoading] = useState<boolean>(false);

    const handleFrontChange = (info: UploadChangeParam<UploadFile<any>>) => {
        if (info.file.status === 'done') setFrontPreview(URL.createObjectURL(info.file.originFileObj as Blob));
    };
    const handleBackChange = (info: UploadChangeParam<UploadFile<any>>) => {
        if (info.file.status === 'done') setBackPreview(URL.createObjectURL(info.file.originFileObj as Blob));
    };

    const props: UploadProps = {
        name: 'images',
        maxCount: 1,
        accept: 'image/*',
        listType: 'picture-card',
        showUploadList: false,
        style: {
            aspectRatio: 17 / 11,
        },
        iconRender: () => null,
    };

    const handleFinish = async (values: any) => {
        setLoading(true);

        try {
            const frontImage = values.front.fileList[0].originFileObj;
            const backImage = values.back.fileList[0].originFileObj;

            const formData = new FormData();

            formData.append('front', frontImage);
            formData.append('back', backImage);

            await verifyUser(formData);

            toast.success('Xác thực thành công');
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error('Xác thực thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Form form={form} onFinish={handleFinish} layout="vertical">
                <Row gutter={12}>
                    <Col span={12}>
                        <Form.Item
                            name="front"
                            label="Ảnh mặt trước CCCD"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng tải lên ảnh mặt trước CCCD',
                                },
                            ]}
                        >
                            <Dragger {...props} onChange={handleFrontChange}>
                                <Image
                                    src={frontPreview || '/id-card.png'}
                                    alt=""
                                    width={200}
                                    height={200}
                                    className="w-full aspect-[17/11] object-contain"
                                />
                            </Dragger>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="back"
                            label="Ảnh mặt sau CCCD"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng tải lên ảnh mặt sau CCCD',
                                },
                            ]}
                        >
                            <Dragger {...props} onChange={handleBackChange}>
                                <Image
                                    src={backPreview || '/card.png'}
                                    alt=""
                                    width={200}
                                    height={200}
                                    className="w-full aspect-[17/11] object-contain"
                                />
                            </Dragger>
                        </Form.Item>
                    </Col>
                </Row>
                <Flex justify="center">
                    <Button htmlType="submit" type="primary" loading={loading}>
                        Xác thực
                    </Button>
                </Flex>
            </Form>
        </div>
    );
};

export default VerifyForm;
