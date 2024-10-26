import ReviewFooter from '@/components/review/review-footer';
import ReviewList from '@/components/review/review-list';
import { IReview } from '@/interfaces/review';

const Review = ({
    review,
    ownerId,
    contractId,
    propertyId,
}: {
    review: IReview | null;
    ownerId: string;
    contractId: string;
    propertyId: string;
}) => {
    return (
        <div>
            {review && <ReviewList review={review} ownerId={ownerId} />}
            <ReviewFooter ownerId={ownerId} isFirst={!review} contractId={contractId} propertyId={propertyId} />
        </div>
    );
};

export default Review;
