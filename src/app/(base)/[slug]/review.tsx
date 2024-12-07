'use client';

import Review from '@/components/review/review';
import { IReview } from '@/interfaces/review';
import { getReviewsBySlug } from '@/services/review-service';
import { Empty } from 'antd';
import { useEffect, useState } from 'react';

const ReviewProperty = ({ slug, propertyId, ownerId }: { slug: string; ownerId: string; propertyId: string }) => {
    const [reviews, setReviews] = useState<IReview[]>([]);

    useEffect(() => {
        getReviewsBySlug(slug).then((data) => {
            setReviews(data);
        });
    }, [slug]);

    return (
        <div>
            {reviews?.length === 0 && <Empty description="Chưa có đánh giá" />}
            {reviews?.map((review) => (
                <Review key={review.id} review={review} ownerId={ownerId} propertyId={propertyId} />
            ))}
        </div>
    );
};

export default ReviewProperty;
