'use client';

import PropertiesByLocation from '@/components/properties-by-locations/properties-by-location';
import { Col, Row, Typography } from 'antd';

const locations = [
    {
        title: 'Hà Nội',
        src: '/ha-noi-location.webp',
        href: '/ha-noi',
    },
    {
        title: 'Hồ Chí Minh',
        src: '/bat-dong-san-hcm.webp',
        href: '/ho-chi-minh',
    },
    {
        title: 'Đà Nẵng',
        src: '/bat-dong-san-da-nang.webp',
        href: '/da-nang',
    },
    {
        title: 'Cần Thơ',
        src: '/bat-dong-san-can-tho.webp',
        href: '/can-tho',
    },
    {
        title: 'Bà Rịa - Vũng Tàu',
        src: '/bat-dong-san-ba-ria-vung-tau.webp',
        href: '/ba-ria-vung-tau',
    },
    {
        title: 'Bình Dương',
        src: '/bat-dong-san-binh-duong.webp',
        href: '/binh-duong',
    },
    {
        title: 'Đồng Nai',
        src: '/bat-dong-san-dong-nai.webp',
        href: '/dong-nai',
    },
    {
        title: 'Hải Phòng',
        src: '/bat-dong-san-hai-phong.webp',
        href: '/hai-phong',
    },
];

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
