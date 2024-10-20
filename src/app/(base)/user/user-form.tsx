'use client';

import { IUser } from '@/interfaces/user';
import { EntryError } from '@/lib/error';
import { updateMyInfo } from '@/services/user-service';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Form, GetProp, message, Row, Upload, UploadProps } from 'antd';
import { useForm } from 'antd/es/form/Form';
import Input from 'antd/es/input/Input';
import { UploadChangeParam, UploadFile } from 'antd/es/upload';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface IUpdateUser {
    name: string;
    phoneNumber: string;
    avatar: UploadChangeParam<UploadFile<any>>;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('Chỉ hỗ trợ định dạng ảnh JPG/PNG!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
        message.error('Kích thước ảnh phải nhỏ hơn 5MB!');
    }
    return isJpgOrPng && isLt5M;
};

const UserForm = ({ user }: { user: IUser }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>(user.avatar || '');
    const [form] = useForm<IUpdateUser>();

    const handleChange: UploadProps['onChange'] = (info) => {
        if (info.file.status === 'uploading') setImageUrl(URL.createObjectURL(info.file.originFileObj as Blob));
    };

    const handleFinish = async (values: IUpdateUser) => {
        setLoading(true);

        try {
            const formData = new FormData();

            formData.append('name', values.name);
            formData.append('phoneNumber', values.phoneNumber);
            if (values.avatar?.fileList?.[0]?.originFileObj)
                formData.append('avatar', values.avatar?.fileList?.[0]?.originFileObj);

            await updateMyInfo(formData);

            toast.success('Cập nhật thông tin thành công');
            router.refresh();
        } catch (error) {
            if (error instanceof EntryError) {
                form.setFields(
                    error.details.map((err) => ({ name: err.field as keyof IUpdateUser, errors: [err.error] })),
                );
            } else if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Đã xảy ra lỗi');
            }
        } finally {
            setLoading(false);
        }
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    useEffect(() => {
        form.setFieldsValue({
            name: user.name,
            phoneNumber: user.phoneNumber || '',
        });
    }, [form, user.name, user.phoneNumber]);

    return (
        <div className="mt-6">
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                    name="avatar"
                >
                    <Upload
                        name="avatar"
                        listType="picture-circle"
                        className="avatar-uploader"
                        showUploadList={false}
                        accept="image/*"
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                    >
                        {imageUrl ? (
                            <Image
                                alt="Ảnh đại diện"
                                src={imageUrl}
                                width={100}
                                height={100}
                                className="w-[100px] aspect-square object-cover rounded-full"
                            />
                        ) : (
                            uploadButton
                        )}
                    </Upload>
                </Form.Item>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: 'Họ và tên không được để trống',
                                },
                            ]}
                            initialValue={user.name}
                            name="name"
                            label="Họ và tên"
                        >
                            <Input disabled={user.isVerified} placeholder="Nhập họ và tên" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                            initialValue={user.email}
                            name="email"
                            label="Email"
                        >
                            <Input disabled placeholder="Nhập email" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            rules={[
                                {
                                    type: 'regexp',
                                    validator(_rule, value, _callback) {
                                        if (!value) {
                                            return Promise.resolve();
                                        }

                                        // 10 digits long
                                        if (!/^0\d{9}$/.test(value))
                                            return Promise.reject(
                                                'Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0',
                                            );

                                        return Promise.resolve();
                                    },
                                },
                            ]}
                            initialValue={user.phoneNumber}
                            name="phoneNumber"
                            label="Số điện thoại"
                        >
                            <Input type="tel" placeholder="Nhập số điện thoại" />
                        </Form.Item>
                    </Col>
                </Row>
                <Flex justify="center">
                    <Button loading={loading} htmlType="submit" type="primary">
                        Lưu thay đổi
                    </Button>
                </Flex>
            </Form>
        </div>
    );
};

export default UserForm;
