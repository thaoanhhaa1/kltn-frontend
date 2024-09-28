import { IProperty } from '@/interfaces/property';

export interface IChatRequest {
    query: string;
}

export interface IChatResponse {
    response: {
        query: string;
        result: string;
        source_documents: Array<IProperty>;
        slugs: Array<string>;
    };
}
