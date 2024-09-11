'use client';

import RentalRequestModal from '@/app/(base)/[slug]/rental-request-modal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IProperty } from '@/interfaces/property';
import { convertDateToTimeAgo, formatCurrency, getNameAvatar } from '@/lib/utils';
import { Button, Flex, Typography } from 'antd';
import { useState } from 'react';

const BaseInfo = ({ property }: { property: IProperty }) => {
    const [openRentalRequest, setOpenRentalRequest] = useState(false);

    const handleOpenRentalRequest = () => {
        setOpenRentalRequest(true);
    };

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
                <Button type="primary" ghost>
                    Liên hệ chủ nhà
                </Button>
                <Button type="primary" onClick={handleOpenRentalRequest}>
                    Gửi yêu cầu thuê
                </Button>
            </Flex>
            <RentalRequestModal property={property} open={openRentalRequest} setOpen={setOpenRentalRequest} />
        </>
    );
};

export default BaseInfo;
