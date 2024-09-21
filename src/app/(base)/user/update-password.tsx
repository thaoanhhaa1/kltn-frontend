'use client';

import { EntryError } from '@/lib/error';
import { UpdatePasswordInput } from '@/schemas/user.schema';
import { updatePassword } from '@/services/user-service';
import { Button, Col, Flex, Form, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import Input from 'antd/es/input/Input';
import { useState } from 'react';
import { toast } from 'react-toastify';

const UpdatePassword = () => {
    const [loading, setLoading] = useState(false);
    const [form] = useForm<UpdatePasswordInput>();

    const handleFinish = async (values: UpdatePasswordInput) => {
        setLoading(true);

        try {
            await updatePassword(values);

            toast.success('Cập nhật mật khẩu thành công');
        } catch (error) {
            if (error instanceof EntryError) {
                form.setFields(
                    error.details.map((err) => ({ name: err.field as keyof UpdatePasswordInput, errors: [err.error] })),
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

    return (
        <div className="mt-6">
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            rules={[
                                {
                                    validator(_rule, value, _callback) {
                                        if (!value) return Promise.reject('Mật khẩu không được để trống');

                                        if (value.len < 6) return Promise.reject('Mật khẩu phải có ít nhất 6 ký tự');

                                        if (!/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(value))
                                            return Promise.reject('Mật khẩu phải chứa ít nhất một chữ cái, một số');

                                        return Promise.resolve();
                                    },
                                },
                            ]}
                            name="oldPassword"
                            label="Mật khẩu hiện tại"
                        >
                            <Input type="password" placeholder="Nhập mật khẩu" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            rules={[
                                {
                                    validator(_rule, value, _callback) {
                                        if (!value) return Promise.reject('Mật khẩu không được để trống');

                                        if (value.len < 6) return Promise.reject('Mật khẩu phải có ít nhất 6 ký tự');

                                        if (!/^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(value))
                                            return Promise.reject('Mật khẩu phải chứa ít nhất một chữ cái, một số');

                                        return Promise.resolve();
                                    },
                                },
                            ]}
                            name="password"
                            label="Mật khẩu mới"
                        >
                            <Input type="password" placeholder="Nhập mật khẩu" />
                        </Form.Item>
                    </Col>
                </Row>
                <Flex justify="center">
                    <Button loading={loading} htmlType="submit" type="primary">
                        Cập nhật mật khẩu
                    </Button>
                </Flex>
            </Form>
        </div>
    );
};

export default UpdatePassword;
