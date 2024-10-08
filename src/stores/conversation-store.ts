import { IConversation } from '@/interfaces/chat';
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
}));

export { useConversationStore };
