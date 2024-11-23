import { IProperty } from '@/interfaces/property';

export interface IChatRequest {
    query: string;
}

export interface IChatbot {
    _id: string;
    query: string;
    result: string;
    source_documents: Array<IProperty>;
}

export interface IChatResponse {
    response: IChatbot;
}
