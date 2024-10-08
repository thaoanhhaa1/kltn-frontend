'use client';

import RentalRequestModal from '@/app/(base)/[slug]/rental-request-modal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IConversation } from '@/interfaces/chat';
import { IProperty } from '@/interfaces/property';
import {
    convertDateToGMT,
    convertDateToTimeAgo,
    createChatConversation,
    formatCurrency,
    getNameAvatar,
} from '@/lib/utils';
import { CHAT } from '@/path';
import { useConversationStore } from '@/stores/conversation-store';
import { useUserStore } from '@/stores/user-store';
import { Button, Flex, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const BaseInfo = ({ property }: { property: IProperty }) => {
    const router = useRouter();
    const { user } = useUserStore();
    const { addConversation, setSelectedConversation } = useConversationStore();
    const [openRentalRequest, setOpenRentalRequest] = useState(false);
    const createdAt = convertDateToGMT(property.createdAt);

    const handleOpenRentalRequest = () => {
        setOpenRentalRequest(true);
    };

    const handleConnectOwner = () => {
        const conversation: IConversation = {
            conversationId: createChatConversation(user?.userId || '', property.owner.userId),
            createdAt: new Date().toISOString(),
            deletedBy: [],
            participants: [user!, property.owner],
            updatedAt: new Date().toISOString(),
            receiver: property.owner,
            chats: [],
            unreadCount: 0,
        };

        addConversation(conversation);
        setSelectedConversation(conversation);
        router.push(CHAT);
    };

    return (
        <>
            <Typography.Text type="secondary">{convertDateToTimeAgo(createdAt)}</Typography.Text>
            <Typography.Title
                level={2}
                style={{
                    marginTop: '8px',
                }}
            >
                {property.title}
            </Typography.Title>
            <div className="flex items-center gap-4">
                <Avatar>
                    <AvatarImage src={property.owner.avatar || ''} alt={property.owner.name} />
                    <AvatarFallback>{getNameAvatar(property.owner.name)}</AvatarFallback>
                </Avatar>
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
                <Button type="primary" ghost disabled={!user} onClick={handleConnectOwner}>
                    Liên hệ chủ nhà
                </Button>
                <Button type="primary" disabled={!user} onClick={handleOpenRentalRequest}>
                    Gửi yêu cầu thuê
                </Button>
            </Flex>
            <RentalRequestModal property={property} open={openRentalRequest} setOpen={setOpenRentalRequest} />
        </>
    );
};

export default BaseInfo;
