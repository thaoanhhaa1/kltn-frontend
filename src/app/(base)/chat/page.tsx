import Conversations from '@/app/(base)/chat/conversations';
import Chat from '@/components/chat/chat';
import { Col, Divider, Flex, Row } from 'antd';

const hFullStyle = {
    height: '100%',
};

const ChatPage = () => {
    return (
        <Row style={hFullStyle}>
            <Col span={8}>
                <Flex style={hFullStyle}>
                    <Conversations />
                    <Divider style={hFullStyle} type="vertical" />
                </Flex>
            </Col>
            <Col span={16}>
                <Chat />
            </Col>
        </Row>
    );
};

export default ChatPage;
