import { ChatStatus, IConversation } from '@/interfaces/chat';
import { IReadConversationSocket } from '@/interfaces/conversation';
import { IPageInfo } from '@/interfaces/pagination';
import { ITable } from '@/interfaces/table';
import { combineConversations } from '@/lib/utils';
import { create } from 'zustand';

export interface IConversationStore {
    loading: boolean;
    isFirstLoad: boolean;
    conversations: Array<IConversation>;
    selectedConversation: IConversation | null;
    pageInfo: IPageInfo;
    unreadCount: number;
    addConversation: (conversation: IConversation) => void;
    addConversations: (conversations: ITable<IConversation>) => void;
    setSelectedConversation: (conversation: IConversation) => void;
    setLoading: (loading: boolean) => void;
    readConversation: (data: IReadConversationSocket) => void;
}

const useConversationStore = create<IConversationStore>((set) => ({
    unreadCount: 0,
    conversations: [],
    selectedConversation: null,
    pageInfo: {
        current: 0,
        pageSize: 10,
        total: 0,
    },
    isFirstLoad: true,
    loading: false,
    addConversation: (conversation) =>
        set((prev) => {
            const newConversations = combineConversations([conversation], prev.conversations);
            const selectedConversation = prev.selectedConversation
                ? newConversations.find((c) => c.conversationId === prev.selectedConversation?.conversationId)
                : null;

            return {
                conversations: newConversations,
                selectedConversation,
                unreadCount: prev.unreadCount + conversation.unreadCount,
            };
        }),
    addConversations: (conversations: ITable<IConversation>) =>
        set((prev) => {
            const newConversations = combineConversations(prev.conversations, conversations.data);
            const selectedConversation = prev.selectedConversation
                ? newConversations.find((c) => c.conversationId === prev.selectedConversation?.conversationId)
                : null;

            const unreadCount = newConversations.reduce((acc, conversation) => acc + conversation.unreadCount, 0);

            return {
                conversations: newConversations,
                pageInfo: conversations.pageInfo,
                isFirstLoad: false,
                selectedConversation,
                unreadCount,
            };
        }),
    setSelectedConversation: (conversation) =>
        set((prev) => {
            const newConversations = prev.conversations.map((c) => {
                if (c.conversationId === conversation.conversationId) {
                    return {
                        ...c,
                        unreadCount: 0,
                    };
                }

                return c;
            });

            return {
                selectedConversation: {
                    ...conversation,
                    unreadCount: 0,
                },
                unreadCount: prev.unreadCount - conversation.unreadCount,
                conversations: newConversations,
            };
        }),
    setLoading: (loading) => set({ loading }),
    readConversation: ({ chatId, conversationId }) =>
        set((prev) => {
            const newConversations = prev.conversations.map((oldConversation) => {
                const conversation = { ...oldConversation };

                if (conversation.conversationId === conversationId) {
                    let index = Infinity;

                    const newChats = conversation.chats.map((chat, i) => {
                        if (chat.chatId === chatId) index = i;
                        if (i <= index) {
                            return {
                                ...chat,
                                status: 'READ' as ChatStatus,
                            };
                        }

                        return chat;
                    });

                    return {
                        ...conversation,
                        chats: newChats,
                    };
                }

                return conversation;
            });

            return {
                conversations: newConversations,
                selectedConversation:
                    newConversations.find((c) => c.conversationId === prev.selectedConversation?.conversationId) ??
                    null,
            };
        }),
}));

export { useConversationStore };
