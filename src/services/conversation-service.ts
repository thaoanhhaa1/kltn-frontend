import { IConversation } from '@/interfaces/chat';
import { ITable } from '@/interfaces/table';
import http from '@/lib/http';

const ENDPOINT = '/estate-manager-service/conversations';

export const getConversationsByUserServices = async (accessToken: string): Promise<ITable<IConversation>> => {
    return http.get<ITable<IConversation>>(ENDPOINT, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};
