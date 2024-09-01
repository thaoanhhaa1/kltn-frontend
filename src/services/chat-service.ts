import { IChatRequest, IChatResponse } from '@/interfaces/chat';
import http from '@/lib/http';

export const chatService = (params: IChatRequest) => {
    return http.post<IChatResponse>('/chat-service/generate', params);
};
