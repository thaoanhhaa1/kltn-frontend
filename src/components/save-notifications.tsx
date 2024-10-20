'use client';

import { IConversation } from '@/interfaces/chat';
import { ITable } from '@/interfaces/table';
import { IUser } from '@/interfaces/user';
import { useConversationStore } from '@/stores/conversation-store';
import { useEffect } from 'react';

const SaveConversations = ({ conversations, user }: { conversations: ITable<IConversation>; user?: IUser }) => {
    const { addConversations } = useConversationStore();

    useEffect(() => {
        if (!user) return;

        const newConversations = conversations.data.map((conversation) => {
            const chatCount = conversation.chats.length;
            let unreadCount = 0;

            for (let i = chatCount - 1; i >= 0; i--) {
                const chat = conversation.chats[i];

                if (chat.senderId !== user.userId && chat.status === 'RECEIVED') unreadCount++;
                else break;
            }

            return { ...conversation, unreadCount };
        });

        addConversations({ ...conversations, data: newConversations });
    }, [addConversations, conversations, conversations.data, user]);

    return null;
};

export default SaveConversations;
