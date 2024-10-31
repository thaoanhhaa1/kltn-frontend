'use client';

import Conversation from '@/app/(base)/chat/conversation';
import ConversationSkeleton from '@/app/(base)/chat/conversation-skeleton';
import SkeletonRender from '@/components/skeleton-render';
import { ScrollArea } from '@/components/ui/scroll-area';
import useDebounce from '@/hooks/useDebounce';
import { useConversationStore } from '@/stores/conversation-store';
import { useUserStore } from '@/stores/user-store';
import { Divider, Empty, Input, Typography } from 'antd';
import { useMemo, useState } from 'react';

const Conversations = () => {
    const { user } = useUserStore();
    const { conversations, isFirstLoad, loading, addConversations, setLoading } = useConversationStore();
    const [value, setValue] = useState('');
    const valueDebounce = useDebounce(value, 500);

    const conversationsFiltered = useMemo(() => {
        if (!valueDebounce) return conversations;

        return conversations.filter((conversation) =>
            conversation.participants.some(
                (participant) =>
                    participant.name.toLowerCase().includes(valueDebounce.toLowerCase()) &&
                    participant.userId !== user?.userId!,
            ),
        );
    }, [conversations, user?.userId, valueDebounce]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    return (
        <div className="flex flex-col flex-1 mt-3 gap-3">
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
                    margin: 0,
                }}
            />

            <Input allowClear value={value} onChange={handleChange} placeholder="Tìm kiếm cuộc trò chuyện..." />

            <div className="flex-1 relative">
                <div className="inset-0 absolute">
                    <ScrollArea className="h-full">
                        {loading && <SkeletonRender vertical controller={ConversationSkeleton} />}
                        {conversationsFiltered.map((conversation) => (
                            <Conversation key={conversation.conversationId} conversation={conversation} />
                        ))}
                        {!loading && conversationsFiltered.length === 0 && (
                            <Empty description="Không có cuộc trò chuyện nào" />
                        )}
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
};

export default Conversations;
