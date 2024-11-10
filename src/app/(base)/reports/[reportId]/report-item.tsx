import Text from '@/components/text';
import Title from '@/components/title';
import { Flex } from 'antd';
import { ReactNode } from 'react';

const ReportItem = ({
    description,
    title,
    children,
}: {
    title: string;
    description?: string;
    children?: ReactNode;
}) => {
    return (
        <Flex vertical gap={4}>
            <Title level={5}>{title}</Title>
            {description && <Text>{description}</Text>}
            {children && <div>{children}</div>}
        </Flex>
    );
};

export default ReportItem;
