'use client';

import ReviewItem from '@/components/review/review-item';
import { IReview } from '@/interfaces/review';
import { Button, Flex } from 'antd';
import { useEffect, useState } from 'react';

const ReviewList = ({
    review,
    isCollapse = false,
    ownerId,
    contractId,
}: {
    review: IReview;
    isCollapse?: boolean;
    ownerId: string;
    contractId?: string;
}) => {
    const [collapsed, setCollapsed] = useState<boolean>(true);

    useEffect(() => {
        setCollapsed(isCollapse);
    }, [isCollapse]);

    return (
        <Flex
            vertical
            gap={12}
            style={{
                paddingTop: '8px',
            }}
        >
            <ReviewItem
                reviewId={review.id}
                review={review}
                user={review.renter}
                contractId={contractId}
                propertyId={review.propertyId}
                ownerId={ownerId}
            />
            {collapsed ||
                review.children.map((child) => (
                    <ReviewItem
                        key={child.id}
                        reviewId={review.id}
                        review={child}
                        user={child.userId === review.renter.userId ? review.renter : review.owner}
                        contractId={contractId}
                        propertyId={review.propertyId}
                        ownerId={ownerId}
                    />
                ))}
            {review.children.length > 0 && (
                <Button type="link" onClick={() => setCollapsed((prev) => !prev)}>
                    {collapsed ? `Xem thêm ${review.children.length} đánh giá` : 'Thu gọn'}
                </Button>
            )}
        </Flex>
    );
};

export default ReviewList;
