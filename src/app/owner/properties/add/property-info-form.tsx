'use client';

import AttributesForm from '@/app/owner/properties/add/attributes-form';
import PriceInput from '@/components/input/price-input';
import { interiorOptions } from '@/constants/init-data';
import { IPropertyType } from '@/interfaces/propertyType';
import { getPropertyTypes } from '@/services/property-type';
import { Col, Form, InputNumber, Row, Select } from 'antd';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

const inputNumberProps = {
    style: {
        width: '100%',
    },
    controls: true,
    min: 0,
    max: 10,
    precision: 0,
};

const PropertyInfoForm = ({ setType }: { setType: Dispatch<SetStateAction<IPropertyType | undefined>> }) => {
    const [typeOptions, setTypeOptions] = useState<IPropertyType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const handleChangeType = (_value: string, option: IPropertyType | IPropertyType[]) => {
        const type = Array.isArray(option) ? option[0] : option;
        setType({
            id: type.id,
            name: type.name,
        });
    };

    useEffect(() => {
        const fetchPropertyTypes = async () => {
            setLoading(true);

            try {
                const data = await getPropertyTypes();
                setTypeOptions(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchPropertyTypes();
    }, []);

    return (
        <Row gutter={12}>
            <Col span={8}>
                <Form.Item label="Loại nhà" name="type" rules={[{ required: true, message: 'Vui lòng chọn loại nhà' }]}>
                    <Select
                        loading={loading}
                        options={typeOptions}
                        fieldNames={{
                            label: 'name',
                            value: 'id',
                        }}
                        optionFilterProp="name"
                        placeholder="Chọn loại nhà"
                        onChange={handleChangeType}
                        showSearch
                    />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label="Diện tích"
                    name="acreage"
                    rules={[{ required: true, message: 'Vui lòng nhập diện tích' }]}
                >
                    <InputNumber
                        addonAfter="m2"
                        {...inputNumberProps}
                        min={1}
                        max={10000}
                        placeholder="Nhập diện tích"
                    />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label="Diện tích quyền sử dụng đất"
                    name="landArea"
                    rules={[{ required: true, message: 'Vui lòng nhập diện tích' }]}
                >
                    <InputNumber
                        addonAfter="m2"
                        {...inputNumberProps}
                        min={1}
                        max={10000}
                        placeholder="Nhập diện tích"
                    />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item label="Số tầng" name="floor" rules={[{ required: true, message: 'Vui lòng nhập số tầng' }]}>
                    <InputNumber {...inputNumberProps} min={1} placeholder="Nhập số tầng" />
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
                <Form.Item label="Giá" name="price" rules={[{ required: true, message: 'Vui lòng nhập giá' }]}>
                    <PriceInput placeholder="Nhập giá" />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item label="Tiền cọc" name="deposit">
                    <PriceInput placeholder="Nhập tiền cọc" />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item label="Phòng ngủ" name="bedroom">
                    <InputNumber {...inputNumberProps} max={50} placeholder="Nhập số phòng ngủ" />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item label="Phòng tắm, vệ sinh" name="bathroom">
                    <InputNumber {...inputNumberProps} max={50} placeholder="Nhập số phòng tắm, vệ sinh" />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item label="Thời gian thuê tối thiểu" name="minDuration">
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
