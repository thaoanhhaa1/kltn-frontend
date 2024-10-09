import ChatEmpty from '@/components/chat/chat-empty';
import ChatItem from '@/components/chat/chat-item';
import Text from '@/components/text';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatStatus } from '@/interfaces/chat';
import { getChatStatusText } from '@/lib/utils';
import { useConversationStore } from '@/stores/conversation-store';
import { useUserStore } from '@/stores/user-store';
import { Flex, Spin } from 'antd';
import { Check, CheckCheck } from 'lucide-react';

const isShowChat = ['READ', 'RECEIVED'] as ChatStatus[];

const Body = () => {
    const { user } = useUserStore();
    const { selectedConversation, loading } = useConversationStore();
    const chats = selectedConversation?.chats || [];

    if (!selectedConversation) return null;

    const lastChat = chats.at(-1);

    return (
        <div className="flex-1 relative">
            <div className="absolute inset-0">
                <ScrollArea className="h-full pr-2.5">
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
                    {lastChat && lastChat.senderId === user?.userId && isShowChat.includes(lastChat.status) && (
                        <Flex
                            align="center"
                            gap={2}
                            justify="flex-end"
                            style={{
                                paddingInline: '48px',
                            }}
                        >
                            {lastChat.status === 'RECEIVED' ? (
                                <Check className="w-4 h-4" />
                            ) : (
                                <CheckCheck className="w-4 h-4" />
                            )}
                            <Text>{getChatStatusText(lastChat.status)}</Text>
                        </Flex>
                    )}
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
