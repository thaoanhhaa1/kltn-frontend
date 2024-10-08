import ChatEmpty from '@/components/chat/chat-empty';
import ChatItem from '@/components/chat/chat-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useConversationStore } from '@/stores/conversation-store';
import { Flex, Spin } from 'antd';

const Body = () => {
    const { selectedConversation, loading } = useConversationStore();
    const chats = selectedConversation?.chats || [];

    if (!selectedConversation) return null;

    return (
        <div className="flex-1 relative">
            <div className="absolute inset-0">
                <ScrollArea className="h-full">
                    {loading && (
                        <Flex
                            justify="center"
                            style={{
                                padding: '8px 0',
                            }}
                        >
                            <Spin />
                        </Flex>
                    )}
                    <Flex vertical gap={12}>
                        {chats.map((chat) => (
                            <ChatItem chat={chat} key={chat.chatId} />
                        ))}
                    </Flex>
                </ScrollArea>
            </div>
            {!loading && chats.length === 0 && (
                <div className="absolute inset-0 flex justify-center items-center">
                    <ChatEmpty />
                </div>
            )}
        </div>
    );
};

export default Body;
