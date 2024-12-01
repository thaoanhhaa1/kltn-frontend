'use client';

import RejectPropertyModal, { IRejectInput } from '@/app/(admin)/dashboard/properties/reject-property-modal';
import RejectReasons from '@/components/reject-reasons/reject-reasons';
import useBoolean from '@/hooks/useBoolean';
import { IProperty } from '@/interfaces/property';
import { IRejectReason } from '@/interfaces/reject-reason';
import { convertDateToTimeAgo, formatCurrency, getPropertyStatusColor, getPropertyStatusText } from '@/lib/utils';
import { updateApprovalProperties } from '@/services/property-service';
import { useUserStore } from '@/stores/user-store';
import { Button, Flex, Modal, Tag, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

const NO_LOADING = 0;
const APPROVE_LOADING = 1;
const REJECT_LOADING = 2;

const BaseInfo = ({ property, rejectReasons }: { property: IProperty; rejectReasons: IRejectReason[] }) => {
    const router = useRouter();
    const { user } = useUserStore();
    const {
        value: openRejectReasonModal,
        setFalse: handleCloseRejectReasonModal,
        setTrue: setOpenRejectReasonModal,
    } = useBoolean(false);
    const [isOpenRejectModal, setIsOpenRejectModal] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<IProperty | null>(null);
    const [loading, setLoading] = useState(NO_LOADING);

    const handleApprove = useCallback(async () => {
        setLoading(APPROVE_LOADING);

        try {
            await updateApprovalProperties([property.propertyId], 'ACTIVE');

            toast.success('Bất động sản đã được duyệt');
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error('Duyệt bất động sản thất bại');
        } finally {
            setLoading(NO_LOADING);
        }
    }, [property.propertyId, router]);

    const handleReject = useCallback(() => {
        setSelectedProperty(property);
        setIsOpenRejectModal(true);
    }, [property]);

    const handleConfirmReject = useCallback(
        async ({ propertyId, reason }: IRejectInput) => {
            setLoading(REJECT_LOADING);

            try {
                await updateApprovalProperties([propertyId], 'REJECTED', reason);

                toast.success('Bất động sản đã bị từ chối');
                router.refresh();
            } catch (error) {
                console.error(error);
                toast.error('Từ chối bất động sản thất bại');
            } finally {
                setLoading(NO_LOADING);
            }
        },
        [router],
    );

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
            <Flex justify="space-between" align="center">
                <Tag color={getPropertyStatusColor(property.status)}>{getPropertyStatusText(property.status)}</Tag>
                <Flex
                    style={{
                        marginTop: '12px',
                    }}
                    gap={12}
                >
                    <Button
                        loading={loading === REJECT_LOADING}
                        danger
                        onClick={handleReject}
                        disabled={property.status === 'REJECTED'}
                    >
                        Từ chối
                    </Button>
                    <Button
                        loading={loading === APPROVE_LOADING}
                        type="primary"
                        onClick={handleApprove}
                        disabled={property.status === 'ACTIVE'}
                    >
                        Phê duyệt
                    </Button>
                    <Button onClick={setOpenRejectReasonModal}>Lý do từ chối</Button>
                </Flex>
            </Flex>
            <Modal
                title="Lý do từ chối"
                open={openRejectReasonModal}
                onCancel={handleCloseRejectReasonModal}
                footer={null}
            >
                <RejectReasons rejectReasons={rejectReasons} />
            </Modal>
            {selectedProperty && (
                <RejectPropertyModal
                    open={isOpenRejectModal}
                    property={selectedProperty}
                    setOpen={setIsOpenRejectModal}
                    onReject={handleConfirmReject}
                />
            )}
        </>
    );
};

export default BaseInfo;
