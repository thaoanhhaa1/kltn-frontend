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
    resetChatbotStore: () => void;
}

const useChatStore = create<IChatStore>((set) => ({
    chats: [],
    chat: '',
    loading: false,
    addChat: (chat: IChatResponse) => set((state) => ({ chats: [...state.chats, chat] })),
    setChat: (chat: string) => set({ chat }),
    setLoading: (loading: boolean) => set({ loading }),
    addChats: (chats: IChatbot[]) =>
        set((state) => {
            console.log(chats);
            if (chats[0]?._id === state.chats[0]?.response._id) return state;

            return { chats: [...[...chats].reverse().map((chat) => ({ response: chat })), ...state.chats] };
        }),
    resetChatbotStore: () => set({ chats: [], chat: '', loading: false }),
}));

export { useChatStore };
