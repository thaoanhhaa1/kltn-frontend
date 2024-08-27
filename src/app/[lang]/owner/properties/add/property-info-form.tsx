import { AddPropertyDictionary } from '@/app/[lang]/dictionaries';
import AttributesForm from '@/app/[lang]/owner/properties/add/attributes-form';
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

const PropertyInfoForm = ({ addPropertyDict }: { addPropertyDict: AddPropertyDictionary }) => {
    const interiorOptions = [
        {
            label: addPropertyDict['fully-furnished'],
            value: addPropertyDict['fully-furnished'],
        },
        {
            label: addPropertyDict['partly-furnished'],
            value: addPropertyDict['partly-furnished'],
        },
        {
            label: addPropertyDict['unfurnished'],
            value: addPropertyDict['unfurnished'],
        },
    ];

    return (
        <Row gutter={12}>
            <Col span={8}>
                <Form.Item
                    label={addPropertyDict.acreage}
                    name="acreage"
                    rules={[{ required: true, message: addPropertyDict['acreage-required'] }]}
                >
                    <InputNumber
                        addonAfter="m2"
                        {...inputNumberProps}
                        max={10000}
                        placeholder={addPropertyDict['acreage-placeholder']}
                    />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label={addPropertyDict.prices}
                    name="price"
                    rules={[{ required: true, message: addPropertyDict['prices-required'] }]}
                >
                    <InputNumber
                        addonAfter="VND"
                        {...inputNumberProps}
                        max={1000000000000}
                        placeholder={addPropertyDict['prices-placeholder']}
                    />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label={addPropertyDict.interior}
                    name="interior"
                    rules={[{ required: true, message: addPropertyDict['interior-required'] }]}
                >
                    <Select options={interiorOptions} placeholder={addPropertyDict['interior-placeholder']} />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item label={addPropertyDict.bedrooms} name="bedroom">
                    <InputNumber {...inputNumberProps} placeholder={addPropertyDict['bedrooms-placeholder']} />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item label={addPropertyDict.bathrooms} name="bathroom">
                    <InputNumber {...inputNumberProps} placeholder={addPropertyDict['bathrooms-placeholder']} />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item label={addPropertyDict.floors} name="floor">
                    <InputNumber {...inputNumberProps} placeholder={addPropertyDict['floors-placeholder']} />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item label={addPropertyDict.deposit} name="deposit">
                    <InputNumber
                        addonAfter="VND"
                        {...inputNumberProps}
                        max={1000000000000}
                        placeholder={addPropertyDict['deposit-placeholder']}
                    />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item label={addPropertyDict['min-duration']} name="min_duration">
                    <InputNumber
                        addonAfter={addPropertyDict.months}
                        {...inputNumberProps}
                        max={100}
                        placeholder={addPropertyDict['min-duration-placeholder']}
                    />
                </Form.Item>
            </Col>
            <AttributesForm label={addPropertyDict.amenity} placeholder={addPropertyDict['amenity-placeholder']} />
        </Row>
    );
};

export default PropertyInfoForm;
