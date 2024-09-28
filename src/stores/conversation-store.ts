import { IConversation } from '@/interfaces/chat';
import { IPageInfo } from '@/interfaces/pagination';
import { ITable } from '@/interfaces/table';
import { combineConversations } from '@/lib/utils';
import { create } from 'zustand';

export interface IConversationStore {
    conversations: Array<IConversation>;
    selectedConversation: IConversation | null;
    pageInfo: IPageInfo;
    addConversation: (conversation: IConversation) => void;
    addConversations: (conversations: ITable<IConversation>) => void;
    setSelectedConversation: (conversation: IConversation) => void;
}

const useConversationStore = create<IConversationStore>((set) => ({
    conversations: [],
    selectedConversation: null,
    pageInfo: {
        current: 0,
        pageSize: 10,
        total: 0,
    },
    addConversation: (conversation) =>
        set((prev) => ({ conversations: combineConversations([conversation], prev.conversations) })),
    addConversations: (conversations: ITable<IConversation>) =>
        set((prev) => ({
            conversations: combineConversations(prev.conversations, conversations.data),
            pageInfo: conversations.pageInfo,
        })),
    setSelectedConversation: (conversation) => set({ selectedConversation: conversation }),
}));

export { useConversationStore };
