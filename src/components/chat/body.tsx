import ChatEmpty from '@/components/chat/chat-empty';
import ChatItem from '@/components/chat/chat-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getChatsService } from '@/services/chat-service';
import { useChatStore } from '@/stores/chat-store';
import { useConversationStore } from '@/stores/conversation-store';
import { Flex, Spin } from 'antd';
import { useCallback, useEffect } from 'react';

const Body = () => {
    const { getChats, loading, firstGet, addChats, setLoading } = useChatStore();
    const { selectedConversation } = useConversationStore();
    const chats = selectedConversation?.receiver ? getChats(selectedConversation?.receiver.userId!) : [];

    const fetchChats = useCallback(
        async (nextChat?: string) => {
            setLoading(true);

            try {
                const chats = await getChatsService({
                    receiver: selectedConversation?.receiver.userId!,
                    nextChat,
                });

                addChats(selectedConversation?.receiver.userId!, chats);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        },
        [addChats, selectedConversation?.receiver.userId, setLoading],
    );

    useEffect(() => {
        if (selectedConversation && !firstGet.includes(selectedConversation?.receiver.userId!) && !loading)
            fetchChats();
    }, [fetchChats, firstGet, loading, selectedConversation]);

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
                    <Flex
                        vertical
                        gap={12}
                        style={{
                            flexDirection: 'column-reverse',
                        }}
                    >
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
