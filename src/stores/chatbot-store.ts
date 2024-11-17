import { IChatbot, IChatResponse } from '@/interfaces/chatbot';
import { create } from 'zustand';

export interface IChatStore {
    chats: IChatResponse[];
    chat: string;
    loading: boolean;
    addChat: (chat: IChatResponse) => void;
    addChats: (chats: IChatbot[]) => void;
    setChat: (chat: string) => void;
    setLoading: (loading: boolean) => void;
}

const useChatStore = create<IChatStore>((set) => ({
    chats: [],
    chat: '',
    loading: false,
    addChat: (chat: IChatResponse) => set((state) => ({ chats: [...state.chats, chat] })),
    setChat: (chat: string) => set({ chat }),
    setLoading: (loading: boolean) => set({ loading }),
    addChats: (chats: IChatbot[]) => set(() => ({ chats: chats.map((chat) => ({ response: chat })) })),
}));

export { useChatStore };
