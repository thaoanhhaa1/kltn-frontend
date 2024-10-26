import { HeartFill } from '@/assets/svgs/icons';
import { createPropertyInteraction } from '@/services/property-interaction-service';
import { useFavoriteStore } from '@/stores/favorite-store';
import { useUserStore } from '@/stores/user-store';
import { Button } from 'antd';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const HeartBtn = ({ isFavorite, propertyId }: { propertyId: string; isFavorite?: boolean }) => {
    const { user } = useUserStore();
    const [favorite, setFavorite] = useState(isFavorite);
    const [loading, setLoading] = useState(false);
    const { increment, decrement } = useFavoriteStore();
    const Icon = favorite ? HeartFill : Heart;

    const handleAddToFavorite = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();

        try {
            setLoading(true);

            await createPropertyInteraction({
                propertyId,
                interactionType: favorite ? 'VIEWED' : 'FAVORITED',
            });

            toast.success(favorite ? 'Đã xóa khỏi danh sách yêu thích' : 'Đã thêm vào danh sách yêu thích');
            setFavorite(!favorite);
            favorite ? decrement() : increment();
        } catch (error) {
            toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setFavorite(isFavorite);
    }, [isFavorite]);

    return (
        <Button
            loading={loading}
            disabled={!user?.userTypes.includes('renter')}
            type="text"
            danger
            icon={<Icon className="w-5 h-5" />}
            onClick={handleAddToFavorite}
        />
    );
};

export default HeartBtn;
