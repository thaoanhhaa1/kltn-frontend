'use client';

import { Typography } from 'antd';
import { ParagraphProps } from 'antd/es/typography/Paragraph';

const Paragraph = (props: ParagraphProps) => {
    return <Typography.Paragraph {...props} />;
};

export default Paragraph;
