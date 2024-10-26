import { IBaseUserEmbed } from '@/interfaces/user';

export interface ICreateReview {
    content: string;
    rating: number;
    contractId: string;
    propertyId: string;
}

export interface IUpdateReview {
    content: string;
    rating: number;
    replyId?: string;
}

export interface IDeleteReview {
    reviewId: string;
    replyId?: string;
}

export interface IReplyReview {
    id: string;
    content: string;
    rating: number;
    medias: string[];
    userId: string;
    deleted: boolean;
    createdAt: string;
}

export interface IReview {
    id: string;
    content: string;
    rating: number;
    medias: string[];
    userId: string;
    deleted: boolean;
    createdAt: string;
    renter: IBaseUserEmbed;
    owner: IBaseUserEmbed;
    children: IReplyReview[];
    contractId: string;
    propertyId: string;
}
