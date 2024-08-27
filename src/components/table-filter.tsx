import { Card } from '@/components/ui/card';
import { Button, Form, Row } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import { ReactNode } from 'react';

const TableFilter = <T,>({
    children,
    form,
    onFinish,
    onReset,
}: {
    children: ReactNode;
    form: FormInstance<T>;
    onFinish: (values: T) => void;
    onReset?: () => void;
}) => {
    const handleReset = () => {
        form.resetFields();
        onReset?.();
    };

    return (
        <Card className="p-4 mb-4">
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={16}>{children}</Row>
                <Row className="gap-2" justify="end">
                    <Button onClick={handleReset} type="default" htmlType="reset">
                        Huỷ
                    </Button>
                    <Button type="primary" htmlType="submit">
                        Tìm kiếm
                    </Button>
                </Row>
            </Form>
        </Card>
    );
};

export default TableFilter;
