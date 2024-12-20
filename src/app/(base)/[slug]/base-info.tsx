'use client';

import RentalRequestModal from '@/app/(base)/[slug]/rental-request-modal';
import HeartBtn from '@/components/property/heart-btn';
import { IConversation } from '@/interfaces/chat';
import { IProperty } from '@/interfaces/property';
import { IPropertyInteraction } from '@/interfaces/property-interaction';
import { convertDateToTimeAgo, createChatConversation, formatCurrency, formatDate } from '@/lib/utils';
import { CHAT } from '@/path';
import { getOnGoingContracts } from '@/services/contract-service';
import { getFavoriteBySlug } from '@/services/property-interaction-service';
import { useConversationStore } from '@/stores/conversation-store';
import { useUserStore } from '@/stores/user-store';
import { Button, Flex, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export interface Contract {
    startDate: string;
    endDateActual: string;
}

const BaseInfo = ({ property }: { property: IProperty }) => {
    const router = useRouter();
    const { user } = useUserStore();
    const { addConversation, setSelectedConversation, conversations } = useConversationStore();
    const [openRentalRequest, setOpenRentalRequest] = useState(false);
    const [interaction, setInteraction] = useState<IPropertyInteraction | undefined>();
    const disabled = !user || user.userId === property.owner?.userId || !user.userTypes.includes('renter');
    const [contracts, setContracts] = useState<Contract[]>([]);

    const handleOpenRentalRequest = () => {
        setOpenRentalRequest(true);
    };

    const handleConnectOwner = () => {
        const conversationId = createChatConversation(user?.userId || '', property.owner.userId);
        const conversation: IConversation = conversations.find((c) => c.conversationId === conversationId) || {
            conversationId: createChatConversation(user?.userId || '', property.owner.userId),
            createdAt: new Date().toISOString(),
            deletedBy: [],
            participants: [user!, property.owner],
            updatedAt: new Date().toISOString(),
            receiver: property.owner,
            chats: [],
            unreadCount: 0,
        };

        if (!conversation) return;

        addConversation(conversation);
        setSelectedConversation(conversation);
        router.push(CHAT);
    };

    useEffect(() => {
        if (!user) return;

        const fetch = async () => {
            try {
                const interaction = await getFavoriteBySlug(property.slug);

                setInteraction(interaction);
            } catch (error) {}
        };

        fetch();
    }, [property.slug, user]);

    useEffect(() => {
        getOnGoingContracts(property.slug).then((res) => {
            setContracts(res);
        });
    }, [property.slug]);

    return (
        <>
            <Typography.Text type="secondary">{convertDateToTimeAgo(new Date(property.createdAt))}</Typography.Text>
            <Typography.Title
                level={2}
                style={{
                    marginTop: '8px',
                }}
            >
                {property.title}
            </Typography.Title>
            <div className="flex items-center gap-4 mb-[15px]">
                {/* <Avatar>
                    <AvatarImage src={property.owner.avatar || ''} alt={property.owner.name} />
                    <AvatarFallback>{getNameAvatar(property.owner.name)}</AvatarFallback>
                </Avatar> */}
                <div>
                    <Typography.Title level={5}>Chủ nhà: {property.owner.name}</Typography.Title>
                    {property.owner.phoneNumber && (
                        <Typography.Title level={5}>
                            Số điện thoại liên hệ: {property.owner.phoneNumber}
                        </Typography.Title>
                    )}
                    <Typography.Title level={5}>Email liên hệ: {property.owner.email}</Typography.Title>
                </div>
            </div>
            <Typography.Paragraph>
                Địa chỉ: {property.address.street}, {property.address.ward}, {property.address.district},{' '}
                {property.address.city}
            </Typography.Paragraph>
            <Typography.Title level={3} type="danger">
                Giá: {formatCurrency(property.price, true)}
            </Typography.Title>
            <Typography.Paragraph>Tiền cọc: {formatCurrency(property.deposit, true)}</Typography.Paragraph>
            <Typography.Paragraph>Thời gian tối thiểu: {property.minDuration} tháng</Typography.Paragraph>
            <Flex
                style={{
                    marginTop: '12px',
                }}
                gap={12}
            >
                <Button type="primary" ghost disabled={disabled} onClick={handleConnectOwner}>
                    Liên hệ chủ nhà
                </Button>
                <Button type="primary" disabled={disabled} onClick={handleOpenRentalRequest}>
                    Gửi yêu cầu thuê
                </Button>
                <HeartBtn propertyId={property.propertyId} isFavorite={interaction?.interactionType === 'FAVORITED'} />
            </Flex>
            {contracts.length > 0 && (
                <div>
                    <Typography.Title level={4} style={{ marginTop: '20px' }}>
                        Các hợp đồng đang diễn ra
                    </Typography.Title>
                    {contracts.map((contract, index) => (
                        <div key={index}>
                            <Typography.Text>
                                Từ {formatDate(contract.startDate)} đến {formatDate(contract.endDateActual)}
                            </Typography.Text>
                        </div>
                    ))}
                </div>
            )}
            <RentalRequestModal property={property} open={openRentalRequest} setOpen={setOpenRentalRequest} />
        </>
    );
};

export default BaseInfo;
