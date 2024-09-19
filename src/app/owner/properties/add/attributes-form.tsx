'use client';

import { IAttributeCbb } from '@/interfaces/attribute';
import { getAllAttributesCbb } from '@/services/attribute-service';
import { Col, Form, Select } from 'antd';
import { useEffect, useState } from 'react';

const fieldNames = {
    label: 'name',
    value: 'id',
};

const AttributesForm = ({ label, placeholder }: { label: string; placeholder: string }) => {
    const [attributes, setAttributes] = useState<IAttributeCbb[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchAttributes = async () => {
            setLoading(true);
            const data = await getAllAttributesCbb();
            setAttributes(data);
            setLoading(false);
        };

        fetchAttributes();
    }, []);

    return (
        <Col span={8}>
            <Form.Item label={label} name="attributeIds">
                <Select
                    mode="multiple"
                    fieldNames={fieldNames}
                    loading={loading}
                    options={attributes}
                    placeholder={placeholder}
                />
            </Form.Item>
        </Col>
    );
};

export default AttributesForm;
