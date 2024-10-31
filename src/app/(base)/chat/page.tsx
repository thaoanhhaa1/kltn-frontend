import Conversations from '@/app/(base)/chat/conversations';
import Chat from '@/components/chat/chat';
import { Col, Divider, Flex, Row } from 'antd';

const hFullStyle = {
    height: '100%',
};

const ChatPage = () => {
    return (
        <div className="h-[calc(100vh-4rem)]">
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
        </div>
    );
};

export default ChatPage;
