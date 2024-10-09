'use client';

import { IConversation } from '@/interfaces/chat';
import { IConversationSocket, IReadConversationSocket } from '@/interfaces/conversation';
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
    const { selectedConversation, addConversation, readConversation } = useConversationStore();

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
                const isSelected = selectedConversation?.conversationId === data.conversationId;

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
                            status: isSelected ? 'READ' : 'RECEIVED',
                            updatedAt: data.createdAt,
                        },
                    ],
                    deletedBy: [],
                    unreadCount: data.sender.userId === user?.userId || isSelected ? 0 : 1,
                };

                addConversation(conversation);

                if (isSelected && data.sender.userId !== user?.userId)
                    socket?.emit('read-conversation', {
                        conversationId: selectedConversation.conversationId,
                        time: new Date().toISOString(),
                        chatId: data.chatId,
                        userId: receiver?.userId,
                    });
            });

            socket.on('read-conversation', (data: IReadConversationSocket) => {
                readConversation(data);

                console.log('🚀 ~ file: socket.tsx ~ read-conversation', data);
            });
        }

        return () => {
            if (socket) {
                socket.off('connect');
                socket.off('disconnect');
                socket.off('send-message');
                socket.off('read-conversation');
            }
        };
    }, [addChat, addConversation, readConversation, selectedConversation?.conversationId, socket, user?.userId]);

    useEffect(() => {
        if (user && socket) socket.emit('online', user.userId);
    }, [socket, user]);

    return null;
};

export default Socket;
