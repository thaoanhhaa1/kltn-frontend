import { IBaseUserEmbed, IUser } from '@/interfaces/user';

export interface IMediaType {
    key: string;
    name: string;
    url: string;
    type: string;
}

export interface IChatEmbed {
    sender: IBaseUserEmbed;
    message: string;
    medias: Array<IMediaType>;
    status: ChatStatus;
}

export interface IConversation {
    conversationId: string;
    deletedBy: Array<string>;
    createdAt: string;
    updatedAt: string;
    participants: Array<IBaseUserEmbed>;
    receiver: IBaseUserEmbed;
    chats: Array<IChat>;
    unreadCount: number;
}

export interface IChat {
    chatId: string;
    medias: Array<IMediaType>;
    message: string;
    createdAt: string;
    senderId: IUser['userId'];
    savedBy: Array<string>;
    deletedBy: Array<string>;
    status: ChatStatus;
    updatedAt: string;
}

export interface IGetChat {
    receiver: string;
    nextChat?: string;
}

export type ChatStatus = 'RECEIVED' | 'READ' | 'DELETED' | 'RECALL';
