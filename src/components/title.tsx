'use client';

import { Typography } from 'antd';
import { TitleProps } from 'antd/es/typography/Title';

const Title = (props: TitleProps) => {
    return (
        <Typography.Title
            {...props}
            style={{
                margin: 0,
                ...props.style,
            }}
        />
    );
};

export default Title;
