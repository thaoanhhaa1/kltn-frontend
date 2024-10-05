'use client';

import { Typography } from 'antd';
import { TitleProps } from 'antd/es/typography/Title';
import { ReactNode } from 'react';

const Title = ({ level, children }: { level?: TitleProps['level']; children: ReactNode }) => {
    return (
        <Typography.Title
            style={{
                margin: 0,
            }}
            level={level}
        >
            {children}
        </Typography.Title>
    );
};

export default Title;
