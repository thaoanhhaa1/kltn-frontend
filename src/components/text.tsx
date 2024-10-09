'use client';

import { Typography } from 'antd';
import { TextProps } from 'antd/es/typography/Text';

const Text = (props: TextProps) => {
    return <Typography.Text {...props} />;
};

export default Text;
