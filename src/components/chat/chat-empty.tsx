import { Empty, Flex } from 'antd';

const ChatEmpty = () => {
    return (
        <Flex
            align="center"
            justify="center"
            style={{
                height: '100%',
            }}
        >
            <Empty description={false} />
        </Flex>
    );
};

export default ChatEmpty;
