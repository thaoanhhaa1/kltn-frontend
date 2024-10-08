'use client';

import Conversation from '@/app/(base)/chat/conversation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getConversationsByUserServices } from '@/services/conversation-service';
import { useConversationStore } from '@/stores/conversation-store';
import { useUserStore } from '@/stores/user-store';
import { Divider, Typography } from 'antd';
import { useCallback, useEffect } from 'react';

const Conversations = () => {
    const { user } = useUserStore();
    const { conversations, isFirstLoad, addConversations, setLoading } = useConversationStore();

    const fetchConversations = useCallback(async () => {
        setLoading(true);

        try {
            const conversations = await getConversationsByUserServices(user?.userId!);

            addConversations(conversations);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [addConversations, setLoading, user?.userId]);

    useEffect(() => {
        if (isFirstLoad) fetchConversations();
    }, [fetchConversations, isFirstLoad]);

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
