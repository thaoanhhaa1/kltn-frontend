'use client';

import { IProperty } from '@/interfaces/property';
import { Col, Row, Typography } from 'antd';
import Markdown from 'react-markdown';

const DetailInfo = ({ property }: { property: IProperty }) => {
    return (
        <div className="mt-8 mb-10">
            <Typography.Title level={2}>Thông tin mô tả</Typography.Title>
            <Typography.Paragraph>
                <Markdown>{property.description}</Markdown>
            </Typography.Paragraph>
            <Typography.Title level={2}>Điều kiện</Typography.Title>
            <Row>
                {property.conditions.map((condition) => (
                    <Col span={6} key={condition.condition_type}>
                        <Typography.Text>
                            <span className="font-semibold">{condition.condition_type}</span>:{' '}
                            {condition.condition_value}
                        </Typography.Text>
                    </Col>
                ))}
            </Row>
            <Typography.Title
                style={{
                    marginTop: '36px',
                }}
                level={2}
            >
                Tiện ích
            </Typography.Title>
            <Row>
                {property.attributes.map((attribute, index) => (
                    <Col span={6} key={index}>
                        <Typography.Text>{attribute.attribute_name}</Typography.Text>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default DetailInfo;
