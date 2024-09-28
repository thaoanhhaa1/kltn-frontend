import { IBaseUserEmbed } from '@/interfaces/user';

export interface IMediaType {
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
    participants: Array<IBaseUserEmbed>;
    receiver: IBaseUserEmbed;
    lastChat?: IChatEmbed;
    conversationId: string;
    deletedBy: Array<string>;
    createdAt: string;
    updatedAt: string;
}

export interface IChat {
    sender: IBaseUserEmbed;
    receiver: IBaseUserEmbed;
    chatId: string;
    conversation: string;
    message: string;
    medias: Array<IMediaType>;
    savedBy: Array<string>;
    deletedBy: Array<string>;
    status: ChatStatus;
    createdAt: string;
    updatedAt: string;
}

export interface IGetChat {
    receiver: string;
    nextChat?: string;
}

export type ChatStatus = 'RECEIVED' | 'READ' | 'DELETED' | 'RECALL';
