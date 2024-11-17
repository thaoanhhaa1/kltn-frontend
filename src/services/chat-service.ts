import { IChat, IConversation, IGetChat } from '@/interfaces/chat';
import { IChatbot, IChatRequest, IChatResponse } from '@/interfaces/chatbot';
import { IPagination } from '@/interfaces/pagination';
import { ITable } from '@/interfaces/table';
import http from '@/lib/http';

export const chatService = (params: IChatRequest) => {
    return http.post<IChatResponse>('/chat-service/generate', params);
};

export const getAllChatsService = (accessToken: string) => {
    return http.get<Array<IChatbot>>('/chat-service/chats', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

export const getConversationsService = (pagination: IPagination) => {
    return http.get<ITable<IConversation>>('/estate-manager-service/chats/conversation', {
        params: pagination,
    });
};

export const getChatsService = (params: IGetChat) => {
    return http.get<Array<IChat>>('/estate-manager-service/chats', {
        params,
    });
};
