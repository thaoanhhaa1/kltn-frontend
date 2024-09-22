'use client';

import { Card } from '@/components/ui/card';
import { IRentalRequest } from '@/interfaces/rentalRequest';
import { formatCurrency, formatDate, getRentalRequestColor } from '@/lib/utils';
import { renterUpdateRentalRequestStatus } from '@/services/rental-request-service';
import { Button, Flex, Tag, Typography } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const RentalRequest = ({ rentalRequest }: { rentalRequest: IRentalRequest }) => {
    const router = useRouter();

    const handleCanCelRequest = async () => {
        try {
            await renterUpdateRentalRequestStatus({
                requestId: rentalRequest.requestId,
                status: 'CANCELLED',
            });

            toast.success('Huỷ yêu cầu thuê nhà thành công');
            router.refresh();
        } catch (error) {
            toast.error('Huỷ yêu cầu thuê nhà thất bại');
            console.log('Error cancelling rental request', error);
        }
    };

    return (
        <Card className="overflow-hidden">
            <Flex>
                <Link className="block w-1/3 aspect-square" href={`/${rentalRequest.property.slug}`}>
                    <Image
                        alt=""
                        src={rentalRequest.property.images[0]}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                    />
                </Link>
                <Flex vertical className="px-4 py-2" flex={1}>
                    <Typography.Title level={5}>{rentalRequest.property.title}</Typography.Title>
                    <Flex gap={8} align="flex-end" justify="space-between" wrap>
                        <Typography.Title
                            style={{
                                marginBottom: 0,
                            }}
                            type="danger"
                            level={4}
                        >
                            Giá: {formatCurrency(rentalRequest.rentalPrice, true)}
                        </Typography.Title>
                        <Typography.Text strong>
                            Tiền cọc: {formatCurrency(rentalRequest.rentalDeposit, true)}
                        </Typography.Text>
                    </Flex>
                    <Typography.Text
                        type="secondary"
                        style={{
                            marginTop: 8,
                        }}
                    >
                        Thời gian: {formatDate(rentalRequest.rentalStartDate)} -{' '}
                        {formatDate(rentalRequest.rentalEndDate)}
                    </Typography.Text>
                    <Flex className="mt-2" align="flex-end" justify="space-between" flex={1}>
                        <Tag color={getRentalRequestColor(rentalRequest.status)}>
                            {rentalRequest.status === 'PENDING'
                                ? 'Đang chờ'
                                : rentalRequest.status === 'APPROVED'
                                ? 'Đã duyệt'
                                : rentalRequest.status === 'REJECTED'
                                ? 'Đã từ chối'
                                : 'Đã hủy'}
                        </Tag>
                        {rentalRequest.status === 'PENDING' && (
                            <Button danger ghost onClick={handleCanCelRequest}>
                                Huỷ yêu cầu
                            </Button>
                        )}
                    </Flex>
                </Flex>
            </Flex>
        </Card>
    );
};

export default RentalRequest;
