import Title from '@/components/title';
import { Col, Flex } from 'antd';
import { ReactNode } from 'react';

const Item = ({ children, title, span = 24 }: { children: ReactNode; title: string; span?: number }) => {
    return (
        <Col span={span}>
            <Flex vertical gap={8}>
                <Title level={4}>{title}</Title>
                {children}
            </Flex>
        </Col>
    );
};

export default Item;
