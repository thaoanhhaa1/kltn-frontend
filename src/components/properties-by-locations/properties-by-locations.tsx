'use client';

import PropertiesByLocation from '@/components/properties-by-locations/properties-by-location';
import { locations } from '@/constants/init-data';
import { Col, Row, Typography } from 'antd';

const PropertiesByLocations = () => {
    return (
        <div className="mt-10">
            <Typography.Title level={4}>Bất động sản theo địa điểm</Typography.Title>
            <Row gutter={32}>
                {locations.map((location, index) => (
                    <Col span={6} key={index}>
                        <PropertiesByLocation {...location} />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default PropertiesByLocations;
