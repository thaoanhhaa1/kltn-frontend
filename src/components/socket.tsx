'use client';

import { IConversation } from '@/interfaces/chat';
import { IConversationSocket } from '@/interfaces/conversation';
import { getOtherUser } from '@/lib/utils';
import { useChatStore } from '@/stores/chat-store';
import { useConversationStore } from '@/stores/conversation-store';
import { useSocketStore } from '@/stores/socket-store';
import { useUserStore } from '@/stores/user-store';
import { useEffect } from 'react';

const Socket = () => {
    const { user } = useUserStore();
    const { socket, disconnect, connect } = useSocketStore();
    const { addChat } = useChatStore();
    const { addConversation } = useConversationStore();

    useEffect(() => {
        if (user) connect();
        else disconnect();
    }, [connect, disconnect, user]);

    useEffect(() => {
        if (socket) {
            socket.on('connect', () => {
                console.log('connected');
            });

            socket.on('disconnect', () => {
                console.log('disconnected');
            });

            socket.on('send-message', (data: IConversationSocket) => {
                console.log('🚀 ~ file: socket.tsx ~ line 47 ~ socket.on ~ data', data);
                const participants = [data.sender, data.receiver];
                const receiver = getOtherUser(participants, user?.userId || '')!;

                const conversation: IConversation = {
                    conversationId: data.conversationId,
                    createdAt: data.createdAt,
                    updatedAt: data.createdAt,
                    participants,
                    receiver,
                    chats: [
                        {
                            chatId: data.chatId,
                            createdAt: data.createdAt,
                            deletedBy: [],
                            medias: data.medias,
                            message: data.message,
                            savedBy: [],
                            senderId: data.sender.userId,
                            status: 'RECEIVED',
                            updatedAt: data.createdAt,
                        },
                    ],
                    deletedBy: [],
                    unreadCount: data.sender.userId === user?.userId ? 0 : 1,
                };

                addConversation(conversation);
            });
        }

        return () => {
            if (socket) {
                socket.off('connect');
                socket.off('disconnect');
                socket.off('send-message');
            }
        };
    }, [addChat, addConversation, socket, user?.userId]);

    useEffect(() => {
        if (user && socket) socket.emit('online', user.userId);
    }, [socket, user]);

    return null;
};

export default Socket;
