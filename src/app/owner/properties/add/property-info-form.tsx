import AttributesForm from '@/app/owner/properties/add/attributes-form';
import { Col, Form, InputNumber, Row, Select } from 'antd';

const inputNumberProps = {
    style: {
        width: '100%',
    },
    controls: true,
    min: 0,
    max: 10,
    precision: 0,
};

const PropertyInfoForm = () => {
    const interiorOptions = [
        {
            label: 'Đầy đủ nội thất',
            value: 'Đầy đủ nội thất',
        },
        {
            label: 'Nội thất cơ bản',
            value: 'Nội thất cơ bản',
        },
        {
            label: 'Không nội thất',
            value: 'Không nội thất',
        },
    ];

    return (
        <Row gutter={12}>
            <Col span={8}>
                <Form.Item
                    label="Diện tích"
                    name="acreage"
                    rules={[{ required: true, message: 'Vui lòng nhập diện tích' }]}
                >
                    <InputNumber addonAfter="m2" {...inputNumberProps} max={10000} placeholder="Nhập diện tích" />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item label="Giá" name="price" rules={[{ required: true, message: 'Vui lòng nhập giá' }]}>
                    <InputNumber addonAfter="VND" {...inputNumberProps} max={1000000000000} placeholder="Nhập giá" />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label="Nội thất"
                    name="interior"
                    rules={[{ required: true, message: 'Vui lòng chọn nội thất' }]}
                >
                    <Select options={interiorOptions} placeholder="Chọn nội thất" />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item label="Phòng ngủ" name="bedroom">
                    <InputNumber {...inputNumberProps} placeholder="Nhập số phòng ngủ" />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item label="Phòng tắm, vệ sinh" name="bathroom">
                    <InputNumber {...inputNumberProps} placeholder="Nhập số phòng tắm, vệ sinh" />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item label="Số tầng" name="floor">
                    <InputNumber {...inputNumberProps} placeholder="Nhập số tầng" />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item label="Tiền cọc" name="deposit">
                    <InputNumber
                        addonAfter="VND"
                        {...inputNumberProps}
                        max={1000000000000}
                        placeholder="Nhập tiền cọc"
                    />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item label="Thời gian thuê tối thiểu" name="min_duration">
                    <InputNumber
                        addonAfter="tháng"
                        {...inputNumberProps}
                        max={100}
                        placeholder="Nhập thời gian thuê tối thiểu"
                    />
                </Form.Item>
            </Col>
            <AttributesForm label="Tiện ích" placeholder="Vui lòng chọn tiện ích" />
        </Row>
    );
};

export default PropertyInfoForm;
