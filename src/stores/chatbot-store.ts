import { IChatResponse } from '@/interfaces/chatbot';
import { create } from 'zustand';

export interface IChatStore {
    chats: IChatResponse[];
    chat: string;
    loading: boolean;
    addChat: (chat: IChatResponse) => void;
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
}));

export { useChatStore };
