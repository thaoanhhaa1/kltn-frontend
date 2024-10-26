import { IDeleteReview, IReview } from '@/interfaces/review';
import http from '@/lib/http';

const ENDPOINT = '/estate-manager-service/reviews';

export const createReview = (data: FormData) => {
    return http.post<IReview>(`${ENDPOINT}`, data);
};

export const updateReview = (reviewId: string, data: FormData) => {
    return http.put<IReview>(`${ENDPOINT}/${reviewId}`, data);
};

export const deleteReview = ({ reviewId, replyId }: IDeleteReview) => {
    return http.delete(`${ENDPOINT}/${reviewId}`, null, {
        params: { replyId },
    });
};

export const getReviewByContractId = (contractId: string, accessToken: string) => {
    return http.get<IReview | null>(`${ENDPOINT}/contract/${contractId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
};

export const getReviewsBySlug = (slug: string) => {
    return http.get<IReview[]>(`${ENDPOINT}/property/${slug}`);
};
