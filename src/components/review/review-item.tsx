'use client';

import AvatarWithName from '@/components/avatar-with-name';
import ReviewFooter from '@/components/review/review-footer';
import Text from '@/components/text';
import Title from '@/components/title';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IReplyReview } from '@/interfaces/review';
import { IBaseUserEmbed } from '@/interfaces/user';
import { formatDateTime, isImage } from '@/lib/utils';
import { deleteReview } from '@/services/review-service';
import { useUserStore } from '@/stores/user-store';
import { Button, Flex, Image, Rate } from 'antd';
import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ReactPlayer from 'react-player';
import { toast } from 'react-toastify';

const ReviewItem = ({
    review,
    user,
    reviewId,
    contractId = '',
    ownerId,
    propertyId,
}: {
    review: IReplyReview;
    user: IBaseUserEmbed;
    reviewId: string;
    ownerId: string;
    propertyId: string;
    contractId?: string;
}) => {
    const { user: me } = useUserStore();
    const router = useRouter();
    const [isEdit, setIsEdit] = useState(false);
    const isMe = me?.userId === user.userId;
    const value = review.rating / 2;

    const handleDelete = async () => {
        try {
            await deleteReview({
                reviewId,
                replyId: reviewId === review.id ? undefined : review.id,
            });

            toast.success('Xoá đánh giá thành công');
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || 'Đã có lỗi xảy ra');
        }
    };

    const handleEdit = () => {
        setIsEdit(true);
    };

    if (isEdit)
        return (
            <ReviewFooter
                contractId={contractId}
                ownerId={ownerId}
                propertyId={propertyId}
                review={review}
                isFirst={review.id === reviewId}
                reviewId={reviewId}
                setIsEdit={setIsEdit}
            />
        );

    return (
        <Flex gap={8}>
            <AvatarWithName avatar={user.avatar || ''} name={user.name} />
            <Flex align="center" gap={8}>
                <Flex gap={4} vertical>
                    <Title level={5}>{user.name}</Title>
                    {reviewId === review.id && <Rate value={value} disabled />}
                    <Text>{formatDateTime(review.createdAt)}</Text>
                    <Text>{review.content}</Text>
                    <Flex gap={4}>
                        {review.medias.map((media) => (
                            <div key={media} className="w-[200px]">
                                {isImage(media) ? (
                                    <Image alt="media" width={200} height={200} src={media} className="rounded-md" />
                                ) : (
                                    <ReactPlayer
                                        width="100%"
                                        height="100%"
                                        style={{
                                            aspectRatio: '16/9',
                                        }}
                                        url={media}
                                        controls
                                    />
                                )}
                            </div>
                        ))}
                    </Flex>
                </Flex>
                {isMe && contractId && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button icon={<MoreHorizontal className="w-5 h-5" />} type="text" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                            <DropdownMenuItem onClick={handleEdit}>
                                <span>Sửa</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDelete}>
                                <span>Xoá</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </Flex>
        </Flex>
    );
};

export default ReviewItem;
