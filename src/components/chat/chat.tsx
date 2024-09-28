'use client';

import Body from '@/components/chat/body';
import ChatEmpty from '@/components/chat/chat-empty';
import Footer from '@/components/chat/footer';
import Header from '@/components/chat/header';
import { getOtherUser } from '@/lib/utils';
import { useConversationStore } from '@/stores/conversation-store';
import { useUserStore } from '@/stores/user-store';
import { Divider, Flex } from 'antd';

const Chat = () => {
    const { user } = useUserStore();
    const { selectedConversation } = useConversationStore();

    if (!selectedConversation) return <ChatEmpty />;
    const otherUser = getOtherUser(selectedConversation.participants, user?.userId!);

    return (
        <Flex
            vertical
            style={{
                height: '100%',
            }}
        >
            <Header user={otherUser!} />
            <Divider
                style={{
                    marginBlock: '0px 8px',
                }}
            />
            <Body />
            <Divider
                style={{
                    marginBlock: '8px 0px',
                }}
            />
            <Footer />
        </Flex>
    );
};

export default Chat;
