import { IProperty } from '@/interfaces/property';

export interface IChatRequest {
    query: string;
}

export interface IChatbot {
    query: string;
    result: string;
    source_documents: Array<IProperty>;
}

export interface IChatResponse {
    response: IChatbot;
}
