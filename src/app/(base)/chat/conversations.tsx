'use client';

import Conversation from '@/app/(base)/chat/conversation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IPagination } from '@/interfaces/pagination';
import { getConversationsService } from '@/services/chat-service';
import { useConversationStore } from '@/stores/conversation-store';
import { Divider, Typography } from 'antd';
import { useCallback, useEffect } from 'react';

const Conversations = () => {
    const { conversations, addConversations } = useConversationStore();

    const fetchConversations = useCallback(
        async (pagination: IPagination) => {
            try {
                const conversations = await getConversationsService(pagination);

                addConversations(conversations);
            } catch (error) {
                console.error(error);
            }
        },
        [addConversations],
    );

    useEffect(() => {
        fetchConversations({
            skip: 0,
            take: 10,
        });
    }, [fetchConversations]);

    return (
        <div className="flex flex-col flex-1 mt-3">
            <Typography.Title
                style={{
                    margin: 0,
                }}
                level={3}
            >
                Trò chuyện
            </Typography.Title>
            <Divider
                style={{
                    marginBlock: '12px',
                }}
            />
            <div className="flex-1 relative">
                <div className="inset-0 absolute">
                    <ScrollArea className="h-full">
                        {conversations.map((conversation) => (
                            <Conversation key={conversation.conversationId} conversation={conversation} />
                        ))}
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
};

export default Conversations;
