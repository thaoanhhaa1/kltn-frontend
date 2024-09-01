'use client';

import { envConfig } from '@/config/envConfig';
import { Typography } from 'antd';

const Banner = () => {
    return (
        <div>
            <Typography.Title level={2}>Chào mừng bạn đến với {envConfig.NEXT_PUBLIC_WEB_NAME}!</Typography.Title>
            <Typography.Paragraph>
                {envConfig.NEXT_PUBLIC_WEB_NAME} là nơi cung cấp thông tin về các căn hộ cho thuê và nhiều hơn nữa.
            </Typography.Paragraph>
        </div>
    );
};

export default Banner;
