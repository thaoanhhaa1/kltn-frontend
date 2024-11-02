import Title from '@/components/title';
import { Flex } from 'antd';
import { ReactNode } from 'react';

const Item = ({ children, title }: { title: string; children: ReactNode }) => {
    return (
        <Flex
            vertical
            gap={16}
            style={{
                height: '100%',
            }}
        >
            <Title level={2}>{title}</Title>
            {children}
        </Flex>
    );
};

export default Item;
