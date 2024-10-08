import { IMediaType } from '@/interfaces/chat';
import { IBaseUserEmbed } from '@/interfaces/user';

export interface IConversationSocket {
    chatId: string;
    conversationId: string;
    createdAt: string;
    medias: Array<IMediaType>;
    message: string;
    receiver: IBaseUserEmbed;
    sender: IBaseUserEmbed;
}
