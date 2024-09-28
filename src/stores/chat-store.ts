import { IChat } from '@/interfaces/chat';
import { combineChats } from '@/lib/utils';
import { create } from 'zustand';

export interface IChatStore {
    chats: {
        [key: string]: Array<IChat>;
    };
    firstGet: string[];
    loading: boolean;
    getChats: (receiver: string) => Array<IChat>;
    addChat: (receiver: string, chat: IChat) => void;
    addChats: (receiver: string, chats: Array<IChat>) => void;
    setLoading: (loading: boolean) => void;
}

const useChatStore = create<IChatStore>((set, get) => ({
    firstGet: [],
    chats: {},
    loading: false,
    getChats: (receiver) => get().chats[receiver] || [],
    addChat: (receiver, chat) =>
        set((state) => ({
            chats: {
                ...state.chats,
                [receiver]: combineChats([chat], state.chats[receiver] || []),
            },
        })),
    addChats: (receiver, chats) =>
        set((state) => ({
            chats: {
                ...state.chats,
                [receiver]: combineChats(state.chats[receiver] || [], chats),
            },
            firstGet: [...state.firstGet, receiver],
        })),
    setLoading: (loading) => set({ loading }),
}));

export { useChatStore };
